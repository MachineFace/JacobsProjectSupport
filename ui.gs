//Build HTML for MaterialMenu()
function BuildHTMLMenu() {
    let last = materialDict.advlab.getLastRow() - 1;
    let materialList = materialDict.advlab.getRange(2, 1, last, 1).getValues();
    Logger.log(materialList);

    let html = '<label for="Material 1">Choose a Material:</label> <br/>';
        html += '<select name="Material 1" id="Material 1">';
        materialList.forEach(item => html +='   <option value="' + item + '">' + item + '</option>');
        html += '</select>';
   html += '<label for="Material 2">Choose a Material:</label> <br/>';
        html += '<select name="Material 2" id="Material 2">';
        materialList.forEach(item => html +='   <option value="' + item + '">' + item + '</option>');
        html += '</select>';
    Logger.log(html);
    return html;
}

//Popup for Materials
function MaterialMenu() {

    let ui = SpreadsheetApp.getUi();
    // Display a modal dialog box with custom HtmlService content.
    var htmlOutput = HtmlService
        .createHtmlOutput(BuildHTMLMenu())
        .setWidth(640)
        .setHeight(480);
    let modal = ui.showModalDialog(htmlOutput, 'JPS Material Selector');

}

function PopupCountUsers() {
    let title = 'JPS Runtime Message';
    let msg = 'Students Currently Using JPS: \\n \\n';
    let count = CountActiveUsers();
    SpreadsheetApp.getUi()
      .alert(title, msg + count, ui.ButtonSet.OK);
}


function BarMenu() {
    let ui = SpreadsheetApp.getUi()
      .createMenu('JPS Menu')
      .addItem('Generate Bill to Selected Student', 'BillFromSelected')
      .addSeparator()
      .addItem('Count Users', 'PopupCountUsers')
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Calculate')
          .addItem('Generate Metrics', 'Metrics')
          .addItem('Generate Distribution', 'CalculateDistribution')
          .addItem('Generate Standard Deviation', 'CalculateStandardDeviation'))
          .addSeparator()
          .addItem('How to use JPS', 'helpJPS')
      //.addSeparator()
      //.addSubMenu(SpreadsheetApp.getUi().createMenu('Chris + Cody ONLY')
      //    .addItem('ENABLE JPS', 'EnableJPS')
      //    .addItem('DISABLE JPS', 'DisableJPS'))
      .addToUi();
}

