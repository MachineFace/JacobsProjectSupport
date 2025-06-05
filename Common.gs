
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Common GAS Functions
 */
class Common {
  constructor() {
    
  }

  /**
   * Standardize Address
   * Split addresses at the first comma or semicolon and replace 'St.' or 'Street' with 'St'
   * Returns something like: 1290 Sutter Street
   * This reduces false negatives if Ticketmaster shows CA but another shows it as California
   * @param {string} address
   * @returns {string} standardized address
   */
  static StandardizeAddress(address = ``) {
    try {
      if(!address) throw new Error(`Missing address.`);
      return address
        .replace(/(Avenue|Ave[.]?)/g, "Ave")
        .replace(/(Street|St[.]?)/g, "St")
        .replace(/(Drive|Dr[.]?)/g, "Dr")
        .replace(/(Road|Rd[.]?)/g, "Rd");
    } catch(err) {
      console.error(`"StandardizeAddress()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Normalization Function
   */
  static StringNormalize(str = ``) {
    return str
      .toLowerCase()
      .normalize('NFD')                       // Unicode normalization
      .replace(/[\u0300-\u036f]/g, '')        // Strip accents
      .replace(/[^a-z0-9\s]/gi, '')           // Remove special chars
      .replace(/\s+/g, ' ')                   // Normalize whitespace
      .trim();
  }

  /**
   * Parse URL path parameters
   * @param {request} request
   * @returns {string} path
   */
  static ParsePathParameters(request) {
    if (!request.queryString.match(/\=/)) return request.queryString;  // If there`s only one parameter, just treat it as a path
    return request.parameter.path || ``;
  }

  /**
   * Score String Similarity
   * Bernoulli-weighted string similarity scorer
   * @param {string} strA - First string to compare
   * @param {string} strB - Second string to compare
   * @returns {number} - Similarity score between 0 and 1
   */
  static ScoreStringSimilarity(strA = ``, strB = ``) {
    if (typeof strA !== 'string' || typeof strB !== 'string') return 0;

    // Normalization Function
    function StringNormalize(str = ``) {
      return str
        .toLowerCase()
        .normalize('NFD')                       // Unicode normalization
        .replace(/[\u0300-\u036f]/g, '')        // Strip accents
        .replace(/[^a-z0-9\s]/gi, '')           // Remove special chars
        .replace(/\s+/g, ' ')                   // Normalize whitespace
        .trim();
    }

    // Step 1: Sanitize & Normalize
    const a = StringNormalize(strA);
    const b = StringNormalize(strB);
    if (!a || !b) return 0;
    if (a === b) return 1;

    // Step 2: Token Jaccard Similarity
    const tokensA = new Set(a.split(' '));
    const tokensB = new Set(b.split(' '));
    const intersection = [...tokensA].filter(x => tokensB.has(x)).length;
    const union = new Set([...tokensA, ...tokensB]).size;
    const jaccard = union === 0 ? 0 : intersection / union;

    // Levenshtein Distance Function
    function Levenshtein(s = ``, t = ``) {
      const dp = Array.from({ length: s.length + 1 }, (_, i) => [i]);
      for (let j = 1; j <= t.length; j++) dp[0][j] = j;

      for (let i = 1; i <= s.length; i++) {
        for (let j = 1; j <= t.length; j++) {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1)
          );
        }
      }
      return dp[s.length][t.length];
    }

    // Step 3: Levenshtein Distance Normalized
    const maxLen = Math.max(a.length, b.length);
    const editDist = Levenshtein(a, b);
    const editSimilarity = maxLen === 0 ? 0 : 1 - editDist / maxLen;

    // Step 4: Weighted Blend (Bernoulli-esque weighting)
    // Emphasize strong exact matches over weak partials
    const score = (0.7 * jaccard + 0.3 * editSimilarity) ** 2; // squaring rewards strong matches
    return Math.max(0, Math.min(1, parseFloat(score.toFixed(4))));
  }

  /**
   * Strip spaces, no-break spaces, zero-width spaces, & zero-width no-break spaces
   * @param {string} string
   * @returns {string} string
   */
  static StringTrim(string) {
    const pattern = /(^[\s\u00a0\u200b\uFEFF]+)|([\s\u00a0\u200b\uFEFF]+$)/g;
    return string.replace(pattern, ``);
  }

  /**
   * Levenshtein Distance Normalized
   * String Comparison between 2 strings
   * @param {string} string a
   * @param {string} string b
   * @returns {Array} comparisons
   */
  static StringLevenshteinDistanceNormalization(s = ``, t = ``) {
    let dp = Array.from({ length: s.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= t.length; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[s.length][t.length];
  }

  /**
   * Retrieve text from inside XML tags
   * @param {string} string
   * @returns {string} string
   */
  static StripXml(input) {
    // Only parse input if it looks like it contains tags
    if (input.match(/<[^>]*>/)) {
      // Find where the tags start & end
      const start = input.indexOf(`<`);
      const end = input.lastIndexOf(`>`) + 1;

      // Grab any text before all XML tags
      const pre = input.slice(0, start);
      // Grab any text after all XML tags
      const post = input.slice(end);
      let inside = ``;

      try {
        // Parse input without any pre or post text
        let cleanInput = input.slice(start, end);

        let doc = XmlService.parse(cleanInput);
        inside = doc.getRootElement().getText();
      } catch (error) {
        console.error(`Whoops: ${input} = ${error}`);
      }
      return pre + inside + post;
    }
    return input;
  }

  /**
   * Create XML Element
   */
  static XmlElement(type, text) {
    return XmlService
      .createElement(type)
      .setText(text);
  }

  /**
   * Convert a JSON string to a pretty-print JSON string
   * @param {string} input
   * @returns {[string]} string array
   */
  static PrettifyJson(input) {
    return JSON.stringify(input, null, 3);
  }

  /**
   * Collate objects at given path, from array of JSON strings
   * @param {string} path
   * @param {[object]} objects
   */
  static CollateArrays(path, objects) {
    let outArray = [];
    let chunks = path.split(`.`);

    // Iterate over each object
    for (const resp of objects) {
      let obj = JSON.parse(resp);
      for (const chunk of chunks) {
        obj = obj[chunk];
      }
      outArray = outArray.concat(obj);
    }
    return outArray;
  }

  /**
   * Remove duplictes from an array
   * @param {array} array
   */
  static UniqueArray(array) {
    return [...new Set(array)];
  }

  /**
   * Test if a number is even.
   * @param {number} n
   * @returns {bool} boolean
   */
  static isEven(n) {
    return n % 2 === 0;
  }

  /**
   * Test if number is odd.
   * @param {number} n
   * @returns {bool} boolean
   */
  static isOdd(n) {
    return n % 2 !== 0;
  }
}

/**
 * Sleep function to wait for execution
 * @param {number} milliseconds
 */
const Sleep = (ms) => Utilities.sleep(ms);

const _testSleep = () => {
  console.time(`Test Sleep`);
  Sleep(2 * 1000);
  console.timeEnd(`Test Sleep`);
}

const _testC = () => {
  const arr = Common.UniqueArray([0, 1, 2, 3, 4, 5, 6, 7, 8, null, `x`, true])
  console.info(arr);

  // Test Even / Odd
  arr.forEach(x => {
    console.info(`(${x}) is even?: ${Common.isEven(x)}`);
    console.info(`(${x}) is odd?: ${Common.isOdd(x)}`);
  });

  // Test Address
  const addr = `1234 State street, Columbus, OH 90210`;
  const address = Common.StandardizeAddress(addr);
  console.info(address);
}








