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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
 * @param {obj} session
 * @param {int} printerID
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  Logger.log(`Response Code ---> : ${html.getResponseCode()} : ${responseCodes[html.getResponseCode()]}`);
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
  try {
    const { responseCode, headers, response } = await PrinterOS_Login();
    if(responseCode != 200) {
      const { responseCode, headers, response } = await PrinterOS_ClassicLogin();
    }

    // const printers = PrinterOS_GetPrinters(session)

    // printers.forEach(printer => {
    //   let jobslist = PrinterOS_GetPrintersJobList(session, printer)
    // })
  } catch(err) {
    Logger.log(`Whoops ---> : ${err}`)
  }
}


