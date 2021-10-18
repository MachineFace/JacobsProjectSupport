/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a Ticket to Print
 * @param {Event} e
 * @param {string} designspecialist
 * @param {bool} priority
 * @param {number} jobnumber
 * @param {time} submissiontime
 * @param {string} name
 * @param {number} sid
 * @param {string} email
 * @param {string} projectname
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @returns {doc} doc
 */
class Ticket 
{
  constructor(jobnumber){
    this.jobnumber = jobnumber;
    this.designspecialist;
    this.submissiontime;
    this.name;
    this.email;
    this.projectname;
    this.material1Name;
    this.material1Quantity;
    this.material2Name;
    this.material2Quantity;
    this.sheetName;
    this.row;
    this.doc;
    this.url;
    this.writer = new WriteLogger();
  }


  GetInfo() {
    let thisSheet;
    for(const [key, sheet] of Object.entries(SHEETS)) {
      const finder = sheet.createTextFinder(this.jobnumber).findNext();
      if (finder != null) {
        this.row = finder.getRow();
        thisSheet = sheet;
        this.sheetName = sheet.getName();
      }
    }
    this.designspecialist = this.GetByHeader(thisSheet, "(INTERNAL): DS Assigned", this.row);
    this.submissiontime = this.GetByHeader(thisSheet, "Timestamp", this.row);
    this.email = this.GetByHeader(thisSheet, "Email Address", this.row);
    this.name = this.GetByHeader(thisSheet, "What is your name?", this.row);
    this.projectname = this.GetByHeader(thisSheet, "Project Name", this.row);
    this.material1Name = this.GetByHeader(thisSheet, "(INTERNAL) Item 1", this.row);
    this.material1Quantity = this.GetByHeader(thisSheet, "(INTERNAL) Material 1 Quantity", this.row);
    this.material2Name = this.GetByHeader(thisSheet, "(INTERNAL) Item 2", this.row);
    this.material2Quantity = this.GetByHeader(thisSheet, "(INTERNAL) Material 2 Quantity", this.row);
  }

