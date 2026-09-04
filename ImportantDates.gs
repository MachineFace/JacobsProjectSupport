

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## Get the current Jacobs Project Support semester dates.
 *
 * Searches multiple Jacobs Institute pages because the website structure
 * changes periodically. Results are validated and the last known-good
 * result is cached in Script Properties.
 *
 * @returns {{
 *   start: Date,
 *   end: Date,
 *   next: Date|null,
 *   semester: string,
 *   source: string,
 *   cached: boolean
 * }|null}
 */
const GetSemesterDates = () => {
  const CACHE_KEY = `JPS_SEMESTER_DATES`;

  const URLS = [
    `https://jacobsinstitute.berkeley.edu/making-at-jacobs/`,
    `https://jacobsinstitute.berkeley.edu/hours-and-access/`,
    `https://jacobsinstitute.berkeley.edu/jps/`,
  ];

  const START_LABELS = [
    `JPS service begins`,
    `JPS service start`,
    `JPS begins`,
    `JPS starts`,
    `service begins`,
  ];

  const END_LABELS = [
    `Last day to submit JPS jobs`,
    `Last day to submit JPS job`,
    `Last day to submit`,
    `JPS submission deadline`,
    `JPS jobs due`,
  ];

  try {
    let results = [];

    URLS.forEach(url => {
        const response = UrlFetchApp.fetch(url, {
          method: `get`,
          headers: {
            Accept: `text/html`,
          },
          followRedirects: true,
          muteHttpExceptions: true,
        });

        const responseCode = response.getResponseCode();

        if(![200, 201].includes(responseCode)) {
          throw new Error(`Bad response from server: Semester lookup: ${url}, ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
        }

        const content = response.getContentText();
        if (!content) {
          console.warn(`Semester lookup: ${url} returned empty content.`);
          return;
        }

        const text = CleanSemesterPageText(content);
        const semester = ExtractSemesterName(text);

        if (!semester) {
          console.warn(`Semester lookup: no semester found on ${url}.`);
          return;
        }

        const year = ExtractSemesterYear(semester);

        if (!year) {
          console.warn(`Semester lookup: no year found on ${url}.`);
          return;
        }

        const start = ExtractLabeledDate(text, START_LABELS, year);
        const end = ExtractLabeledDate(text, END_LABELS, year);

        results.push({
          start: start,
          end: end,
          semester: semester,
          source: url,
        });
    });


    const validResult = SelectValidSemesterResult(results);
    console.info(validResult);

    if (validResult) {
      const next = GetNextSemesterDate(validResult.start, validResult.end);

      const result = {
        start: validResult.start,
        end: validResult.end,
        next: next,
        semester: validResult.semester,
        source: validResult.source,
        cached: false,
      };

      CacheSemesterDates(CACHE_KEY, result);

      console.info(`JPS semester dates found: ${result.start.toDateString()} → ${result.end.toDateString()}`);
      return result;
    }

    const cached = GetCachedSemesterDates(CACHE_KEY);

    if (cached) {
      console.warn(`Using cached JPS semester dates.`);
      return cached;
    }

    throw new Error(`Could not find valid JPS semester dates.`);
  } catch (err) {
    console.error(`"GetSemesterDates()" failed: ${err}`);
    return null;
  }
}

/**
 * ## Clean HTML into reasonably searchable plain text.
 *
 * @param {string} html
 * @return {string}
 */
const CleanSemesterPageText = (html) => {
  if (typeof html !== `string` || !html.trim()) {
    return ``;
  }

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ` `)
    .replace(/<style[\s\S]*?<\/style>/gi, ` `)
    .replace(/<[^>]+>/g, ` `)
    .replace(/&nbsp;/gi, ` `)
    .replace(/&amp;/gi, `&`)
    .replace(/&ndash;|&#8211;/gi, `–`)
    .replace(/&mdash;|&#8212;/gi, `—`)
    .replace(/&#39;|&apos;/gi, `'`)
    .replace(/&quot;/gi, `"`)
    .replace(/\s+/g, ` `)
    .trim();
}

/**
 * ## Find the semester heading.
 *
 * Example:
 * "Key Dates for Fall 2026"
 *
 * @param {string} text
 * @return {string|null}
 */
const ExtractSemesterName = (text) => {
  const match = text.match(/Key Dates\s+for\s+((?:Spring|Summer|Fall|Winter)\s+\d{4})/i);
  if (!match) return null;
  return match[1].trim();
}

/**
 * ## Extract the year from a semester name.
 *
 * @param {string} semester
 * @return {number|null}
 */
const ExtractSemesterYear = (semester) => {
  if (typeof semester !== `string`) return null;

  const match = semester.match(/\b(20\d{2})\b/);
  if (!match) return null;

  return Number(match[1]);
}

/**
 * ## Extract a date following one of several possible labels.
 *
 * The parser intentionally allows arbitrary whitespace and punctuation
 * between the label and date so minor website formatting changes do not
 * break the lookup.
 *
 * @param {string} text
 * @param {string[]} labels
 * @param {number} year
 * @return {Date|null}
 */
const ExtractLabeledDate = (text, labels, year) => {
  if (typeof text !== `string` || !text.trim()) return null;
  if (!Number.isInteger(year) || year < 2000) return null;

  const EscapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, `\\$&`); // Escape string for regex

  for (const label of labels) {
    const pattern =
      `${EscapeRegExp(label)}` +
      `\\s*[:\\-–—]?\\s*` +
      `((?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|` +
      `Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|` +
      `Dec|December)\\.?\\s+\\d{1,2}(?:\\s*[–—-]\\s*\\d{1,2})?)`;

    const match = text.match(new RegExp(pattern, `i`));
    if (!match) continue;

    const dateText = match[1]
      .replace(/\.$/, ``)
      .replace(/\s+/g, ` `)
      .trim();

    const date = ParseSemesterDate(dateText, year);

    if (date) return date;
  }

  return null;
}

/**
 * ## Parse a month/day string into a Date.
 *
 * Handles:
 *   Aug 26
 *   Aug. 26
 *   August 26
 *   Dec 11
 *   December 11
 *
 * @param {string} value
 * @param {number} year
 * @return {Date|null}
 */
const ParseSemesterDate = (value, year) => {
  try {
    if (typeof value !== `string` || !value.trim()) return null;
    if (!Number.isInteger(year) || year < 2000) return null;

    const normalized = value
      .replace(/\./g, ``)
      .replace(/\s+/g, ` `)
      .trim();

    const match = normalized.match(
      /^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})$/i
    );
    if (!match) return null;

    const monthNames = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    };

    const month = monthNames[match[1].toLowerCase()];
    const day = Number(match[2]);

    if (month === undefined) return null;

    if (!Number.isInteger(day) || day < 1 || day > 31) return null;

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year) return null;

    if (date.getMonth() !== month) return null;

    if (date.getDate() !== day) return null;

    return date;
  } catch (err) {
    console.error(`"ParseSemesterDate()" failed: ${err}`);
    return null;
  }
}

