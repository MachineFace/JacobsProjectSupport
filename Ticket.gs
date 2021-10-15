class Ticket 
{
  constructor({
    designspecialist = "Staff", 
    submissiontime = new Date(), 
    name = "Student Name", 
    email = "Student Email", 
    projectname = "Project Name",
    material1Name = "Plywood", 
    material1Quantity = 0,
    material2Name, 
    material2Quantity = 0,
    ticketName = "PrinterOS Ticket",
    printerID = "79165",
    printerName = "Spectrum",
    printDuration = 2000,
    jobnumber = 12934871,
  }){
    this.designspecialist = designspecialist;
    this.submissiontime = submissiontime;
    this.name = name;
    this.email = email;
    this.projectname = projectname;
    this.material1Name = material1Name;
    this.material1Quantity = material1Quantity;
    this.material2Name = material2Name;
    this.material2Quantity = material2Quantity;
    this.ticketName = ticketName;
    this.printerID = printerID;
    this.printerName = printerName;
    this.printDuration = printDuration;
    this.jobnumber = jobnumber;
    this.writer = new WriteLogger();
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Replace table entries with an Image blob
   * @param {DocumentApp.create(`doc`).getbody()} body
   * @param {string} text
   * @param {blob} image
   */
  ReplaceTextToImage(body, searchText, image) {
    var next = body.findText(searchText);
    if (!next) return;
    var r = next.getElement();
    r.asText().setText("");
    var img = r.getParent().asParagraph().insertInlineImage(0, image);
    return next;
  };

  CreateTicket() {
    const jobnumber = this.jobnumber;
    const folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    const doc = DocumentApp.create(this.ticketName); //Make Document
    let body = doc.getBody();
    let docId = doc.getId();
    let url = doc.getUrl();
    
    const qGen = new QRCodeAndBarcodeGenerator({url, jobnumber});
    const barcode = qGen.GenerateBarCode();
    const qrCode = qGen.GenerateQRCode();

    // Append Document with Info
    if (doc != undefined || doc != null || doc != NaN) {
      let header = doc
        .addHeader()
        .appendTable([[`img1`, `img2`]])
        .setAttributes({
          [DocumentApp.Attribute.BORDER_WIDTH]: 0,
          [DocumentApp.Attribute.BORDER_COLOR]: `#ffffff`,
        });
      this.ReplaceTextToImage(header, `img1`, barcode);
      this.ReplaceTextToImage(header, `img2`, qrCode);

      body.insertHorizontalRule(0);
      body.insertParagraph(1, "Email: " + this.email.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 18,
          [DocumentApp.Attribute.BOLD]: true,
        });
      body.insertParagraph(2, "Printer: " + this.printerName.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING2)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 12,
          [DocumentApp.Attribute.BOLD]: true,
        });

      // Create a two-dimensional array containing the cell contents.
      body.appendTable([
          ["Date Started", this.submissiontime.toString()],
          ["Design Specialist:", this.designspecialist],
          ["Job Number:", this.jobnumber.toString()],
          ["Student Email:", this.email.toString()],
          ["Elapsed time : ", this.printDuration.toString()],
          ["Materials:", `PLA : ${this.material1Quantity}`],
          ["Materials:", `Breakaway Support : ${this.material2Quantity}`],
        ])
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 9,
        });

      // Remove File from root and Add that file to a specific folder
      try {
        const docFile = DriveApp.getFileById(docId);
        DriveApp.removeFile(docFile);
        folder.next().addFile(docFile);
        folder.next().addFile(barcode);
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
}

const _testTicket = () => {
  const dummyObj = {
    designspecialist : "Mike",
    submissiontime : new Date(),
    name : "Stu Dent",
    email : "email@email.com",
    projectname : "Pro Jecta",
    material1Quantity : 5000,
    material2Quantity : 9000,

  }
  const tic = new Ticket(dummyObj).CreateTicket();
  Logger.log(tic);
}








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