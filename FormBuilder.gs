
/**
 * ----------------------------------------------------------------------------------------------------------------
 * @REMOVEDFROMSERVICE
 * Class for Building an Approval Form
 */
class FormBuilderService {
  constructor() {
    
  }

  /**
   * Create Approval Form
   * @param {string} name
   * @param {string} id
   * @param {float} cost 
   * @param {string} title
   */
  static CreateApprovalForm({
    name : name = `Some Name`,
    id : id = IDService.createId(),
    cost : cost = 0.0,
    title : title = `Approval Form`,
  }) {
    try {
      let costFormatted = Utilities.formatString("$%.2f", cost);
      let url = ``;
      const destination = DriveApp.getFoldersByName(`Job Forms`);
      const form = FormApp.create(title);
      const sendloc = "16oCqmnW9zCUhpQLo3TXsaUSxDcSv7aareEVSE9zYtVQ";
      form
        .setDestination(FormApp.DestinationType.SPREADSHEET, sendloc )
        .setTitle(title)
        .setDescription(`Referrence Number: ${id}`)
        .setConfirmationMessage(`Thanks for responding!`)
        .setAllowResponseEdits(false)
        .setAcceptingResponses(true);

      // Ask Questions
      let item;
      if (cost == "" || cost == undefined || cost <= 0) {
        console.warn(`No known cost. Cost = ${cost}`);
        item = form.addMultipleChoiceItem();
        item
          .setRequired(true)
          .setTitle(`The cost of materials for this project were not specified. 
            Please speak with a Design Specialist if you have questions. 
            Do you approve the work to be completed by a Design Specialist or Student Supervisor, 
            and approve of a bill being generated for the materials used?`)
          .setChoices([
            item.createChoice(`Yes, I approve.`),
            item.createChoice(`No. I reject.`),
          ]);
      } else {
        
        console.info(`Approval form: Known Cost = ${costFormatted}`);
        item = form.addMultipleChoiceItem();
        item
          .setRequired(true)
          .setTitle(`The cost of materials for this project are estimated to be: ${costFormatted}. 
            Do you approve the work to be completed by a Design Specialist or Student Supervisor, 
            and approve of a bill being generated for the materials used?`)
          .setChoices([
            item.createChoice(`Yes, I approve.`),
            item.createChoice(`No. I reject.`),
          ]);
      }
      let item2 = form.addMultipleChoiceItem();
      item2
        .setRequired(true)
        .setTitle(`Please select your name below.`)
        .setChoices([
          item2.createChoice(name)
        ]);
      let item3 = form.addMultipleChoiceItem();
      item3
        .setRequired(true)
        .setTitle(`Please select the ID number below.`)
        .setChoices([
          item3.createChoice(id)
        ]);
      url = form.getPublishedUrl();
      console.info(`Created an Approval Form for the student.`);

      let id = form.getId();
      DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); 
      let docFile = DriveApp.getFileById(id);
      DriveApp.removeFile(docFile);
      while(destination.hasNext()) {
        destination.next().addFile(docFile);
      }
      console.info(`Form Successfully Created : ${url}`);
      return url;
    } catch (err) {
      console.error(`${err} : Couldn't generate Approval Form`);
      return 1;
    }
  }


}








