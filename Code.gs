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
    setByHeader(sheet, "(INTERNAL) Status", lastRow, STATUS.received);
    writer.Info(`Set status to 'Received'.`);
  } catch (err) {
    writer.Error(`${err}: Could not set status to 'Received'.`);
  }

  // Parse Functions for shipping / variables
  var name = e.namedValues["What is your name?"][0] ? e.namedValues["What is your name?"][0] : getByHeader(sheet, "What is your name?", lastRow);
  var email = e.namedValues["Email Address"][0] ? e.namedValues["Email Address"][0] : getByHeader(sheet, "Email Address", lastRow);
  var sid = e.namedValues["Your Student ID Number?"][0] ? e.namedValues["Your Student ID Number?"][0] : getByHeader(sheet, "Your Student ID Number?", lastRow);
  var studentType = e.namedValues["What is your affiliation to the Jacobs Institute?"][0] ? e.namedValues["What is your affiliation to the Jacobs Institute?"][0] : getByHeader(sheet, "What is your affiliation to the Jacobs Institute?", lastRow);
  var projectname = e.namedValues["Project Name"][0] ? e.namedValues["Project Name"][0] : getByHeader(sheet, "Project Name", lastRow);
  var shipping = e.namedValues["Do you need your parts shipped to you?"][0];
  var timestamp = e.namedValues["Timestamp"][0];

  var values = e.namedValues;

  writer.Info(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Needs Shipping : ${shipping}, Timestamp : ${timestamp}`);

  // Generate new Job number
  let jobnumber = await new JobNumberGenerator(timestamp).Create();
  setByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);

  // Check Priority
  var priority = await GetPriority(email, sid);
  //sheet.getRange("C" + lastRow).setValue(priority);
  setByHeader(sheet, "(INTERNAL): Priority", lastRow, priority);

  // Create Messages
  var message = await new CreateSubmissionMessage(name, projectname, jobnumber);

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
    case "Othermill":
    case "Shopbot":
      designspecialistemail = InvokeDS("Adam", "email");
      //sheet.getRange("B" + lastRow).setValue("Adam");
      setByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Adam");
      break;
    case "Advanced Lab":
    case "Creaform":
      designspecialistemail = InvokeDS("Chris", "email");
      //sheet.getRange("B" + lastRow).setValue("Chris");
      setByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Chris");
      break;
    case "Canon Plotter":
    case "Fablight":
    case "Haas & Tormach":
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      setByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Cody");
      break;
    case "Waterjet":
    case "Other Tools":
      designspecialistemail = InvokeDS("Gary", "email");
      //sheet.getRange("B" + lastRow).setValue("Gary");
      setByHeader(sheet, "(INTERNAL): DS Assigned", lastRow, "Gary");
      break;
    case "Laser Cutter":
      //Nobody assigned / Everyone assigned.
      break;
    case "Ultimaker":
      designspecialistemail = InvokeDS("Nicole", lastRow, "email");
      break;
    case "Vinyl Cutter":
      designspecialistemail = InvokeDS("Cody", "email");
      //sheet.getRange("B" + lastRow).setValue("Cody");
      setByHeader(sheet, "(INTERNAL): DS Assigned",  lastRow, "Cody");
      break;
    case undefined:
      designspecialistemail = InvokeDS("Staff", "email");
      //sheet.getRange("B" + lastRow).setValue("Staff");
      setByHeader(sheet, "(INTERNAL): DS Assigned",  lastRow, "Staff");
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
  stat = stat ? stat : setByHeader(sheet, "(INTERNAL) Status",  lastRow, STATUS.received); 
  writer.Info(`Status refixed to 'Received'.`);

  // "Shipping Questions" message - Need to collect info here: https://docs.google.com/forms/d/e/1FAIpQLSdgk5-CjHOWJmAGja3Vk7L8a7ddLwTsyJhGicqNK7G-I5RjIQ/viewform
  var shippingbody = message.shippingMessage;

  if (shipping == "Yes") {
    //Email
    GmailApp.sendEmail(email, "Jacobs Project Support : Shipping Form", "", {
      htmlBody: shippingbody,
      from: supportAlias,
      bcc: InvokeDS("Chris", "email"),
      name: gmailName,
    });
    writer.Info(`Shipping instructions email sent.`);
  }

  // Creaform Email with instructions for student dropoff.
  var creaformMessage = message.creaformMessage;

  try {
    if (SpreadsheetApp.getActiveSheet().getSheetName() == "Creaform") {
      //Email
      GmailApp.sendEmail(email, "Jacobs Project Support : Creaform Part Drop-off Instructions", "", {
          htmlBody: creaformMessage,
          from: supportAlias,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      writer.Info(`Creaform instruction email sent.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldnt send Creaform email for some reason.`);
  }

  // No Access Response
  let missingaccessbody = message.missingAccessMessage;

  var access;
  try {
    if (priority == "STUDENT NOT FOUND!" || priority == false) {
      //Email
      GmailApp.sendEmail(email, "Jacobs Project Support : Missing Access", "", {
        htmlBody: missingaccessbody,
        from: supportAlias,
        bcc: InvokeDS("Chris", "email"),
        name: "Jacobs Project Support",
      });

      // Set access to Missing Access
      setByHeader(sheet, "(INTERNAL) Status", lastRow, STATUS.missingAccess);
      writer.Info(`'Missing Access' Email sent to student and status set to 'Missing Access'.`);
    }
  } catch (err) {
    writer.Error(`${err} : Couldn't find student access boolean value`);
  }

  // Check again
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : new JobNumberGenerator(timestamp).Create();
  setByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);
  

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

  let tempEmail = getByHeader(thisSheet, "Email Address", thisRow);
  let tempSID = getByHeader(thisSheet, "Your Student ID Number?", thisRow);

  const tempPriority = GetPriority(tempEmail, tempSID);
  setByHeader(thisSheet, "(INTERNAL): Priority", thisRow, tempPriority);
  if (tempPriority == "STUDENT NOT FOUND") {
      setByHeader(thisSheet, "(INTERNAL) Status", thisRow, STATUS.missingAccess);
  }

  // STATUS CHANGE TRIGGER
  // Only look at Column 1 for email trigger.... Also 52 is live.
  if (thisCol > 1 && thisCol != 3 && thisCol != 52) return;

  //----------------------------------------------------------------------------------------------------------------
  // Parse Data
  const status = getByHeader(spreadSheet, "(INTERNAL) Status", thisRow);

  var designspecialist = getByHeader(thisSheet, "(INTERNAL): DS Assigned", thisRow);
  var priority = getByHeader(thisSheet, "(INTERNAL): Priority", thisRow);
  var jobnumber = getByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow);
  var studentApproval = getByHeader(thisSheet, "Student Has Approved Job", thisRow);
  var submissiontime = getByHeader(thisSheet, "Timestamp", thisRow);
  var email = getByHeader(thisSheet, "Email Address", thisRow);
  var name = getByHeader(thisSheet, "What is your name?", thisRow);
  var sid = getByHeader(thisSheet, "Student ID Number", thisRow);
  var studentType = getByHeader(thisSheet, "What is your affiliation to the Jacobs Institute?", thisRow);
  var projectname = getByHeader(thisSheet, "Project Name", thisRow);
  var shippingQuestion = getByHeader(thisSheet, "Do you need your parts shipped to you?", thisRow);
  var cost = getByHeader(thisSheet, "Estimate", thisRow);

  //Materials
  const material1Quantity = getByHeader(thisSheet, "(INTERNAL) Material 1 Quantity", thisRow);
  const material1Name = getByHeader(thisSheet, "(INTERNAL) Item 1", thisRow);
  // const material1URL = LookupProductID(material1Name).link;
  const material1URL = "";

  const material2Quantity = getByHeader(spreadSheet, "(INTERNAL) Material 2 Quantity", thisRow);
  const material2Name = getByHeader(spreadSheet, "(INTERNAL) Item 2", thisRow);
  // const material2URL = LookupProductID(material2Name).link;
  const material2URL = "";

  const material3Quantity = getByHeader(thisSheet, "(INTERNAL) Material 3 Quantity", thisRow);
  const material3Name = getByHeader(thisSheet, "(INTERNAL) Item 3", thisRow);
  // const material3URL = LookupProductID(material3Name).link;
  const material3URL = "";

  const material4Quantity = getByHeader(thisSheet, "(INTERNAL) Material 4 Quantity", thisRow);
  const material4Name = getByHeader(thisSheet, "(INTERNAL) Item 4", thisRow);
  // const material4URL = LookupProductID(material4Name).link;
  const material4URL = "";

  const material5Quantity = getByHeader(thisSheet, "(INTERNAL) Material 5 Quantity", thisRow);
  const material5Name = getByHeader(thisSheet, "(INTERNAL) Item 5", thisRow);
  // const material5URL = LookupProductID(material5Name).link;
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

  //----------------------------------------------------------------------------------------------------------------
  // Fix Job Number if it's missing
  try {
    if (status == STATUS.received || status == STATUS.inProgress) {
      jobnumber = jobnumber ? jobnumber : new JobNumberGenerator(submissiontime).Create();
      //ss.getRange(thisRow, 6).setValue(jobnumber);
      setByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow, jobnumber);
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
  //Calculate Turnaround Time only when cell is empty
  try {
    var startTime = submissiontime;
    var elapsedCell = ss.getRange(thisRow, 43).getValue();
    if (elapsedCell == undefined || elapsedCell == null || elapsedCell == "") {
      if (status == STATUS.completed || status == STATUS.billed) {
        let endTime = new Date();
        const calc = new Calculate();
        let time = await calc.CalculateDuration(startTime, endTime);

        // Write to Column - d h:mm:ss
        setByHeader(thisSheet, "Elapsed Time", thisRow, time);
        writer.Info(`Turnaround Time = ${time}`);

        //Write Completed time
        //ss.getRange(thisRow, 43).setValue(endTime);
        setByHeader(thisSheet, "Date Completed", thisRow, endTime);
      }
    }
  } catch (err) {
    writer.Error( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }

  //----------------------------------------------------------------------------------------------------------------
  // Trigger for generating a "Ticket"
  if ( status == STATUS.received || status == STATUS.inProgress || status == STATUS.pendingApproval ) {
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
  if (status == STATUS.pendingApproval) {
    var approvalURL = await CreateApprovalForm(name, jobnumber, cost);
    writer.Info(`Approval Form generated and sent to user.`);
  }

  //Case switch for different Design Specialists email
  var designspecialistemaillink = InvokeDS(designspecialist, "emaillink");
  var designspecialistemail = InvokeDS(designspecialist, "email");

  //Create a Message and Return Appropriate Responses.
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

  //Send email with appropriate response and cc Chris and Cody.
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

  //Lastly Run these Metrics ignoring first 2 rows:
  if (thisRow > 3) {
    await Metrics();
    writer.Info(`Recalculated Metrics tab.`);
  }
};


/**
 * =======================================================================================================================================================================
 * =======================================================================================================================================================================
 * FUNCTIONS
 */


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create Approval Form
 * @param {string} name
 * @param {number} jobnumber
 * @returns {string} approval form
 */
const CreateApprovalForm = (name, jobnumber, cost) => {
  const writer = new WriteLogger();
  try {
    // Make a new approval form
    let approvalForm = FormApp.create("Approval Form");

    //Set parent folder
    //var parentFolder = DriveApp.getFolderById("1EpvCTyuCkNzKQ4sxYrZvwPqGqzRvgtRX").addFile(approvalForm);

    let sendloc = "16oCqmnW9zCUhpQLo3TXsaUSxDcSv7aareEVSE9zYtVQ";
    let destination = approvalForm.setDestination( FormApp.DestinationType.SPREADSHEET, sendloc );
    // Form Setup
    approvalForm.setTitle(`Approval Form`)
      .setDescription(`Referrence Number: ${jobnumber}`)
      .setConfirmationMessage(`Thanks for responding!`)
      .setAllowResponseEdits(false)
      .setAcceptingResponses(true);

    //Ask Questions
    if (cost == "" || cost == undefined || cost == 0) {
      writer.Info(`Approval form: No known cost. cost = ${cost}`);
      let item = approvalForm.addMultipleChoiceItem().setRequired(true)
        .setTitle(`For this job, the cost of materials was not specified. 
          Please speak with a Design Specialist if you have questions. 
          Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`)
        .setChoices([
          item.createChoice(`Yes, I approve.`),
          item.createChoice(`No. I reject.`),
        ]);
    } else {
      let costFormatted = Utilities.formatString("$%.2f", cost);
      writer.Info(`Approval form: Known cost. cost = ${costFormatted}`);
      let item = approvalForm.addMultipleChoiceItem().setRequired(true)
        .setTitle(`For this job, the cost of materials is estimated to be: ${costFormatted}. 
          Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`)
        .setChoices([
          item.createChoice(`Yes, I approve.`),
          item.createChoice(`No. I reject.`),
        ]);
    }
    let item2 = approvalForm.addMultipleChoiceItem().setRequired(true)
      .setTitle(`Please select your name below.`)
      .setChoices([item2.createChoice(name)]);
    let item3 = approvalForm.addMultipleChoiceItem().setRequired(true)
      .setTitle(`Please select the job number below.`)
      .setChoices([item3.createChoice(jobnumber)]);
    let approvalURL = approvalForm.getPublishedUrl();
    writer.Info(`Created an Approval Form for the student.`);
  } catch (err) {
    writer.Error(`${err} : Couldn't generate Approval Form`);
  }

  try {
    // Set folder
    let folder = DriveApp.getFoldersByName(`Job Forms`);

    // Remove File from root and Add that file to a specific folder
    let id = approvalForm.getId();
    let docFile = DriveApp.getFileById(id);
  } catch (err) {
    writer.Error(`${err} : Couldn't get the id of the file.`);
  }
  try {
    DriveApp.removeFile(docFile);
    folder.next().addFile(docFile);

    //Set permissions to 'anyone can edit' for that file
    DriveApp.getFileById(id)
      .setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
  } catch (err) {
    writer.Error(`${err} : Couldn't delete the form in that spot. Probably still has the form linked.` );
  }
  return approvalURL;
};










/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get Priority Number
 * @param {string} email
 * @param {string} sid
 * @returns {number} priority number 1 - 4
 */
const GetPriority = (email, sid) => {
  const writer = new WriteLogger();
  let priority;
  let emailSearch, sidSearch;
  emailSearch = SearchSpecificSheet(OTHERSHEETS.approved, email);
  if(emailSearch) {
    priority = OTHERSHEETS.approved.getRange(emailSearch, 4, 1, 1).getValue().toString();;
  }
  else if(!emailSearch) {
    sidSearch = SearchSpecificSheet(OTHERSHEETS.approved, sid);
    if(!sidSearch) {
      priority = "STUDENT NOT FOUND!";
      return priority;
    }
    priority = OTHERSHEETS.approved.getRange(sidSearch, 4, 1, 1).getValue().toString();
  }
  if(!emailSearch && !sidSearch) {
    priority = "STUDENT NOT FOUND!";
  }
  return priority;
};






/**
 * ----------------------------------------------------------------------------------------------------------------
 * DEFUNCT Get Priority
 * @param {string} email
 * @param {string} SID
 * @returns {int} priority
 */
const GetPriorityFromEmailOrSID = (email, sid) => {
  const writer = new WriteLogger();
  let priority;
  // any = 3034073475;  // test good sid
  // any = 2323453444;   // test bad sid
  // any = "helentongli@berkeley.edu"; // good test
  if (email) {
    email.toString().replace(/\s+/g, "");
    const finder = OTHERSHEETS.approved.createTextFinder(email).findNext();
    if (finder != null) {
      let row = finder.getRow();
      priority = OTHERSHEETS.approved.getRange(row, 4, 1, 1).getValue();
      writer.Info(`ROW : ${row} : PRIORITY : ${priority}`);
    } else if (!finder) {
      priority = "STUDENT NOT FOUND!";
      writer.Warning(`PRIORITY : ${priority}`);
    }
  }
  if(sid) {
    sid.toString().replace(/\s+/g, "");
    const finder = OTHERSHEETS.approved.createTextFinder(sid).findNext();
    if (finder != null) {
      let row = finder.getRow();
      priority = OTHERSHEETS.approved.getRange(row, 4, 1, 1).getValue();
      writer.Info(`ROW : ${row} : PRIORITY : ${priority}`);
    } else if (!finder) {
      priority = "STUDENT NOT FOUND!";
      writer.Warning(`PRIORITY : ${priority}`);
    }
  } else priority = "STUDENT NOT FOUND!";
  
  return priority;
}




const _testGetPriority = () => {
  const writer = new WriteLogger();
  let p1 = GetPriority(`laxbop@berkeley.edu`,3036051329) // Good Email and Good SID
  let p2 = GetPriority(`laxbop@berkeley.edu`, 12938749123) // Good Email, Bad SID
  let p3 = GetPriority(`ding@bat.edu`, 3036051329) // Bad Email, Good SID
  let p4 = GetPriority(`ding@bat.edu`, 2394872349587) // Bad Email, Bad SID
  writer.Info(`Good Email and Good SID : ${p1}`);
  writer.Warning(`Good Email, Bad SID : ${p2}`);
  writer.Warning(`Bad Email, Good SID : ${p3}`);
  writer.Error(`Bad Email, Bad SID : ${p4}`);
}


