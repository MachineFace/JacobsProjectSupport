/**
 * Mark a job as abandoned and send an email to that student
 * DEFUNCT
 *
const PopUpMarkAsAbandoned = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(
    `${SERVICE_NAME} : Mark Job as Abandoned`, 
    `Scan a ticket with this cell selected and press "OK".`, 
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let id = response.getResponseText();
    console.warn(`Finding ${id}`);
    let res = SheetService.FindOne(id);
    if(res == null) {
      progressUpdate.setValue(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      SheetService.SetByHeader(sheet, HEADERNAMES.status, row, STATUS.abandoned);
      console.info(`Job number ${id} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${row}`);
      const message = await new MessageService({
        name : res.name, 
        projectname : res.projectName, 
        id : id, 
        designspecialist : res.ds, 
      })
      await new Emailer({
        email : email, 
        status : STATUS.abandoned,
        projectname : res.projectName,
        id : id,
        message : message,
      })
      console.warn(`Owner ${email} of abandoned job: ${id} emailed...`);
      ui.alert(`Marked as Abandoned`, `${email}, Job: ${id} emailed... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to send an email...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}
*/

/**
 * Mark a job as abandoned and send an email to that student
 * DEFUNCT
const PopUpMarkAsPickedUp = async () => {
  let ui = SpreadsheetApp.getUi(); 
  let response = ui.prompt(
    `${SERVICE_NAME}:\n Mark Print as Picked Up`, 
    `Scan a ticket with this cell selected and press "OK".`, 
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    let id = response.getResponseText();
    console.warn(`Finding ${id}`);
    let res = SheetService.FindOne(id);
    if(res == null) {
      console.warn(`Job number not found. Try again.`);
    } else {
      let sheet = SHEETS[res.sheetName];
      let row = res.row;
      let email = res.email;
      SheetService.SetByHeader(sheet, HEADERNAMES.status, row, STATUS.pickedUp);
      console.warn(`${email}, Job: ${id} marked as picked up... Sheet: ${sheet.getSheetName()} row: ${row}`);
      ui.alert(`Marked as Picked Up`, `${email}, Job: ${id}... Sheet: ${sheet.getSheetName()} row: ${row}`, ui.ButtonSet.OK);
    }
  } else if (response.getSelectedButton() == ui.Button.CANCEL) {
    console.warn(`User chose not to mark as picked up...`);
  } else {
    console.warn(`User cancelled.`);
  }
    
}
*/


/** 
 * Creates a pop-up for counting users.
 */
const PopupCountUsers = () => {
  const ui = SpreadsheetApp.getUi();
  const count = Calculate.CountActiveUsers();
  ui.alert(
    SERVICE_NAME,
    `JPS User Count: ${count}`,
    ui.ButtonSet.OK
  );
};


/**
 * Create a pop-up to check for ALL missing students
 */
const PopupCheckMissingAccessStudents = async () => {
  const ui = SpreadsheetApp.getUi();
  const names = await CheckMissingAccessStudents().join(",\n");
  console.info(names);
  ui.alert(
    `${SERVICE_NAME}: ALERT!`,
    `Checked Missing Access Students on All Sheets :\n ${names}`,
    ui.ButtonSet.OK
  );
};


/**
 * Create a pop-up to check for ONE missing students
 */
const PopupGetSingleStudentPriority = async () => {
  try {
    const ui = SpreadsheetApp.getUi();
    const thisSheet = SpreadsheetApp.getActiveSheet();
    let thisRow = thisSheet.getActiveRange().getRow();

    const rowData = SheetService.GetRowData(thisSheet, thisRow);
    let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, sheetName, row, } = rowData;
    console.info(`Checking access for ${name}, ${email}, ${sid}, Row: ${thisRow}`);

    
    priority = await new PriorityService({ email : email, sid : sid }).Priority;
    console.info(`Priority: ${priority}`);
    SheetService.SetByHeader(thisSheet, HEADERNAMES.priority, thisRow, priority);
    if(priority == PRIORITY.None) {
      SheetService.SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.missingAccess);
      new Emailer({ 
        name : name, 
        status : STATUS.missingAccess,
        email : email,    
        message :  new MessageService({
          name : name,
          projectname : projectName, 
          id : id,
          rowData : rowData,
          designspecialist : rowData.ds,
        }),
      });
    }
    ui.alert(
      SERVICE_NAME,
      `Access for ${name} set to : "${priority}"`,
      ui.ButtonSet.OK,
    );
  } catch(err) {
    console.error(`"PopupGetSingleStudentPriority()" failed : ${err} : Couldn't set priority for ${name}`);
    ui.alert(
      `${SERVICE_NAME} : Error!`,
      `Whoops, couldn't set priority for ${name}`,
      ui.ButtonSet.OK,
    );
  }
  
};


/**
 * Create a pop-up to make a new ID
 */
