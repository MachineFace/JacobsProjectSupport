/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Barcode
 * @required {number} jobnumber
 */
class BarcodeGenerator {
  constructor({
    jobnumber : jobnumber,
  }) {
    this.jobnumber = jobnumber ? jobnumber : `10000001`;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Generate Barcode
   */
  async GenerateBarCode() {

    const root = 'http://bwipjs-api.metafloor.com/';
    const rootsec = 'https://bwipjs-api.metafloor.com/';
    const type = '?bcid=code128';
    const ts = '&text=';
    const scale = '&scale=0.75'
    const postfx = '&includetext';

    //let barcodeLoc = 'http://bwipjs-api.metafloor.com/?bcid=code128&text=1234567890&includetext';  //KNOWN WORKING LOCATION
    const barcodeLoc = root + type + ts + this.jobnumber + scale + postfx;

    const params = {
      "method" : "GET",
      "headers" : { "Authorization": "Basic ", "Content-Type" : "image/png" },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    
    const html = await UrlFetchApp.fetch(barcodeLoc, params);
    const responseCode = html.getResponseCode();
    console.info(`Response Code : ${responseCode} ----> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      this.blob = Utilities.newBlob(html.getContent()).setName(`Barcode-${this.jobnumber}`) ;
      this.barcode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(this.blob);
      this.url = this.barcode.getUrl();
      console.info(`Barcode ---> ${this.url}`);
      return this.barcode;
    } else {
      console.error('Failed to GET Barcode');
      return false;
    }

  }

  async GenerateBarCodeForTicketHeader() {

    const root = 'http://bwipjs-api.metafloor.com/';
    const type = '?bcid=code128';
    const ts = '&text=';
    const scaleX = `&scaleX=6`
    const scaleY = '&scaleY=6';
    const postfx = '&includetext';

    const barcodeLoc = root + type + ts + this.jobnumber + scaleX + scaleY + postfx;

    const params = {
      "method" : "GET",
      "headers" : { "Authorization": "Basic ", "Content-Type" : "image/png" },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };

    let barcode;
    const res = UrlFetchApp.fetch(barcodeLoc, params);
    const responseCode = res.getResponseCode();
    // console.info(`Response Code : ${responseCode}, ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200) {
      barcode = DriveApp.createFile( Utilities.newBlob(res.getContent()).setName(`Barcode : ${this.jobnumber}`) );
      barcode.setTrashed(true);
    } 
    else console.error('Failed to GET Barcode');
    console.info(`BARCODE CREATED ---> ${barcode?.getId()?.toString()}`);
    return barcode;
    
  }
  
}

/**
 * QR Code Generator
 * @required {string} url
 */
class QRCodeGenerator {
  constructor({ url : url, }) {
    this.url = url ? url : `jps.jacobshall.org/`;
    this.GenerateQRCode();
    this.blob;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Generate QR Code
   */
  async GenerateQRCode(){
    console.info(`QRCode URL : ${this.url}`);
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${this.url}`;  //API call
    const params = {
      "method" : "GET",
      "headers" : { "Authorization" : "Basic" },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    let qrCode;
    const html = await UrlFetchApp.fetch(loc, params);
    const responseCode = html.getResponseCode();
    console.info(`Response Code : ${responseCode} ----> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      this.blob = Utilities.newBlob(html.getContent()).setName(`QRCode-${this.jobnumber}` );
      qrCode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(blob);
      console.info(`QR CODE ---> ${qrCode.getUrl()}`);
      return qrCode;
    } else {
      console.error('Failed to GET QRCode');
      return false;
    }
  }
  
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * For use with barcode scanner.
 * Searches for job number found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
 */
const PickupByBarcode = () => {
  const jobnumber = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  let progress = OTHERSHEETS.Pickup.getRange(4,2);

  progress.setValue(`Searching for job number...`);
  if (jobnumber == null || jobnumber == "") {
    progress.setValue(`No job number provided. Select the yellow cell, scan, then press enter to make sure the cell's value has been changed.`);
    return;
  }
  Object.values(SHEETS).forEach(sheet => {
    const textFinder = sheet.createTextFinder(jobnumber);
    const searchFind = textFinder.findNext();
    if (searchFind != null) {
      let searchRow = searchFind.getRow();
      SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.pickedUp);
      progress.setValue(`Job number ${jobnumber} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      console.info(`Job number ${jobnumber} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      //var ui = SpreadsheetApp.getUi();
      //ui.alert("Job marked as picked up. Job located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
      return;
    }
  });
  progress.setValue(`Job number not found. Try again.`);
} 

/**
 * Mark a job as abandoned and email student.
 */
const MarkAsAbandonedByBarcode = async () => {
  const jobnumber = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  let progress = OTHERSHEETS.Pickup.getRange(4,2);

  progress.setValue(`Searching for job number...`);
  if (jobnumber == null || jobnumber == "") {
    progress.setValue(`No job number provided. Select the yellow cell, scan, then press enter to make sure the cell's value has been changed.`);
    return;
  }
  Object.values(SHEETS).forEach(sheet => {
    const textFinder = sheet.createTextFinder(jobnumber);
    const searchFind = textFinder.findNext();
    if (searchFind != null) {
      let searchRow = searchFind.getRow();
      SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.abandoned);
      progress.setValue(`Job number ${jobnumber} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      console.info(`Job number ${jobnumber} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);

      const email = GetByHeader(sheet, HEADERNAMES.email, searchRow);
      const name = GetByHeader(sheet, HEADERNAMES.name, searchRow);
      const projectname = GetByHeader(sheet, HEADERNAMES.filename, searchRow);
      const material1Quantity = GetByHeader(sheet, HEADERNAMES.materials, searchRow);
      const material1Name = GetByHeader(sheet, HEADERNAMES.mat1, searchRow);
      const designspecialist = GetByHeader(sheet, HEADERNAMES.ds, searchRow);
      var message = new CreateMessage({
        name : name,
        projectname : projectname, 
        jobnumber : jobnumber,
        material1Quantity : material1Quantity,
        material1Name : material1Name,
        designspecialist : designspecialist,
      });
      new Emailer({
        email : email,
        name : name, 
        status : STATUS.abandoned,
        projectname : projectname,
        jobnumber : jobnumber,
        material1Quantity : material1Quantity,
        message : message,
      });
      console.warn(`Student: ${name} emailed ABANDONED message.`)
      return;
    }
  });
  progress.setValue(`Job number not found. Try again.`);
}

const _testBarcode = async () => {
  const b = await new BarcodeGenerator({ jobnumber : 123847687 }).GenerateBarCodeForTicketHeader();
  console.info(b);
  // const q = new QRCodeGenerator({ url : `https://www.codyglen.com/`, });
  // console.info(q)
}












