/**
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 * Code orginally developed by Kuan-Ju Wu as part of a SARS-COV-2 / COVID19 Project Response Form.
 * Refined and modified by Cody Glen and Chris Parsell for Jacobs Institute for Design Innovation - UC Berkeley
 * This project creates a project-tracking and notification system for remote project management.
 * This project notifies students automatically via email about the status of their projects as they are fabricated, as well as calculates metrics about fab lab usage.
 * Release 20200611 - Version 0.1
 * Last Updated: 20210105 - Version 2.7.0
 * URL for Spreadsheet: https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ/edit#gid=1063176066
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 */

//Set Permissions - DONOTDELETE
/**
 * @NotOnlyCurrentDoc
 */




/**
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 */

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Trigger 1 - On Submission
 * Reserved word: onFormSubmit() cannot be used here because it's reserved for simple triggers.
 * @param {Event} e
 */
const onSubmission = async (e) => {
  const writer = new WriteLogger();
  const staff = new MakeStaff().Staff;
  // Set status to RECEIVED on new submission
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = e.range.getSheet().getName();

  // Loop through to get last row and set status to received
  try {
    var searchRange = sheet.getRange(2, 8, sheet.getLastRow()).getValues(); //search timestamp rows for last row
    var lastRow;
    for (var i = 0; i < searchRange.length; i++) {
      if (searchRange[i][0].toString() == ``) {
        lastRow = i + 1;
        break;
      }
    }
    SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.received);
    writer.Info(`Set status to 'Received'.`);
  } catch (err) {
    writer.Error(`${err}: Couldn't set status to 'Received'.`);
  }

  // Parse variables
  var name = e.namedValues[HEADERNAMES.name][0] ? TitleCase(e.namedValues[HEADERNAMES.name][0]) : GetByHeader(sheet, HEADERNAMES.name, lastRow);
  var email = e.namedValues[HEADERNAMES.email][0] ? e.namedValues[HEADERNAMES.email][0] : GetByHeader(sheet, HEADERNAMES.email, lastRow);
  var sid = e.namedValues[HEADERNAMES.sid][0] ? e.namedValues[HEADERNAMES.sid][0] : GetByHeader(sheet, HEADERNAMES.sid, lastRow);
  var studentType = e.namedValues[HEADERNAMES.afiliation][0] ? e.namedValues[HEADERNAMES.afiliation][0] : GetByHeader(sheet, HEADERNAMES.afiliation, lastRow);
  var projectname = e.namedValues[HEADERNAMES.projectName][0] ? e.namedValues[HEADERNAMES.projectName][0] : GetByHeader(sheet, HEADERNAMES.projectName, lastRow);
  var timestamp = e.namedValues[HEADERNAMES.timestamp][0];

  var values = e.namedValues;

  writer.Info(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Timestamp : ${timestamp}`);

  // Generate new Job number
  let jobnumber = await new CreateJobnumber({ date : timestamp }).Jobnumber;
  SetByHeader(sheet, HEADERNAMES.jobNumber, lastRow, jobnumber);

  // Check Priority
  let priority = await new CheckPriority({email : email, sid : sid}).Priority;
  SetByHeader(sheet, HEADERNAMES.priority, lastRow, priority);


  // Create Messages
  const message = await new CreateSubmissionMessage({name : name, projectname : projectname, jobnumber : jobnumber});

  // Get DS-Specific Message
  let dsMessage = message.dsMessage;

  // Create array summary of student's entry and append it to the message
  var values = e.namedValues;
  dsMessage += `<ul>`;
  for (Key in values) {
    let label = Key;
    let data = values[Key];
    dsMessage += `<li>` + label + `: ` + data + `</li>`;
  }
  dsMessage += `</ul>`;
  dsMessage += `<div>`;

  // Notify Staff via email and set their assignment
  var designspecialistemail;

  // Set the Staff member for the sheet.
  SetStaffForSheet(sheet);

  // Email each DS
  try {
    GmailApp.sendEmail(designspecialistemail, `${SERVICE_NAME} Notification`, ``, {
      htmlBody: dsMessage,
      from: SUPPORT_ALIAS,
      bcc: staff.Chris.email,
      name: SERVICE_NAME,
    });
    writer.Info(`Design Specialist has been emailed.`);
  } catch (err) {
    writer.Error(`${err} : Couldn't email DS. Something went wrong.`);
  }

  // Fix `Received` Status Issue
  let stat = sheet.getRange(`A` + lastRow).getValue();
  stat = stat ? stat : SetByHeader(sheet, HEADERNAMES.status,  lastRow, STATUS.received); 
  writer.Warning(`Status refixed to 'Received'.`);

  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == SHEETS.Creaform.getSheetName()) {
      //Email
      GmailApp.sendEmail(email, `${SERVICE_NAME} : Creaform Part Drop-off Instructions`, ``, {
        htmlBody: message.creaformMessage,
        from: SUPPORT_ALIAS,
        bcc: staff.Chris.email,
        name: SERVICE_NAME,
      });
      writer.Info(`Creaform instruction email sent.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't send Creaform email for some reason.`);
  }

  try {
    if (priority == `STUDENT NOT FOUND!` || priority == false) {
      // Set access to Missing Access
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);

      //Email
      GmailApp.sendEmail(email, `${SERVICE_NAME} : Missing Access`, ``, {
        htmlBody: message.missingAccessMessage,
        from: SUPPORT_ALIAS,
        bcc: staff.Chris.email,
        name: SERVICE_NAME,
      });
      writer.Warning(`'Missing Access' Email sent to student and status set to 'Missing Access'.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't find student access boolean value`);
  } finally {
    if (priority == `STUDENT NOT FOUND!` || priority == false) {
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);
    }
  }

  // Check again
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : new CreateJobnumber({ date : timestamp }).Jobnumber;
  SetByHeader(sheet, HEADERNAMES.jobNumber, lastRow, jobnumber);

  // Fix wrapping issues
  let driveloc = sheet.getRange(`D` + lastRow);
  FormatCell(driveloc);
};