function BillFromSelected() {    
    
    //Could use a couple checks.  Cant be row 1 that is selected, and cant be more than one row selected.
    //also check that its not the summary page
    
    //let vv = SpreadsheetApp.getActiveSheet().getActiveCell().getValue(); //gets value of selected cell
    let range = SpreadsheetApp.getActiveSheet().getActiveRange();
    var ss = range.getSheet();
    let sheetname = SpreadsheetApp.getActiveSheet().getName();
    let thisRow = range.getRow();

    if (sheetname=="Ultimaker" || sheetname=="Laser Cutter" || sheetname=="Fablight" || sheetname=="Waterjet" || sheetname=="Advanced Lab" || sheetname=="Shopbot" || sheetname=="Haas & Tormach" || sheetname=="Vinyl Cutter" || sheetname=="Othermill" || sheetname=="Other Tools" || sheetname=="Canon Plotter") {
        
        //If It is on a valid sheet

        var status = getByHeader("(INTERNAL) Status", thisRow); 
        Logg("status of billed row = " + status);  
        var jobnumber = getByHeader("(INTERNAL AUTO) Job Number", thisRow);
        var email = getByHeader("Email Address", thisRow);
        var name = getByHeader("What is your name?", thisRow); 
        //var sid = getByHeader("Student ID Number", thisRow);
        //var projectname = getByHeader("Project Name", thisRow);
        var cost = getByHeader("Estimate", thisRow); 

        //Materials
        var material1Quantity = ss.getRange(thisRow, 13).getValue();
        var material1Name = ss.getRange(thisRow, 14).getValue();
        var material1URL = new LookupProductID(material1Name).link;

        var material2Quantity = ss.getRange(thisRow, 15).getValue();
        var material2Name = ss.getRange(thisRow, 16).getValue();
        var material2URL = new LookupProductID(material2Name).link;

        //Use the right Column Later once we decide on location.

        var material3Quantity = ss.getRange(thisRow, 17).getValue();
        var material3Name = ss.getRange(thisRow, 18).getValue();
        //var material3URL = new LookupProductID(material3Name).link;

        var material4Quantity = ss.getRange(thisRow, 19).getValue();
        var material4Name = ss.getRange(thisRow, 20).getValue();
        //var material4URL = new LookupProductID(material4Name).link;

        var material5Name = ss.getRange(thisRow, 22).getValue();
        var material5Quantity = ss.getRange(thisRow, 21).getValue(); 
        //var material5URL = new LookupProductID(material5Name).link;
        
        //Add total quantities - if there are none then cancel billing
        let quantityTotal = material1Quantity + material2Quantity + material3Quantity + material4Quantity + material5Quantity;

        if (quantityTotal==0 || quantityTotal==undefined || quantityTotal=="") {
            //No quantity entered, msg saying so
            Logg("Cannot bill - no quantity recorded");
            let boxMsg = 'No quantities entered for selected submission.';
            let boxTitle = 'Generate Bill to Shopify';
            response = Browser.msgBox(boxTitle, boxMsg, Browser.Buttons.OK);
        } else {
            
        
            if(status == 'Billed' || status == 'CLOSED') {
                var boxMsg = 'You have already Generated a bill to this Student';
                var boxTitle = 'Generate Bill to Shopify';
                response = Browser.msgBox(boxTitle, boxMsg, Browser.Buttons.OK);
                if (response == "OK") {
                    Logger.log('User clicked "OK".');
                    ss.getRange('AZ' + thisRow).setValue(false);
                }
            }
            else if(status != 'Billed') {
                var response;

                //Check for Staff
                let staffEmails = sheetDict.staff.getRange(2, 3, sheetDict.staff.getLastRow() -1, 1).getValues();
                for(var i = 0; i < staffEmails.length; i++) {
                    if(email == staffEmails[i]) {
                        email = 'JacobsInstituteStore@gmail.com';
                        break;
                    }
                }

                //Fetch Customer and Products
                var customer = GetShopifyCustomerByEmail(email);
                var package = new PackageMaterials(material1Name, material1Quantity, material2Name, material2Quantity, material3Name, material3Quantity, material4Name, material4Quantity, material5Name, material5Quantity);
                var formattedMats = new MakeLineItems(package);


                var boxTitle = 'Generate Bill to Shopify';
                var boxMsg = 'Would you like to Generate a Bill to: \\n\\n';
                boxMsg += 'Customer Name : ' + customer.first_name + ' ' + customer.last_name + '\\n';
                boxMsg += 'Job Number : ' + jobnumber + '\\n';
                boxMsg += 'Shopify ID : ' + customer.id + '\\n';
                boxMsg += 'For Materials : \\n\\n';

                //Lists (Pushing at the same time ensures the lists are the same size.)
                let materialList = [material1Name, material2Name, material3Name, material4Name, material5Name];
                let quantityList = [material1Quantity, material2Quantity, material3Quantity, material4Quantity, material5Quantity];

                //Remove when Those are empty / null / undefined
                for(let i = 0; i <= materialList.length + 1; i++) {
                    if(materialList[i] == null || materialList[i] == undefined || materialList[i] == '' || materialList[i] == ' ') {
                        materialList.splice(i);
                        quantityList.splice(i);
                    }
                }
                for(let i = 0; i < materialList.length; i++) {
                    boxMsg += i+1 + '.   ' + quantityList[i] + ' of ' + materialList[i] + '\\n';
                }

                //Make a nessage box
                try {
                    response = Browser.msgBox(boxTitle, boxMsg, Browser.Buttons.YES_NO_CANCEL);
                    if (response == "yes") {
                        Logger.log('User clicked "Yes".');
                        var order = new CreateShopifyOrder(customer, jobnumber, package, formattedMats);
                        //ss.getRange('AZ' + thisRow).setValue(false);
                        ss.getRange('A' + thisRow).setValue('Billed');
                        Logger.log(order.toString());
                        Browser.msgBox(boxTitle, 'Student has been successfully billed on Shopify!\\n' + GetLastShopifyOrder(), Browser.Buttons.OK);
                    }
                    else {
                        Logger.log('User clicked "No / Cancel".');
                        Logger.log('Order NOT Created.');
                        //ss.getRange('AZ' + thisRow).setValue(false);
                    }
                }
                catch(err) {
                    Logger.log(err + ' : Could not generate a message box to gather info.');
                }
                finally {
                    ss.getRange('AZ' + thisRow).setValue(false);
                }

            }
        }
    } else {
        //Selected Bill on an invalid sheet
        let boxMsg = 'Please bill in the correct sheet (eg. Laser Cutter or Fablight). Select one cell in the row associated with the job being billed';
        let boxTitle = 'Incorrect Sheet Active';
        response = Browser.msgBox(boxTitle, boxMsg, Browser.Buttons.OK);
        //Display a msg box saying 'Please bill in the correct sheet. Select one cell in the row associated with the job being billed'
        
        
    }
  
    

    Logger.log('Completed BillFromSelected');
}

function helpJPS() {
    //go to some kind of help file that breaks down using JPS, step by step.
}