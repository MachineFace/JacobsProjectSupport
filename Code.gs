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
const gmailName = "Jacobs Project Support";

const DaysRetentionNumber = 15; //How many days to hold a file
const RetentionPeriod = DaysRetentionNumber * 24 * 60 * 60 * 1000; //Number of milliseconds in the retention period.

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
    SetByHeader(sheet, "(INTERNAL) Status", lastRow, STATUS.received);
    writer.Info(`Set status to 'Received'.`);
  } catch (err) {
    writer.Error(`${err}: Could not set status to 'Received'.`);
  }

  // Parse variables
  var name = e.namedValues["What is your name?"][0] ? e.namedValues["What is your name?"][0] : GetByHeader(sheet, "What is your name?", lastRow);
  var email = e.namedValues["Email Address"][0] ? e.namedValues["Email Address"][0] : GetByHeader(sheet, "Email Address", lastRow);
  var sid = e.namedValues["Your Student ID Number?"][0] ? e.namedValues["Your Student ID Number?"][0] : GetByHeader(sheet, "Your Student ID Number?", lastRow);
  var studentType = e.namedValues["What is your affiliation to the Jacobs Institute?"][0] ? e.namedValues["What is your affiliation to the Jacobs Institute?"][0] : GetByHeader(sheet, "What is your affiliation to the Jacobs Institute?", lastRow);
  var projectname = e.namedValues["Project Name"][0] ? e.namedValues["Project Name"][0] : GetByHeader(sheet, "Project Name", lastRow);
  var timestamp = e.namedValues["Timestamp"][0];

  var values = e.namedValues;

  writer.Info(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Timestamp : ${timestamp}`);

  // Generate new Job number
  let jobnumber = await new JobNumberGenerator(timestamp).jobnumber;
  SetByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);

  // Check Priority
  let priority = await new Priority({email : email, sid : sid});
  SetByHeader(sheet, "(INTERNAL): Priority", lastRow, priority.priority);


  // Create Messages
  const message = await new CreateSubmissionMessage(name, projectname, jobnumber);

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
    case SHEETS.othermill.getName():
    case SHEETS.shopbot.getName():
      designspecialistemail = InvokeDS("Adam", "email");
      //sheet.getRange("B" + lastRow).setValue("Adam");
      SetByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Adam");
      break;
    case SHEETS.advancedlab.getName():
    case SHEETS.creaform.getName():
      designspecialistemail = InvokeDS("Chris", "email");
      //sheet.getRange("B" + lastRow).setValue("Chris");
      SetByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Chris");
      break;
    case SHEETS.plotter.getName():
    case SHEETS.fablight.getName():
    case SHEETS.haas.getName():
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      SetByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Cody");
      break;
    case SHEETS.waterjet.getName():
    case SHEETS.othertools.getName():
      designspecialistemail = InvokeDS("Gary", "email");
      //sheet.getRange("B" + lastRow).setValue("Gary");
      SetByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Gary");
      break;
    case SHEETS.laser.getName():
      //Nobody assigned / Everyone assigned.
      break;
    case SHEETS.ultimaker.getName():
      designspecialistemail = InvokeDS("Nicole", lastRow, "email");
      break;
    case SHEETS.vinyl.getName():
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      SetByHeader(sheet, "(INTERNAL): DS Assigned",  lastRow, "Cody");
      break;
    case undefined:
      designspecialistemail = InvokeDS("Staff", "email");
      //sheet.getRange("B" + lastRow).setValue("Staff");
      SetByHeader(sheet, "(INTERNAL): DS Assigned",  lastRow, "Staff");
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
    writer.Error(`${err} : Could not email DS. Something went wrong.`);
  }

  // Fix "Received" Status Issue
  let stat = sheet.getRange("A" + lastRow).getValue();
  stat = stat ? stat : SetByHeader(sheet, "(INTERNAL) Status",  lastRow, STATUS.received); 
  writer.Info(`Status refixed to 'Received'.`);

  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == "Creaform") {
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
    writer.Error(`${err} : Couldnt send Creaform email for some reason.`);
  }

  try {
    if (priority == "STUDENT NOT FOUND!" || priority == false) {
      // Set access to Missing Access
      SetByHeader(sheet, "(INTERNAL) Status", lastRow, STATUS.missingAccess);

      //Email
      GmailApp.sendEmail(email, "Jacobs Project Support : Missing Access", "", {
        htmlBody: message.missingAccessMessage,
        from: supportAlias,
        bcc: InvokeDS("Chris", "email"),
        name: "Jacobs Project Support",
      });

      writer.Info(`'Missing Access' Email sent to student and status set to 'Missing Access'.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't find student access boolean value`);
  } finally {
    if (priority == "STUDENT NOT FOUND!" || priority == false) {
      SetByHeader(sheet, "(INTERNAL) Status", lastRow, STATUS.missingAccess);
    }
  }

  // Check again
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : new JobNumberGenerator(timestamp).jobnumber;
  SetByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);


  

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
  var ss = e.range.getSheet();
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var thisSheet = spreadSheet.getActiveSheet();

  // Fetch Columns and rows and check validity
  var thisCol = e.range.getColumn();
  var thisRow = e.range.getRow();

  // Skip the first 2 rows of data.
  if (thisRow <= 1) return;

  //----------------------------------------------------------------------------------------------------------------
  // Add link to DS List
  const sLink = OTHERSHEETS.staff.getRange(thisRow, 4).getValue();
  if (thisRow > 2) {
    if ( sLink == undefined || sLink == null || (sLink == "" && OTHERSHEETS.staff.getRange(thisRow, 3).getValue() != "") ) {
      const l = MakeLink(OTHERSHEETS.staff.getRange(thisRow, 3).getValue());
      OTHERSHEETS.staff.getRange(thisRow, 4).setValue(l);
    }
  }
  

  //----------------------------------------------------------------------------------------------------------------
  //Ignore Edits on background sheets like Logger and StoreItems - NICE!! /CG
  var thisSheetName = e.range.getSheet().getSheetName();
  switch (thisSheetName) {
    case "Logger":
    case "Master Intake Form Responses":
    case "Student List DONOTDELETE":
    case "ApprovedByStudents - DO NOT DELETE":
    case "Staff List":
    case "AdvLabStoreItems":
    case "UltimakerStoreItems":
    case "FablightStoreItems":
    case "HaasTormachStoreItems":
    case "OthermillStoreItems":
    case "ShopbotStoreItems":
    case "WaterjetStoreItems":
    case "VinylCutterStoreItems":
    case "LaserStoreItems":
    case "Data Metrics":
    case "Shipping for Gary":
    case "Summary":
    case "Background Data Mgmt":
    case "Advanced Lab ReOrder":
    case "Billing":
      return;
  }

  //----------------------------------------------------------------------------------------------------------------
  // Check Priority

  let tempEmail = GetByHeader(thisSheet, "Email Address", thisRow);
  let tempSID = GetByHeader(thisSheet, "Your Student ID Number?", thisRow);

  let tempPriority = await new Priority({email : tempEmail, sid : tempSID});
  SetByHeader(thisSheet, "(INTERNAL): Priority", thisRow, tempPriority.priority);
  if (tempPriority == "STUDENT NOT FOUND") {
    SetByHeader(thisSheet, "(INTERNAL) Status", thisRow, STATUS.missingAccess);
  }

  // STATUS CHANGE TRIGGER
  // Only look at Column 1 for email trigger.... Also 52 is live.
  if (thisCol > 1 && thisCol != 3 && thisCol != 52) return;

  //----------------------------------------------------------------------------------------------------------------
  // Parse Data
  const status = GetByHeader(spreadSheet, "(INTERNAL) Status", thisRow);

  var designspecialist = GetByHeader(thisSheet, "(INTERNAL): DS Assigned", thisRow);
  var priority = GetByHeader(thisSheet, "(INTERNAL): Priority", thisRow);
  var jobnumber = GetByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow);
  var studentApproval = GetByHeader(thisSheet, "Student Has Approved Job", thisRow);
  var submissiontime = GetByHeader(thisSheet, "Timestamp", thisRow);
  var email = GetByHeader(thisSheet, "Email Address", thisRow);
  var name = GetByHeader(thisSheet, "What is your name?", thisRow);
  var sid = GetByHeader(thisSheet, "Student ID Number", thisRow);
  var studentType = GetByHeader(thisSheet, "What is your affiliation to the Jacobs Institute?", thisRow);
  var projectname = GetByHeader(thisSheet, "Project Name", thisRow);
  var cost = GetByHeader(thisSheet, "Estimate", thisRow);

  //Materials
  const material1Quantity = GetByHeader(thisSheet, "(INTERNAL) Material 1 Quantity", thisRow);
  const material1Name = GetByHeader(thisSheet, "(INTERNAL) Item 1", thisRow);
  const material1URL = "";

  const material2Quantity = GetByHeader(spreadSheet, "(INTERNAL) Material 2 Quantity", thisRow);
  const material2Name = GetByHeader(spreadSheet, "(INTERNAL) Item 2", thisRow);
  const material2URL = "";

  const material3Quantity = GetByHeader(thisSheet, "(INTERNAL) Material 3 Quantity", thisRow);
  const material3Name = GetByHeader(thisSheet, "(INTERNAL) Item 3", thisRow);
  const material3URL = "";

  const material4Quantity = GetByHeader(thisSheet, "(INTERNAL) Material 4 Quantity", thisRow);
  const material4Name = GetByHeader(thisSheet, "(INTERNAL) Item 4", thisRow);
  const material4URL = "";

  const material5Quantity = GetByHeader(thisSheet, "(INTERNAL) Material 5 Quantity", thisRow);
  const material5Name = GetByHeader(thisSheet, "(INTERNAL) Item 5", thisRow);
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
  if(priority == "STUDENT NOT FOUND!" || status == STATUS.closed ) return;

  //----------------------------------------------------------------------------------------------------------------
  // Fix Job Number if it's missing
  try {
    writer.Debug(`Trying to fix job number : ${jobnumber}`)
    if (status == STATUS.received || status == STATUS.inProgress) {
      jobnumber = jobnumber ? jobnumber : new JobNumberGenerator(submissiontime).jobnumber;
      SetByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow, jobnumber);
      writer.Info(`Job Number was missing, so the script fixed it. Submission by ${email}`);
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
    writer.Debug(`Attempting to Calculate turnaround times`);
    const calc = new Calculate();
    let elapsedCell = thisSheet.getRange(thisRow, 43).getValue();
    if (elapsedCell !== undefined || elapsedCell !== null || elapsedCell !== "") {
      if (status == STATUS.completed || status == STATUS.billed) {
        let endTime = new Date();
        let time = await calc.CalculateDuration(new Date(submissiontime), endTime);

        // Write to Column - d h:mm:ss  
        SetByHeader(thisSheet, "Elapsed Time", thisRow, time.toString());
        writer.Info(`Turnaround Time = ${time}`);

        // Write Completed time
        SetByHeader(thisSheet, "Date Completed", thisRow, endTime.toString());
      }
    }
  } catch (err) {
    writer.Error( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }

  //----------------------------------------------------------------------------------------------------------------
  // Trigger for generating a "Ticket"
  if ( status == STATUS.received || status == STATUS.inProgress || status == STATUS.pendingApproval ) {
    writer.Debug(`Attempting to create a ticket`)
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
    writer.Debug(`Attempting to create an approval form.`)
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
  var Message = new CreateMessage(
    name,
    projectname,
    jobnumber,
    approvalURL,
    material1URL,
    material1Quantity,
    material1Name,
    material2URL,
    material2Quantity,
    material2Name,
    material3URL,
    material3Quantity,
    material3Name,
    material4URL,
    material4Quantity,
    material4Name,
    material5URL,
    material5Quantity,
    material5Name,
    designspecialist,
    designspecialistemaillink,
    cost
  );

  // Send email with appropriate response and cc Chris and Cody.
  writer.Info(`Sending email.`)
  switch (status) {
    case STATUS.received:
      GmailApp.sendEmail(email, "Jacobs Project Support : Received", "", {
        htmlBody: Message.receivedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case STATUS.pendingApproval:
      GmailApp.sendEmail(email, "Jacobs Project Support : Needs Your Approval", "", {
          htmlBody: Message.pendingMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.inProgress:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Started", "", {
          htmlBody: Message.inProgressMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.completed:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Completed", "", {
          htmlBody: Message.completedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.pickedUp:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Picked Up", "", {
          htmlBody: Message.pickedUpMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.shipped:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Shipped", "", {
          htmlBody: Message.shippedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.failed:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has Failed", "", {
          htmlBody: Message.failedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.rejectedByStudent:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has been Declined", "", {
          htmlBody: Message.rejectedByStudentMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.rejectedByStaff:
    case "Cancelled":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has been Cancelled", "", {
          htmlBody: Message.rejectedByStaffMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.billed:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Closed", "", {
        htmlBody: Message.billedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case STATUS.waitlist:
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Waitlisted", "", {
          htmlBody: Message.waitlistMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case STATUS.missingAccess:
      if (priority == false) break;
      else {
        GmailApp.sendEmail(email, "Jacobs Project Support : Missing Access", "", {
            htmlBody: Message.noAccessMessage,
            from: supportAlias,
            cc: designspecialistemail,
            bcc: InvokeDS("Chris", "email"),
            name: gmailName,
        });
        break;
      }
    case "":
    case undefined:
      break;
  }

  // Lastly Run these Metrics ignoring first 2 rows:
  if (thisRow > 3) {
    await Metrics();
    writer.Info(`Recalculated Metrics tab.`);
  }

  // Check priority one more time:
  if (priority == "STUDENT NOT FOUND!" && (status != STATUS.missingAccess || status != STATUS.closed || status != STATUS.cancelled)) {
    SetByHeader(thisSheet, "(INTERNAL) Status", thisRow, STATUS.missingAccess);
  }
};









