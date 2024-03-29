/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Barcode
 * @required {number} jobnumber
 */
class BarcodeGenerator {
  constructor({
    jobnumber : jobnumber,
  }) {
    this.jobnumber = jobnumber ? jobnumber : new JobnumberService().jobnumber;
  }

  /**
   * Generate Barcode
   */
  async GenerateBarCodeForTicketHeader() {
    try {
      const root = 'http://bwipjs-api.metafloor.com/';
      const type = '?bcid=code128';
      const ts = '&text=';
      const scaleX = `&scaleX=6`
      const scaleY = '&scaleY=6';

      if(!JobnumberService.isValid(this.jobnumber)) throw new Error(`Invalid UUID jobnumber...`);
      const text = JobnumberService.toDecimal(this.jobnumber);

      const barcodeLoc = root + type + ts + text + scaleX + scaleY + `&includetext` + `&parsefnc&alttext=` + this.jobnumber;

      const params = {
        method : "GET",
        headers : { "Authorization" : "Basic ", "Content-Type" : "image/png" },
        contentType : "application/json",
        followRedirects : true,
        muteHttpExceptions : true,
      };
      console.info(barcodeLoc, params);
      const response = await UrlFetchApp.fetch(barcodeLoc, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      let barcode = await DriveApp.createFile( Utilities.newBlob(response.getContent()).setName(`Barcode : ${this.jobnumber}`) );
      barcode.setTrashed(true);
      console.info(`BARCODE CREATED ---> ${barcode?.getId()?.toString()}, URL: ${barcode?.getUrl()}`);
      return barcode;
    } catch(err) {
      console.error(`Failed to GET Barcode ---> ${err}`);
      return 1;
    }
    
  }
  
}

const _testBarcode = () => {
  const jobnumber = new JobnumberService().jobnumber;
  const b = new BarcodeGenerator({ jobnumber : jobnumber }).GenerateBarCodeForTicketHeader();
}

/**
 * QR Code Generator
 * @required {string} url
 */
class QRCodeGenerator {
  constructor({ url : url, }) {
    this.url = url ? url : `jps.jacobshall.org/`;
    this.GenerateQRCode();
  }

  /**
   * Generate QR Code
   */
  async GenerateQRCode(){
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${this.url}`;  //API call
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic" },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };

    try {
      const response = await UrlFetchApp.fetch(loc, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const blob = await Utilities.newBlob(response.getContent()).setName(`QRCode-${this.jobnumber}` );
      let qrCode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(blob);
      console.info(`QR CODE ---> ${qrCode.getUrl()} for ${this.url}`);
      return qrCode;
    } catch(err) {
      console.error(`Failed to generate QRCode ---> ${err}`);
    }
  }
  
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * For use with barcode scanner.
 * Searches for job number found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
 * @DEFUNCT
 */
const PickupByBarcode = () => {
  const text = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  const jobnumber = JobnumberService.decimalToUUID(text);
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
 * @DEFUNCT
 */
const MarkAsAbandonedByBarcode = async () => {
  const text = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  const jobnumber = JobnumberService.decimalToUUID(text);
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
      
      const rowData = GetRowData(sheet, searchRow);
      let { status, ds, priority, ticket, jobnumber, timestamp, email, name, sid, projectName, 
        mat1quantity, mat1, mat2quantity, mat2, 
        mat3quantity, mat3, mat4quantity, mat4, 
        mat5quantity, mat5, affiliation, elapsedTime, estimate, 
        price1, price2, sheetName, row, } = rowData;

      var message = new CreateMessage({
        name : name,
        projectname : projectName, 
        jobnumber : jobnumber,
        rowData : rowData,
        designspecialist : ds,
      });
      new Emailer({
        email : email,
        name : name, 
        status : STATUS.abandoned,
        projectname : projectName,
        jobnumber : jobnumber,
        material1Quantity : mat1quantity,
        message : message,
      });
      console.warn(`Student: ${name} emailed ABANDONED message.`)
      return;
    }
  });
  progress.setValue(`Job number not found. Try again.`);
}













