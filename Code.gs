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
  // Set status to RECEIVED on new submission
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = e.range.getSheet().getName();

  // Loop through to get last row and set status to received
  try {
    var searchRange = sheet.getRange(2, 8, sheet.getLastRow()).getValues(); //search timestamp rows for last row
    var lastRow;
    for (var i = 0; i < searchRange.length; i++) {
      if (searchRange[i][0].toString() == "") {
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
  var name = e.namedValues[HEADERNAMES.name][0] ? e.namedValues[HEADERNAMES.name][0] : GetByHeader(sheet, HEADERNAMES.name, lastRow);
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
  let priority = await new Priority({email : email, sid : sid});
  SetByHeader(sheet, HEADERNAMES.priority, lastRow, priority.priority);


  // Create Messages
  const message = await new CreateSubmissionMessage({name : name, projectname : projectname, jobnumber : jobnumber});

  // Get DS-Specific Message
  let dsMessage = message.dsMessage;

  // Create array summary of student's entry and append it to the message
  var values = e.namedValues;
  dsMessage += "<ul>";
  for (Key in values) {
    let label = Key;
    let data = values[Key];
    dsMessage += "<li>" + label + ": " + data + "</li>";
  }
  dsMessage += "</ul>";
  dsMessage += "<div>";

  // Notify Staff via email and set their assignment
  var designspecialistemail;

  switch (sheetName) {
    case SHEETS.Othermill.getName():
    case SHEETS.Shopbot.getName():
      designspecialistemail = InvokeDS("Adam", "email");
      //sheet.getRange("B" + lastRow).setValue("Adam");
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, "Adam");
      break;
    case SHEETS.Advancedlab.getName():
    case SHEETS.Creaform.getName():
      designspecialistemail = InvokeDS("Chris", "email");
      //sheet.getRange("B" + lastRow).setValue("Chris");
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, "Chris");
      break;
    case SHEETS.Plotter.getName():
    case SHEETS.Fablight.getName():
    case SHEETS.Haas.getName():
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, "Cody");
      break;
    case SHEETS.Waterjet.getName():
    case SHEETS.Othertools.getName():
      designspecialistemail = InvokeDS("Gary", "email");
      //sheet.getRange("B" + lastRow).setValue("Gary");
      SetByHeader(sheet, HEADERNAMES.ds, lastRow, "Gary");
      break;
    case SHEETS.Laser.getName():
      //Nobody assigned / Everyone assigned.
      break;
    case SHEETS.Ultimaker.getName():
      designspecialistemail = InvokeDS("Nicole", lastRow, "email");
      break;
    case SHEETS.Vinyl.getName():
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, "Cody");
      break;
    case undefined:
      designspecialistemail = InvokeDS("Staff", "email");
      //sheet.getRange("B" + lastRow).setValue("Staff");
      SetByHeader(sheet, HEADERNAMES.ds,  lastRow, "Staff");
      break;
  }

  // Email each DS
  try {
    GmailApp.sendEmail(designspecialistemail, "Jacobs Project Support Notification", "", {
      htmlBody: dsMessage,
      from: supportAlias,
      bcc: InvokeDS("Chris", "email"),
      name: gmailName,
    });
    writer.Info(`Design Specialist has been emailed.`);
  } catch (err) {
    writer.Error(`${err} : Couldn't email DS. Something went wrong.`);
  }

  // Fix "Received" Status Issue
  let stat = sheet.getRange("A" + lastRow).getValue();
  stat = stat ? stat : SetByHeader(sheet, HEADERNAMES.status,  lastRow, STATUS.received); 
  writer.Warning(`Status refixed to 'Received'.`);

  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == SHEETS.Creaform.getSheetName()) {
      //Email
      GmailApp.sendEmail(email, "Jacobs Project Support : Creaform Part Drop-off Instructions", "", {
        htmlBody: message.creaformMessage,
        from: supportAlias,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      writer.Info(`Creaform instruction email sent.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't send Creaform email for some reason.`);
  }

  try {
    if (priority == "STUDENT NOT FOUND!" || priority == false) {
      // Set access to Missing Access
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);

      //Email
      GmailApp.sendEmail(email, "Jacobs Project Support : Missing Access", "", {
        htmlBody: message.missingAccessMessage,
        from: supportAlias,
        bcc: InvokeDS("Chris", "email"),
        name: "Jacobs Project Support",
      });
      writer.Warning(`'Missing Access' Email sent to student and status set to 'Missing Access'.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't find student access boolean value`);
  } finally {
    if (priority == "STUDENT NOT FOUND!" || priority == false) {
      SetByHeader(sheet, HEADERNAMES.status, lastRow, STATUS.missingAccess);
    }
  }

  // Check again
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : new JobNumberGenerator({ date : timestamp }).jobnumber;
  SetByHeader(sheet, HEADERNAMES.jobNumber, lastRow, jobnumber);


  

  // Fix wrapping issues
  let driveloc = sheet.getRange("D" + lastRow);
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
    if ( sLink == undefined || sLink == null || (sLink == "" && OTHERSHEETS.Staff.getRange(thisRow, 3).getValue() != "") ) {
      const l = MakeLink(OTHERSHEETS.Staff.getRange(thisRow, 3).getValue());
      OTHERSHEETS.Staff.getRange(thisRow, 4).setValue(l);
    }
  }
  

  //----------------------------------------------------------------------------------------------------------------
  //Ignore Edits on background sheets like Logger and StoreItems - NICE!! /CG
  var thisSheetName = e.range.getSheet().getSheetName();
  for(const [key, sheet] of Object.entries(NONITERABLESHEETS)) {
    if(thisSheetName == sheet.getSheetName()) return;
  }

  //----------------------------------------------------------------------------------------------------------------
  // Check Priority

  let tempEmail = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  let tempSID = GetByHeader(thisSheet, HEADERNAMES.sid, thisRow);

  let tempPriority = await new Priority({email : tempEmail, sid : tempSID}).priority;
  SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, tempPriority);
  if (tempPriority == "STUDENT NOT FOUND") {
    SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
  }

  // STATUS CHANGE TRIGGER
  // Only look at Column 1 for email trigger.... Also 52 is live.
  if (thisCol > 1 && thisCol != 3 && thisCol != 52) return;

  //----------------------------------------------------------------------------------------------------------------
  // Parse Data
  const status = GetByHeader(spreadSheet, HEADERNAMES.status, thisRow);

  var designspecialist = GetByHeader(thisSheet, HEADERNAMES.ds, thisRow);
  var priority = GetByHeader(thisSheet, HEADERNAMES.priority, thisRow);
  var jobnumber = GetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow);
  var studentApproval = GetByHeader(thisSheet, HEADERNAMES.studentApproved, thisRow);
  var submissiontime = GetByHeader(thisSheet, HEADERNAMES.timestamp, thisRow);
  var email = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  var name = GetByHeader(thisSheet, HEADERNAMES.name, thisRow);
  var sid = GetByHeader(thisSheet, HEADERNAMES.sid, thisRow);
  var studentType = GetByHeader(thisSheet, HEADERNAMES.afiliation, thisRow);
  var projectname = GetByHeader(thisSheet, HEADERNAMES.projectName, thisRow);
  var cost = GetByHeader(thisSheet, HEADERNAMES.estimate, thisRow);

  //Materials
  const material1Quantity = GetByHeader(thisSheet, HEADERNAMES.mat1quantity, thisRow);
  const material1Name = GetByHeader(thisSheet, HEADERNAMES.mat1, thisRow);
  const material1URL = "";

  const material2Quantity = GetByHeader(spreadSheet, HEADERNAMES.mat2quantity, thisRow);
  const material2Name = GetByHeader(spreadSheet, HEADERNAMES.mat2, thisRow);
  const material2URL = "";

  const material3Quantity = GetByHeader(thisSheet, HEADERNAMES.mat3quantity, thisRow);
  const material3Name = GetByHeader(thisSheet, HEADERNAMES.mat3, thisRow);
  const material3URL = "";

  const material4Quantity = GetByHeader(thisSheet, HEADERNAMES.mat4quantity, thisRow);
  const material4Name = GetByHeader(thisSheet, HEADERNAMES.mat4, thisRow);
  const material4URL = "";

  const material5Quantity = GetByHeader(thisSheet, HEADERNAMES.mat5quantity, thisRow);
  const material5Name = GetByHeader(thisSheet, HEADERNAMES.mat5, thisRow);
  const material5URL = "";

  if (material1Name != "") var mat1 = true;
  else mat1 = false;
  if (material2Name != "") var mat2 = true;
  else mat2 = false;
  if (material3Name != "") var mat3 = true;
  else mat3 = false;
  if (material4Name != "") var mat4 = true;
  else mat4 = false;
  if (material5Name != "") var mat5 = true;
  else mat5 = false;

  // Log submission info to sheet
  writer.Info(`Submission Time = ${submissiontime}, Name = ${name}, Email = ${email}, Project = ${projectname}`);

  // Ignore
  if(status == STATUS.closed ) return;

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
  // Fix empty variables
  try {
    designspecialist = designspecialist ? designspecialist : "a Design Specialist";
    projectname = projectname ? projectname : "Your Project";
  } catch (err) {
    writer.Error( `${err} : Fixing empty or corrupted variables has failed for some reason.` );
  }

  //----------------------------------------------------------------------------------------------------------------
  // Calculate Turnaround Time only when cell is empty
  try {
    writer.Warning(`Attempting to Calculate turnaround times`);
    const calc = new Calculate();
    let elapsedCell = thisSheet.getRange(thisRow, 43).getValue();
    if (elapsedCell !== undefined || elapsedCell !== null || elapsedCell !== "") {
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
  // Trigger for generating a "Ticket"
  if ( status == STATUS.received || status == STATUS.inProgress || status == STATUS.pendingApproval ) {
    writer.Warning(`Attempting to create a ticket`)
    const ticketGenerator = new Ticket({jobnumber : jobnumber});
    try {
      const ticket = ticketGenerator.CreateTicket();
    } catch (err) {
      writer.Error(`${err} : Couldn't generate a ticket. Check docUrl / id and repair.` );
    }
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

  // Case switch for different Design Specialists email
  var designspecialistemaillink = InvokeDS(designspecialist, "emaillink");
  var designspecialistemail = InvokeDS(designspecialist, "email");

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
  writer.Info(`Sending email....`)
  switch (status) {
    case STATUS.received:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : ${STATUS.received}`, "", {
        htmlBody: Message.receivedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case STATUS.pendingApproval:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Needs Your Approval`, "", {
          htmlBody: Message.pendingMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.inProgress:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Started`, "", {
          htmlBody: Message.inProgressMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.completed:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Completed`, "", {
          htmlBody: Message.completedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.pickedUp:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Picked Up`, "", {
          htmlBody: Message.pickedUpMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.shipped:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Shipped`, "", {
          htmlBody: Message.shippedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.failed:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project has Failed`, "", {
          htmlBody: Message.failedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.rejectedByStudent:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project has been Declined`, "", {
          htmlBody: Message.rejectedByStudentMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.rejectedByStaff:
    case STATUS.cancelled:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project has been Cancelled`, "", {
          htmlBody: Message.rejectedByStaffMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.billed:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Closed`, "", {
        htmlBody: Message.billedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case STATUS.waitlist:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Project Waitlisted`, "", {
          htmlBody: Message.waitlistMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.missingAccess:
      console.warn(`Sending ${status} email to student.`);
      GmailApp.sendEmail(email, `${gmailName} : Missing Access`, "", {
          htmlBody: Message.noAccessMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;   
    case "":
    case undefined:
      break;
  }

  // Check priority one more time:
  if (priority == "STUDENT NOT FOUND!" && (status != STATUS.closed || status != STATUS.cancelled)) {
    SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
  }
};









