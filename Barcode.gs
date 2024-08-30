/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Barcode
 * @required {number} id
 */
class BarcodeGenerator {
  constructor({
    id : id,
  }) {
    this.id = id ? id : new IDService().id;
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

      if(!IDService.isValid(this.id)) throw new Error(`Invalid UUID id...`);
      const text = IDService.toDecimal(this.id);

      const barcodeLoc = root + type + ts + text + scaleX + scaleY + `&includetext` + `&parsefnc&alttext=` + this.id;

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

      let barcode = await DriveApp.createFile( Utilities.newBlob(response.getContent()).setName(`Barcode : ${this.id}`) );
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
  const id = new IDService().id;
  const b = new BarcodeGenerator({ id : id }).GenerateBarCodeForTicketHeader();
}

/**
 * QR Code Generator
 * @required {string} url
 */
class QRCodeGenerator {
  constructor({ url : url, }) {
    this.url = url ? url : `jps.jacobshall.org/`;
    /** @private */
    this.id = new IDService().id;
    /** @private */
    this.filename = `QRCode-${this.id}`;
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
      const blob = await Utilities.newBlob(response.getContent()).setName(this.filename);
      let qrCode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(blob);
      console.info(`QR CODE ---> ${qrCode.getUrl()} for ${this.url}`);
      return qrCode.getUrl();
    } catch(err) {
      console.error(`Failed to generate QRCode ---> ${err}`);
      return 1;
    }
  }
  
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * For use with barcode scanner.
 * Searches for id found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
 * @DEFUNCT
 *
const PickupByBarcode = () => {
  const text = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  const id = IDService.decimalToUUID(text);
  let progress = OTHERSHEETS.Pickup.getRange(4,2);

  progress.setValue(`Searching for id...`);
  if (id == null || id == "") {
    progress.setValue(`No id number provided. Select the yellow cell, scan, then press enter to make sure the cell's value has been changed.`);
    return;
  }
  Object.values(SHEETS).forEach(sheet => {
    const textFinder = sheet.createTextFinder(id);
    const searchFind = textFinder.findNext();
    if (searchFind != null) {
      let searchRow = searchFind.getRow();
      SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.pickedUp);
      progress.setValue(`ID number ${id} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      console.info(`ID number ${id} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      //var ui = SpreadsheetApp.getUi();
      //ui.alert("ID marked as picked up. ID located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
      return;
    }
  });
  progress.setValue(`ID number not found. Try again.`);
} 
*/

/**
 * Mark an id as abandoned and email student.
 * @DEFUNCT
 *
const MarkAsAbandonedByBarcode = async () => {
  const text = OTHERSHEETS.Pickup.getRange(3,2).getValue();
  const id = IDService.decimalToUUID(text);
  let progress = OTHERSHEETS.Pickup.getRange(4,2);

  progress.setValue(`Searching for id number...`);
  if (id == null || id == "") {
    progress.setValue(`No id number provided. Select the yellow cell, scan, then press enter to make sure the cell's value has been changed.`);
    return;
  }
  Object.values(SHEETS).forEach(sheet => {
    const textFinder = sheet.createTextFinder(id);
    const searchFind = textFinder.findNext();
    if (searchFind != null) {
      let searchRow = searchFind.getRow();
      SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.abandoned);
      progress.setValue(`ID number ${id} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      console.info(`ID number ${id} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
      
      const rowData = GetRowData(sheet, searchRow);
      let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
        mat1quantity, mat1, mat2quantity, mat2, 
        mat3quantity, mat3, mat4quantity, mat4, 
        mat5quantity, mat5, affiliation, elapsedTime, estimate, 
        price1, price2, sheetName, row, } = rowData;

      var message = new CreateMessage({
        name : name,
        projectname : projectName, 
        id : id,
        rowData : rowData,
        designspecialist : ds,
      });
      new Emailer({
        email : email,
        name : name, 
        status : STATUS.abandoned,
        projectname : projectName,
        id : id,
        material1Quantity : mat1quantity,
        message : message,
      });
      console.warn(`Student: ${name} emailed ABANDONED message.`)
      return;
    }
  });
  progress.setValue(`ID number not found. Try again.`);
}
*/












