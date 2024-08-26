

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
  _GetEmailHtml(dataRange) {
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
  _GetData(values) {
    values.shift(); // remove headers
    let items = [];
    values.forEach( (value) => {
      const item = {
        status : value[0],
        ds : value[1],
        approved : value[2],
        files : value[3],
        ticket : value[4],
        jobnum : value[5],
        studentApproved : value[6],
        timestamp : value[7],
        email : value[8],
        name : value[9],
        sid : value[10],
        project : value[11],
        mat1num : value[12],
        mat1type : value[13],
        mat1url : value[14],
        mat2num : value[15],
        mat2type : value[16],
        mat2url : value[17],
        affiliation : value[18],
        partcount : value[19],
        quality : value[20],
      };
      items.push(item);
    })
    return items;
  }



  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get Google Doc as html string data : returns string
   * @private
   * @param {string} docId
   * @return {string} text 
   */
  async _DocToHtml(docId) {
    let url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + docId + '&exportFormat=html';
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
  _SummaryText() {
    let text = `<p>Hello!</p> `;
      text += `<p>Here is a summary of all the recent submissions.<br/><br/>`;
      text += `<a href="https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ"><b> ** GO TO SHEET NOW ** </b></a><br/><br/>`;
      text += `If you have questions or need assistance please slack Chris and/or Cody, or email <a href="mailto:jacobs-project-support@berkeley.edu">jacobs-project-support@berkeley.edu</a>. </p>`;
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

      let items = await this._GetData(dataRange);
      let htmlBodyText = await this._GetEmailHtml(items);

      // Email DS
      await GmailApp.sendEmail('jacobs-project-support@berkeley.edu', 'JPS: SUMMARY EMAIL', '', {
        htmlBody: this._SummaryText() + htmlBodyText,
        'from': 'jacobs-project-support@berkeley.edu',
        // 'cc' : `codyglen@berkeley.edu`,
        'cc': StaffEmailAsString(),
        'bcc': 'cparsell@berkeley.edu',
        'name': 'JPS DAILY SUMMARY'
      });
      console.warn('DS Team Emailed with Summary for the day.');
    } catch(err) {
      console.error(`"SendEmail()" failed : ${err}`);
    }
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class Instance to be Triggered
 * This generates a summary email to all the Design Specialists (triggered daily at 6am)
 */
const CreateSummaryEmail = () => new SummaryBuilder();









