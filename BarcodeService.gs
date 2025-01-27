/**
 * Class for Creating a Barcode
 */
class BarcodeService {
  constructor() {

  }

  /**
   * Generate Barcode
   * @required {uuid} id
   * @returns {barcode} barcode
   */
  static async GenerateBarCodeForTicketHeader(id = IDService.createId()) {
    try {
      id = IDService.isValid(id) ? id : IDService.createId();
      const root = `http://bwipjs-api.metafloor.com/`;
      const type = '?bcid=code128';
      const text = IDService.toDecimal(id);
      const scaleX = `&scaleX=6`
      const scaleY = '&scaleY=6';

      const url = `${root}${type}&text=${text}${scaleX}${scaleY}&includetext&parsefnc&alttext=${id}`;

      const params = {
        method : "GET",
        headers : { "Authorization" : "Basic ", "Content-Type" : "image/png" },
        contentType : "application/json",
        followRedirects : true,
        muteHttpExceptions : true,
      };
      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const blob = Utilities.newBlob(response.getContent()).setName(`Barcode_${id}`);
      let barcode = await DriveApp.createFile(blob);
      barcode.setTrashed(true);
      console.info(`BARCODE CREATED ---> ${barcode?.getId()?.toString()}, URL: ${barcode?.getUrl()}`);
      return barcode;
    } catch(err) {
      console.error(`"GenerateBarCodeForTicketHeader()" failed: ${err}`);
      return 1;
    }
    
  }

  /**
   * For use with barcode scanner.
   * Searches for id found in cell B2 of SearchByBarCode sheet and changes status to 'Picked Up'
   * @DEFUNCT
   * @private
   */
  static PickupByBarcode() {
    try {
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
          SheetService.SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.pickedUp);
          progress.setValue(`ID number ${id} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
          console.info(`ID number ${id} marked as picked up. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
          //var ui = SpreadsheetApp.getUi();
          //ui.alert("ID marked as picked up. ID located on sheet " + searchSheet.getSheetName() + " row " + searchRow)
          return;
        }
      });
      progress.setValue(`ID number not found. Try again.`);
      return 0;
    } catch(err) {
      console.error(`"PickupByBarcode()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Mark an id as abandoned and email student.
   * @DEFUNCT
   * @private
   */
  static async MarkAsAbandonedByBarcode() {
    try {
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
          SheetService.SetByHeader(sheet, HEADERNAMES.status, searchRow, STATUS.abandoned);
          progress.setValue(`ID number ${id} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
          console.info(`ID number ${id} marked as abandoned. Sheet: ${sheet.getSheetName()} row: ${searchRow}`);
          
          const rowData = SheetService.GetRowData(sheet, searchRow);
          let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
            mat1quantity, mat1, mat2quantity, mat2, 
            mat3quantity, mat3, mat4quantity, mat4, 
            mat5quantity, mat5, affiliation, elapsedTime, estimate, 
            unit_cost1, unit_cost2, unit_cost3, unit_cost4, unit_cost5, sheetName, row, } = rowData;

          const message = new MessageService({
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
            message : message.abandonedMessage,
          });
          console.warn(`Student: ${name} emailed ABANDONED message.`)
          return;
        }
      });
      progress.setValue(`ID number not found. Try again.`);
      return 0;
    } catch(err) {
      console.error(`"MarkAsAbandonedByBarcode()" failed: ${err}`);
      return 1;
    }
  }
  
}

const _testBarcode = () => {
  const id = IDService.createId();
  const b = BarcodeService.GenerateBarCodeForTicketHeader(id);
}


















