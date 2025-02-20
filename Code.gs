/**
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 * Code orginally developed by Kuan-Ju Wu as part of a SARS-COV-2 / COVID19 Project Response Form.
 * Refined and modified by Cody Glen and Chris Parsell for Jacobs Institute for Design Innovation - UC Berkeley
 * This project creates a project-tracking and notification system for remote project management.
 * This project notifies students automatically via email about the status of their projects as they are fabricated, as well as calculates metrics about fab lab usage.
 * Release 20200611 - Version 0.1
 * Last Updated: 20240827 - Version 2.7.0
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

  const staff = new StaffService().Staff;

  const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const thisSheetName = e.range.getSheet().getSheetName();

  // Get last row and set status to received
  let lastRow = [...SheetService.GetColumnDataByHeader(thisSheet, HEADERNAMES.timestamp)]
    .filter(Boolean)
    .length + 1;
  console.info(`This Row: ${lastRow}`);

  // Parse variables
  let values = e.namedValues;
  let name = values[HEADERNAMES.name][0] ? TitleCase(values[HEADERNAMES.name][0]) : undefined;
  SheetService.SetByHeader(thisSheet, HEADERNAMES.name, lastRow, name);
  let email = values[HEADERNAMES.email][0] ? values[HEADERNAMES.email][0] : SheetService.GetByHeader(thisSheet, HEADERNAMES.email, lastRow);
  let sid = values[HEADERNAMES.sid][0] ? values[HEADERNAMES.sid][0] : SheetService.GetByHeader(thisSheet, HEADERNAMES.sid, lastRow);
  let studentType = values[HEADERNAMES.affiliation][0] ? values[HEADERNAMES.affiliation][0] : SheetService.GetByHeader(thisSheet, HEADERNAMES.affiliation, lastRow);
  let projectname = values[HEADERNAMES.projectName][0] ? values[HEADERNAMES.projectName][0] : SheetService.GetByHeader(thisSheet, HEADERNAMES.projectName, lastRow);
  let timestamp = values[HEADERNAMES.timestamp][0];

  // Set status to RECEIVED on new submission
  console.info(`VALUES FROM FORM: ${JSON.stringify(values)}`);
  console.warn(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Timestamp : ${timestamp}`);

  // Generate new Job number
  let id = IDService.createId();
  SheetService.SetByHeader(thisSheet, HEADERNAMES.id, lastRow, id);

  // Priority
  let priority = new PriorityService({ email : email, sid : sid }).Priority;
  SheetService.SetByHeader(thisSheet, HEADERNAMES.priority, lastRow, priority);

  // Create Messages
  const message = await new CreateSubmissionMessage({ name : name, projectname : projectname, id : id });

  try {
    if (priority == PRIORITY.None) {
      // Set access to Missing Access
      SheetService.SetByHeader(thisSheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);

      // Email
      Emailer.Email(email, SERVICE_EMAIL, `${SERVICE_NAME} : Missing Access`, message.missingAccessMessage, STATUS.missingAccess, staff.Cody.email );

    } else {
      // Set Status to Received
      SheetService.SetByHeader(thisSheet, HEADERNAMES.status,  lastRow, STATUS.received); 
    }
  } catch(err) {
    console.error(`${err} : Couldn't determine student access`);
  }

  // Get DS-Specific Message
  let dsMessage = message.dsMessage;

  // Create array summary of student's entry and append it to the message
  dsMessage += `<ul>`;
  for (let key in values) {
    dsMessage += `<li>${key}: ${values[key]}</li>`;
  }
  dsMessage += `</ul><div>`;

  // Set the Staff member for the sheet.
  let designspecialistemail;
  switch (thisSheetName) {
    case SHEETS.Advancedlab.getName():
      designspecialistemail = staff.Chris.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds, lastRow, staff.Chris.name);
      break;
    case SHEETS.Plotter.getName():
    case SHEETS.Fablight.getName():
    case SHEETS.Vinyl.getName():
    case SHEETS.GSI_Plotter.getName():
      designspecialistemail = staff.Cody.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds, lastRow, staff.Cody.name);
      break;
    case SHEETS.Waterjet.getName():
    case SHEETS.Othertools.getName():
      designspecialistemail = staff.Gary.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds, lastRow, staff.Gary.name);
      break;
    case SHEETS.Laser.getName():
    case SHEETS.Shopbot.getName():
      designspecialistemail = staff.Staff.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
    case undefined:
      designspecialistemail = staff.Staff.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
    default:
      designspecialistemail = staff.Staff.email;
      SheetService.SetByHeader(thisSheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
  }

  // Email each DS
  try {
    MailApp.sendEmail(designspecialistemail, `${SERVICE_NAME} Notification`, ``, {
      htmlBody: dsMessage,
      from: SERVICE_EMAIL,
      bcc: `"${staff.Chris.email}, ${staff.Cody.email}"`,
      name: SERVICE_NAME,
    });
    console.info(`Design Specialist has been emailed.`);
  } catch(err) {
    console.error(`${err} : Couldn't email DS...`);
  }

  // GSI Plotter
  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == SHEETS.GSI_Plotter.getSheetName()) {
      SheetService.SetByHeader(SHEETS.GSI_Plotter, HEADERNAMES.priority, lastRow, 1);
      SheetService.SetByHeader(SHEETS.GSI_Plotter, HEADERNAMES.status, lastRow, STATUS.received );
      // Email
      MailApp.sendEmail(email, `${SERVICE_NAME} : GSI Plotter Instructions`, ``, {
        htmlBody: message.gsiPlotterMessage,
        from: SERVICE_EMAIL,
        bcc: `"${staff.Chris.email}, ${staff.Cody.email}"`,
        name: SERVICE_NAME,
      });
      console.info(`GSI Plotter instruction email sent.`);
    }
  } catch (err) {
    console.error(`Whoops: Couldn't deal with GSI sheet I guess.. ${err}`);
  }

  // Check again
  if(IDService.isValid(id) == false) {
    SheetService.SetByHeader(thisSheet, HEADERNAMES.id, lastRow, IDService.createId());
  }

  // Fix wrapping issues
  let driveloc = thisSheet.getRange(`D` + lastRow);
  FormatCell(driveloc);
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Trigger 2 - On Edit
 * Reserved word: onEdit() cannot be used here because it's reserved for simple triggers.
 * @param {Event} e
 */
