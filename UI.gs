
/**
 * Creates a pop-up for counting users.
 */
const PopupCountUsers = async () => {
  let ui = await SpreadsheetApp.getUi();
  let count = await CountActiveUsers();
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
  let ui = await SpreadsheetApp.getUi();
  let names = await CheckMissingAccessStudents().join(", ");
  ui.alert(
    `JPS Runtime Message`,
    `Checking Missing Access Students on All Sheets : \\n ${names}`,
    ui.ButtonSet.OK
  );
};

/**
 * Create a pop-up to Create a new Ticket if one is missing.
 */
const PopupCreateTicket = async () => {
  let ui = SpreadsheetApp.getUi();

  let thisSheet = SpreadsheetApp.getActiveSheet();
  let ss = thisSheet.getActiveRange().getSheet();
  let sheetname = thisSheet.getName();
  let thisRow = thisSheet.getActiveRange().getRow();
  let jobnumber = getByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow);

  // If It is on a valid sheet
  // for(const [key, sheet] of Object.entries(NONITERABLESHEETS)) {
  //   if(thisSheet === sheet) {
  //     Browser.msgBox(
  //       "Incorrect Sheet Active",
  //       "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
  //       Browser.Buttons.OK
  //     );
  //     return;
  //   }
  // }
  switch (sheetname) {
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
      Browser.msgBox(
        "Incorrect Sheet Active",
        "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
        Browser.Buttons.OK
      );
      return;
  }
  
  const ticketMaker = new Ticket({jobnumber : jobnumber});
  try {
    const ticket = ticketMaker.CreateTicket();
  } catch (err) {
    Logger.log(`${err} : Couldn't create a ticket.`);
  }

  ui.alert(
    `JPS Runtime Message`,
    `Ticket Created for : ${ticketMaker.name}, Job Number : ${jobnumber}`,
    ui.ButtonSet.OK
  );
};

/**
 * Builds HTML file for the modal pop-up from the help list.
 */