/**
 * ## Select the strongest result from the pages we searched.
 *
 * A valid result must contain both a start and end date, and the start
 * must occur before the end.
 *
 * @param {Object[]} results
 * @return {Object|null}
 */
const SelectValidSemesterResult = (results) => {
  if (!Array.isArray(results) || !results.length) return null;

  const valid = results.filter(result => {
    if (!result?.start || !result?.end) return false;
    return result.start.getTime() < result.end.getTime();
  });

  if (!valid.length) return null;

  return valid[0];
}

/**
 * ## Determine the next service start.
 *
 * This deliberately does NOT attempt to invent a date from the current
 * semester's end date. If the next semester isn't explicitly known,
 * return null.
 *
 * @param {Date} start
 * @param {Date} end
 * @return {Date|null}
 */
const GetNextSemesterDate = (start, end) => {
  if (!(start instanceof Date) || isNaN(start.getTime())) return null;
  if (!(end instanceof Date) || isNaN(end.getTime())) return null;

  const cached = GetCachedSemesterDates(`JPS_NEXT_SEMESTER_DATES`);

  if (!cached?.start) return null;
  if (cached.start.getTime() <= end.getTime()) return null;

  return cached.start;
}

/**
 * ## Cache a successful result.
 *
 * Dates are serialized as ISO strings because Date objects cannot be
 * directly stored in PropertiesService.
 *
 * @param {string} key
 * @param {Object} result
 * @return {void}
 */