const onChange = async (e) => {

  // Fetch Data from Sheets
  const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const thisSheetName = thisSheet.getSheetName();

  // Fetch Columns and rows and check validity
  const thisCol = e.range.getColumn();
  const thisRow = e.range.getRow();
  // console.info(`SHEET: ${thisSheetName}, ROW: ${thisRow}, COL: ${thisCol}`);

  // Skip the first row of data.
  if (thisRow <= 1) return;

  // Add link to DS List on Staff Sheet
  if(thisSheetName == OTHERSHEETS.Staff.getSheetName()) {
    const sLink = SheetService.GetByHeader(OTHERSHEETS.Staff, `EMAIL LINK`, thisRow);
    const staffEmail = SheetService.GetByHeader(OTHERSHEETS.Staff, `EMAIL`, thisRow);
    if ( sLink == undefined || sLink == null || (sLink == `` && staffEmail != ``) ) {
      const l = MakeLink(staffEmail);
      SheetService.SetByHeader(OTHERSHEETS.Staff, `EMAIL LINK`, thisRow, l);
    }
  }

  // Ignore Edits on background sheets like Logger and StoreItems 
  if (!SheetService.IsValidSheet(thisSheet)) return;

  // STATUS CHANGE TRIGGER : Only look at Column 1 for email trigger.....
  if (thisCol > 1 && thisCol != 3) return;

  // Parse Row Data
  let rowData = SheetService.GetRowData(thisSheet, thisRow);
  let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
    mat1quantity, mat1, mat2quantity, mat2, 
    mat3quantity, mat3, mat4quantity, mat4, 
    mat5quantity, mat5, affiliation, elapsedTime, estimate, 
    unit_cost1, unit_cost2, unit_cost3, unit_cost4, unit_cost5, printColor, printSize, printCount, sheetName, row, } = rowData;

  // Check Priority
  if(!priority) {
    priority = new PriorityService({ email : email, sid : sid }).Priority;
    SheetService.SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
  } else if (priority == PRIORITY.None && (status != STATUS.cancelled && status != STATUS.closed)) {
    SheetService.SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
  } else if(thisSheetName == SHEETS.GSI_Plotter.getSheetName() || thisSheetName == SHEETS.Plotter.getSheetName()) {
    priority = PRIORITY.Tier1;
    SheetService.SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
  }


  ds = ds ? ds : `a Design Specialist`;
  id = IDService.isValid(id) ? id : IDService.createId();
  projectName = projectName ? projectName : `Your Project`;

  // Log submission info to sheet
  Log.Info(`Submission Time: ${timestamp}, Name: ${name}, Email: ${email}, Project: ${projectName}`);

  // Ignore
  if(status == STATUS.closed || status == STATUS.billed) return;
  else if (status == STATUS.received || status == STATUS.inProgress) {
    console.info(`ID is broken: ${id}`);
    id = IDService.isValid(id) ? id : IDService.createId();
    SheetService.SetByHeader(thisSheet, HEADERNAMES.id, thisRow, id);
    console.warn(`ID was cured for ${email}`);
  }

  // Generate an estimate
  if(mat1 && mat1quantity) BuildEstimate(thisSheet, thisRow);
  
  // Fix Casing on the name field
  if(name) SheetService.SetByHeader(thisSheet, HEADERNAMES.name, thisRow, TitleCase(name));

  // Calculate Turnaround Time only when cell is empty
  if (!elapsedTime && (status == STATUS.completed || status == STATUS.billed)) {
    console.info(`Calculating turnaround times`);
    let endTime = new Date();
    let time = TimeService.Duration(new Date(timestamp), endTime);
    SheetService.SetByHeader(thisSheet, HEADERNAMES.elapsedTime, thisRow, time.toString());
    SheetService.SetByHeader(thisSheet, HEADERNAMES.dateCompleted, thisRow, endTime.toString());
  }

  // Generating a "Ticket"
  if ( status != STATUS.closed && status != STATUS.pickedUp && status != STATUS.abandoned ) {
    if (ticket !== null && ticket !== undefined) {
      console.info(`Already seems to have a ticket, Current Ticket: ${ticket}`);
    } else {
      try {
        ticket = new Ticket({
          id : id,
          designspecialist : ds,
          submissiontime : timestamp,
          name : name,
          email : email,
          projectname : projectName,
          rowData : rowData,
        });
        ticket.CreateTicket();
        SheetService.SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, ticket.url);
        console.info(`Set Ticket URL: ${ticket.url} - Sheet: ${thisSheet} Row: ${thisRow}`);
      } catch (err) {
        console.error(`Ticket Creation failed: ${err}`);
      }
    }
  }
  
  // Case switch for different Design Specialists email
  const designspecialistemaillink = InvokeDS(ds, `emaillink`);
  const designspecialistemail = InvokeDS(ds, `email`);

  // Create a Message and Return Appropriate Responses.
  const message = new MessageService({
    name : name,
    projectname : projectName, 
    id : id,
    rowData : rowData,
    designspecialist : ds,
    designspecialistemaillink : designspecialistemaillink,
    cost : estimate,
  });

  // Send email with appropriate response and cc Chris and Cody.
  new Emailer({
    name : name, 
    status : status,
    email : email,    
    designspecialistemail : designspecialistemail,
    message : message,
  });

  // Check priority one more time:
  if(priority == PRIORITY.None){
    if(status != STATUS.closed && status != STATUS.cancelled ) {
      SheetService.SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
    }
  } else if (!priority && status == STATUS.closed) return;

}









