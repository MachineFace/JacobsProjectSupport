

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Summary Email
 */
class SummaryBuilder {
  constructor() {
    this.CreateSummaryEmail();
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
      let item = {};
      item.status = value[0];
      item.ds = value[1];
      item.approved = value[2];
      item.files = value[3];
      item.ticket = value[4];
      item.jobnum = value[5];
      item.studentApproved = value[6];
      item.timestamp = value[7];
      item.email = value[8];
      item.name = value[9];
      item.sid = value[10];
      item.project = value[11];
      item.mat1num = value[12];
      item.mat1type = value[13];
      item.mat1url = value[14];
      item.mat2num = value[15];
      item.mat2type = value[16];
      item.mat2url = value[17];
      item.affiliation = value[18];
      item.partcount = value[19];
      item.quality = value[20];

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
      text += `<p>Here is a summary of all the recent submissions.<br />`;
      text += `If you have questions or need assistance please slack Chris and/or Cody, or email <a href="mailto:jacobsprojectsupport@berkeley.edu">jacobsprojectsupport@berkeley.edu</a>. </p>`;
      text += `<p>Best,<br />${SERVICE_NAME}</p>`;
      text += `<br/>`;
      text += `SUMMARY:`;
      text += `<br/>`;
    return text;
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Summary Email
   * This generates a summary email to all the Design Specialists (triggered daily at 6am)
   */
  async CreateSummaryEmail () {
    let dataRange = OTHERSHEETS.Summary.getRange(1, 1, OTHERSHEETS.Summary.getLastRow(), 22).getValues();

    let items = await this._GetData(dataRange);
    let htmlBodyText = await this._GetEmailHtml(items);

    // Email DS
    await GmailApp.sendEmail('codyglen@berkeley.edu', 'JPS: SUMMARY EMAIL', '', {
      htmlBody: this._SummaryText() + htmlBodyText,
      'from': 'jacobsprojectsupport@berkeley.edu',
      'cc': StaffEmailAsString(),
      'bcc': 'cparsell@berkeley.edu',
      'name': 'JPS DAILY SUMMARY'
    });
    console.warn('DS Team Emailed with Summary for the day.');
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class Instance to be Triggered
 * This generates a summary email to all the Design Specialists (triggered daily at 6am)
 */
const CreateSummaryEmail = () => new SummaryBuilder();









