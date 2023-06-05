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

  // Get last row and set status to received
  let timestamps = [...GetColumnDataByHeader(sheet, HEADERNAMES.timestamp)].filter(Boolean);
  let lastRow = timestamps.length + 1;
  console.info(`This Row: ${lastRow}`);

  // Parse variables
  let name = e.namedValues[HEADERNAMES.name][0] ? TitleCase(e.namedValues[HEADERNAMES.name][0]) : undefined;
  SetByHeader(sheet, HEADERNAMES.name, lastRow, name);
  let email = e.namedValues[HEADERNAMES.email][0] ? e.namedValues[HEADERNAMES.email][0] : GetByHeader(sheet, HEADERNAMES.email, lastRow);
  let sid = e.namedValues[HEADERNAMES.sid][0] ? e.namedValues[HEADERNAMES.sid][0] : GetByHeader(sheet, HEADERNAMES.sid, lastRow);
  let studentType = e.namedValues[HEADERNAMES.affiliation][0] ? e.namedValues[HEADERNAMES.affiliation][0] : GetByHeader(sheet, HEADERNAMES.affiliation, lastRow);
  let projectname = e.namedValues[HEADERNAMES.projectName][0] ? e.namedValues[HEADERNAMES.projectName][0] : GetByHeader(sheet, HEADERNAMES.projectName, lastRow);
  let timestamp = e.namedValues[HEADERNAMES.timestamp][0];

  let values = e.namedValues;
  console.info(`VALUES FROM FORM: ${JSON.stringify(values)}`);
  writer.Info(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Timestamp : ${timestamp}`);

  // Generate new Job number
  const jobnumberService = new JobnumberService();
  let jobnumber = jobnumberService.jobnumber;
  SetByHeader(sheet, HEADERNAMES.jobnumber, lastRow, jobnumber);

  // Check Priority
  let priority = await new CheckPriority({email : email, sid : sid}).Priority;
  SetByHeader(sheet, HEADERNAMES.priority, lastRow, priority);

  // Create Messages
  const message = await new CreateSubmissionMessage({ name : name, projectname : projectname, jobnumber : jobnumber });

  // Get DS-Specific Message
  let dsMessage = message.dsMessage;

  // Create array summary of student's entry and append it to the message
  dsMessage += `<ul>`;
  for (let key in values) {
    let label = key;
    let data = values[key];
    dsMessage += `<li>` + label + `: ` + data + `</li>`;
  }
  dsMessage += `</ul>`;
  dsMessage += `<div>`;

  // Notify Staff via email and set their assignment
  let designspecialistemail;

  // Set the Staff member for the sheet.
  switch (sheetName) {
    case SHEETS.Advancedlab.getName():
    case SHEETS.Creaform.getName():
      designspecialistemail = staff.Chris.email;
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, staff.Chris.name);
      break;
    case SHEETS.Plotter.getName():
    case SHEETS.Fablight.getName():
    case SHEETS.Haas.getName():
    case SHEETS.Vinyl.getName():
    case SHEETS.GSI_Plotter.getName():
      designspecialistemail = staff.Cody.email;
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, staff.Cody.name);
      break;
    case SHEETS.Waterjet.getName():
    case SHEETS.Othertools.getName():
      designspecialistemail = staff.Gary.email;
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, staff.Gary.name);
      break;
    case SHEETS.Laser.getName():
      // Nobody assigned / Everyone assigned.
      break;
    case SHEETS.Othermill.getName():
    case SHEETS.Shopbot.getName():
      designspecialistemail = staff.Staff.email;
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
    case undefined:
      designspecialistemail = staff.Staff.email;
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
    default:
      designspecialistemail = staff.Staff.email;
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
  }

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
    console.error(`${err} : Couldn't email DS...`);
  }

  // Fix `Received` Status Issue
  let stat = GetByHeader(sheet, HEADERNAMES.status, lastRow);
  if (stat != STATUS.received) {
    stat = STATUS.received;
    SetByHeader(sheet, HEADERNAMES.status,  lastRow, stat); 
    console.warn(`Status refixed to 'Received'.`);
  }

  // Creaform
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
    console.error(`${err} : Couldn't send Creaform email for some reason.`);
  }

  // GSI Plotter
  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == SHEETS.GSI_Plotter.getSheetName()) {
      SetByHeader(SHEETS.GSI_Plotter, HEADERNAMES.priority, lastRow, 1);
      SetByHeader(SHEETS.GSI_Plotter, HEADERNAMES.status, lastRow, STATUS.received );
      GmailApp.sendEmail(email, `${SERVICE_NAME} : GSI Plotter Instructions`, ``, {
        htmlBody: message.gsiPlotterMessage,
        from: SUPPORT_ALIAS,
        bcc: staff.Chris.email,
        name: SERVICE_NAME,
      });
      console.info(`GSI Plotter instruction email sent.`);
    }
  } catch (err) {
    console.error(`Whoops: Couldn't deal with GSI sheet I guess.. ${err}`);
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
    console.error(`${err} : Couldn't determine student access`);
  } finally {
    if (priority == `STUDENT NOT FOUND!` || priority == false) {
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);
    }
  }

  // Check again
  if(!jobnumberService.IsValid(jobnumber)) {
    jobnumber = jobnumberService.jobnumber
    SetByHeader(sheet, HEADERNAMES.jobnumber, lastRow, jobnumber);
  }

  // Fix wrapping issues
  let driveloc = sheet.getRange(`D` + lastRow);
  FormatCell(driveloc);
};



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Trigger 2 - On Edit
 * Reserved word: onEdit() cannot be used here because it's reserved for simple triggers.
 * @param {Event} e
 */