  GetByHeader (sheet, colName, row) {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row - 1][col];
    }
  };

  CreateTicket() {
    const folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    this.doc = DocumentApp.create(`Job Ticket-${this.jobnumber}`); //Make Document
    this.url = this.doc.getUrl();
    let body = this.doc.getBody();
    let docId = this.doc.getId();
    
    const qGen = new QRCodeAndBarcodeGenerator({url : url, jobnumber : this.jobnumber});
    const barcode = qGen.GenerateBarCode();
    const qrCode = qGen.GenerateQRCode();

    this.GetInfo();

    let mat = [];
    let partcount = [];
    let notes = [];
    if (this.sheetName == "Ultimaker") {
      mat.push( "Needs Breakaway Removed:", SHEETS.ultimaker.getRange("AD" + this.row).getValue().toString());
      partcount.push( "Part Count:", SHEETS.ultimaker.getRange("Y" + this.row).getValue().toString());
      notes.push( "Notes:", SHEETS.ultimaker.getRange("AE" + this.row).getValue().toString());
    }
    if (this.sheetName == "Laser Cutter") {
      mat.push( "Rough Dimensions:", SHEETS.laser.getRange("AA" + this.row).getValue().toString() );
      partcount.push("Part Count:", SHEETS.laser.getRange("Y" + this.row).getValue().toString() );
      notes.push( "Notes:", SHEETS.laser.getRange("AC" + this.row).getValue().toString() );
    }
    if (this.sheetName == "Fablight") {
      mat.push( "Rough Dimensions:", SHEETS.fablight.getRange("AA" + this.row).getValue().toString() );
      partcount.push( "Part Count:", SHEETS.fablight.getRange("AB" + this.row).getValue().toString() );
      notes.push( "Notes:", SHEETS.fablight.getRange("AC" + this.row).getValue().toString() );
    }
    if (this.sheetName == "Waterjet") {
      mat.push( "Rough Dimensions:", SHEETS.waterjet.getRange("AA" + this.row).getValue().toString() );
      partcount.push( "Part Count:", SHEETS.waterjet.getRange("AB" + this.row).getValue().toString() );
      notes.push( "Notes:", SHEETS.waterjet.getRange("AD" + this.row).getValue().toString() );
    }
    if (this.sheetName == "Advanced Lab") {
      mat.push( "Which Printer:", SHEETS.advancedlab.getRange("Z" + this.row).getValue().toString() );
      partcount.push( "Part Count:", SHEETS.advancedlab.getRange("Y" + this.row).getValue().toString() );
      notes.push( "Notes:", SHEETS.advancedlab.getRange("AJ" + this.row).getValue().toString() );
    } else {
      mat.push("Materials: ", "None");
      partcount.push("Part Count: ", "None");
      notes.push("Notes: ", "None");
    }

    // Append Document with Info
    if (this.doc != undefined || this.doc != null || this.doc != NaN) {
      try {
        let header = this.doc
          .addHeader()
          .appendTable([
            ['img1', 'img2']
          ])
          .setAttributes({
            [DocumentApp.Attribute.BORDER_WIDTH]: 0,
            [DocumentApp.Attribute.BORDER_COLOR]: `#ffffff`,
          });
        this.ReplaceTextToImage(header, `img1`, barcode);
        this.ReplaceTextToImage(header, `img2`, qrCode);

        body.insertHorizontalRule(0);
        body.insertParagraph(1, "Name: " + name.toString())
          .setHeading(DocumentApp.ParagraphHeading.HEADING1)
          .setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 18,
            [DocumentApp.Attribute.BOLD]: true,
          });
        body.insertParagraph(2, "Job Number: " + +jobnumber.toString())
          .setHeading(DocumentApp.ParagraphHeading.HEADING2)
          .setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 12,
            [DocumentApp.Attribute.BOLD]: true,
          });

        // Create a two-dimensional array containing the cell contents.
        body.appendTable([
            ["Design Specialist:", designspecialist.toString()],
            ["Job Number:", jobnumber.toString()],
            ["Student Name:", name.toString()],
            ["Project Name:", projectname.toString()],
            [mat[0], mat[1]],
            [partcount[0], partcount[1]],
            [notes[0], notes[1]],
          ])
          .setAttributes({
            [DocumentApp.Attribute.FONT_SIZE]: 9,
          });
      } catch (err) {
        this.writer.Error(`${err} : Couldn't append info to ticket. Ya dun goofed.`);
      }

      // Remove File from root and Add that file to a specific folder
      try {
        const docFile = DriveApp.getFileById(docId);
        DriveApp.removeFile(docFile);
        folder.next()
          .addFile(docFile)
          .addFile(barcode)
      } catch (err) {
        this.writer.Error(`Whoops : ${err}`);
      }


      // Set permissions to 'anyone can edit' for that file
      let file = DriveApp.getFileById(docId);
      file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
    }
    // Return Document to use later
    this.writer.Info(JSON.stringify(doc))
    return doc;
  };

  ReplaceTextToImage (body, searchText, image) {
    let next = body.findText(searchText);
    if (!next) return;
    let r = next.getElement();
    r.asText().setText("");
    r.getParent().asParagraph().insertInlineImage(image);
    return next;
  };
  
}

const _testTicket = () => {
  const jnum = 20210920145816;
  const tic = new Ticket(jnum).CreateTicket();
  Logger.log(tic);
}