const PopupCreateNewID = () => {
  const ui = SpreadsheetApp.getUi();
  const thisSheet = SpreadsheetApp.getActiveSheet();
  let thisRow = thisSheet.getActiveRange().getRow();
  const newID = IDService.createId();

  if(!SheetService.IsValidSheet(thisSheet)) {
    const a = ui.alert(
      `${SERVICE_NAME}: Incorrect Sheet!`,
      `Please select from a valid sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK,
    );
    if(a === ui.Button.OK) return;
  } 
  const { name, id } = SheetService.GetRowData(thisSheet, thisRow);
  if(IDService.isValid(id)) {
    const a = ui.alert(
      `${SERVICE_NAME}: Error!`,
      `ID for ${name} exists already!\n${id}`,
      ui.ButtonSet.OK
    );
    if(a === ui.Button.OK) return;
  }
  SheetService.SetByHeader(thisSheet, HEADERNAMES.id, thisRow, newID);
  const a = ui.alert(
    SERVICE_NAME,
    `Created a New ID for ${name}:\n${newID}`,
    ui.ButtonSet.OK
  );
  if(a === ui.Button.OK) return;
};


/**
 * Bill from a selected line
 */
const BillFromSelected = async () => {
  const ui = SpreadsheetApp.getUi();
  const shopify = await new ShopifyAPI(); 
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let thisRow = thisSheet.getActiveRange().getRow();
  let response;

  const rowData = SheetService.GetRowData(thisSheet, thisRow);
  let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
    mat1quantity, mat1, mat2quantity, mat2, 
    mat3quantity, mat3, mat4quantity, mat4, 
    mat5quantity, mat5, affiliation, elapsedTime, estimate, 
    price1, price2, printColor, printSize, printCount, sheetName, row, } = rowData;

  if(!SheetService.IsValidSheet(thisSheet)) {
    const a = ui.alert(
      `${SERVICE_NAME}: Incorrect Sheet!`,
      `Please select from a valid sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK,
    );
    if(a === ui.Button.OK) return;
  } 

  // TODO: Fix this messy shit.
  if(thisSheet == SHEETS.Plotter || thisSheet == SHEETS.GSI_Plotter) {
    mat1 = rowData.material;
    mat1quantity = rowData.printSize;
  }

  let quantityTotal = mat1quantity + mat2quantity + mat3quantity + mat4quantity + mat5quantity;
  
  if (quantityTotal == 0 || quantityTotal == undefined || quantityTotal == "") {
    console.warn(`Cannot Bill Student - No Material quantity(s) recorded...`);
    response = ui.alert(
      `${SERVICE_NAME}: Error!`,
      `No quantities entered for selected submission. Maybe add some materials first before billing...`,
      Browser.Buttons.OK
    );
    if (response === ui.Button.OK) return;
  }
  if (status == STATUS.billed || status == STATUS.closed || status == STATUS.abandoned || status == STATUS.failed) {
    response = Browser.msgBox(
      `${SERVICE_NAME}: Error!`,
      `You have already Generated a bill to this Student. Project is closed.`,
      Browser.Buttons.OK
    );
    if (response === ui.Button.OK) return;
  }


  // Fetch Customer and Products
  const customer = await shopify.GetCustomerByEmail(email);
  console.info(`CUSTOMER : ${JSON.stringify(customer)}`)
  if (customer == undefined || customer == null) {
    response = ui.alert(
      `${SERVICE_NAME}: Error!`,
      `The Shopify customer was not found... Check with Chris & Cody.`,
      Browser.Buttons.OK
    );
    if (response === ui.Button.OK) return;
  }

  const boxTitle = `${SERVICE_NAME} : Generate Bill to Shopify`;
  let msg = `Would you like to Generate a Bill to:\n`
  + `${customer?.first_name} ${customer?.last_name}\n`
  + `Email: ${email}\n`
  + `Job Number : ${id?.toString()}\n`
  + `Shopify ID : ${customer.id?.toString()}\n`
  + `For Materials : \n`
  + `----- ${mat1quantity} of ${mat1}\n`
  if(mat2quantity) msg += `----- ${mat2quantity} of ${mat2}\n`;
  if(mat3quantity) msg += `----- ${mat3quantity} of ${mat3}\n`;
  if(mat4quantity) msg += `----- ${mat4quantity} of ${mat4}\n`;
  if(mat5quantity) msg += `----- ${mat5quantity} of ${mat5}\n`;
  msg += `Estimated Cost: $${estimate?.toString()} \n`;

  try {
    response = ui.alert(
      boxTitle,
      msg,
      Browser.Buttons.YES_NO_CANCEL
    );
    if (response == ui.Button.YES) {      
      const order = await shopify.CreateOrder({
        id : id, 
        email : email,
        material1Name : mat1, material1Quantity : mat1quantity,
        material2Name : mat2, material2Quantity : mat2quantity,
        material3Name : mat3, material3Quantity : mat3quantity,
        material4Name : mat4, material4Quantity : mat4quantity,
        material5Name : mat5, material5Quantity : mat5quantity, 
      });
      SheetService.SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.billed);
      let lastOrder =  JSON.stringify(order, null, 4);
      console.info(lastOrder);
      ui.alert(
        boxTitle,
        `Student has been successfully billed on Shopify for $${estimate?.toString()}`,
        Browser.Buttons.OK,
      );
    } 
    else if(response === ui.Button.NO || response === ui.Button.CANCEL) {
      console.warn(`User clicked "No / Cancel"....\nOrder NOT Created.`);
    }
  } catch (err) {
    console.error(`"BillFromSelected()" failed : ${err}`);
    return 1;
  } 
};


