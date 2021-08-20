const root = 'https://cloud.3dprinteros.com/';
const api_key = "576527286089-l5pr801cmggb0hisn5kcisanbsiv14ul.apps.googleusercontent.com";
const api_pass = "6X5vHouCqFT6GeiPp3Cjmr93";


/**
 * Login Classic : Username and Password
 * Avoid this like the plague.
 */
const PrinterOS_ClassicLogin = async () => {
  const repo = "/apiglobal/login";
  const payload = {
    username : "codyglen@berkeley.edu",
    password : "Test_Password",
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Login : Create a Session
 */
const PrinterOS_Login = async () => {
  const repo = "google_login";
  const payload = {
    token : api_key,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`Headers ---> ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Check PrinterOS Session
 */
const PrinterOS_CheckSession = async (session) => {
  const repo = "/apiglobal/check_session"
  const payload = {
    "session" : session,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }

}


/**
 * Get Organizations Printers
 * @param {obj} session
 * @param {int} printer_id (optional)
 * workgroup_id {int} (optional)
 */
const PrinterOS_GetPrinters = async (session) => {
  const repo = "/apiglobal/get_organization_printers_list";
  const payload = {
    "session" : session,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }

}


/**
 * Get Printer List
 * @required {obj} session
 * @param {string} printer_type (optional, printer short type, ex. K_PORTRAIT)
 * @param {int} printer_id (optional, printer id)
 */
const PrinterOS_GetPrinterList = async (session, printer_type, printer_id) => {
  const repo = "/apiglobal/get_printers_list";
  const payload = {
    "session" : session,
    "printer_type" : printer_type,
    "printer_id" : printer_id,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Get a Specific Printer's Job List
 * @required {obj} session
 * @required {int} printerID
 * @param {int} limit (optional, default 20) - max job count in response
 * @param {int} offset (optional, default 0) - offset for pagination
 * @param {int} prev_time (optional, parameter for live update. Can be used to get only changed jobs between two requests. For first request need to send add prev_time: 0, and you will have “time” parameter in   
 * response. You need to send prev_time: “time” in next request to get only live updates)
 */
const PrinterOS_GetPrintersJobList = async (session, printerID) => {
  const repo = "/apiglobal/get_printer_jobs";
  const payload = {
    "session" : session,
    "printer_id" : printerID,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Get a Specific Job Details
 * @param {obj} session
 * @param {int} jobID
 */
const PrinterOS_GetJobInfo = async (session, jobID) => {
  const repo = "/apiglobal/get_job_info";
  const payload = {
    "session" : session,
    "job_id" : jobID,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Get Users by Workgroup Assignment
 * @param {obj} session
 * @param {int} workgroupID
 */
const PrinterOS_GetUsersByWorkgroup = async (session, workgroupID) => {
  const repo = "/apiglobal/get_workgroup_users";
  const payload = {
    "session" : session,
    "workgroup_id" : workgroupID,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Get Printers in Cloud - No input params
 */
const PrinterOS_GetPrintersInCloud = async () => {
  const repo = "/apiglobal/get_printer_types_detailed";
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Get a Custom Admin Report
 * @required {obj} session
 * @param {string} from (optional, Y-m-d date string, for ex 2019-06-01; default is today-31 days)
 * @param {string} to (optional Y-m-d date string, for ex 2019-06-01; default is today; max range for from-to is 365 days)
 * @param {string} type (optional, type of response: json or csv; default is csv)
 * @param {int} workgroups (optional, 1 or 0; add to response fields connected with workgroups: Workgroup IDs, Workgroup Names, and Workgroup Passwords; default is 0; id user is in multiple workgroups   
 * @param {int} all_fields (optional, 1 or 0; show all available fields or only fields that were selected in organizational settings tab; default is 0)
 */
const PrinterOS_GetAdminReport = async (session, fromDate, toDate ) => {
  const repo = "/apiglobal/get_custom_report";
  const payload = {
    "session" : session,
    "from" : fromDate,
    "to" : toDate,
    "type" : "json",
    "workgroups" : 0,
    "all_fields" : 0,
  }
  const params = {
    "method" : "POST",
    "headers" : { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) },
    "contentType" : "application/json",
    "payload" : payload,
    followRedirects : true,
    muteHttpExceptions : true
  };
  const html = await UrlFetchApp.fetch(root + repo, params);
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${RESPONSECODES[html.getResponseCode()]}`);
  Logger.log(`HEADERS ---> : ${JSON.stringify(html.getHeaders())}`);
  Logger.log(`Response ---> : ${JSON.stringify(html.getContentText())}`);
  return {
    responseCode : html.getResponseCode(),
    headers : html.getHeaders(),
    response : html.getContentText()
  }
}


/**
 * Try it out.
 */
const PrinterOS_Get = async () => {
  let session;
  try {
    const { responseCode, headers, response } = await PrinterOS_Login();
    if(responseCode != 200) {
      const { responseCode, headers, response } = await PrinterOS_ClassicLogin();
    }
    if(response) { 
      session = response;
    }
    // const printers = PrinterOS_GetPrinters(session);
    // const { responseCode, headers, response } = PrinterOS_GetPrintersInCloud();

    // printers.forEach(printer => {
    //   let jobslist = PrinterOS_GetPrintersJobList(session, printer)
    // })
  } catch(err) {
    Logger.log(`Whoops ---> : ${err}`)
  }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a PrinterOS Ticket to Print
 * @param {string} designspecialist
 * @param {time} submissiontime
 * @param {string} name
 * @param {number} sid
 * @param {string} email
 * @param {string} projectname
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @returns {doc} doc
 */
const PrinterOS_CreateTicket = ( designspecialist, submissiontime, name, email, projectname, material1Quantity, material1Name, material2Quantity, material2Name, ) => {

  // Create JobNumber
  try {
    const jobnumber = CreateJobNumber(submissiontime);
  } catch (err) {
    Logger.log(`${err} : Couldn't generate a job number.`)
  }

  // Create Doc
  try {
    var folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    var doc = DocumentApp.create(`Job Ticket`); //Make Document
    var body = doc.getBody();
    var docId = doc.getId();
  } catch (err) {
    Logger.log( `${err} : Couldn't fetch doc folder, or make ticket, or get body or docId.` );
  }

  // Create BarCode
  try {
    var barcode = GenerateBarCode(jobnumber);
  } catch (err) {
    Logger.log(`${err} : Couldnt create barcode for some reason.`);
  }

  // Create QR Code
  try {
    var qrCode = GenerateQRCode(doc.getUrl());
  } catch (err) {
    Logger.log(`${err} : Couldnt create QRCode for some reason.`);
  }

  // Append Document with Info
  if (doc != undefined || doc != null || doc != NaN) {
    try {
      let header = doc
        .addHeader()
        .appendTable([[`img1`, `img2`]])
        .setAttributes({
          [DocumentApp.Attribute.BORDER_WIDTH]: 0,
          [DocumentApp.Attribute.BORDER_COLOR]: `#ffffff`,
        });
      ReplaceTextToImage(header, `img1`, barcode);
      ReplaceTextToImage(header, `img2`, qrCode);

      body.insertHorizontalRule(0);
      body.insertParagraph(1, "Name: " + name.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 18,
          [DocumentApp.Attribute.BOLD]: true,
        });
      body.insertParagraph(2, "Job Number: " + +jobnumber.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING2)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 12,
          [DocumentApp.Attribute.BOLD]: true,
        });

      // Create a two-dimensional array containing the cell contents.
      body.appendTable([
          ["Design Specialist:", designspecialist.toString()],
          ["Job Number:", jobnumber.toString()],
          ["Student Name:", name.toString()],
          ["Project Name:", projectname.toString()],
          ["Materials:", material1Name.toString()],
          [mat[0], mat[1]],
          [partcount[0], partcount[1]],
        ])
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 9,
        });
    } catch (err) {
      Logger.log(`${err} : Couldn't append info to ticket. Ya dun goofed.`);
    }

    // Remove File from root and Add that file to a specific folder
    try {
      var docFile = DriveApp.getFileById(docId);
      DriveApp.removeFile(docFile);
      folder.next().addFile(docFile);
      folder.next().addFile(barcode);
    } catch (err) {
      Logger.log( `${err} : Couldn't delete the file from the drive folder. Sheet is still linked` );
    }

    // Set permissions to 'anyone can edit' for that file
    try {
      var file = DriveApp.getFileById(docId);
      file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
    } catch (err) {
      Logg( `${err} : Couldn't change permissions on the file. You probably have to do something else to make it work.` );
    }
  }
  //Return Document to use later
  return doc;
};

