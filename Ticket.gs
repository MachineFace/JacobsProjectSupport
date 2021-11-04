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
  constructor({jobnumber = 202010010101,}){
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
    this.sheet;
    this.row;
    this.doc;
    this.url;
    this.GetInfo();
  }


  GetInfo() {
    for(const [key, sheet] of Object.entries(SHEETS)) {
      const finder = sheet.createTextFinder(this.jobnumber).findNext();
      if (finder != null) {
        this.row = finder.getRow();
        this.sheet = sheet;
        this.sheetName = sheet.getName();
      }
    }
    this.designspecialist = this.GetByHeader(this.sheet, "(INTERNAL): DS Assigned", this.row);
    this.submissiontime = this.GetByHeader(this.sheet, "Timestamp", this.row);
    this.email = this.GetByHeader(this.sheet, "Email Address", this.row);
    this.name = this.GetByHeader(this.sheet, "What is your name?", this.row);
    this.projectname = this.GetByHeader(this.sheet, "Project Name", this.row);
    this.material1Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 1", this.row);
    this.material1Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 1 Quantity", this.row);
    this.material2Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 2", this.row);
    this.material2Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 2 Quantity", this.row);
  }

  GetByHeader (sheet, colName, row) {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row - 1][col];
    }
  };

  async CreateTicket() {
    await this.GetInfo();
    const folder = DriveApp.getFoldersByName(`Job Tickets`); //Set the correct folder
    this.doc = DocumentApp.create(`Job Ticket-${this.jobnumber}`); //Make Document
    this.url = this.doc.getUrl();
    let body = this.doc.getBody();
    let docId = this.doc.getId();
    
    const qGen = new QRCodeAndBarcodeGenerator({url : this.url, jobnumber : this.jobnumber});
    const barcode = await qGen.GenerateBarCode();
    const qrCode = await qGen.GenerateQRCode();
    Logger.log(`Barcode ----> ${barcode}`);

    let material, part, note;
    let mat = [];
    let partcount = [];
    let notes = [];
    switch(this.sheetName) {
      case 'Ultimaker':
        material = this.GetByHeader(SHEETS.ultimaker, 'Does your project need the support material removed?', this.row);
        if(material) mat.push( "Needs Breakaway Removed:", material.toString());
        part = this.GetByHeader(SHEETS.ultimaker, 'Part Count', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        note = this.GetByHeader(SHEETS.ultimaker, 'Notes', this.row);
        if(note) notes.push( "Notes:", note.toString());
        break;
      case "Laser Cutter":
        material = this.GetByHeader(SHEETS.laser, 'Rough dimensions of your part', this.row)
        if(material) mat.push( "Rough Dimensions:", material.toString());
        part = this.GetByHeader(SHEETS.laser, 'Total number of parts needed', this.row);
        if(part) partcount.push("Part Count:", part.toString());
        note = this.GetByHeader(SHEETS.laser, 'Notes', this.row);
        if(note) notes.push( "Notes:", note.toString());
        break;
      case "Fablight":
        material = this.GetByHeader(SHEETS.fablight, 'Rough dimensions of your part?', this.row);
        if(material) mat.push( "Rough Dimensions:", material.toString());
        part = this.GetByHeader(SHEETS.fablight, 'How many parts do you need?', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        note = this.GetByHeader(SHEETS.fablight, 'Notes:', this.row);
        if(note) notes.push( "Notes:", note.toString());
        break;
      case "Waterjet":
        material = this.GetByHeader(SHEETS.waterjet, 'Rough dimensions of your part', this.row);
        if(material) mat.push( "Rough Dimensions:", material.toString());
        part = this.GetByHeader(SHEETS.waterjet, 'How many parts do you need?', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        lnote = this.GetByHeader(SHEETS.waterjet, 'Notes', this.row);
        if(note) notes.push( "Notes:", note.toString());
        break;
      case "Advanced Lab":
        material = this.GetByHeader(SHEETS.advancedlab, 'Which printer?', this.row);
        if(material) mat.push( "Which Printer:", material.toString());
        part = this.GetByHeader(SHEETS.advancedlab, 'Total number of parts needed', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        note = this.GetByHeader(SHEETS.advancedlab, 'Other Notes About This Job', this.row);
        if(note) notes.push( "Notes:", note.toString());
        break;
      default:
        mat.push("Materials: ", "None");
        partcount.push("Part Count: ", "None");
        notes.push("Notes: ", "None");
        break;
    }

    // Append Document with Info
    let header;
    try {
      header = this.doc
        .addHeader()
        .appendTable([
          ['img1', 'img2']
        ])
        .setAttributes({
          [DocumentApp.Attribute.BORDER_WIDTH]: 0,
          [DocumentApp.Attribute.BORDER_COLOR]: `#ffffff`,
        });
      this._ReplaceTextToImage(header, 'img1', barcode);
      this._ReplaceTextToImage(header, 'img2', qrCode);

      body.insertHorizontalRule(0);
      body.insertParagraph(1, "Name: " + this.name.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 12,
          [DocumentApp.Attribute.BOLD]: true,
        });
      body.insertParagraph(2, "Job Number: " + this.jobnumber.toString())
        .setHeading(DocumentApp.ParagraphHeading.HEADING2)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 10,
          [DocumentApp.Attribute.BOLD]: true,
        });

      // Create a two-dimensional array containing the cell contents.
      body.appendTable([
          ["Design Specialist:", this.designspecialist.toString()],
          ["Job Number:", this.jobnumber.toString()],
          ["Student Name:", this.name.toString()],
          ["Project Name:", this.projectname.toString()],
          [mat[0], mat[1]],
          [partcount[0], partcount[1]],
          [notes[0], notes[1]],
        ])
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 8,
        });
    } catch (err) {
      Logger.log(`${err} : Couldn't append info to ticket. Ya dun goofed.`);
    }

    // Remove File from root and Add that file to a specific folder
    try {
      const docFile = DriveApp.getFileById(docId);
      DriveApp.removeFile(docFile);
      while(folder.hasNext()) {
        folder.next().addFile(docFile)
      }
    } catch (err) {
      Logger.log(`Whoops : ${err}`);
    }

    // Set permissions to 'anyone can edit' for that file
    let file = DriveApp.getFileById(docId);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing

    Logger.log(JSON.stringify(this.doc));
    this.SetTicketURL();
    return this.doc;
  };

  SetTicketURL() {
    try {
      const data = this.sheet.getDataRange().getValues();
      const col = data[0].indexOf('Printable Ticket') + 1;
      this.sheet.getRange(this.row, col).setValue(this.url);
      Logger.log(`Set Ticket URL - Sheet: ${this.sheetName} Row: ${this.row} Col: ${col} Value: ${this.url}`);
    } catch (err) {
      Logger.log(`${err} : Setting Ticket URL failed - Sheet: ${this.sheetName} Row: ${this.row} Col: ${col} Value: ${this.url}`);
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Replace table entries with an Image blob
   * @param {DocumentApp.create(`doc`).getbody()} body
   * @param {string} text
   * @param {blob} image
   */
  _ReplaceTextToImage (body, searchText, imagefile) {
    try {
      const imageBlob = imagefile.getBlob();
      let next = body.findText(searchText);
      if (!next) return;
      let r = next.getElement();
      r.asText().setText("");
      r.getParent().asParagraph().insertInlineImage(0,imageBlob);
      return next;
    } catch (err) {
      Logger.log(`${err} : Couldn't swap out text for images....`);
    }
  };
  
}

const _testTicket = () => {
  const jnum = 20211007000407;
  const tic = new Ticket({jobnumber : jnum}).CreateTicket();

  Logger.log(tic);
}





