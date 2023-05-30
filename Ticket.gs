/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Printable Ticket
 * @required {number} jobnumber
 * @param {string} designspecialist
 * @param {date} submissiontime
 * @param {string} name
 * @param {string} email
 * @param {string} projectname
 * @param {JSON} rowData
 * @returns {Ticket} ticket
 */
class Ticket {
  constructor({
    jobnumber : jobnumber = 202010010101,
    designspecialist : designspecialist = `Staff`,
    submissiontime : submissiontime = new Date(),
    name : name = `Unknown`,
    email : email = `Unknown`,
    projectname : projectname = `Unknown`,
    rowData : rowData = [],
  }){
    this.jobnumber = jobnumber;
    this.designspecialist  = designspecialist;
    this.submissiontime = submissiontime;
    this.name = name;
    this.email = email;
    this.projectname = projectname;
    this.rowData = rowData;

    this.doc;
    this.url = ``;

  }

  
  async CreateTicket() {
    const barcode = await new BarcodeGenerator({ jobnumber : this.jobnumber }).GenerateBarCodeForTicketHeader();

    const folder = DriveApp.getFolderById(DRIVEFOLDERS.tickets); // Set the correct folder
    this.doc = await DocumentApp.create(`JPS-Ticket-${this.jobnumber}`); // Make Document
    this.url = this.doc.getUrl();
    let body = this.doc.getBody();
    let docId = this.doc.getId();

    // Parse
    let { status, whichPrinter, numberOfParts, staffNotes,
      material, materials, fablightMaterial, fiberReinforcement, fiberPattern, timestamp,
      mat1quantity, mat1, 
      mat2quantity, mat2, 
      mat3quantity, mat3, 
      mat4quantity, mat4, 
      mat5quantity, mat5,
      thickness, fablightThickness, roughDimsFablight, partCountFablight,
      printColor, printSize, printCount, 
      otherNotes, layerThickness, density, fortusLayerThickness, densityInfill, finish, roughDimensions, 
      markforgedDensity, buildParameters, otherJobNotes, dateCompleted, 
      elapsedTime, estimate, price1, price2, price3, price4, sheet, row 
    } = this.rowData;


    // Build Table
    let tb = [];

    this.designspecialist ? tb.push([`Design Specialist`, this.designspecialist.toString()]) : tb.push([`Design Specialist`, `Staff`]);
    tb.push([`Job Number`, this.jobnumber.toString()]);
    tb.push([`Student Name`, this.name?.toString()]);
    tb.push([`Project Name`, this.projectname?.toString()]);
    status ? tb.push([`Status`, status.toString()]) : tb.push([`Status`, STATUS.received]);
    timestamp ? tb.push([`Submitted On`, timestamp.toString()]) : tb.push([`Submitted On`, new Date().toDateString()])

    if (numberOfParts) tb.push([`Number of Parts`, numberOfParts.toString()]);
    if (partCountFablight) tb.push([`Number of Parts`, partCountFablight.toString()]);

    if (roughDimensions) tb.push([`General Dimensions`, roughDimensions.toString()]);
    if (roughDimsFablight) tb.push([`General Dimensions`, roughDimsFablight.toString()]);
    if (mat1 && mat1quantity) tb.push([mat1.toString(), mat1quantity.toString()]);
    if (mat2 && mat2quantity) tb.push([mat2.toString(), mat2quantity.toString()]);
    if (mat3 && mat3quantity) tb.push([mat3.toString(), mat3quantity.toString()]);
    if (mat4 && mat4quantity) tb.push([mat4.toString(), mat4quantity.toString()]);
    if (mat5 && mat5quantity) tb.push([mat5.toString(), mat5quantity.toString()]);
    if (material) tb.push([`Material`, material.toString()]);
    if (materials) tb.push([`Materials`, materials.toString()]);
    if (fablightMaterial) tb.push([`Material`, fablightMaterial.toString()]);

    if (thickness) tb.push([`Thickness`, thickness.toString()]);
    if (fablightThickness) tb.push([`Thickness`, fablightThickness.toString()]);

    if (printColor) tb.push([`Color or B/W`, printColor.toString()]);	
    if (printSize) tb.push([`Print Dimensions`, printSize.toString()]);		
    if (printCount) tb.push([`Number of Prints`, printCount.toString()]);	

    if (whichPrinter) tb.push([`Printer`, whichPrinter.toString()]);
    if (layerThickness) tb.push([`Layer Thickness`, layerThickness.toString()]);
    if (density) tb.push([`Density`, density.toString()]);
    if (fortusLayerThickness) tb.push([`Fortus Layer Thickness`, fortusLayerThickness.toString()]);
    if (densityInfill) tb.push([`Infill Density`, densityInfill.toString()]);
    if (finish) tb.push([`Finish`, finish.toString()]);
    if (markforgedDensity) tb.push([`Density`, markforgedDensity.toString()]);
    if (fiberReinforcement) tb.push([`Fiber Reinforcement`, fiberReinforcement.toString()]);
    if (fiberPattern) tb.push([`Fiber Pattern`, fiberPattern.toString()]);
    if (buildParameters) tb.push([`Parameters`, buildParameters.toString()]);
    if (dateCompleted) tb.push([`Date Completed`, dateCompleted.toString()]);
    if (elapsedTime) tb.push([`Elapsed Time`, elapsedTime.toString()]);
    if (estimate) tb.push([`Estimate`, estimate.toString()]);

    staffNotes ? tb.push([`Notes`, staffNotes.toString()]) : tb.push([`Notes`, `None`]);
    if (otherNotes) tb.push([`Additional Notes`, otherNotes.toString()]);
    if (otherJobNotes) tb.push([`Additional Notes`, otherJobNotes.toString()]);

    console.info(tb)

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
      body.appendTable([...tb])
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
   * @private
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
          rowData : data,
        }).CreateTicket();
        SetByHeader(sheet, HEADERNAMES.ticket, thisRow, ticket.getUrl());
      }
    })
  })
  return 0;
}