var CreateTicket = (
  designspecialist,
  priority,
  jobnumber,
  submissiontime,
  name,
  sid,
  email,
  projectname,
  material1Quantity,
  material1Name,
  material2Quantity,
  material2Name,
) => {
  //Create Doc
  try {
    var folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    var doc = DocumentApp.create(`Job Ticket`); //Make Document
    var body = doc.getBody();
    var docId = doc.getId();
  } catch (err) {
    WriteLog( `${err} : Could not fetch doc folder, or make ticket, or get body or docId.` );
  }
  const url = doc.getUrl();
  const qgen = new QRCodeAndBarcodeGenerator({url : url, jobnumber : jobnumber});
  try {
    const barcode = qgen.GenerateBarCode();
  } catch (err) {
    Logger.log(`${err} : Couldn't create barcode for some reason.`);
  }
  try {
    const qrCode = qgen.GenerateQRCode();
  } catch (err) {
    Logger.log(`${err} : Couldn't create QRCode for some reason.`);
  }

  // Parse for Individual Sheets
  var sheetname = SpreadsheetApp.getActiveSheet().getSheetName();
  var thisRow = SpreadsheetApp.getActiveSheet().getActiveRange().getRow();

  var thisSheet;
  var mat = [];
  var partcount = [];
  var notes = [];
  if (sheetname == "Ultimaker") {
    thisSheet = SHEETS.ultimaker;
    mat.push( "Needs Breakaway Removed:", thisSheet.getRange("AD" + thisRow).getValue().toString());
    partcount.push( "Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString());
    notes.push( "Notes:", thisSheet.getRange("AE" + thisRow).getValue().toString());
  }
  if (sheetname == "Laser Cutter") {
    thisSheet = SHEETS.laser;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push("Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AC" + thisRow).getValue().toString() );
  }
  if (sheetname == "Fablight") {
    thisSheet = SHEETS.fablight;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("AB" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AC" + thisRow).getValue().toString() );
  }
  if (sheetname == "Waterjet") {
    thisSheet = SHEETS.waterjet;
    mat.push( "Rough Dimensions:", thisSheet.getRange("AA" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("AB" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AD" + thisRow).getValue().toString() );
  }
  if (sheetname == "Advanced Lab") {
    thisSheet = SHEETS.advancedlab;
    mat.push( "Which Printer:", thisSheet.getRange("Z" + thisRow).getValue().toString() );
    partcount.push( "Part Count:", thisSheet.getRange("Y" + thisRow).getValue().toString() );
    notes.push( "Notes:", thisSheet.getRange("AJ" + thisRow).getValue().toString() );
  } else {
    mat.push("Materials: ", "");
    partcount.push("Part Count: ", "1");
    notes.push("Notes: ", "None");
  }

  //Append Document with Info
  if (doc != undefined || doc != null || doc != NaN) {
    try {
      let header = doc
        .addHeader()
        .appendTable([[`img1`, `img2`]])
        .setAttributes({
          [DocumentApp.Attribute.BORDER_WIDTH]: 0,
          [DocumentApp.Attribute.BORDER_COLOR]: `#ffffff`,
        });
      ReplaceTextToImage(header, `img1`, barcode);
      ReplaceTextToImage(header, `img2`, qrCode);

      body.insertHorizontalRule(0);
      body.insertParagraph(1, "Name: " + name.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 18,
          [DocumentApp.Attribute.BOLD]: true,
        });
      body.insertParagraph(2, "Job Number: " + +jobnumber.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING2)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 12,
          [DocumentApp.Attribute.BOLD]: true,
        });

      //body.appendImage(barcode).setAltTitle("Barcode");
      //body.appendImage(qrCode).setAltTitle("QRCode");

      // Create a two-dimensional array containing the cell contents.
      body.appendTable([
          ["Design Specialist:", designspecialist.toString()],
          ["Job Number:", jobnumber.toString()],
          ["Student Name:", name.toString()],
          ["Project Name:", projectname.toString()],
          ["Materials:", material1Name.toString()],
          [mat[0], mat[1]],
          [partcount[0], partcount[1]],
          [notes[0], notes[1]],
        ])
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 9,
        });
    } catch (err) {
      WriteLog(`${err} : Couldn't append info to ticket. Ya dun goofed.`);
    }

    //Remove File from root and Add that file to a specific folder
    try {
      var docFile = DriveApp.getFileById(docId);
      DriveApp.removeFile(docFile);
      folder.next().addFile(docFile);
      folder.next().addFile(barcode);
    } catch (err) {
      WriteLog( `${err} : Couldn't delete the file from the drive folder. Sheet is still linked` );
    }

    //Set permissions to 'anyone can edit' for that file
    try {
      var file = DriveApp.getFileById(docId);
      file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
    } catch (err) {
      WriteLog( `${err} : Couldn't change permissions on the file. You probably have to do something else to make it work.` );
    }
  }
  //Return Document to use later
  return doc;
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Replace table entries with an Image blob
 * @param {DocumentApp.create(`doc`).getbody()} body
 * @param {string} text
 * @param {blob} image
 */
const ReplaceTextToImage = (body, searchText, image) => {
  var next = body.findText(searchText);
  if (!next) return;
  var r = next.getElement();
  r.asText().setText("");
  var img = r.getParent().asParagraph().insertInlineImage(0, image);
  return next;
};



const _testFind = () => {
  let thisRow;
  let thisSheet;
  let jobnumber = 20210920145816;
  for(const [key, sheet] of Object.entries(SHEETS)) {
    const finder = sheet.createTextFinder(jobnumber).findNext();
    if (finder != null) {
      thisRow = finder.getRow();
      thisSheet = sheet.getName();
    }
  }
  Logger.log(`Sheet : ${thisSheet}, ROW : ${thisRow}`)
}
