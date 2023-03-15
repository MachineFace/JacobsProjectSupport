
/**
 * Mark a job as abandoned and send an email to that student
 */
const PopUpMarkAsAbandoned = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(
    `Mark Job as Abandoned`, 
    `Scan a ticket with this cell selected and press "OK".`, 
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let jobnumber = response.getResponseText();
    console.warn(`Finding ${jobnumber}`);
    let res = FindOne(jobnumber);
    if(res == null) {
      progressUpdate.setValue(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      SetByHeader(sheet, HEADERNAMES.status, row, STATUS.abandoned);
      console.info(`Job number ${jobnumber} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${row}`);
      const message = await new CreateMessage({
        name : res.name, 
        projectname : res.projectName, 
        jobnumber : jobnumber, 
        designspecialist : res.ds, 
      })
      await new Emailer({
        email : email, 
        status : STATUS.abandoned,
        projectname : res.projectName,
        jobnumber : jobnumber,
        message : message,
      })
      console.warn(`Owner ${email} of abandoned job: ${jobnumber} emailed...`);
      ui.alert(`Marked as Abandoned`, `${email}, Job: ${jobnumber} emailed... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to send an email...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}


/**
 * Mark a job as abandoned and send an email to that student
 */
const PopUpMarkAsPickedUp = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(
    `Mark Print as Picked Up`, 
    `Scan a ticket with this cell selected and press "OK".`, 
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let jobnumber = response.getResponseText();
    console.warn(`Finding ${jobnumber}`);
    let res = FindOne(jobnumber);
    if(res == null) {
      console.warn(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      SetByHeader(sheet, HEADERNAMES.status, row, STATUS.pickedUp);
      console.warn(`${email}, Job: ${jobnumber} marked as picked up... Sheet: ${sheet.getSheetName()} row: ${row}`);
      ui.alert(`Marked as Picked Up`, `${email}, Job: ${jobnumber}... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to mark as picked up...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}


/** 
 * Creates a pop-up for counting users.
 */
const PopupCountUsers = async () => {
  const ui = await SpreadsheetApp.getUi();
  const count = await CountActiveUsers();
  ui.alert(
    `JPS User Count`,
    `Students Currently Using JPS : ${count}`,
    ui.ButtonSet.OK
  );
};


/**
 * Create a pop-up to check for ALL missing students
 */
const PopupCheckMissingAccessStudents = async () => {
  const ui = await SpreadsheetApp.getUi();
  const names = await CheckMissingAccessStudents().join(", ");
  console.info(names);
  ui.alert(
    `JPS Runtime Message`,
    `Checking Missing Access Students on All Sheets : \\n ${names}`,
    ui.ButtonSet.OK
  );
};


/**
 * Create a pop-up to check for ONE missing students
 */
const PopupGetSingleStudentPriority = async () => {
  const ui = await SpreadsheetApp.getUi();
  const thisSheet = SpreadsheetApp.getActiveSheet();
  let thisRow = thisSheet.getActiveRange().getRow();
  const email = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  const sid = GetByHeader(thisSheet, HEADERNAMES.sid, thisRow);
  const name = GetByHeader(thisSheet, HEADERNAMES.name, thisRow);
  console.info(`Checking access for ${name}, ${email}, ${sid}, Row: ${thisRow}`);
  try {
    const priority = await new CheckPriority({ email : email, sid : sid }).Priority;
    console.info(`Priority: ${priority}`);
    SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
    if(priority != `STUDENT NOT FOUND!`) {
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.received);
    }
    ui.alert(
      `JPS : Checked Access`,
      `Access for ${name} set to : "${priority}"`,
      ui.ButtonSet.OK
    );
  } catch (err) {
    console.error(`${err} : Whoops, couldn't set priority for ${name}`);
    ui.alert(
      `JPS Error`,
      `Whoops, couldn't set priority for ${name}`,
      ui.ButtonSet.OK
    );
  }
  
};


/**
 * Create a pop-up to make a new Jobnumber
 */
const PopupCreateNewJobNumber = async () => {
  const ui = await SpreadsheetApp.getUi();
  const thisSheet = SpreadsheetApp.getActiveSheet();
  let thisRow = thisSheet.getActiveRange().getRow();

  // If It is on a valid sheet
  if(CheckSheetIsForbidden(thisSheet) == true) {
    Browser.msgBox(
      `Incorrect Sheet Active`,
      `Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK
    );
    return;
  } else {
    const timestamp = GetByHeader(thisSheet, HEADERNAMES.timestamp, thisRow);
    const jobnumber = new CreateJobnumber({ date : timestamp}).Jobnumber;
    SetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow, jobnumber.toString());
    ui.alert(
      `JPS Job Number Created`,
      `Created a New Jobnumber : ${jobnumber}`,
      ui.ButtonSet.OK
    );
  }
};


/**
 * Bill from a selected line
 */
const BillFromSelected = async () => {
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let thisRow = thisSheet.getActiveRange().getRow();

  if(CheckSheetIsForbidden(thisSheet) == true) {
    const b = Browser.msgBox(
      `Incorrect Sheet Active`,
      `Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK
    );
    if (b == `ok`) return;
  }
  const rowData = GetRowData(thisSheet, thisRow);
  const { status, jobNumber, email, mat1quantity, mat1, mat2quantity, mat2, mat3quantity, mat3, mat4quantity, mat4, mat5quantity, mat5, estimate } = rowData;
  const quantityTotal = mat1quantity + mat2quantity + mat3quantity + mat4quantity + mat5quantity;
  console.info(rowData);
  
  let response;
  if (quantityTotal == 0 || quantityTotal == undefined || quantityTotal == "") {
    console.warn(`Cannot Bill Student - No Material quantity(s) recorded...`);
    const b = Browser.msgBox(
      `Generate Bill to Shopify`,
      `No quantities entered for selected submission. Maybe add some materials first before billing...`,
      Browser.Buttons.OK
    );
    if (b == `ok`) return;
  }
  if (status == STATUS.billed || status == STATUS.closed || status == STATUS.abandoned || status == STATUS.failed) {
    const b = Browser.msgBox(
      `Generate Bill to Shopify`,
      `You have already Generated a bill to this Student. Project is closed.`,
      Browser.Buttons.OK
    );
    if (b == `ok`) return;
  }

  const shopify = await new ShopifyAPI({
    jobnumber : jobNumber, 
    email : email,
    material1Name : mat1, material1Quantity : mat1quantity,
    material2Name : mat2, material2Quantity : mat2quantity,
    material3Name : mat3, material3Quantity : mat3quantity,
    material4Name : mat4, material4Quantity : mat4quantity,
    material5Name : mat5, material5Quantity : mat5quantity, 
  }); 

  // Fetch Customer and Products
  const customer = await shopify.GetCustomerByEmail(email);
  console.info(`CUSTOMER : ${JSON.stringify(customer)}`)
  if (customer == undefined || customer == null) {
    const b = Browser.msgBox(
      `Shopify Error`,
      `The Shopify customer was not found... Check with Chris & Cody.`,
      Browser.Buttons.OK
    );
    if (b == `ok`) return;
  }

  let boxTitle = `Generate Bill to Shopify`;
  let msg = `Would you like to Generate a Bill to: \\n`;
  msg += `${customer?.first_name} ${customer?.last_name} \\n`;
  msg += `Email: ${email} \\n`;
  msg += `Job Number : ${jobNumber?.toString()} \\n`;
  msg += `Shopify ID : ${customer.id?.toString()} \\n`;
  msg += `For Materials : \\n`; 
  msg += `----- ${mat1quantity} of ${mat1}\\n`;
  if(mat2quantity) msg += `----- ${mat2quantity} of ${mat2}\\n`;
  if(mat3quantity) msg += `----- ${mat3quantity} of ${mat3}\\n`;
  if(mat4quantity) msg += `----- ${mat4quantity} of ${mat4}\\n`;
  if(mat5quantity) msg += `----- ${mat5quantity} of ${mat5}\\n`;
  msg += `Estimated Cost: $${estimate?.toString()} \\n`;

  // Make a nessage box
  try {
    response = Browser.msgBox(
      boxTitle,
      msg,
      Browser.Buttons.YES_NO_CANCEL
    );
    if (response == "yes") {
      console.info(`User clicked "Yes".`);
      
      const order = await shopify.CreateOrder();
      SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.billed);
      console.info(order.toString());
      let lastOrder = await shopify.GetLastOrder();
      Browser.msgBox(
        boxTitle,
        `Student has been successfully billed on Shopify! \n ${JSON.stringify(lastOrder)}`,
        Browser.Buttons.OK
      );
    } else {
      console.warn(`User clicked "No / Cancel".`);
      console.warn(`Order NOT Created.`);
    }
  } catch (err) {
    console.error(`${err} : Couldn't create an order...`);
  } finally {
    thisSheet.getRange(`AZ${thisRow}`).setValue(false);
  }

  console.info(`Completed BillFromSelected`);
};


/**
 * Create a pop-up to Create a new Ticket if one is missing.
 */
const PopupCreateTicket = async () => {
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let ui = SpreadsheetApp.getUi();
  if(CheckSheetIsForbidden(thisSheet)) {
    Browser.msgBox(
      `Incorrect Sheet Active`,
      `Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK
    );
    return;
  }
  let thisRow = thisSheet.getActiveRange().getRow();
  let rowData = await GetRowData(thisSheet, thisRow);
  const { ds, jobNumber, timestamp, email, name, sid, projectName, sheetName, row } = rowData;
  let x = await new Ticket({
    jobnumber : jobNumber,
    designspecialist : ds,
    submissiontime : timestamp,
    name : name,
    email : email, 
    projectname : projectName,
    rowData : rowData,
  });
  let t = await x.CreateTicket();
  console.info(t);
  
  SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, t.getUrl());
  ui.alert(
    `JPS Ticket Creation`,
    `Ticket Created for : ${name}, Job Number : ${jobNumber}`,
    ui.ButtonSet.OK
  );
  
};

/**
 * Builds HTML file for the modal pop-up from the help list.
 */
const BuildHTMLHELP = () => {
  let items = [
    `Note : All status changes trigger an email to the student except for 'CLOSED' status`,
    `New Project comes into a sheet and status will automatically be set to 'Received'.`,
    `Assign yourself as the DS / SS and fill in the materials as best you can.`,
    `Change the status to 'In-Progress' when you're ready to start the project.`,
    `Wait 30 seconds for the printable ticket to generate, and print it.`,
    `Fabricate the project.`,
    `When it's done, bag the project + staple the ticket to the bag and change the status to 'Completed'.`,
    `Select any cell in the row and choose 'Generate Bill' to bill the student. The status will change itself to 'Billed'.`,
    `If you don't need to bill the student, choose 'CLOSED' status.`,
    `If you need to cancel the job, choose 'Cancelled'. `,
    `If the project can't be fabricated at all, choose 'FAILED', and email the student why it failed.`,
    `If you need student approval before proceeding, choose 'Pending Approval'. `,
    `'Missing Access' will be set automatically, and you should not choose this as an option.`,
    `If the student needs to be waitlisted for more information or space, choose 'Waitlisted'. `,
    `See Cody or Chris for additional help + protips.`,
  ];
  let html = `<h2 style="text-align:center"><b> HELP MENU </b></h2>`;
  html += `<h3 style="font-family:Roboto">How to Use JPS : </h3>`;
  html += `<hr>`;
  html += `<p>${items[0]}</p>`;
  html += `<ol style="font-family:Roboto font-size:10">`;
  items.forEach((item, index) => {
    if (index > 0 && index < items.length - 1) html += `<li>${item}</li>`;
  });
  html += `</ol>`;
  html += `<p>${items[items.length - 1]}</p>`;

  console.info(html);
  return html;
};

/**
 * Creates a modal pop-up for the help text.
 */
const PopupHelp = async () => {
  let ui = await SpreadsheetApp.getUi();
  let htmlOutput = HtmlService.createHtmlOutput(await BuildHTMLHELP())
    .setWidth(640)
    .setHeight(480);
  ui.showModalDialog(htmlOutput, `JPS HELP!!`);
};

/**
 * Builds our JPS Menu and sets functions.
 */
const BarMenu = () => {
  SpreadsheetApp.getUi()
    .createMenu(`JPS Menu`)
    .addItem(`Generate Bill to Selected Student`, `BillFromSelected`)
    .addItem(`Generate a New JobNumber`, `PopupCreateNewJobNumber`)
    .addSeparator()
    .addItem(`Mark as Abandoned`, `PopUpMarkAsAbandoned`)
    .addItem(`Mark as Picked Up`, `PopUpMarkAsPickedUp`)
    .addSeparator()
    .addItem(`Barcode Scanning Tool`, `OpenBarcodeTab`)
    .addSeparator()
    .addItem(`Check All Missing Access Students`, `PopupCheckMissingAccessStudents`)
    .addItem(`Check Specific Student's Access`, `PopupGetSingleStudentPriority`)
    .addSeparator()
    .addItem(`Count Active Users`, `PopupCountUsers`)
    .addItem(`Create a Ticket for a User`, `PopupCreateTicket`)
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu(`Calculate`)
        .addItem(`Count Total Emails Sent`, `CountTotalEmailsSent`)
        .addItem(`Generate Metrics`, `Metrics`)
        .addItem(`Generate Top Ten`, `RunTopTen`)
        .addItem(`Generate Standard Deviation`, `RunStandardDeviation`)
    )
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp
        .getUi()
        .createMenu('Chris & Cody ONLY')
        .addItem(`DO NOT USE THESE FUNCTIONS UNLESS YOU ARE CHRIS OR CODY!`, `_testStaff`)
        .addItem('ENABLE JPS', 'EnableJPS')
        .addItem('DISABLE JPS', 'DisableJPS')
    )
    .addSeparator()
    .addItem(`Help`, `PopupHelp`)
    .addToUi();
};

const RunStandardDeviation = () => new Calculate().CalculateStandardDeviation();
const RunTopTen = () => new Calculate().CreateTopTen();




/**
 * Open the Barcode Tab
 */
const OpenBarcodeTab = async () => SpreadsheetApp
  .getActiveSpreadsheet()
  .setActiveSheet(OTHERSHEETS.Pickup)
  .getRange(`B3`)
  .activate();









