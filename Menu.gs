/** 
 * Creates a pop-up for counting users.
 */
const PopupCountUsers = async () => {
  const ui = await SpreadsheetApp.getUi();
  const count = await CountActiveUsers();
  ui.alert(
    `JPS Runtime Message`,
    `Students Currently Using JPS : ${count}`,
    ui.ButtonSet.OK
  );
};

/**
 * Create a pop-up to check for missing students
 */
const PopupCheckMissingAccessStudents = async () => {
  const ui = await SpreadsheetApp.getUi();
  const names = await CheckMissingAccessStudents().join(", ");
  ui.alert(
    `JPS Runtime Message`,
    `Checking Missing Access Students on All Sheets : \\n ${names}`,
    ui.ButtonSet.OK
  );
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
      "Incorrect Sheet Active",
      "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
      Browser.Buttons.OK
    );
    return;
  } else {
    const timestamp = GetByHeader(thisSheet, HEADERNAMES.timestamp, thisRow);
    const jobnumber = new JobNumberGenerator(timestamp).jobnumber;
    SetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow, jobnumber.toString());
    ui.alert(
      `JPS Runtime Message`,
      `Created a New Jobnumber : ${jobnumber}`,
      ui.ButtonSet.OK
    );
  }
  
  

};

/**
 * Create a pop-up to Create a new Ticket if one is missing.
 */
const PopupCreateTicket = async () => {
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let ui = SpreadsheetApp.getUi();
  if(CheckSheetIsForbidden(thisSheet) == true) {
    Browser.msgBox(
      "Incorrect Sheet Active",
      "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
      Browser.Buttons.OK
    );
    return;
  } else {
    let thisRow = thisSheet.getActiveRange().getRow();
    let jobnumber = GetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow);
    let data = await GetRowData(thisSheet, thisRow);
    let ticket = await new Ticket({
      jobnumber : jobnumber,
      designspecialist : data.ds,
      submissiontime : data.timestamp,
      name : data.name,
      email : data.email,
      projectname : data.projectName,
      material1Name : data.material1Name,
      material1Quantity : data.material1Quantity,
      material2Name : data.material2Name,
      material2Quantity : data.material2Quantity,
    });
    let t = await ticket.CreateTicket();
    SetByHeader(thisSheet, HEADERNAMES.ticket, thisRow, t.getUrl());
    ui.alert(
      `JPS Runtime Message`,
      `Ticket Created for : ${data?.name}, Job Number : ${jobnumber}`,
      ui.ButtonSet.OK
    );
  }
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
  let title = "JPS Runtime HELP";
  let htmlOutput = HtmlService.createHtmlOutput(await BuildHTMLHELP())
    .setWidth(640)
    .setHeight(480);
  ui.showModalDialog(htmlOutput, title);
};

/**
 * Builds our JPS Menu and sets functions.
 */
const BarMenu = () => {
  SpreadsheetApp.getUi()
    .createMenu("JPS Menu")
    .addItem("Generate Bill to Selected Student", "BillFromSelected")
    .addItem("Generate a New JobNumber", "PopupCreateNewJobNumber")
    .addSeparator()
    .addItem("Barcode Scanning Tool", "OpenBarcodeTab")
    .addSeparator()
    .addItem("Check All Missing Access Students", "PopupCheckMissingAccessStudents")
    .addSeparator()
    .addItem("Count Active Users", "PopupCountUsers")
    .addItem(`Create a Ticket for a User`, `PopupCreateTicket`)
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu("Calculate")
        .addItem("Count Total Emails Sent", "CountTotalEmailsSent")
        .addItem("Generate Metrics", "Metrics")
        .addItem("Generate Top Ten", "RunTopTen")
        .addItem("Generate Standard Deviation", "RunStandardDeviation")
    )
    .addSeparator()
    .addItem("Help", "PopupHelp")
    //.addSeparator()
    //.addSubMenu(SpreadsheetApp.getUi().createMenu('Chris + Cody ONLY')
    //    .addItem('ENABLE JPS', 'EnableJPS')
    //    .addItem('DISABLE JPS', 'DisableJPS'))
    .addToUi();
};

const RunStandardDeviation = () => new Calculate().CalculateStandardDeviation();
const RunTopTen = () => new Calculate().CreateTopTen();


/**
 * Bill from a selected line
 */
