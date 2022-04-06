/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Printable Ticket
 * @required {number} jobnumber
 */
class Ticket 
{
  constructor({
    jobnumber : jobnumber,
  }){
    this.jobnumber = jobnumber ? jobnumber : 202010010101;
    this.designspecialist = `Staff`;
    this.submissiontime = new Date();
    this.name = `Unknown`;
    this.email = `Unknown`;
    this.projectname = `Unknown`;
    this.material1Name = `Unknown`;
    this.material1Quantity = 0;
    this.material2Name = `Unknown`;
    this.material2Quantity = 0;
    this.sheetName = SHEETS.Laser.getSheetName();
    this.sheet = SHEETS.Laser;
    this.row = 2;
    this.doc;
    this.url = ``;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Set Info by Looking up JobNumber
   */
  SetInfo() {
    for(const [key, sheet] of Object.entries(SHEETS)) {
      const finder = sheet.createTextFinder(this.jobnumber).findNext();
      if (finder != null) {
        this.row = finder.getRow();
        this.sheet = sheet;
        this.sheetName = sheet.getName();
      }
    }
    this.designspecialist = this.GetByHeader(this.sheet, HEADERNAMES.ds, this.row) ? this.GetByHeader(this.sheet, HEADERNAMES.ds, this.row) : "A Design Specialist";
    this.submissiontime = this.GetByHeader(this.sheet, HEADERNAMES.timestamp, this.row);
    this.email = this.GetByHeader(this.sheet, HEADERNAMES.email, this.row);
    this.name = this.GetByHeader(this.sheet, HEADERNAMES.name, this.row);
    this.projectname = this.GetByHeader(this.sheet, HEADERNAMES.projectName, this.row);
    this.material1Name = this.GetByHeader(this.sheet, HEADERNAMES.mat1, this.row);
    this.material1Quantity = this.GetByHeader(this.sheet, HEADERNAMES.mat1quantity, this.row);
    this.material2Name = this.GetByHeader(this.sheet, HEADERNAMES.mat2, this.row);
    this.material2Quantity = this.GetByHeader(this.sheet, HEADERNAMES.mat2quantity, this.row);
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get By Header Name Helper Function
   * @param {sheet} sheet
   * @param {string} column name
   * @param {int} row number
   */
  GetByHeader (sheet, colName, row) {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) return data[row - 1][col];
  };

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Ticket MAIN
   */
  async CreateTicket() {
    await this.SetInfo();
    const folder = DriveApp.getFoldersByName(`Job Tickets`); // Set the correct folder
    this.doc = DocumentApp.create(`Job Ticket-${this.jobnumber}`); // Make Document
    this.url = this.doc.getUrl();
    let body = this.doc.getBody();
    let docId = this.doc.getId();
    
    const barcode = new BarcodeGenerator({ jobnumber : this.jobnumber });

    console.info(`Barcode ----> ${barcode.url}`);

    let material, part, note;
    let mat = [];
    let partcount = [];
    let notes = [];
    switch(this.sheetName) {
      case SHEETS.Ultimaker.getName():
        material = await this.GetByHeader(SHEETS.Ultimaker, 'Does your project need the support material removed?', this.row);
        if(material) mat.push( "Needs Breakaway Removed:", material.toString());
        else mat.push("Materials: ", "None");

        part = await this.GetByHeader(SHEETS.Ultimaker, 'Part Count', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        else partcount.push("Part Count: ", "None");

        note = await this.GetByHeader(SHEETS.Ultimaker, 'Notes', this.row);
        if(note) notes.push( "Notes:", note.toString());
        else notes.push("Notes: ", "None");
        break;
      case SHEETS.Laser.getName():
        material = await this.GetByHeader(SHEETS.Laser, 'Rough dimensions of your part', this.row)
        if(material) mat.push( "Rough Dimensions:", material.toString());
        else mat.push("Materials: ", "None");

        part = await this.GetByHeader(SHEETS.Laser, 'Total number of parts needed', this.row);
        if(part) partcount.push("Part Count:", part.toString());
        else partcount.push("Part Count: ", "None");

        note = await this.GetByHeader(SHEETS.Laser, 'Notes', this.row);
        if(note) notes.push( "Notes:", note.toString());
        else notes.push("Notes: ", "None");
        break;
      case SHEETS.Fablight.getName():
        material = await this.GetByHeader(SHEETS.Fablight, 'Rough dimensions of your part?', this.row);
        if(material) mat.push( "Rough Dimensions:", material.toString());
        else mat.push("Materials: ", "None");

        part = await this.GetByHeader(SHEETS.Fablight, 'How many parts do you need?', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        else partcount.push("Part Count: ", "None");

        note = await this.GetByHeader(SHEETS.Fablight, 'Notes:', this.row);
        if(note) notes.push( "Notes:", note.toString());
        else notes.push("Notes: ", "None");
        break;
      case SHEETS.Waterjet.getName():
        material = await this.GetByHeader(SHEETS.Waterjet, 'Rough dimensions of your part', this.row);
        if(material) mat.push( "Rough Dimensions: ", material.toString());
        else mat.push("Materials: ", "None");

        part = await this.GetByHeader(SHEETS.Waterjet, 'How many parts do you need?', this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        else partcount.push("Part Count: ", "None");

        note = await this.GetByHeader(SHEETS.Waterjet, 'Notes', this.row);
        if(note) notes.push( "Notes: ", note.toString());
        else notes.push("Notes: ", "None");
        break;
      case SHEETS.Advancedlab.getName():
        material = await this.GetByHeader(SHEETS.Advancedlab, HEADERNAMES.whichPrinter, this.row);
        if(material) mat.push( "Which Printer: ", material.toString());
        else mat.push("Materials: ", "None");

        part = await this.GetByHeader(SHEETS.Advancedlab, HEADERNAMES.numberOfParts, this.row);
        if(part) partcount.push( "Part Count:", part.toString());
        else partcount.push("Part Count: ", "None");

        note = await this.GetByHeader(SHEETS.Advancedlab, HEADERNAMES.otherJobNotes, this.row);
        if(note) notes.push( "Notes:", note.toString());
        else notes.push("Notes: ", "None");
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
      body
        .setPageWidth(PAGESIZES.custom.width)
        .setPageHeight(PAGESIZES.custom.height)
        .setMarginTop(2)
        .setMarginBottom(2)
        .setMarginLeft(2)
        .setMarginRight(2);
    } catch (err) {
      console.error(`${err} : Couldn't set ticket main properties.`);
    }
    try {
      body.insertImage(0, barcode.blob)
        .setWidth(260)
        .setHeight(100);
    } catch (err) {
      console.error(`${err} : Couldn't insert image into ticket.`);
    }
    try {
      body.insertHorizontalRule(1);
      
      body.insertParagraph(2, `Name: ${this.name.toString()}`)
        .setHeading(DocumentApp.ParagraphHeading.HEADING1)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 13,
          [DocumentApp.Attribute.BOLD]: true,
          [DocumentApp.Attribute.LINE_SPACING]: 1,
        });
      body.insertParagraph(3, `Job Number: ${this.jobnumber.toString()}`)
        .setHeading(DocumentApp.ParagraphHeading.HEADING2)
        .setAttributes({
          [DocumentApp.Attribute.FONT_SIZE]: 9,
          [DocumentApp.Attribute.BOLD]: true,
          [DocumentApp.Attribute.LINE_SPACING]: 1,
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
          [DocumentApp.Attribute.FONT_SIZE]: 6,
          [DocumentApp.Attribute.LINE_SPACING]: 1,
          [DocumentApp.Attribute.BORDER_WIDTH]: 0.5,
        });
    } catch (err) {
      console.error(`${err} : Couldn't append info to ticket.`);
    }

    // Remove File from root and Add that file to a specific folder
    try {
      const docFile = DriveApp.getFileById(docId);
      DriveApp.removeFile(docFile);
      while(folder.hasNext()) {
        folder.next().addFile(docFile)
      }
    } catch (err) {
      console.error(`Whoops : ${err}`);
    }

    // Set permissions to 'anyone can edit' for that file
    let file = DriveApp.getFileById(docId);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing

    // console.info(JSON.stringify(this.doc));
    console.info(`DOC ----> ${this.doc.getUrl()}`);
    this.SetTicketURL();
    return this.doc;
  };

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Set Ticket URL
   * Prints url to sheet
   */
  SetTicketURL() {
    try {
      const data = this.sheet.getDataRange().getValues();
      const col = data[0].indexOf('Printable Ticket') + 1;
      this.sheet.getRange(this.row, col).setValue(this.url);
      console.info(`Set Ticket URL - Sheet: ${this.sheetName} Row: ${this.row} Col: ${col} Value: ${this.url}`);
    } catch (err) {
      console.error(`${err} : Setting Ticket URL failed - Sheet: ${this.sheetName} Row: ${this.row} Col: ${col} Value: ${this.url}`);
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
      console.error(`${err} : Couldn't swap out text for images....`);
    }
  };
  
}





const _testTicket = () => {
  console.time(`TicketGen Time `);
  const tic = new Ticket({ jobnumber : 20220118033838, }).CreateTicket();
  console.info(tic);
  console.timeEnd(`TicketGen Time `);
}





