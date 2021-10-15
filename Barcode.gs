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
    this.writer = new WriteLogger();
  }

  async GenerateQRCode(){
    this.writer.Info(`URL : ${this.url}, Jobnumber || RNDNumber : ${this.jobnumber}`);
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${this.url}`;  //API call
    const params = {
      "method" : "GET",
      "headers" : { "Authorization" : "Basic" },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    let qrCode;
    const html = UrlFetchApp.fetch(loc, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code : ${responseCode} ----> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      qrCode = DriveApp.createFile( Utilities.newBlob(html.getContent()).setName('QRCode' + this.jobnumber ) );
      qrCode.setTrashed(true);
    }
    else this.writer.Error('Failed to GET QRCode');

    this.writer.Info(qrCode);
    return await qrCode;
  }

  async GenerateBarCode() {

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

    const html = UrlFetchApp.fetch(barcodeLoc, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code : ${responseCode} ----> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      barcode = DriveApp.createFile( Utilities.newBlob(html.getContent()).setName(`Barcode : ${this.jobnumber}`) );
      barcode.setTrashed(true);
    } 
    else this.writer.Error('Failed to GET Barcode');

    Logger.log(barcode);
    return await barcode;

  }
  
}


/**
 * For use with barcode scanner.
 * Searches for job number found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
 * 
 */
const PickupByBarcode = () => {
  const writer = new WriteLogger();
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
      writer.Info(`Job number ${jobnumber} marked as picked up. Sheet: ${searchSheet.getSheetName()} row: ${searchRow}`);
      //var ui = SpreadsheetApp.getUi();
      //ui.alert("Job marked as picked up. Job located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
      return;
    }
  }
  progress.setValue('Job number not found. Try again.');
} 