const BillFromSelected = async () => {
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let sheetname = thisSheet.getName();
  let thisRow = thisSheet.getActiveRange().getRow();

  if(CheckSheetIsForbidden(thisSheet) == true) {
    Browser.msgBox(
      "Incorrect Sheet Active",
      "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
      Browser.Buttons.OK
    );
    return;
  }

  const status = GetByHeader(thisSheet, HEADERNAMES.status, thisRow);
  const jobnumber = GetByHeader(thisSheet, HEADERNAMES.jobNumber, thisRow);
  const email = GetByHeader(thisSheet, HEADERNAMES.email, thisRow);
  const name = GetByHeader(thisSheet, HEADERNAMES.name, thisRow);
  const material1Quantity = GetByHeader(thisSheet, HEADERNAMES.mat1quantity, thisRow);
  const material1Name = GetByHeader(thisSheet, HEADERNAMES.mat1, thisRow);
  const material2Quantity = GetByHeader(thisSheet, HEADERNAMES.mat2quantity,thisRow);
  const material2Name = GetByHeader(thisSheet, HEADERNAMES.mat2, thisRow);
  const material3Quantity = GetByHeader(thisSheet, HEADERNAMES.mat3quantity, thisRow);
  const material3Name = GetByHeader(thisSheet, HEADERNAMES.mat3, thisRow);
  const material4Quantity = GetByHeader( thisSheet, HEADERNAMES.mat4quantity, thisRow );
  const material4Name = GetByHeader(thisSheet, HEADERNAMES.mat4, thisRow);
  const material5Quantity = GetByHeader( thisSheet, HEADERNAMES.mat5quantity, thisRow );
  const material5Name = GetByHeader(thisSheet, HEADERNAMES.mat5, thisRow);
  const quantityTotal = material1Quantity + material2Quantity + material3Quantity + material4Quantity + material5Quantity;
  console.info(status+jobnumber+email+name+material1Name+material1Quantity+material2Name+material2Quantity+material3Name+material3Quantity+material4Name+material4Quantity+material5Name+material5Quantity+quantityTotal)

  const shopify = await new ShopifyAPI({
    jobnumber : jobnumber, 
    email : email,
    material1Name : material1Name, material1Quantity : material1Quantity,
    material2Name : material2Name, material2Quantity : material2Quantity,
    material3Name : material3Name, material3Quantity : material3Quantity,
    material4Name : material4Name, material4Quantity : material4Quantity,
    material5Name : material5Name, material5Quantity : material5Quantity, 
  });
  const customer = await shopify.GetCustomerByEmail(email);
  console.info(`CUSTOMER : ${JSON.stringify(customer)}`)
  // const order = await shopify.CreateOrder();
  // console.info(`ORDER : ${JSON.stringify(order)}`)
  let response;
  if (quantityTotal == 0 || quantityTotal == undefined || quantityTotal == "") {
    console.warn(`Cannot bill - no quantity recorded`);
    Browser.msgBox(
      "Generate Bill to Shopify",
      "No quantities entered for selected submission.",
      Browser.Buttons.OK
    );
    return;
  } else {
    if (status == STATUS.billed || status == STATUS.closed) {
      Browser.msgBox(
        `Generate Bill to Shopify`,
        `You have already Generated a bill to this Student`,
        Browser.Buttons.OK
      );
      return;
    } else {
      let response;

      // Fetch Customer and Products
      if (customer == undefined || customer == null) {
        Browser.msgBox(
          "Shopify Error",
          "The Shopify customer was not found",
          Browser.Buttons.OK
        );
      } else {
        let boxTitle = `Generate Bill to Shopify`;
        let boxMsg = `Would you like to Generate a Bill to: \\n\\n`;
        boxMsg += `Customer Name : ${customer.first_name} ${customer.last_name} \\n`;
        boxMsg += `Job Number : ${jobnumber} \\n`;
        boxMsg += `Shopify ID : ${customer.id} \\n`;
        boxMsg += `For Materials : \\n • ${material1Quantity} of ${material1Name}\\n`;
        if(material2Quantity) boxMsg += ` • ${material2Quantity} of ${material2Name}\\n`;
        if(material3Quantity) boxMsg += ` • ${material3Quantity} of ${material3Name}\\n`;
        if(material4Quantity) boxMsg += ` • ${material4Quantity} of ${material4Name}\\n`;
        if(material5Quantity) boxMsg += ` • ${material5Quantity} of ${material5Name}\\n`;

        //Make a nessage box
        try {
          response = Browser.msgBox(
            boxTitle,
            boxMsg,
            Browser.Buttons.YES_NO_CANCEL
          );
          if (response == "yes") {
            console.info('User clicked "Yes".');
            
            const order = await shopify.CreateOrder();
            SetByHeader(thisSheet, HEADERNAMES.status, thisRow, STATUS.billed);
            console.info(order.toString());
            let lastOrder = await shopify.GetLastOrder();
            Browser.msgBox(
              boxTitle,
              "Student has been successfully billed on Shopify!\\n" + JSON.stringify(lastOrder),
              Browser.Buttons.OK
            );
          } else {
            console.warn('User clicked "No / Cancel".');
            console.warn("Order NOT Created.");
          }
        } catch (err) {
          console.error(`${err} : Couldn't create an order...`);
        } finally {
          thisSheet.getRange("AZ" + thisRow).setValue(false);
        }
      }
    }
  }

  console.info("Completed BillFromSelected");
};


/**
 * Open the Barcode Tab
 */
const OpenBarcodeTab = async () => SpreadsheetApp
  .getActiveSpreadsheet()
  .setActiveSheet(OTHERSHEETS.Pickup)
  .getRange(`B3`)
  .activate();









