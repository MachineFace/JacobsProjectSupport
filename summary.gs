


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get html template
 * @param {dataRange} dataRange
 * @returns {html} htmlBody
 */
var getEmailHtml = (dataRange) => {
    var htmlTemplate = HtmlService.createTemplateFromFile("tabletemplate.html");
    htmlTemplate.items = dataRange;
    var htmlBody = htmlTemplate.evaluate().getContent();
    return htmlBody;
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get data and put into internal lists
 * This function is used in 'CreateSummaryEmail()' with 'tabletemplate.html'
 * @param {any} values
 * @returns {[any]} list
 */
var getData = (values) => {
    values.shift(); //remove headers
    let items = [];
    values.forEach(function (value) {
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
        item.shipping = value[18];
        item.affiliation = value[19];
        item.partcount = value[20];
        item.quality = value[21];

        items.push(item);
    })
    // @ts-ignore
    return items;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get Google Doc as html string data : returns string
 * @param {string} docId
 * @return {string} text 
 */
const DocToHtml = (docId) => {
    // Downloads a Google Doc as an HTML string.
    let url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + docId + '&exportFormat=html';
    let param = {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
        muteHttpExceptions: true,
    };
    return UrlFetchApp.fetch(url, param).getContentText();
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create Summary Email
 * This generates a summary email to all the Design Specialists (triggered daily at 6am)
 */
const CreateSummaryEmail = () => {
    //Fetch Summary Table
    let summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Summary');
    let last = summarySheet.getLastRow();
    let dataRange = summarySheet.getRange(1, 1, last, 22).getValues();

    //Start of email to the Design Specialists
    let summaryText;
    summaryText = '<p>Hello!</p> ';
    summaryText += '<p>Here is a summary of all the recent submissions.<br />';
    summaryText += 'If you have questions or need assistance please slack Chris and/or Cody, or email <a href="mailto:jacobsprojectsupport@berkeley.edu">jacobsprojectsupport@berkeley.edu</a>. </p>';
    summaryText += '<p>Best,<br />Jacobs Project Support</p>';
    summaryText += '<br/>';
    summaryText += 'SUMMARY:';
    summaryText += '<br/>';

    let items = getData(dataRange);
    let htmlBodyText = getEmailHtml(items);

    //Email Targets
    //let hardcodeTarget = 'adamhutz@berkeley.edu, garygin@berkeley.edu, npanditi@berkeley.edu, joeygottbrath@berkeley.edu';

    //Email DS
    GmailApp.sendEmail('codyglen@berkeley.edu', 'JPS: SUMMARY EMAIL', '', {
        htmlBody: summaryText + htmlBodyText,
        'from': 'jacobsprojectsupport@berkeley.edu',
        'cc': StaffEmailAsString(),
        'bcc': 'cparsell@berkeley.edu',
        'name': 'JPS DAILY SUMMARY'
    });
    Logg('DS Team Emailed with Summary for the day.');
}


