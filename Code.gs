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

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Sheets : Dictionary of key / value pair.
 * Example: Calling 'sheetDict.laser' returns value sheet.
 */
const sheetDict = {
    summary: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary"), //Summary Sheet
    laser: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Laser Cutter"), //Laser Sheet
    ultimaker: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ultimaker"), //Ultimaker Sheet
    fablight: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fablight"), //Fablight Sheet
    waterjet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Waterjet"), //Waterjet Sheet
    advancedlab: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Advanced Lab"), //Advanced Lab Sheet
    shopbot: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shopbot"), //Shopbot Sheet
    haas: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Haas & Tormach"), //Haas Sheet
    vinyl: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vinyl Cutter"), //Vinyl Sheet
    othermill: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Othermill"), //Othermill Sheet
    creaform: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Creaform"), //Creaform Sheet
    othertools: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Other Tools"), //Other Sheet
    plotter: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Canon Plotter"), //Plotter Sheet
    approved: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student List DONOTDELETE"), //Approved Sheet DONOTDELETE **
    staff: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Staff List"), //Staff List Sheet **
    logger: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logger"), //Logger Sheet **
    data: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Metrics"), //Data Metrics Sheet **
    backgrounddata: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Background Data Mgmt"), //Background Data Mgmt Sheet **
    billing: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Billing"), //Billing Sheet **
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of INTERNAL Sheets : Dictionary of key / value pair.
 * Example: Calling 'materialDict.laser' returns value materialSheet.
 */
const materialDict = {
    advlab:     SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AdvLabStoreItems"),
    ultimaker:  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("UltimakerStoreItems"),
    fablight:   SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FablightStoreItems"),
    haas:       SpreadsheetApp.getActiveSpreadsheet().getSheetByName("HaasTormachStoreItems"),
    shopbot:    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ShopbotStoreItems"),
    waterjet:   SpreadsheetApp.getActiveSpreadsheet().getSheetByName("WaterjetStoreItems"),
    vinyl:      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VinylCutterStoreItems"),
    laser:      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LaserStoreItems"),
    othermill:  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OthermillStoreItems"),
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Forms : Dictionary of key / value pair.
 * Example: Calling 'formDict.laser' returns value string.
 */
const formDict = {
    ultimaker: "1ASokut0lfjLidzpSmCCfD2mg-yVSa_HR0tTATVzFpI8",
    laser: "1xKiHg8_5U3iQH8EoD2-WbWXaRntP3QxzUNGU7QLfW0w",
    fablight: "1SAQRSMGKyFDrcVf8HGdpRoZ7DrWVVfl6cBAw0ZSyNHA",
    waterjet: "1dNLAlC8Wg0DLLkBboRMgztPqP-fMmUqyGt5xqtg8TKk",
    advancedlab: "1okWAdclqrleQ5ktyXbSIRoY6hrL_v2OYYAhaeb0f1jQ",
    shopbot: "1RFuhGCtQrcA9gbpEStaksK5eYeIAo0dzn5NIcxVngH4",
    haas: "1oS0UbirwjcRdTWzavZ11zO-xa7YiZNVfhMS2AxRwPEk",
    vinyl: "1WTh9nDQ4C_3HyQvCNMIxRFbJk1FH4dZeYeAkiXkItKw",
    othermill: "1YVmZ0H5Uy3AiBiDTUpKQONUyVRqAByju0zrm5s4vrwI",
    creaform: "1Ifg49JzunXI54NZxrfYcJg-p6-k2MkY5IqStISKMXqc",
    othertools: "1cVeRW9WtGa43xNmnwaegZcPK6-V01PIZFpvNcmrpM38",
    plotter: "1au_NsjuGNuucHeZIh-bgzEwkQN1w17igU9ha6i34Y34",
};

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
  //Set status to RECEIVED on new submission
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = e.range.getSheet().getName();

  //Loop through to get last row and set status to received
  try {
    var searchRange = sheet.getRange(2, 8, sheet.getLastRow()).getValues(); //search timestamp rows for last row
    var lastRow;
    for (var i = 0; i < searchRange.length; i++) {
      if (searchRange[i][0].toString() == "") {
        lastRow = i + 1;
        break;
      }
    }
    //sheet.getRange("A" + lastRow).setValue("Received");
    setByHeader(sheet, "(INTERNAL) Status", lastRow, "Received");
    Logg("Set status to 'Received'.");
  } catch (err) {
    Logg(`${err}: Could not set status to 'Received'.`);
  }

  //Parse Functions for shipping / variables
  var name = e.namedValues["What is your name?"][0] ? e.namedValues["What is your name?"][0] : getByHeader(sheet, "What is your name?", lastRow);
  var email = e.namedValues["Email"][0] ? e.namedValues["Email"][0] : getByHeader(sheet, "Email", lastRow);
  var sid = e.namedValues["Your Student ID Number?"][0] ? e.namedValues["Your Student ID Number?"][0] : getByHeader(sheet, "Your Student ID Number?", lastRow);
  var studentType = e.namedValues["What is your affiliation to the Jacobs Institute?"][0] ? e.namedValues["What is your affiliation to the Jacobs Institute?"][0] : getByHeader(sheet, "What is your affiliation to the Jacobs Institute?", lastRow);
  var projectname = e.namedValues["Project Name"][0] ? e.namedValues["Project Name"][0] : getByHeader(sheet, "Project Name", lastRow);
  var shipping = e.namedValues["Do you need your parts shipped to you?"][0];
  var timestamp = e.namedValues["Timestamp"][0];

  var values = e.namedValues;

  Logger.log(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Needs Shipping : ${shipping}, Timestamp : ${timestamp}`);
  Logg(`Name : ${name}, SID : ${sid}, Email : ${email}, Student Type : ${studentType}, Project : ${projectname}, Needs Shipping : ${shipping}, Timestamp : ${timestamp}`);

  //Generate new Job number
  var jobnumber = await CreateJobNumber(timestamp);
  //sheet.getRange("F" + lastRow).setValue(jobnumber);
  setByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);

  //Check Priority
  var priority = await GetPriorityWithEmailOrSID(email, sid);
  //sheet.getRange("C" + lastRow).setValue(priority);
  setByHeader(sheet, "(INTERNAL): Priority", lastRow, priority);

  //Create Messages
  var message = await new CreateSubmissionMessage(name, projectname, jobnumber);

  //Get DS-Specific Message
  let dsMessage = message.dsMessage;

  //Create array summary of student's entry and append it to the message
  var values = e.namedValues;
  dsMessage += "<ul>";
  for (Key in values) {
    let label = Key;
    let data = values[Key];
    dsMessage += "<li>" + label + ": " + data + "</li>";
  }
  dsMessage += "</ul>";
  dsMessage += "<div>";

  //Notify Staff via email and set their assignment
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

  //Email each DS
  try {
    GmailApp.sendEmail(designspecialistemail, "Jacobs Project Support Notification", "", {
        htmlBody: dsMessage,
        from: supportAlias,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
    });
    Logg("Design Specialist has been emailed.");
  } catch (err) {
    Logg(`${err} : Could not email DS. Something went wrong.`);
  }

  //Fix "Received" Status Issue
  let stat = sheet.getRange("A" + lastRow).getValue();
  stat = stat ? stat : setByHeader(sheet, "(INTERNAL) Status",  lastRow, "Received"); 
  Logger.log("Status refixed to 'Received'.");

  //"Shipping Questions" message - Need to collect info here: https://docs.google.com/forms/d/e/1FAIpQLSdgk5-CjHOWJmAGja3Vk7L8a7ddLwTsyJhGicqNK7G-I5RjIQ/viewform
  var shippingbody = message.shippingMessage;

  if (shipping == "Yes") {
    //Email
    GmailApp.sendEmail(email, "Jacobs Project Support : Shipping Form", "", {
      htmlBody: shippingbody,
      from: supportAlias,
      bcc: InvokeDS("Chris", "email"),
      name: gmailName,
    });
    Logg("Shipping instructions email sent.");
  }

  //Creaform Email with instructions for student dropoff.
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
      Logger.log("Creaform instruction email sent.");
    }
  } catch (err) {
    Logger.log(`${err} : Couldnt send Creaform email for some reason.`);
  }

  //No Access Response
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

      //Set access to Missing Access
      //sheet.getRange("A" + lastRow).setValue("Missing Access");
      setByHeader(sheet, "(INTERNAL) Status", lastRow, "Missing Access");
      Logger.log(`'Missing Access' Email sent to student and status set to 'Missing Access'.`);
    }
  } catch (err) {
    Logg(`${err} : Could not find student access boolean value`);
  }

  //Check again
  jobnumber = jobnumber !== null && jobnumber !== undefined ? jobnumber : CreateJobNumber(timestamp);
  //sheet.getRange("F" + lastRow).setValue(jobnumber);
  setByHeader(sheet, "(INTERNAL AUTO) Job Number", lastRow, jobnumber);
  

  //Fix wrapping issues
  let driveloc = sheet.getRange("D" + lastRow);
  formatCell(driveloc);
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
  //Fetch Data from Sheets
  var ss = e.range.getSheet();
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var thisSheet = spreadSheet.getActiveSheet();

  //Fetch Columns and rows and check validity
  var thisCol = e.range.getColumn();
  var thisRow = e.range.getRow();

  //Skip the first 2 rows of data.
  if (thisRow <= 1) return;

  //----------------------------------------------------------------------------------------------------------------
  //Add link to DS List
  var stafflist = sheetDict.staff;
  var sLink = stafflist.getRange(thisRow, 4).getValue();
  if (thisRow > 2) {
    if ( sLink == undefined || sLink == null || (sLink == "" && stafflist.getRange(thisRow, 3).getValue() != "") ) {
      var l = MakeLink(stafflist.getRange(thisRow, 3).getValue());
      stafflist.getRange(thisRow, 4).setValue(l);
    }
  }

  //----------------------------------------------------------------------------------------------------------------
  //Count Active Users & Post to a cell / Fetch top 10
  var users = await CountActiveUsers();
  sheetDict.data.getRange("C4").setValue(users);

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
  //Check Priority
  // let tempEmail = ss.getRange(thisRow, 9).getValue();
  // let tempSID = ss.getRange(thisRow, 11).getValue();
  let tempEmail = getByHeader(thisSheet, "Email", thisRow);
  let tempSID = getByHeader(thisSheet, "Your Student ID Number?", thisRow);

  var priority = await GetPriorityWithEmailOrSID(tempEmail, tempSID);
  //ss.getRange("C" + thisRow).setValue(priority);
  setByHeader(thisSheet, "(INTERNAL): Priority", thisRow, priority);
  if (priority == "STUDENT NOT FOUND") {
      // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(thisRow, 1, 1, 1).setValue("Missing Access");
      setByHeader(thisSheet, "(INTERNAL) Status", thisRow, "Missing Access");
  }

  //STATUS CHANGE TRIGGER
  //Only look at Column 1 for email trigger.... Also 52 is live.
  if (thisCol > 1 && thisCol != 3 && thisCol != 52) return;

  //----------------------------------------------------------------------------------------------------------------
  //Parse Data
  const status = getByHeader(spreadSheet, "(INTERNAL) Status", thisRow);

  var designspecialist = getByHeader(thisSheet, "(INTERNAL): DS Assigned", thisRow);
  var priority = getByHeader(thisSheet, "(INTERNAL): Priority", thisRow);
  var jobnumber = getByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow);
  var studentApproval = getByHeader(thisSheet, "Student Has Approved Job", thisRow);
  var submissiontime = getByHeader(thisSheet, "Timestamp", thisRow);
  var email = getByHeader(thisSheet, "Email", thisRow);
  var name = getByHeader(thisSheet, "What is your name?", thisRow);
  var sid = getByHeader(thisSheet, "Student ID Number", thisRow);
  var studentType = getByHeader(thisSheet, "What is your affiliation to the Jacobs Institute?", thisRow);
  var projectname = getByHeader(thisSheet, "Project Name", thisRow);
  var shippingQuestion = getByHeader(thisSheet, "Do you need your parts shipped to you?", thisRow);
  var cost = getByHeader(thisSheet, "Estimate", thisRow);

  //Materials
  const material1Quantity = getByHeader(thisSheet, "(INTERNAL) Material 1 Quantity", thisRow);
  const material1Name = getByHeader(thisSheet, "(INTERNAL) Item 1", thisRow);
  const material1URL = await new LookupProductID(material1Name).link;

  const material2Quantity = getByHeader(spreadSheet, "(INTERNAL) Material 2 Quantity", thisRow);
  const material2Name = getByHeader(spreadSheet, "(INTERNAL) Item 2", thisRow);
  const material2URL = await new LookupProductID(material2Name).link;

  const material3Quantity = getByHeader(thisSheet, "(INTERNAL) Material 3 Quantity", thisRow);
  const material3Name = getByHeader(thisSheet, "(INTERNAL) Item 3", thisRow);
  const material3URL = new LookupProductID(material3Name).link;

  const material4Quantity = getByHeader(thisSheet, "(INTERNAL) Material 4 Quantity", thisRow);
  const material4Name = getByHeader(thisSheet, "(INTERNAL) Item 4", thisRow);
  const material4URL = new LookupProductID(material4Name).link;

  const material5Quantity = getByHeader(thisSheet, "(INTERNAL) Material 5 Quantity", thisRow);
  const material5Name = getByHeader(thisSheet, "(INTERNAL) Item 5", thisRow);
  const material5URL = new LookupProductID(material5Name).link;

  // const material1Quantity = ss.getRange(thisRow, 13).getValue();
  // const material1Name = ss.getRange(thisRow, 14).getValue();
  // const material1URL = await new LookupProductID(material1Name).link;

  // const material2Quantity = ss.getRange(thisRow, 15).getValue();
  // const material2Name = ss.getRange(thisRow, 16).getValue();
  // const material2URL = await new LookupProductID(material2Name).link;

  // const material3Quantity = ss.getRange(thisRow, 17).getValue();
  // const material3Name = ss.getRange(thisRow, 18).getValue();
  // const material3URL = await new LookupProductID(material3Name).link;

  // const material4Quantity = ss.getRange(thisRow, 19).getValue();
  // const material4Name = ss.getRange(thisRow, 20).getValue();
  // const material4URL = await new LookupProductID(material4Name).link;

  // const material5Quantity = ss.getRange(thisRow, 21).getValue();
  // const material5Name = ss.getRange(thisRow, 22).getValue();
  // const material5URL = await new LookupProductID(material5Name).link;

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

  //Log submission info to sheet
  Logger.log(`Submission Time = ${submissiontime}, Name = ${name}, Email = ${email}, Project = ${projectname}`);

  //----------------------------------------------------------------------------------------------------------------
  //Fix Job Number if it's missing
  try {
    if (status == "Received" || status == "In-Progress") {
      jobnumber = jobnumber ? jobnumber : CreateJobNumber(submissiontime);
      //ss.getRange(thisRow, 6).setValue(jobnumber);
      setByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow, jobnumber);
      Logg(`Job Number was missing, so the script fixed it. Submission by ${email}`);
    }
  } catch (err) {
    Logg(`${err} : Job Number failed onSubmit, and has now failed onEdit`);
  }

  //----------------------------------------------------------------------------------------------------------------
  //Fix empty variables
  try {
    designspecialist = designspecialist ? designspecialist : "a Design Specialist";
    projectname = projectname ? projectname : "Your Project";
  } catch (err) {
    Logg( `${err} : Fixing empty or corrupted variables has failed for some reason.` );
  }

  //----------------------------------------------------------------------------------------------------------------
  //Calculate Turnaround Time only when cell is empty
  try {
    var startTime = submissiontime;
    var elapsedCell = ss.getRange(thisRow, 43).getValue();
    if (elapsedCell == undefined || elapsedCell == null || elapsedCell == "") {
      if (status == "Completed" || status == "Billed") {
        let endTime = new Date();
        let time = await CalculateDuration(startTime, endTime);

        //Write to Column - d h:mm:ss
        //ss.getRange(thisRow, 44).setValue(time);
        setByHeader(thisSheet, "Elapsed Time", thisRow, time);

        Logg(`Turnaround Time = ${time}`);

        //Write Completed time
        //ss.getRange(thisRow, 43).setValue(endTime);
        setByHeader(thisSheet, "Date Completed", thisRow, endTime);
      }
    }
  } catch (err) {
    Logg( `${err} : Calculating the turnaround time and completion time has failed for some reason.` );
  }

  //----------------------------------------------------------------------------------------------------------------
  //Trigger for generating a "Ticket"
  if ( status == "Received" || status == "In-Progress" || status == "Pending Approval" ) {
    try {
      var Ticket = await CreateTicket(
        designspecialist,
        priority,
        jobnumber,
        submissiontime,
        name,
        sid,
        email,
        projectname,
        material1Quantity,
        material1Name,
        material2Quantity,
        material2Name,
        shippingQuestion
      );
    } catch (err) {
      Logger.log( `${err} : Couldn't generate a ticket. Check docUrl / id and repair.` );
    }
    try {
      var id = Ticket.getId();
      var doc = DocumentApp.openById(id);
      var docUrl = doc.getUrl();
      //ss.getRange(thisRow, 5).setValue(docUrl); //Push to cell
      setByHeader(thisSheet, "Printable Ticket", thisRow, docUrl);
      Logger.log(`Ticket Created.`);
    } catch (err) {
      Logger.log(`${err} : Couldn't push ticket to the cell.`);
    }
  }

  //----------------------------------------------------------------------------------------------------------------
  //Make an approval form on demand
  // Create a new form, then add a checkbox question, a multiple choice question,
  if (status == "Pending Approval") {
    var approvalURL = await CreateApprovalForm(name, jobnumber, cost);
    Logg(`Approval Form generated and sent to user.`);
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
    case "Received":
      GmailApp.sendEmail(email, "Jacobs Project Support : Received", "", {
        htmlBody: Message.receivedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case "Pending Approval":
      GmailApp.sendEmail(email, "Jacobs Project Support : Needs Your Approval", "", {
          htmlBody: Message.pendingMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "In-Progress":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Started", "", {
          htmlBody: Message.inProgressMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Completed":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Completed", "", {
          htmlBody: Message.completedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Shipped":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Shipped", "", {
          htmlBody: Message.shippedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "FAILED":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has Failed", "", {
          htmlBody: Message.failedMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Rejected by Student":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has been Declined", "", {
          htmlBody: Message.rejectedByStudentMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Rejected by Staff":
    case "Cancelled":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project has been Cancelled", "", {
          htmlBody: Message.rejectedByStaffMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Billed":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Closed", "", {
        htmlBody: Message.billedMessage,
        from: supportAlias,
        cc: designspecialistemail,
        bcc: InvokeDS("Chris", "email"),
        name: gmailName,
      });
      break;
    case "Waitlist":
      GmailApp.sendEmail(email, "Jacobs Project Support : Project Waitlisted", "", {
          htmlBody: Message.waitlistMessage,
          from: supportAlias,
          cc: designspecialistemail,
          bcc: InvokeDS("Chris", "email"),
          name: gmailName,
      });
      break;
    case "Missing Access":
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
    Logg(`Recalculated Metrics tab.`);

    var topten = await CalculateDistribution();
    if (topten.length >= 10) {
      for (var i = 0; i < 10; i++) {
        let thisRow = 106 + i;
        sheetDict.data.getRange("B" + thisRow).setValue(topten[i]);
        sheetDict.data.getRange("C" + thisRow).setValue(topten[i][1]);
      }
    }
    Logg(`Recalculated Top 10 Distribution.`);
  }
};
//END OF OnEdit

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
var CreateApprovalForm = (name, jobnumber, cost) => {
  try {
    // Make a new approval form
    let approvalForm = FormApp.create("Approval Form");

    //Set parent folder
    //var parentFolder = DriveApp.getFolderById("1EpvCTyuCkNzKQ4sxYrZvwPqGqzRvgtRX").addFile(approvalForm);

    let sendloc = "16oCqmnW9zCUhpQLo3TXsaUSxDcSv7aareEVSE9zYtVQ";
    let destination = approvalForm.setDestination( FormApp.DestinationType.SPREADSHEET, sendloc );
    //Form Setup
    approvalForm.setTitle(`Approval Form`);
    approvalForm.setDescription(`Referrence Number: ${jobnumber}`);
    approvalForm.setConfirmationMessage(`Thanks for responding!`);
    approvalForm.setAllowResponseEdits(false);
    approvalForm.setAcceptingResponses(true);

    //Ask Questions
    if (cost == "" || cost == undefined || cost == 0) {
      Logg(`Approval form: No known cost. cost = ${cost}`);
      let item = approvalForm.addMultipleChoiceItem().setRequired(true);
      item.setTitle(`For this job, the cost of materials was not specified. 
              Please speak with a Design Specialist if you have questions. 
              Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`);
      item.setChoices([
        item.createChoice(`Yes, I approve.`),
        item.createChoice(`No. I reject.`),
      ]);
    } else {
      let costFormatted = Utilities.formatString("$%.2f", cost);
      Logg(`Approval form: Known cost. cost = ${costFormatted}`);
      let item = approvalForm.addMultipleChoiceItem().setRequired(true);
      item.setTitle(`For this job, the cost of materials is estimated to be: ${costFormatted}. 
            Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`);
      item.setChoices([
        item.createChoice(`Yes, I approve.`),
        item.createChoice(`No. I reject.`),
      ]);
    }
    let item2 = approvalForm.addMultipleChoiceItem().setRequired(true);
    item2.setTitle(`Please select your name below.`);
    item2.setChoices([item2.createChoice(name)]);
    let item3 = approvalForm.addMultipleChoiceItem().setRequired(true);
    item3.setTitle(`Please select the job number below.`);
    item3.setChoices([item3.createChoice(jobnumber)]);
    let approvalURL = approvalForm.getPublishedUrl();
    Logg(`Created an Approval Form for the student.`);
  } catch (err) {
    Logg(`${err} : Couldn't generate Approval Form`);
  }

  try {
    //Set folder
    let folder = DriveApp.getFoldersByName(`Job Forms`);

    //Remove File from root and Add that file to a specific folder
    let id = approvalForm.getId();
    let docFile = DriveApp.getFileById(id);
  } catch (err) {
    Logg(`${err} : Couldn't get the id of the file.`);
  }
  try {
    DriveApp.removeFile(docFile);
    folder.next().addFile(docFile);

    //Set permissions to 'anyone can edit' for that file
    let file = DriveApp.getFileById(id);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
  } catch (err) {
    Logg(`${err} : Couldn't delete the form in that spot. Probably still has the form linked.` );
  }
  return approvalURL;
};




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Generate new Job number from a date
 * @param {time} date
 * @return {number} job number
 */
var CreateJobNumber = (date) => {
  //var date = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ultimaker').getRange('H135').getValue();
  //date = sheetDict.othertools.getRange('G7').getValue();

  //Check that it's a date
  let testedDate = isValidDate(date);

  let jobnumber;
  try {
    if ( date == undefined || date == null || date == "" || testedDate == false ) {
      jobnumber = +Utilities.formatDate(new Date(), `PST`, `yyyyMMddHHmmss`);
      Logg(`Set Jobnumber to a new time because timestamp was missing.`);
    } else {
      jobnumber = +Utilities.formatDate(date, `PST`, `yyyyMMddhhmmss`);
      Logg(`Input time: ${date}, Set Jobnumber: ${jobnumber}`);
    }
  } catch (err) {
    Logg(`${err} : Couldnt fix jobnumber.`);
  }
  if (jobnumber == undefined || testedDate == false) {
    jobnumber = +Utilities.formatDate(new Date(), `PST`, `yyyyMMddHHmmss`);
  }
  Logger.log(`Returned Job Number: ${jobnumber}`);
  return jobnumber.toString();
};





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a Ticket to Print
 * @param {Event} e
 * @param {string} designspecialist
 * @param {bool} priority
 * @param {number} jobnumber
 * @param {time} submissiontime
 * @param {string} name
 * @param {number} sid
 * @param {string} email
 * @param {string} projectname
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @param {bool} shippingQuestion
 * @returns {doc} doc
 */
var CreateTicket = (
  designspecialist,
  priority,
  jobnumber,
  submissiontime,
  name,
  sid,
  email,
  projectname,
  material1Quantity,
  material1Name,
  material2Quantity,
  material2Name,
  shippingQuestion
) => {
  //Create Doc
  try {
    var folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    var doc = DocumentApp.create(`Job Ticket`); //Make Document
    var body = doc.getBody();
    var docId = doc.getId();
  } catch (err) {
    Logg( `${err} : Could not fetch doc folder, or make ticket, or get body or docId.` );
  }

  try {
    var barcode = GenerateBarCode(jobnumber);
  } catch (err) {
    Logger.log(`${err} : Couldnt create barcode for some reason.`);
  }
  try {
    var qrCode = GenerateQRCode(doc.getUrl());
  } catch (err) {
    Logger.log(`${err} : Couldnt create QRCode for some reason.`);
  }

  //Parse for Individual Sheets
  var sheetname = SpreadsheetApp.getActiveSheet().getSheetName();
  var thisRow = SpreadsheetApp.getActiveSheet().getActiveRange().getRow();

  var thisSheet;
  var mat = [];
  var partcount = [];
  var notes = [];
  if (sheetname == "Ultimaker") {
    thisSheet = sheetDict.ultimaker;
    mat.push( "Needs Breakaway Removed:", thisSheet.getRange("AD" + thisRow).getValue().toString());
    partcount.push( "Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString());
    notes.push( "Notes:", thisSheet.getRange("AE" + thisRow).getValue().toString());
  }
  if (sheetname == "Laser Cutter") {
    thisSheet = sheetDict.laser;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push("Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AC" + thisRow).getValue().toString() );
  }
  if (sheetname == "Fablight") {
    thisSheet = sheetDict.fablight;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("AB" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AC" + thisRow).getValue().toString() );
  }
  if (sheetname == "Waterjet") {
    thisSheet = sheetDict.waterjet;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("AB" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AD" + thisRow).getValue().toString() );
  }
  if (sheetname == "Advanced Lab") {
    thisSheet = sheetDict.advancedlab;
    mat.push( "Which Printer:", thisSheet.getRange("Z" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AJ" + thisRow).getValue().toString() );
  } else {
    mat.push("Materials: ", "");
    partcount.push("Part Count: ", "1");
    notes.push("Notes: ", "None");
  }

  //Append Document with Info
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

      // // body.appendImage(barcode).setAltTitle("Barcode");
      // body.appendImage(qrCode).setAltTitle("QRCode");

      // Create a two-dimensional array containing the cell contents.
      body.appendTable([
          ["Needs Shipping:", shippingQuestion.toString()],
          ["Design Specialist:", designspecialist.toString()],
          ["Job Number:", jobnumber.toString()],
          ["Student Name:", name.toString()],
          ["Project Name:", projectname.toString()],
          ["Materials:", material1Name.toString()],
          [mat[0], mat[1]],
          [partcount[0], partcount[1]],
          [notes[0], notes[1]],
        ])
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 9,
        });
    } catch (err) {
      Logg(`${err} : Couldn't append info to ticket. Ya dun goofed.`);
    }

    //Remove File from root and Add that file to a specific folder
    try {
      var docFile = DriveApp.getFileById(docId);
      DriveApp.removeFile(docFile);
      folder.next().addFile(docFile);
      folder.next().addFile(barcode);
    } catch (err) {
      Logg( `${err} : Couldn't delete the file from the drive folder. Sheet is still linked` );
    }

    //Set permissions to 'anyone can edit' for that file
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

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Replace table entries with an Image blob
 * @param {DocumentApp.create(`doc`).getbody()} body
 * @param {string} text
 * @param {blob} image
 */
const ReplaceTextToImage = (body, searchText, image) => {
  var next = body.findText(searchText);
  if (!next) return;
  var r = next.getElement();
  r.asText().setText("");
  var img = r.getParent().asParagraph().insertInlineImage(0, image);
  return next;
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get Priority Number from Erik's List
 * Old Excel formula : '=ARRAYFORMULA(ISNUMBER(MATCH(Text(K2:K, "0"), Text('Student List DONOTDELETE'!C2:C500, "0"),0)))'
 * @param {number} sid
 * @returns {number} priority number 1 - 4
 */
var GetPriority = (sid) => {
  //sid = 3035249023;  //test good sid
  //sid = 2323453444;//test bad sid

  //Cast SID to string and remove garbage
  let stringSID;
  let priority;

  if (sid) stringSID = sid.toString().replace(/\s+/g, "");

  let index = 0;

  let last = sheetDict.approved.getLastRow() - 1;
  let approvedList = sheetDict.approved.getRange(2, 3, last, 1).getValues(); //Column C3:C

  //Loop through SIDs to find a match and fetch priority number
  for (let i = 0; i < approvedList.length; i++) {
    let item = approvedList[i][0].toString().replace(/\s+/g, "");
    if (item == stringSID) {
      index = i + 2;
      priority = sheetDict.approved.getRange(index, 4).getValue();
      break;
    } else if (item != stringSID) {
      priority = "STUDENT NOT FOUND!";
    }
  }

  Logger.log(`Priority = ${priority}`);
  //Return value
  return priority;
};



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Get Priority Number from Erik's List
 * Old Excel formula : '=ARRAYFORMULA(ISNUMBER(MATCH(Text(K2:K, "0"), Text('Student List DONOTDELETE'!C2:C500, "0"),0)))'
 * @param {string} email
 * @returns {number} priority number 1 - 4
 */
var GetPriorityFromEmail = (email) => {
  //email = "saveritt@berkeley.edu";  //test good email
  //email = "some@thing.com";    //test bad email

  let priority;

  let last = sheetDict.approved.getLastRow() - 1;
  let approvedList = sheetDict.approved.getRange(2, 2, last, 1).getValues();

  //Loop through SIDs to find a match and fetch priority number
  for (let i = 0; i < approvedList.length; i++) {
    let item = approvedList[i][0].toString();
    if (item == email) {
      let index = i + 2;
      priority = sheetDict.approved.getRange(index, 4).getValue();
      break;
    } else if (item != email) {
      priority = "STUDENT NOT FOUND!";
    }
  }

  Logger.log(`Priority = ${priority}`);
  return priority;
};



/**
 * @param {[string]} array to search
 * @param {string} searchString
 * @returns {int} index
 */
const Search = (values, searchString) => {
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == searchString) {
      return i;
    }
  }
};



/**
 * @param {string} email
 * @param {string} SID
 * @returns {int} priority
 */
const GetPriorityWithEmailOrSID = (email, sid) => {
  if(email != null) email = email.toLowerCase()
  Logger.log(`Email : ${email}, SID : ${sid}`)

  let priority

  let stringSID = sid.toString()
  if (sid) {
      stringSID = sid.toString().replace(/\s+/g, "")
  }

  let approvedListEmails = sheetDict.approved.getRange(2, 2, sheetDict.approved.getLastRow() - 1, 1).getValues()
  let approvedListSIDs = sheetDict.approved.getRange(2, 3, sheetDict.approved.getLastRow() - 1, 1).getValues()

  let casefixedList = []
  approvedListEmails.forEach(email => {
      if(email[0] != null || email[0] != undefined) {
          casefixedList.push(email[0].toString().toLowerCase())
      }
      else casefixedList.push(email[0].toString())
  })

  let index = Search(casefixedList, email)
  if (index == null || index == undefined) {
      index = Search(approvedListSIDs, stringSID)
  }

  if (index != null || index != undefined) {
      index += 2
      Logger.log(`Index on ApprovedSheet : ${index}`)
      priority = sheetDict.approved.getRange(index, 4).getValue()
  } else priority = `STUDENT NOT FOUND!`

  Logger.log(`Priority = ${priority}`)
  return priority
};


const _testGetPriority = async () => {
    let priority = await GetPriorityWithEmailOrSID(`laxbop@berkeley.edu`,3036051329)
    Logger.log(`Priority : ${priority}`)
}