const BuildHTMLHELP = () => {
  let items = Help();
  let html = '<h2 style="text-align:center"><b> HELP MENU </b></h2>';
  html += '<h3 style="font-family:Roboto">How to Use JPS : </h3>';
  html += "<hr>";
  html += "<p>" + items[0] + "</p>";
  html += '<ol style="font-family:Roboto font-size:10">';
  items.forEach((item, index) => {
    if (index > 0 && index < items.length - 1) {
      html += "<li>" + item + "</li>";
    }
  });
  html += "</ol>";
  html += "<p>" + items[items.length - 1] + "</p>";

  Logger.log(html);
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
    .addItem("Barcode Scanning Tool", "OpenBarcodeTab")
    .addSeparator()
    .addItem(
      "Check All Missing Access Students",
      "PopupCheckMissingAccessStudents"
    )
    .addSeparator()
    .addItem("Count Active Users", "PopupCountUsers")
    .addItem(`Create a Ticket for a User`, `PopupCreateTicket`)
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu("Calculate")
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

const RunStandardDeviation = () => {
  const calc = new Calculate();
  return calc.CalculateStandardDeviation();
}
const RunTopTen = () => {
  const calc = new Calculate();
  return calc.CreateTopTen();
}


/**
 * Bill from a selected line
 */
const BillFromSelected = async () => {
  //Could use a couple checks.  Cant be row 1 that is selected, and cant be more than one row selected.
  //also check that its not the summary page

  //let vv = SpreadsheetApp.getActiveSheet().getActiveCell().getValue(); //gets value of selected cell
  let thisSheet = SpreadsheetApp.getActiveSheet();
  let range = thisSheet.getActiveRange();
  let ss = thisSheet.getActiveRange().getSheet();
  let sheetname = thisSheet.getName();
  let thisRow = thisSheet.getActiveRange().getRow();

  //If It is on a valid sheet
  switch (sheetname) {
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
      Browser.msgBox(
        "Incorrect Sheet Active",
        "Please bill in the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row associated with the job being billed",
        Browser.Buttons.OK
      );
      return;
  }

  let status = getByHeader(thisSheet, "(INTERNAL) Status", thisRow);
  Logger.log(`Status of billed row = ${status}`);
  let jobnumber = getByHeader(thisSheet, "(INTERNAL AUTO) Job Number", thisRow);
  let email = getByHeader(thisSheet, "Email Address", thisRow);
  let name = getByHeader(thisSheet, "What is your name?", thisRow);
  //let sid = getByHeader(thisSheet, "Student ID Number", thisRow);
  //let projectname = getByHeader(thisSheet, "Project Name", thisRow);
  Logger.log(`STATUS : ${status}, JOBNUMBER : ${jobnumber}, EMAIL : ${email}, NAME : ${name}`)

  //Materials
  // let material1Quantity = ss.getRange(thisRow, 13).getValue();
  // let material1Name = ss.getRange(thisRow, 14).getValue();
  // let material1URL = await new LookupProductID(material1Name).link;
  let material1Quantity = getByHeader(
    thisSheet,
    "(INTERNAL) Material 1 Quantity",
    thisRow
  );
  let material1Name = getByHeader(thisSheet, "(INTERNAL) Item 1", thisRow);
  //let material1URL = await new LookupProductID(material1Name).link;

  // let material2Quantity = ss.getRange(thisRow, 15).getValue();
  // let material2Name = ss.getRange(thisRow, 16).getValue();
  let material2Quantity = getByHeader(
    thisSheet,
    "(INTERNAL) Material 2 Quantity",
    thisRow
  );
  let material2Name = getByHeader(thisSheet, "(INTERNAL) Item 2", thisRow);

  //if(material2Name !== null || material2Name !== 'undefined') {
  //   let material2URL = await new LookupProductID(material2Name).link;
  //}

  //Use the right Column Later once we decide on location.

  // let material3Quantity = ss.getRange(thisRow, 17).getValue();
  // let material3Name = ss.getRange(thisRow, 18).getValue();
  let material3Quantity = getByHeader(
    thisSheet,
    "(INTERNAL) Material 3 Quantity",
    thisRow
  );
  let material3Name = getByHeader(thisSheet, "(INTERNAL) Item 3", thisRow);

  if (material3Name !== null || material3Name !== "undefined") {
  }
  //let material3URL = new LookupProductID(material3Name).link;

  // let material4Quantity = ss.getRange(thisRow, 19).getValue();
  // let material4Name = ss.getRange(thisRow, 20).getValue();
  let material4Quantity = getByHeader( thisSheet, "(INTERNAL) Material 4 Quantity", thisRow );
  let material4Name = getByHeader(thisSheet, "(INTERNAL) Item 4", thisRow);
  //let material4URL = new LookupProductID(material4Name).link;

  // let material5Name = ss.getRange(thisRow, 22).getValue();
  // let material5Quantity = ss.getRange(thisRow, 21).getValue();
  let material5Quantity = getByHeader( thisSheet, "(INTERNAL) Material 5 Quantity", thisRow );
  let material5Name = getByHeader(thisSheet, "(INTERNAL) Item 5", thisRow);
  //var material5URL = new LookupProductID(material5Name).link;

  //Add total quantities - if there are none then cancel billing
  let quantityTotal = material1Quantity + material2Quantity + material3Quantity + material4Quantity + material5Quantity;

  if (quantityTotal == 0 || quantityTotal == undefined || quantityTotal == "") {
    Logger.log(`Cannot bill - no quantity recorded`);

    Browser.msgBox(
      "Generate Bill to Shopify",
      "No quantities entered for selected submission.",
      Browser.Buttons.OK
    );
  } else {
    if (status == "Billed" || status == "CLOSED") {
      response = Browser.msgBox(
        "Generate Bill to Shopify",
        "You have already Generated a bill to this Student",
        Browser.Buttons.OK
      );
      if (response == "OK") {
        Logger.log(`User clicked "OK".`);
        await ss.getRange("AZ" + thisRow).setValue(false);
      }
    } else if (status != "Billed") {
      let response;

      // //Check for Staff
      // let staffEmails = OTHERSHEETS.staff
        // .getRange(2, 3, OTHERSHEETS.staff.getLastRow() - 1, 1)
      //   .getValues();
      // for (let i = 0; i < staffEmails.length; i++) {
      //   if (email == staffEmails[i]) {
      //     email = "JacobsInstituteStore@gmail.com";
      //     break;
      //   }
      // }

      //Fetch Customer and Products
      const customer = await GetShopifyCustomerByEmail(email);
      if (customer == undefined || customer == null) {
        Browser.msgBox(
          "Shopify Error",
          "The Shopify customer was not found",
          Browser.Buttons.OK
        );
      } else {
        const package = await PackageMaterials(
          material1Name,
          material1Quantity,
          material2Name,
          material2Quantity,
          material3Name,
          material3Quantity,
          material4Name,
          material4Quantity,
          material5Name,
          material5Quantity
        );
        const formattedMats = await MakeLineItems(package);

        var boxTitle = `Generate Bill to Shopify`;
        var boxMsg = `Would you like to Generate a Bill to: \\n\\n`;
        boxMsg += `Customer Name : ${customer.first_name} ${customer.last_name} \\n`;
        boxMsg += `Job Number : ${jobnumber} \\n`;
        boxMsg += `Shopify ID : ${customer.id} \\n`;
        boxMsg += `For Materials : \\n\\n`;

        //Lists (Pushing at the same time ensures the lists are the same size.)
        let materialList = [
          material1Name,
          material2Name,
          material3Name,
          material4Name,
          material5Name,
        ];
        let quantityList = [
          material1Quantity,
          material2Quantity,
          material3Quantity,
          material4Quantity,
          material5Quantity,
        ];

        //Remove when Those are empty / null / undefined
        for (let i = 0; i <= materialList.length + 1; i++) {
          if (
            materialList[i] == null ||
            materialList[i] == undefined ||
            materialList[i] == "" ||
            materialList[i] == " "
          ) {
            materialList.splice(i);
            quantityList.splice(i);
          }
        }
        for (let i = 0; i < materialList.length; i++) {
          boxMsg += `${i + 1}.   ${quantityList[i]} of ${materialList[i]} \\n`;
        }

        //Make a nessage box
        try {
          response = Browser.msgBox(
            boxTitle,
            boxMsg,
            Browser.Buttons.YES_NO_CANCEL
          );
          if (response == "yes") {
            Logger.log('User clicked "Yes".');
            const order = await CreateShopifyOrder(
              customer,
              jobnumber,
              package,
              formattedMats
            );
            //ss.getRange('AZ' + thisRow).setValue(false);
            await ss.getRange("A" + thisRow).setValue("Billed");
            Logger.log(order.toString());
            let lastOrder = await GetLastShopifyOrder();
            Browser.msgBox(
              boxTitle,
              "Student has been successfully billed on Shopify!\\n" + lastOrder,
              Browser.Buttons.OK
            );
          } else {
            Logger.log('User clicked "No / Cancel".');
            Logger.log("Order NOT Created.");
          }
        } catch (err) {
          Logger.log(`${err} : Could not generate a message box to gather info.`);
        } finally {
          ss.getRange("AZ" + thisRow).setValue(false);
        }
      }
    }
  }

  Logger.log("Completed BillFromSelected");
};


const OpenBarcodeTab = async () => {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const searchUISheet = SpreadsheetApp.getActive().getSheetByName('Pickup');
  spreadsheet.setActiveSheet(searchUISheet).getRange('B3').activate();
}


// const _t = () => {
//   const thisSheet = SpreadsheetApp.getActiveSheet();
//   for(const [key, sheet] of Object.entries(NONITERABLESHEETS)) {
//     if(thisSheet == sheet) {
//       Browser.msgBox(
//         "Incorrect Sheet Active",
//         "Please select from the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row and a ticket will be created.",
//         Browser.Buttons.OK
//       );
//       return;
//     }
//   }
// }