/**
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 */

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Trigger 2 - On Edit
 * Reserved word: onEdit() cannot be used here because it's reserved for simple triggers.
 * @param {Event} e
 */
const onChange = async (e) => {
  const writer = new WriteLogger();
  const staff = new MakeStaff().Staff;
  // Fetch Data from Sheets
  var thisSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // var thisSheetName = e.range.getSheet().getSheetName();

  // Fetch Columns and rows and check validity
  var thisCol = e.range.getColumn();
  var thisRow = e.range.getRow();

  // Skip the first 2 rows of data.
  if (thisRow <= 1) return;

  // ----------------------------------------------------------------------------------------------------------------
  // Add link to DS List on Staff Sheet
  if(thisSheet.getSheetName() == OTHERSHEETS.Staff.getSheetName() && thisRow >= 2) {
    const sLink = GetByHeader(OTHERSHEETS.Staff, `EMAIL LINK`, thisRow);
    const staffEmail = GetByHeader(OTHERSHEETS.Staff, `EMAIL`, thisRow);
    if ( sLink == undefined || sLink == null || (sLink == `` && staffEmail != ``) ) {
      const l = MakeLink(staffEmail);
      SetByHeader(OTHERSHEETS.Staff, `EMAIL LINK`, thisRow, l);
    }
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Ignore Edits on background sheets like Logger and StoreItems 
  if (CheckSheetIsForbidden(thisSheet)) return;

  // STATUS CHANGE TRIGGER : Only look at Column 1 for email trigger.....
  if (thisCol > 1 && thisCol != 3) return;

  //----------------------------------------------------------------------------------------------------------------
  // Parse Data
  let rowData = GetRowData(thisSheet, thisRow);
  let { status, ds, priority, ticket, jobNumber, timestamp, email, name, sid, projectName, 
    mat1quantity, mat1, mat2quantity, mat2, 
    mat3quantity, mat3, mat4quantity, mat4, 
    mat5quantity, mat5, afiliation, elapsedTime, estimate, 
    price1, price2, sheetName, row, } = rowData;
  console.info(rowData)

  //----------------------------------------------------------------------------------------------------------------
  // Check Priority
  try {
    priority = priority ? priority : await new CheckPriority({ email : email, sid : sid }).Priority;
    SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
    if (priority == `STUDENT NOT FOUND` && (status != STATUS.cancelled || status != STATUS.closed)) {
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
    }
  } catch (err) {
    console.error(`Whoops: Couldn't double-check priority: ${err}`);
  }


  var designspecialist = ds ? ds : `a Design Specialist`;
  var jobnumber = jobNumber ? jobNumber : new CreateJobnumber({ date : new Date() }).Jobnumber;
  projectName = projectName ? projectName : `Your Project`;

  // Materials
  const material1Name = mat1, material1URL = ``;
  const material2Name = mat2, material2URL = ``;
  const material3Name = mat3, material3URL = ``;
  const material4Name = mat4, material4URL = ``;
  const material5Name = mat5, material5URL = ``;

  mat1 = material1Name == `` ? false : true;
  mat2 = material2Name == `` ? false : true;
  mat3 = material3Name == `` ? false : true;
  mat4 = material4Name == `` ? false : true;
  mat5 = material5Name == `` ? false : true;


  // Log submission info to sheet
  writer.Info(`Submission Time = ${timestamp}, Name = ${name}, Email = ${email}, Project = ${projectName}`);

  // Ignore
  if(status == STATUS.closed || status == STATUS.cancelled) return;

  //----------------------------------------------------------------------------------------------------------------
  // Fix Job Number if it's missing
  try {
    writer.Warning(`Trying to fix job number : ${jobnumber}`)
    if (status == STATUS.received || status == STATUS.inProgress) {
      jobnumber = jobnumber ? jobnumber : new CreateJobnumber({ date : timestamp }).Jobnumber;
      SetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow, jobnumber);
      writer.Warning(`Job Number was missing, so the script fixed it. Submission by ${email}`);
    }
  } catch (err) {
    writer.Error(`${err} : Job Number failed onSubmit, and has now failed onEdit`);
  }
  
  //----------------------------------------------------------------------------------------------------------------
  // Fix Casing on the name field
  try {
    if(name) SetByHeader(thisSheet, HEADERNAMES.name, thisRow, TitleCase(name));
  } catch (err) {
    writer.Error(`${err} : Couldn't fix their name.....`)
  }

  //----------------------------------------------------------------------------------------------------------------
  // Calculate Turnaround Time only when cell is empty
  try {
    writer.Warning(`Attempting to Calculate turnaround times`);
    const calc = new Calculate();
    if (!elapsedTime) {
      if (status == STATUS.completed || status == STATUS.billed) {
        let endTime = new Date();
        let time = await calc.CalculateDuration(new Date(timestamp), endTime);

        // Write to Column - d h:mm:ss  
        SetByHeader(thisSheet, HEADERNAMES.elapsedTime, thisRow, time.toString());
        SetByHeader(thisSheet, HEADERNAMES.dateCompleted, thisRow, endTime.toString());
      }
    }
  } catch (err) {
    writer.Error( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }



  //----------------------------------------------------------------------------------------------------------------
  // Generating a "Ticket"
  if ( status != STATUS.closed || status != STATUS.pickedUp || status != STATUS.abandoned ) {
    if (ticket !== null || ticket !== undefined) writer.Warning("Already seems to have a ticket.");
    writer.Warning(`Current Ticket: ${ticket}`);
    if (ticket == null || ticket == undefined) {

      try {
        ticket = new Ticket({
          jobnumber : jobnumber,
          designspecialist : designspecialist,
          submissiontime : timestamp,
          name : name,
          email : email,
          projectname : projectName,
          rowData : rowData,
        });
        ticket.CreateTicket();
      } catch (err) {
        writer.Error(`${err} : Couldn't generate a ticket. Check docUrl / id and repair.` );
      }
      try {
        SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, ticket.url);
        console.info(`Set Ticket URL: ${ticket.url} - Sheet: ${thisSheet} Row: ${thisRow}`);
      } catch (err) {
        console.error(`${err} : Setting Ticket URL failed - Sheet: ${thisSheet} Row: ${thisRow} URL: ${ticket.url}`);
      }
    }
  }
  
  // Case switch for different Design Specialists email
  var designspecialistemaillink = InvokeDS(designspecialist, `emaillink`);
  var designspecialistemail = InvokeDS(designspecialist, `email`);

  // Create a Message and Return Appropriate Responses.
  var Message = new CreateMessage({
    name : name,
    projectname : projectName, 
    jobnumber : jobnumber,
    material1URL : material1URL,
    material1Quantity : mat1quantity,
    material1Name : material1Name,
    material2URL : material2URL,
    material2Quantity : mat2quantity,
    material2Name : material2Name,
    material3URL : material3URL,
    material3Quantity : mat3quantity,
    material3Name : material3Name,
    material4URL : material4URL,
    material4Quantity : mat4quantity,
    material4Name : material4Name,
    material5URL : material5URL,
    material5Quantity : mat5quantity,
    material5Name : material5Name,
    designspecialist : designspecialist,
    designspecialistemaillink : designspecialistemaillink,
    cost : estimate,
  });

  // Send email with appropriate response and cc Chris and Cody.
  writer.Info(`Sending email....`);
  new Emailer({
    name : name, 
    status : status,
    email : email,    
    designspecialistemail : designspecialistemail,
    message : Message,
  });

  // Check priority one more time:
  if(priority == `STUDENT NOT FOUND!`){
    if(status != STATUS.closed || status != STATUS.cancelled ) {
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
    }
  } else if (!priority) {
    if(status == STATUS.cancelled || status == STATUS.closed) return;
  }
};