const CacheSemesterDates = (key, result) => {
  if (typeof key !== `string` || !key) return;
  if (!result?.start || !result?.end) return;

  PropertiesService
    .getScriptProperties()
    .setProperty(
      key,
      JSON.stringify({
        start: result.start.toISOString(),
        end: result.end.toISOString(),
        next: result.next ? result.next.toISOString() : null,
        semester: result.semester || ``,
        source: result.source || ``,
        cachedAt: new Date().toISOString(),
      })
    );
}

/**
 * ## Retrieve cached semester dates.
 *
 * @param {string} key
 * @return {Object|null}
 */
const GetCachedSemesterDates = (key) => {
  try {
    if (typeof key !== `string` || !key) return null;

    const value = PropertiesService
      .getScriptProperties()
      .getProperty(key);

    if (!value) return null;

    const data = JSON.parse(value);

    const start = new Date(data.start);
    const end = new Date(data.end);
    const next = data.next ? new Date(data.next) : null;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    return {
      start: start,
      end: end,
      next: next && !isNaN(next.getTime()) ? next : null,
      semester: data.semester || ``,
      source: data.source || ``,
      cached: true,
      cachedAt: data.cachedAt || ``,
    };
  } catch (err) {
    console.warn(`Could not read cached semester dates: ${err}`);
    return null;
  }
}

/**
 * ## Print the current JPS semester dates to the Summary sheet.
 * 
 * This function fetches the start and end dates for the JPS Service
 * and cross-references across multiple sites for accuracy and prints those
 * dates to the spreadsheet summary page.
 * 
 * @entry point
 * @return {boolean}
 */
const PrintServiceDates = () => {
  try {
    const dates = GetSemesterDates();
    if (!dates) throw new Error(`Could not retrieve JPS semester dates.`);
    // console.info(dates)

    OTHERSHEETS.Summary
      .getRange(1, 6)
      .setValue(`Start of JPS Service:\n${dates.start.toDateString()}`);

    OTHERSHEETS.Summary
      .getRange(1, 8)
      .setValue(`Last Day to Submit:\n${dates.end.toDateString()}`);

    OTHERSHEETS.Summary
      .getRange(1, 10)
      .setValue(`JPS Service Resumes:\n${dates.next ? dates.next.toDateString() : `Unknown`}`);

    return true;
  } catch (err) {
    console.error(`"PrintSemesterDates()" failed: ${err}`);
    return false;
  }
}


/**
 * <p><strong>Key Dates for Spring 2023:</strong></p>
  <ul>
    <li data-stringify-indent="1" data-stringify-border="0">Maker Pass &amp; JPS Registration opens: Jan 10</li>
    <li data-stringify-indent="1" data-stringify-border="0">JPS Service begins: Jan 17</li>
    <li data-stringify-indent="1" data-stringify-border="0">Makerspace access begins: Jan 17</li>
    <li data-stringify-indent="1" data-stringify-border="0">Hands-on trainings begin: Jan 23</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day of hands-on trainings: Mar 3</li>
    <li data-stringify-indent="1" data-stringify-border="0"><strong>Spring Recess (no makerspace access or JPS service):</strong> Mar 27-31</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to submit JPS project: May 5</li>
    <li data-stringify-indent="1" data-stringify-border="0">Makerspace early closure (at 7pm): May 8-12</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to pick up JPS projects: May 12</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to access Makerspace: May 12</li>
  </ul>
*/