const onChange = async (e) => {
  const writer = new WriteLogger();

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
  let { status, ds, priority, ticket, jobnumber, timestamp, email, name, sid, projectName, 
    mat1quantity, mat1, mat2quantity, mat2, 
    mat3quantity, mat3, mat4quantity, mat4, 
    mat5quantity, mat5, affiliation, elapsedTime, estimate, 
    price1, price2, printColor, printSize, printCount, sheetName, row, } = rowData;

  //----------------------------------------------------------------------------------------------------------------
  // Check Priority
  try {
    if(!priority) {
      priority = await new CheckPriority({ email : email, sid : sid }).Priority;
      SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
    } else if (priority == `STUDENT NOT FOUND` && (status != STATUS.cancelled || status != STATUS.closed)) {
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
    } else if(sheet.getSheetName() == SHEETS.GSI_Plotter.getSheetName()) {
      priority = 1;
      SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
    }
  } catch (err) {
    console.error(`Whoops: Couldn't double-check priority: ${err}`);
  }

  ds = ds ? ds : `a Design Specialist`;
  const jobnumberService = new JobnumberService();
  jobnumber = jobnumberService.IsValid(jobnumber) ? jobnumber : jobnumberService.jobnumber;
  projectName = projectName ? projectName : `Your Project`;


  // Log submission info to sheet
  writer.Info(`Submission Time = ${timestamp}, Name = ${name}, Email = ${email}, Project = ${projectName}`);

  // Ignore
  if(status == STATUS.closed) return;

  //----------------------------------------------------------------------------------------------------------------
  // Fix Job Number if it's missing
  try {
    console.info(`Trying to fix job number : ${jobnumber}`)
    if (status == STATUS.received || status == STATUS.inProgress) {
      jobnumber = jobnumberService.IsValid(jobnumber) ? jobnumber : jobnumberService.jobnumber;
      SetByHeader(thisSheet, HEADERNAMES.jobnumber, thisRow, jobnumber);
      writer.Warning(`Job Number was missing, so the script fixed it. Submission by ${email}`);
    }
  } catch (err) {
    console.error(`${err} : Job Number failed onSubmit, and has now failed onEdit`);
  }
  
  //----------------------------------------------------------------------------------------------------------------
  // Fix Casing on the name field
  try {
    if(name) SetByHeader(thisSheet, HEADERNAMES.name, thisRow, TitleCase(name));
  } catch (err) {
    console.error(`${err} : Couldn't fix their name.....`)
  }

  //----------------------------------------------------------------------------------------------------------------
  // Calculate Turnaround Time only when cell is empty
  try {
    console.info(`Attempting to Calculate turnaround times`);
    if (!elapsedTime) {
      if (status == STATUS.completed || status == STATUS.billed) {
        let endTime = new Date();
        let time = await Calculate.CalculateDuration(new Date(timestamp), endTime);
        SetByHeader(thisSheet, HEADERNAMES.elapsedTime, thisRow, time.toString());
        SetByHeader(thisSheet, HEADERNAMES.dateCompleted, thisRow, endTime.toString());
      }
    }
  } catch (err) {
    console.error( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }


  //----------------------------------------------------------------------------------------------------------------
  // Generating a "Ticket"
  if ( status != STATUS.closed || status != STATUS.pickedUp || status != STATUS.abandoned ) {
    if (ticket !== null || ticket !== undefined) {
      console.info("Already seems to have a ticket.");
      console.info(`Current Ticket: ${ticket}`);
    } else {
      try {
        ticket = new Ticket({
          jobnumber : jobnumber,
          designspecialist : ds,
          submissiontime : timestamp,
          name : name,
          email : email,
          projectname : projectName,
          rowData : rowData,
        });
        ticket.CreateTicket();
      } catch (err) {
        console.error(`${err} : Couldn't generate a ticket. Check docUrl / id and repair.` );
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
  var designspecialistemaillink = InvokeDS(ds, `emaillink`);
  var designspecialistemail = InvokeDS(ds, `email`);

  // Create a Message and Return Appropriate Responses.
  var message = new CreateMessage({
    name : name,
    projectname : projectName, 
    jobnumber : jobnumber,
    rowData : rowData,
    designspecialist : ds,
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
    message : message,
  });

  // Check priority one more time:
  if(priority == `STUDENT NOT FOUND!`){
    if(status != STATUS.closed || status != STATUS.cancelled ) {
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
    }
  } else if (!priority) {
    if(status == STATUS.closed) return;
  }
};









