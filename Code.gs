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
 * Gmail Constants
 */
const supportAlias = GmailApp.getAliases()[0];
const gmailName = `Jacobs Project Support`;


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
  const staff = BuildStaff();
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
  let jobnumber = await new JobNumberGenerator({ date : timestamp }).jobnumber;
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

  switch (sheetName) {
    case SHEETS.Othermill.getName():
    case SHEETS.Shopbot.getName():
      designspecialistemail = staff.Adam.email;
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, staff.Adam.name);
      break;
    case SHEETS.Advancedlab.getName():
    case SHEETS.Creaform.getName():
      designspecialistemail = staff.Chris.email;
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, staff.Chris.name);
      break;
    case SHEETS.Plotter.getName():
    case SHEETS.Fablight.getName():
    case SHEETS.Haas.getName():
    case SHEETS.Vinyl.getName():
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
    case SHEETS.Ultimaker.getName():
      designspecialistemail = staff.Nicole.email;
      break;
    case undefined:
      designspecialistemail = staff.Staff.email;
      //sheet.getRange(`B` + lastRow).setValue(`Staff`);
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, staff.Staff.name);
      break;
  }

  // Email each DS
  try {
    GmailApp.sendEmail(designspecialistemail, `Jacobs Project Support Notification`, ``, {
      htmlBody: dsMessage,
      from: supportAlias,
      bcc: staff.Chris.email,
      name: gmailName,
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
      GmailApp.sendEmail(email, `Jacobs Project Support : Creaform Part Drop-off Instructions`, ``, {
        htmlBody: message.creaformMessage,
        from: supportAlias,
        bcc: staff.Chris.email,
        name: gmailName,
      });
      writer.Info(`Creaform instruction email sent.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't send Creaform email for some reason.`);
  }

  try {
    if (priority.priority == `STUDENT NOT FOUND!` || priority.priority == false) {
      // Set access to Missing Access
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);

      //Email
      GmailApp.sendEmail(email, `Jacobs Project Support : Missing Access`, ``, {
        htmlBody: message.missingAccessMessage,
        from: supportAlias,
        bcc: staff.Chris.email,
        name: gmailName,
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
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : new JobNumberGenerator({ date : timestamp }).jobnumber;
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
  const staff = BuildStaff();
  // Fetch Data from Sheets
  var thisSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Fetch Columns and rows and check validity
  var thisCol = e.range.getColumn();
  var thisRow = e.range.getRow();

  // Skip the first 2 rows of data.
  if (thisRow <= 1) return;

  //----------------------------------------------------------------------------------------------------------------
  // Add link to DS List
  const sLink = OTHERSHEETS.Staff.getRange(thisRow, 4).getValue();
  if (thisRow > 2) {
    if ( sLink == undefined || sLink == null || (sLink == `` && OTHERSHEETS.Staff.getRange(thisRow, 3).getValue() != ``) ) {
      const l = MakeLink(OTHERSHEETS.Staff.getRange(thisRow, 3).getValue());
      OTHERSHEETS.Staff.getRange(thisRow, 4).setValue(l);
    }
  }
  

  //----------------------------------------------------------------------------------------------------------------
  //Ignore Edits on background sheets like Logger and StoreItems - NICE!! /CG
  var thisSheetName = e.range.getSheet().getSheetName();
  Object.values(NONITERABLESHEETS).forEach(sheet => {
    if(thisSheetName == sheet.getSheetName()) return;
  });

  // STATUS CHANGE TRIGGER : Only look at Column 1 for email trigger.....
  if (thisCol > 1 && thisCol != 3) return;

  //----------------------------------------------------------------------------------------------------------------
  // Check Priority
  let status = GetByHeader(thisSheet, HEADERNAMES.status, thisRow);

  let tempEmail = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  let tempSID = GetByHeader(thisSheet, HEADERNAMES.sid, thisRow);

  let tempPriority = await new CheckPriority({email : tempEmail, sid : tempSID}).Priority;
  SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, tempPriority);
  if (tempPriority == `STUDENT NOT FOUND` || !tempPriority && (status != STATUS.cancelled || status != STATUS.closed)) {
    SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
  }

  

  //----------------------------------------------------------------------------------------------------------------
  // Parse Data

  var designspecialist = GetByHeader(thisSheet, HEADERNAMES.ds, thisRow) ? GetByHeader(thisSheet, HEADERNAMES.ds, thisRow) : `a Design Specialist`;
  var priority = GetByHeader(thisSheet, HEADERNAMES.priority, thisRow) ? GetByHeader(thisSheet, HEADERNAMES.priority, thisRow) : await new CheckPriority({email : tempEmail, sid : tempSID}).Priority;
  var jobnumber = GetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow) ? GetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow) : new JobNumberGenerator({ date : new Date() }).jobnumber;
  var ticket = GetByHeader(thisSheet, HEADERNAMES.ticket, thisRow);
  var studentApproval = GetByHeader(thisSheet, HEADERNAMES.studentApproved, thisRow);
  var submissiontime = GetByHeader(thisSheet, HEADERNAMES.timestamp, thisRow);
  var email = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  var name = GetByHeader(thisSheet, HEADERNAMES.name, thisRow);
  var sid = GetByHeader(thisSheet, HEADERNAMES.sid, thisRow);
  var studentType = GetByHeader(thisSheet, HEADERNAMES.afiliation, thisRow);
  var projectname = GetByHeader(thisSheet, HEADERNAMES.projectName, thisRow) ? GetByHeader(thisSheet, HEADERNAMES.projectName, thisRow) : `Your Project`;
  var cost = GetByHeader(thisSheet, HEADERNAMES.estimate, thisRow);

  //Materials
  const material1Quantity = GetByHeader(thisSheet, HEADERNAMES.mat1quantity, thisRow);
  const material1Name = GetByHeader(thisSheet, HEADERNAMES.mat1, thisRow);
  const material1URL = ``;

  const material2Quantity = GetByHeader(thisSheet, HEADERNAMES.mat2quantity, thisRow);
  const material2Name = GetByHeader(thisSheet, HEADERNAMES.mat2, thisRow);
  const material2URL = ``;

  const material3Quantity = GetByHeader(thisSheet, HEADERNAMES.mat3quantity, thisRow);
  const material3Name = GetByHeader(thisSheet, HEADERNAMES.mat3, thisRow);
  const material3URL = ``;

  const material4Quantity = GetByHeader(thisSheet, HEADERNAMES.mat4quantity, thisRow);
  const material4Name = GetByHeader(thisSheet, HEADERNAMES.mat4, thisRow);
  const material4URL = ``;

  const material5Quantity = GetByHeader(thisSheet, HEADERNAMES.mat5quantity, thisRow);
  const material5Name = GetByHeader(thisSheet, HEADERNAMES.mat5, thisRow);
  const material5URL = ``;

  if (material1Name != ``) var mat1 = true;
  else mat1 = false;
  if (material2Name != ``) var mat2 = true;
  else mat2 = false;
  if (material3Name != ``) var mat3 = true;
  else mat3 = false;
  if (material4Name != ``) var mat4 = true;
  else mat4 = false;
  if (material5Name != ``) var mat5 = true;
  else mat5 = false;

  // Log submission info to sheet
  writer.Info(`Submission Time = ${submissiontime}, Name = ${name}, Email = ${email}, Project = ${projectname}`);

  // Ignore
  if(status == STATUS.closed || status == STATUS.cancelled) return;

  //----------------------------------------------------------------------------------------------------------------
  // Fix Job Number if it's missing
  try {
    writer.Warning(`Trying to fix job number : ${jobnumber}`)
    if (status == STATUS.received || status == STATUS.inProgress) {
      jobnumber = jobnumber ? jobnumber : new JobNumberGenerator({ date : submissiontime }).jobnumber;
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
    let elapsedCell = thisSheet.getRange(thisRow, 43).getValue();
    if (elapsedCell) {
      if (status == STATUS.completed || status == STATUS.billed) {
        let endTime = new Date();
        let time = await calc.CalculateDuration(new Date(submissiontime), endTime);

        // Write to Column - d h:mm:ss  
        SetByHeader(thisSheet, HEADERNAMES.elapsedTime, thisRow, time.toString());
        writer.Info(`Turnaround Time = ${time}`);

        // Write Completed time
        SetByHeader(thisSheet, HEADERNAMES.dateCompleted, thisRow, endTime.toString());
      }
    }
  } catch (err) {
    writer.Error( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }



  //----------------------------------------------------------------------------------------------------------------
  // Make an approval form on demand
  // Create a new form, then add a checkbox question, a multiple choice question,
  let approvalURL;
  if (status == STATUS.pendingApproval) {
    writer.Warning(`Attempting to create an approval form.`)
    try {
      const approvalform = await new ApprovalFormBuilder({
        name : name,
        jobnumber : jobnumber,
        cost : cost,
      })
      approvalURL = approvalform.url;
      writer.Info(`Approval Form generated and sent to user.`);
    }
    catch (err) {
      writer.Error(`${err} : Couldn't generate an approval form` );
    }
  }

  //----------------------------------------------------------------------------------------------------------------
  // Generating a "Ticket"
  if ( status != STATUS.closed || status != STATUS.pickedUp || status != STATUS.abandoned ) {
    let ticket;
    try {
      writer.Warning(`Attempting to create a ticket`);
      let material, part, note;
      let mat = [];
      let partcount = [];
      let notes = [];
      switch(thisSheet.getSheetName()) {
        case SHEETS.Laser.getSheetName():
          material = GetByHeader(SHEETS.Laser, `Rough dimensions of your part`, thisRow);
          if(!material) mat.push(`Materials: `, `None`);
          else mat.push( `Rough Dimensions:`, material.toString());

          part = GetByHeader(SHEETS.Laser, `Total number of parts needed`, thisRow);
          if(!part) partcount.push(`Part Count: `, `None`);
          else partcount.push(`Part Count:`, part.toString());

          note = GetByHeader(SHEETS.Laser, `Notes`, thisRow);
          if(!note) notes.push(`Notes: `, `None`);
          else notes.push( `Notes:`, note.toString());
          break;
        case SHEETS.Fablight.getSheetName():
          material = GetByHeader(SHEETS.Fablight, `Rough dimensions of your part?`, thisRow);
          if(!material) mat.push(`Materials: `, `None`);
          else mat.push( `Rough Dimensions:`, material.toString());

          part = GetByHeader(SHEETS.Fablight, `How many parts do you need?`, thisRow);
          if(!part) partcount.push(`Part Count: `, `None`);
          else partcount.push( `Part Count:`, part.toString());

          note = GetByHeader(SHEETS.Fablight, `Notes:`, thisRow);
          if(!note) notes.push(`Notes: `, `None`);
          else notes.push( `Notes:`, note.toString());
          break;
        case SHEETS.Waterjet.getSheetName():
          material = GetByHeader(SHEETS.Waterjet, `Rough dimensions of your part`, thisRow);
          if(!material) mat.push(`Materials: `, `None`);
          else mat.push( `Rough Dimensions: `, material.toString());

          part = GetByHeader(SHEETS.Waterjet, `How many parts do you need?`, thisRow);
          if(!part) partcount.push(`Part Count: `, `None`);
          else partcount.push( `Part Count:`, part.toString());

          note = GetByHeader(SHEETS.Waterjet, `Notes`, thisRow);
          if(!note) notes.push(`Notes: `, `None`);
          else notes.push( `Notes: `, note.toString());
          break;
        case SHEETS.Advancedlab.getSheetName():
          material = GetByHeader(SHEETS.Advancedlab, HEADERNAMES.whichPrinter, thisRow);
          if(!material) mat.push(`Materials: `, `None`);
          else mat.push( `Which Printer: `, material.toString());

          part = GetByHeader(SHEETS.Advancedlab, HEADERNAMES.numberOfParts, thisRow);
          if(!part) partcount.push(`Part Count: `, `None`);
          else partcount.push( `Part Count:`, part.toString());

          note = GetByHeader(SHEETS.Advancedlab, HEADERNAMES.otherJobNotes, thisRow);
          if(!note) notes.push(`Notes: `, `None`);
          else notes.push( `Notes:`, note.toString());
          break;
        default:
          mat.push(`Materials: `, `None`);
          partcount.push(`Part Count: `, `None`);
          notes.push(`Notes: `, `None`);
          break;
      }
      ticket = new Ticket({
        jobnumber : jobnumber,
        designspecialist : designspecialist,
        submissiontime : submissiontime,
        name : name,
        email : email,
        projectname : projectname,
        material1Name : material1Name,
        material1Quantity : material1Quantity,
        material2Name : material2Name,
        material2Quantity : material2Quantity,
        materials : mat,
        partCount : partcount,
        notes : notes,
      });
      ticket.CreateTicket();
    } catch (err) {
      writer.Error(`${err} : Couldn't generate a ticket. Check docUrl / id and repair.` );
    }
    try {
      SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, ticket.url);
      console.info(`Set Ticket URL - Sheet: ${thisSheet} Row: ${thisRow}, URL: ${ticket.url}`);
    } catch (err) {
      console.error(`${err} : Setting Ticket URL failed - Sheet: ${thisSheet} Row: ${thisRow} URL: ${ticket.url}`);
    }
  }

  // Case switch for different Design Specialists email
  var designspecialistemaillink = InvokeDS(designspecialist, `emaillink`);
  var designspecialistemail = InvokeDS(designspecialist, `email`);

  // Create a Message and Return Appropriate Responses.
  var Message = new CreateMessage({
    name : name,
    projectname : projectname, 
    jobnumber : jobnumber,
    approvalURL : approvalURL,
    material1URL : material1URL,
    material1Quantity : material1Quantity,
    material1Name : material1Name,
    material2URL :material2URL,
    material2Quantity : material2Quantity,
    material2Name : material2Name,
    material3URL : material3URL,
    material3Quantity : material3Quantity,
    material3Name : material3Name,
    material4URL : material4URL,
    material4Quantity : material4Quantity,
    material4Name : material4Name,
    material5URL : material5URL,
    material5Quantity : material5Quantity,
    material5Name : material5Name,
    designspecialist : designspecialist,
    designspecialistemaillink : designspecialistemaillink,
    cost : cost,
  });

  // Send email with appropriate response and cc Chris and Cody.
  writer.Info(`Sending email....`);
  const emailer = new Emailer({
    name : name, 
    status : status,
    email : email,    
    designspecialistemail : designspecialistemail,
    message : Message,
  })

  // Check priority one more time:
  if (priority == `STUDENT NOT FOUND!` || !priority && (status != STATUS.closed || status != STATUS.cancelled)) {
    SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
  }
};









