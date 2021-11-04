
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Building an Approval Form
 */
class ApprovalFormBuilder
{
  constructor({
    name = `Some Name`,
    jobnumber = 129384712398,
    cost = 2.50,
  }) {
    this.name = name;
    this.jobnumber = jobnumber;
    this.cost = cost;
    this.destination = DriveApp.getFoldersByName(`Job Forms`);
    this.form = FormApp.create("Approval Form");
    this.CreateApprovalForm();
    this.url;
  }

  CreateApprovalForm () {
    const sendloc = "16oCqmnW9zCUhpQLo3TXsaUSxDcSv7aareEVSE9zYtVQ";
    try {
      this.form
        .setDestination( FormApp.DestinationType.SPREADSHEET, sendloc )
        .setTitle(`Approval Form`)
        .setDescription(`Referrence Number: ${this.jobnumber}`)
        .setConfirmationMessage(`Thanks for responding!`)
        .setAllowResponseEdits(false)
        .setAcceptingResponses(true);

      // Ask Questions
      let item;
      if (this.cost == "" || this.cost == undefined || this.cost == 0) {
        Logger.log(`Approval form: No known cost. Cost = ${this.cost}`);
        item = this.form.addMultipleChoiceItem();
        item
          .setRequired(true)
          .setTitle(`For this job, the cost of materials was not specified. 
            Please speak with a Design Specialist if you have questions. 
            Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`)
          .setChoices([
            item.createChoice(`Yes, I approve.`),
            item.createChoice(`No. I reject.`),
          ]);
      } else {
        let costFormatted = Utilities.formatString("$%.2f", this.cost);
        Logger.log(`Approval form: Known Cost = ${costFormatted}`);
        item = this.form.addMultipleChoiceItem();
        item
          .setRequired(true)
          .setTitle(`For this job, the cost of materials is estimated to be: ${costFormatted}. Do you approve the work to be completed by a Design Specialist or Student Supervisor, 
            and approve of a bill being generated for the materials used?`)
          .setChoices([
            item.createChoice(`Yes, I approve.`),
            item.createChoice(`No. I reject.`),
          ]);
      }
      let item2 = this.form.addMultipleChoiceItem();
      item2
        .setRequired(true)
        .setTitle(`Please select your name below.`)
        .setChoices([
          item2.createChoice(this.name)
        ]);
      let item3 = this.form.addMultipleChoiceItem();
      item3
        .setRequired(true)
        .setTitle(`Please select the job number below.`)
        .setChoices([
          item3.createChoice(this.jobnumber)
        ]);
      this.url = this.form.getPublishedUrl();
      Logger.log(`Created an Approval Form for the student.`);
    } catch (err) {
      Logger.log(`${err} : Couldn't generate Approval Form`);
    }

    try {
      let id = this.form.getId();
      DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); 
      let docFile = DriveApp.getFileById(id);
      DriveApp.removeFile(docFile);
      while(this.destination.hasNext()) {
        this.destination.next().addFile(docFile);
      }
      Logger.log(`Form Successfully Created : ${this.url}`);
    } catch (err) {
      Logger.log(`${err} : Couldn't delete the form in that spot. Probably still has the form linked.` );
    }
    return this.url;
  };
}


const _testApprovalForm = () => {
  const former = new ApprovalFormBuilder({
    name : "Dingus",
    jobnumber : 19238712398,
    cost : 50.00,
  });
}







