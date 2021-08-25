
/**
 * Generate a barcode png image from a jobnumber.
 * Documentation at "https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API"
 */

 const submissionSheetDict = {
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
};
const GenerateBarCode = (jobnumber) => {

    //jobnumber = "20210301140515";   //Test JobNumber
    //jobnumber = 20210224175306;

    //Access Tokens
    let root = 'http://bwipjs-api.metafloor.com/';
    let rootsec = 'https://bwipjs-api.metafloor.com/';
    let type = '?bcid=code128';
    let ts = '&text=';
    let scale = '&scale=0.75'
    let postfx = '&includetext';

    //let barcodeLoc = 'http://bwipjs-api.metafloor.com/?bcid=code128&text=1234567890&includetext';  //KNOWN WORKING LOCATION

    let barcodeLoc = root + type + ts + jobnumber + scale +postfx;

    //Params
    let params = {
        "method" : "GET",
        "headers" : { "Authorization": "Basic ", "Content-Type" : "image/png" },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    let barcode;

    //Fetch Barcode
    let res = UrlFetchApp.fetch(barcodeLoc, params);
    Logger.log("Response Code : " + res.getResponseCode());
    if (res.getResponseCode() == 200) {

        barcode = DriveApp.createFile( Utilities.newBlob(res.getContent()).setName('Barcode' + jobnumber ) );
        barcode.setTrashed(true);

        // var meta = Drive.Files.get(file.getId()).imageMediaMetadata;
        // let embed = Drive.Files.get(file.getId()).embedLink; 

        // GmailApp.sendEmail('codyglen@berkeley.edu', 'JPSY : Barcode', '', {
        //     htmlBody: embed,
        //     'from': 'jacobsprojectsupport@berkeley.edu',
        //     'name': 'JPSY'
        // });

    } 
    else Logger.log('Failed to GET Barcode');

    Logger.log(barcode);
    return barcode;

}



/**
 * Generate a QR code from some data. Feed it a url.
 * @param {string} url
 * @return
 */
const GenerateQRCode = (url, jobnumber) => {

    if(url === null || url === undefined) {
         url = 'jps.jacobshall.org/';
    }
    if(jobnumber == null || jobnumber == undefined) {
         jobnumber = Math.floor(Math.random() * 100000).toFixed()
    }
    Logger.log(`URL : ${url}, Jobnumber || RNDNumber : ${jobnumber}`);

    let loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${url}`;  //API call
    
    //Stuff payload into postParams
    let postParams = {
        "method" : "GET",
        "headers" : { "Authorization" : "Basic" },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };

    //Fetch QR Code
    let qrCode;
    let res = UrlFetchApp.fetch(loc, postParams);
    Logger.log(`Response Code : ${res.getResponseCode()}`);
    if (res.getResponseCode() == 200) {
        qrCode = DriveApp.createFile( Utilities.newBlob(res.getContent()).setName('QRCode' + jobnumber ) );
        qrCode.setTrashed(true);
    }
    else Logger.log('Failed to GET QRCode');

    Logger.log(qrCode);
    return qrCode;

}


const PickupByBarcode = () => {
    //Search each sheet for jobnumber
    //return sheet and row number
    //change status of that row to 'Picked Up'
    var sh = SpreadsheetApp.getActiveSpreadsheet();
    var searchUISheet = SpreadsheetApp.getActive().getSheetByName('SearchByBarcode');
    var jobnumber = searchUISheet.getRange(2,2).getValue();
    var titleRow = 1;

    //create array with sheets in active spreadsheet
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();  

    //loop through sheets to look for value
    //for(var i in sheetDict) {
    for (const [key, value] of Object.entries(submissionSheetDict)) {

        //SpreadsheetApp.setActiveSheet(submissionSheetDict[key])
        let searchSheet = submissionSheetDict[key];
        let data = searchSheet.getDataRange().getValues();
        let col = data[0].indexOf('(INTERNAL AUTO) Job Number');
        //var searchResult = col.findIndex(jobnumber); //Row Index - 2
        var textFinder = searchSheet.createTextFinder(jobnumber);
        
        var searchFind = textFinder.findNext();
        if (searchFind != null) {
            searchRow = searchFind.getRow();
            //searchResult + 2 is row index.
            
            // change status to picked up
            setByHeader(searchSheet, "(INTERNAL) Status", searchRow, STATUS.pickedUp);
            //var ui = SpreadsheetApp.getUi();
            //ui.alert("Job marked as picked up. Job located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
            Logger.log("Job number " + jobnumber + " marked as picked up. Sheet: " + searchSheet.getSheetName() + " row: " + searchRow);
            return;
        }

       
        
    }
} 

// const SearchByBarcode = (jobnumber, range) => {
//     let d = sheetDict.backgrounddata.getRange('V2:V').getValues();
//     for(let i = 0; i < d.length; i++){ 
//         if(d[i] != '' && d[i] != null && d[i] != undefined && d[i] != ' ') {
//             people.push(d[i]); 
//         }
//     }
//     Logger.log(`People : ${people.toString()}`); 
// }