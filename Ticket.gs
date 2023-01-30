/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Printable Ticket
 * @required {number} jobnumber
 */
class Ticket 
{
  constructor({
    jobnumber : jobnumber = 202010010101,
    designspecialist : designspecialist = `Staff`,
    submissiontime : submissiontime = new Date(),
    name : name = `Unknown`,
    email : email = `Unknown`,
    projectname : projectname = `Unknown`,
    material1Name : material1Name = `Unknown`,
    material1Quantity : material1Quantity = 0,
    material2Name : material2Name = `Unknown`,
    material2Quantity : material2Quantity = 0,
    materials : materials =  [`Materials: `, `None`],
    partCount : partcount = [`Part Count: `, `None`],
    notes : notes = [`Notes: `, `None`],
  }){
    this.jobnumber = jobnumber;
    this.designspecialist  = designspecialist;
    this.submissiontime = submissiontime;
    this.name = name;
    this.email = email;
    this.projectname = projectname;
    this.material1Name = material1Name;
    this.material1Quantity = material1Quantity;
    this.material2Name = material2Name;
    this.material2Quantity = material2Quantity;
    this.materials = materials;
    this.partcount = partcount;
    this.notes = notes;

    this.doc;
    this.url = ``;

  }

  async CreateTicket() {
    const barcode = await new BarcodeGenerator({ jobnumber : this.jobnumber }).GenerateBarCodeForTicketHeader();
    console.info(`Barcode ----> ${barcode.url}`);

    const folder = DriveApp.getFolderById(DRIVEFOLDERS.tickets); // Set the correct folder
    this.doc = await DocumentApp.create(`JPS-Ticket-${this.jobnumber}`); // Make Document
    this.url = this.doc.getUrl();
    let body = this.doc.getBody();
    let docId = this.doc.getId();

    // Append Document with Info
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
      body.insertImage(0, barcode)
        .setWidth(260)
        .setHeight(100);
    } catch (err) {
      console.error(`${err} : Couldn't insert barcode into ticket.`);
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
          [this.materials[0], this.materials[1]],
          [this.partcount[0], this.partcount[1]],
          [this.notes[0], this.notes[1]],
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
      const docFile = await DriveApp.getFileById(docId);
      docFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); //set sharing
      docFile.moveTo(folder)
    } catch (err) {
      console.error(`Whoops : ${err}`);
    }
    
    // console.info(JSON.stringify(this.doc));
    console.info(`DOC ----> ${this.doc.getUrl()}`);
    return this.doc;
  };

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

/**
 * Function for Creating missing tickets
 */
const GenerateMissingTickets = () => {
  Object.values(SHEETS).forEach(sheet => {
    let jobnumbers = GetColumnDataByHeader(sheet, HEADERNAMES.jobNumber);
    let tickets = GetColumnDataByHeader(sheet, HEADERNAMES.ticket);
    console.info(`Sheet --> ${sheet.getSheetName()}`)
    jobnumbers.forEach( async(jobnumber, index) => {
      if(jobnumber && !tickets[index]) {
        let thisRow = index + 2;
        console.info(index + 2);
        let data = await GetRowData(sheet, thisRow);
        let ticket = await new Ticket({
          jobnumber : jobnumber,
          designspecialist : data.ds,
          submissiontime : data.timestamp,
          name : data.name,
          email : data.email,
          projectname : data.projectName,
          material1Name : data.material1Name,
          material1Quantity : data.material1Quantity,
          material2Name : data.material2Name,
          material2Quantity : data.material2Quantity,
        });
        let t = await ticket.CreateTicket();
        SetByHeader(sheet, HEADERNAMES.ticket, thisRow, t.getUrl());
      }
    })
  })
  return 0;
}