/**
 * Create a pop-up to Create a new Ticket if one is missing.
 */
const PopupCreateTicket = async () => {
  const thisSheet = SpreadsheetApp.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  let response;

  if(!SheetService.IsValidSheet(thisSheet)) {
    const a = ui.alert(
      `${SERVICE_NAME}: Incorrect Sheet!`,
      `Please select from a valid sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.`,
      Browser.Buttons.OK,
    );
    if(a === ui.Button.OK) return;
  } 
  const thisRow = thisSheet.getActiveRange().getRow();
  const rowData = SheetService.GetRowData(thisSheet, thisRow);
  const { ds, id, timestamp, email, name, sid, projectName, sheetName, row } = rowData;
  const x = await new Ticket({
    id : id,
    designspecialist : ds,
    submissiontime : timestamp,
    name : name,
    email : email, 
    projectname : projectName,
    rowData : rowData,
  });
  const t = await x.CreateTicket();
  console.info(t);
  
  SheetService.SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, t.getUrl());
  response = ui.alert(
    `${SERVICE_NAME} : Ticket Created!`,
    `Ticket Created for : ${name}, Job Number : ${id}`,
    ui.ButtonSet.OK
  );
  if(response === ui.Button.OK) return;
};

/**
 * Builds HTML file for the modal pop-up from the help list.
 */
const BuildHTMLHELP = () => {
  let items = [
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
    `If the student needs to be waitlisted for more information or space, choose 'Waitlisted'. `,
    `'Missing Access' will be set automatically, and you should not choose this as an option.`,
  ];
  let html = `<h2 style="text-align:center"><b> HELP MENU </b></h2>`
  + `<h3 style="font-family:Roboto">How to Use ${SERVICE_NAME} : </h3>`
  + `<hr>`
  + `<p>Note : All status changes trigger an email to the student except for 'CLOSED' status</p>`
  + `<ol style="font-family:Roboto font-size:10">`;
  items.forEach(item => html += `<li>${item}</li>`);
  html += `</ol>`;
  html += `<p>See Cody or Chris for additional help / protips.</p>`;

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
  ui.showModalDialog(htmlOutput, `${SERVICE_NAME} HELP!!`);
};

/**
 * Builds our JPS Menu and sets functions.
 */
const BarMenu = () => {
  SpreadsheetApp.getUi()
    .createMenu(`JPS Menu`)
      .addItem(`Bill SELECTED User`, `BillFromSelected`)
      .addItem(`Create a New ID for SELECTED User`, `PopupCreateNewID`)
      .addItem(`Create a Ticket for SELECTED User`, `PopupCreateTicket`)
      .addItem(`Check Access for SELECTED User`, `PopupGetSingleStudentPriority`)
      .addSeparator()
      .addItem(`Check All Missing Access Users`, `PopupCheckMissingAccessStudents`)
      .addSeparator()
      .addSubMenu(
        SpreadsheetApp.getUi()
          .createMenu(`Calculate`)
          .addItem(`Count Active Users`, `PopupCountUsers`)
          .addItem(`Generate Metrics`, `Metrics`)
          .addItem(`Generate Top Ten`, `RunTopTen`)
          .addItem(`Generate Standard Deviation`, `RunStandardDeviation`)
      )
      .addSeparator()
      .addSubMenu(
        SpreadsheetApp
          .getUi()
          .createMenu(`Chris & Cody ONLY`)
          .addItem(`DO NOT USE THESE FUNCTIONS UNLESS YOU ARE CHRIS OR CODY!`, `PopupHelp`)
          .addItem(`ENABLE JPS`, `EnableJPS`)
          .addItem(`DISABLE JPS`, `DisableJPS`)
          .addItem(`Update Start and End Dates`, `PrintServiceDates`)
          .addItem(`Reset Conditional Formatting`, `SetConditionalFormatting`)
      )
      .addSeparator()
      .addItem(`Help`, `PopupHelp`)
      .addToUi();
};

const RunStandardDeviation = () => Calculate.GetUserSubmissionStandardDeviation();
const RunTopTen = () => Calculate.CreateTopTen();




/**
 * Open the Barcode Tab
 * @DEFUNCT
 *
const OpenBarcodeTab = async () => SpreadsheetApp
  .getActiveSpreadsheet()
  .setActiveSheet(OTHERSHEETS.Pickup)
  .getRange(`B3`)
  .activate();
*/