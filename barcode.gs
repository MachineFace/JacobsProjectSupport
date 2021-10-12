
/**
 * Generate a barcode png image from a jobnumber.
 * Documentation at "https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API"
 */



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

/**
 * For use with barcode scanner.
 * Searches for job number found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
 * 
 */
const PickupByBarcode = () => {
  const searchUISheet = SpreadsheetApp.getActive().getSheetByName('Pickup');
  const jobnumber = searchUISheet.getRange(3,2).getValue();
  let progress = searchUISheet.getRange(4,2);

  progress.setValue(`Searching for job number...`);
  if (jobnumber == null || jobnumber == "") {
    progress.setValue(`No job number provided. Select the yellow cell, scan, then press enter to make sure the cell's value has been changed.`);
    return;
  }

  // loop through sheets to look for value
  for (const [key, value] of Object.entries(SHEETS)) {
    const searchSheet = SHEETS[key];
    // const data = searchSheet.getDataRange().getValues();
    const textFinder = searchSheet.createTextFinder(jobnumber);
    const searchFind = textFinder.findNext();
    if (searchFind != null) {
      searchRow = searchFind.getRow();
      
      // change status to picked up
      setByHeader(searchSheet, "(INTERNAL) Status", searchRow, STATUS.pickedUp);
      progress.setValue(`Job number ${jobnumber} marked as picked up. Sheet: ${searchSheet.getSheetName()} row: ${searchRow}`);
      Logger.log(`Job number ${jobnumber} marked as picked up. Sheet: ${searchSheet.getSheetName()} row: ${searchRow}`);
      //var ui = SpreadsheetApp.getUi();
      //ui.alert("Job marked as picked up. Job located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
      return;
    }
  }
  progress.setValue('Job number not found. Try again.');
} 

// const SearchByBarcode = (jobnumber, range) => {
    // let d = OTHERSHEETS.backgrounddata.getRange('V2:V').getValues();
//     for(let i = 0; i < d.length; i++){ 
//         if(d[i] != '' && d[i] != null && d[i] != undefined && d[i] != ' ') {
//             people.push(d[i]); 
//         }
//     }
//     Logger.log(`People : ${people.toString()}`); 
// }










/**
 * Generate a QR code from some data. Feed it a url.
 * @param {string} url
 * @pararm {string} jobnumber
 * @return
 */
class QRCodeAndBarcodeGenerator {
  constructor(
    {
      url = 'jps.jacobshall.org/', 
      jobnumber = Math.floor(Math.random() * 100000).toFixed(),
    }) {
    this.url = url;
    this.jobnumber = jobnumber;
  }

  GenerateQRCode(){
    Logger.log(`URL : ${this.url}, Jobnumber || RNDNumber : ${this.jobnumber}`);
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${this.url}`;  //API call
    const postParams = {
        "method" : "GET",
        "headers" : { "Authorization" : "Basic" },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };

    let qrCode;
    const html = UrlFetchApp.fetch(loc, postParams);
    Logger.log(`Response Code : ${html.getResponseCode()}`);
    if (html.getResponseCode() == 200) {
        qrCode = DriveApp.createFile( Utilities.newBlob(html.getContent()).setName('QRCode' + this.jobnumber ) );
        qrCode.setTrashed(true);
    }
    else Logger.log('Failed to GET QRCode');

    Logger.log(qrCode);
    return qrCode;
  }

  GenerateBarCode() {

    const root = 'http://bwipjs-api.metafloor.com/';
    const rootsec = 'https://bwipjs-api.metafloor.com/';
    const type = '?bcid=code128';
    const ts = '&text=';
    const scale = '&scale=0.75'
    const postfx = '&includetext';

    //let barcodeLoc = 'http://bwipjs-api.metafloor.com/?bcid=code128&text=1234567890&includetext';  //KNOWN WORKING LOCATION
    const barcodeLoc = root + type + ts + this.jobnumber + scale +postfx;

    const params = {
        "method" : "GET",
        "headers" : { "Authorization": "Basic ", "Content-Type" : "image/png" },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    let barcode;

    let html = UrlFetchApp.fetch(barcodeLoc, params);
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {

        barcode = DriveApp.createFile( Utilities.newBlob(html.getContent()).setName(`Barcode : ${this.jobnumber}`) );
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
  
}








