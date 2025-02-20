

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Summary Email
 */
class SummaryBuilder {
  constructor() {
    this.SendEmail();
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get html template
   * @private
   * @param {dataRange} dataRange
   * @returns {html} htmlBody
   */
  static _GetEmailHtml(dataRange) {
    let htmlTemplate = HtmlService.createTemplateFromFile("TableTemplate.html");
    htmlTemplate.items = dataRange;
    const htmlBody = htmlTemplate.evaluate().getContent();
    return htmlBody;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get data and put into internal lists
   * This function is used in 'CreateSummaryEmail()' with 'tabletemplate.html'
   * @private
   * @param {any} values
   * @returns {[any]} list
   */
  static _GetData(values) {
    try {
      // Validate input: must be an array with at least one header row and one data row.
      if (!Array.isArray(values) || values.length < 2) throw new Error(`Values input is null or less than 1.`);

      // Define the expected keys based on column order.
      const keys = [
        "status", "ds", "approved", "files", "ticket", "id", "studentApproved",
        "timestamp", "email", "name", "sid", "project", "mat1num", "mat1type",
        "mat1url", "mat2num", "mat2type", "mat2url", "affiliation", "partcount", "quality"
      ];
      
      // Slice off the header row and map each row to an object.
      const formattedObject =  values.slice(1).map(row => {
        // Use reduce to build the object, assigning an empty string if a cell is missing.
        return keys.reduce((obj, key, i) => {
          obj[key] = row[i] !== undefined ? row[i] : "";
          return obj;
        }, {});
      });
      return formattedObject;
    } catch(err) {
      console.error(`"_GetData()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get Google Doc as html string data : returns string
   * @private
   * @param {string} docId
   * @return {string} text 
   */
  static async _DocToHtml(docId) {
    let url = `https://docs.google.com/feeds/download/documents/export/Export?id=${docId}&exportFormat=html`;
    let param = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true,
    };
    return await UrlFetchApp.fetch(url, param).getContentText();
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Summary Text
   * @private
   */
  static _SummaryText() {
    let text = `<p>Hello!</p> `;
      text += `<p>`;
      text += `Here is a summary of all the recent submissions.<br/><br/>`;
      text += `<a href="https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ"><b> ** GO TO SHEET NOW ** </b></a>`;
      text += `<br/><br/>`;
      text += `If you have questions or need assistance please slack Chris and/or Cody, or email <a href="mailto:${SERVICE_EMAIL}">${SERVICE_EMAIL}</a>.`;
      text += `</p>`;
      text += `<p>Best,<br/>${SERVICE_NAME}</p>`;
      text += `<br/>`;
      text += `SUMMARY:`;
      text += `<br/>`;
    return text;
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Send Summary Email
   * This generates a summary email to all the Design Specialists (triggered daily at 6am)
   */
  async SendEmail () {
    try {
      console.warn(`Building Email...`)
      let dataRange = OTHERSHEETS.Summary.getRange(1, 1, OTHERSHEETS.Summary.getLastRow(), 22).getValues();

      let items = await SummaryBuilder._GetData(dataRange);
      let htmlBodyText = await SummaryBuilder._GetEmailHtml(items);

      // Email DS
      MailApp.sendEmail(SERVICE_EMAIL, `JPS: SUMMARY EMAIL`, ``, {
        htmlBody: SummaryBuilder._SummaryText() + htmlBodyText,
        from : SERVICE_EMAIL,
        cc : StaffEmailAsString(),
        bcc : `cparsell@berkeley.edu, codyglen@berkeley.edu`,
        name: `JPS DAILY SUMMARY`,
      });
      console.warn(`DS Team Emailed with Summary for the day.`);
      return 0;
    } catch(err) {
      console.error(`"SendEmail()" failed: ${err}`);
      return 1;
    }
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class Instance to be Triggered
 * This generates a summary email to all the Design Specialists (triggered daily at 6am)
 */
const CreateSummaryEmail = () => new SummaryBuilder();









