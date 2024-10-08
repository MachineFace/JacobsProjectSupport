
/**
 * ----------------------------------------------------------------------------------------------------------------
 * @REMOVEDFROMSERVICE
 * Class for Building an Approval Form
 * @param {string} name
 * @param {string} id
 * @param {float} cost
 */
// class ApprovalFormBuilder {
//   constructor({
//     name : name = `Some Name`,
//     id : id = new IDService().id,
//     cost : cost = 2.50,
//   }) {
//     /** @private */
//     this.name = name;
//     /** @private */
//     this.id = id;
//     /** @private */
//     this.cost = cost;
//     /** @private */
//     this.destination = DriveApp.getFoldersByName(`Job Forms`);
//     /** @private */
//     this.form = FormApp.create(`Approval Form`);
//     /** @private */
//     this.CreateApprovalForm();
//     this.url;
//   }

//   /**
//    * Create Approval Form
//    */
//   CreateApprovalForm () {
//     const sendloc = "16oCqmnW9zCUhpQLo3TXsaUSxDcSv7aareEVSE9zYtVQ";
//     try {
//       this.form
//         .setDestination(FormApp.DestinationType.SPREADSHEET, sendloc )
//         .setTitle(`Approval Form`)
//         .setDescription(`Referrence Number: ${this.id}`)
//         .setConfirmationMessage(`Thanks for responding!`)
//         .setAllowResponseEdits(false)
//         .setAcceptingResponses(true);

//       // Ask Questions
//       let item;
//       if (this.cost == "" || this.cost == undefined || this.cost == 0) {
//         console.warn(`Approval form: No known cost. Cost = ${this.cost}`);
//         item = this.form.addMultipleChoiceItem();
//         item
//           .setRequired(true)
//           .setTitle(`The cost of materials for this project were not specified. 
//             Please speak with a Design Specialist if you have questions. 
//             Do you approve the work to be completed by a Design Specialist or Student Supervisor, and approve of a bill being generated for the materials used?`)
//           .setChoices([
//             item.createChoice(`Yes, I approve.`),
//             item.createChoice(`No. I reject.`),
//           ]);
//       } else {
//         let costFormatted = Utilities.formatString("$%.2f", this.cost);
//         console.info(`Approval form: Known Cost = ${costFormatted}`);
//         item = this.form.addMultipleChoiceItem();
//         item
//           .setRequired(true)
//           .setTitle(`The cost of materials for this project are estimated to be: ${costFormatted}. Do you approve the work to be completed by a Design Specialist or Student Supervisor, 
//             and approve of a bill being generated for the materials used?`)
//           .setChoices([
//             item.createChoice(`Yes, I approve.`),
//             item.createChoice(`No. I reject.`),
//           ]);
//       }
//       let item2 = this.form.addMultipleChoiceItem();
//       item2
//         .setRequired(true)
//         .setTitle(`Please select your name below.`)
//         .setChoices([
//           item2.createChoice(this.name)
//         ]);
//       let item3 = this.form.addMultipleChoiceItem();
//       item3
//         .setRequired(true)
//         .setTitle(`Please select the ID number below.`)
//         .setChoices([
//           item3.createChoice(this.id)
//         ]);
//       this.url = this.form.getPublishedUrl();
//       console.info(`Created an Approval Form for the student.`);
//     } catch (err) {
//       console.error(`${err} : Couldn't generate Approval Form`);
//     }

//     try {
//       let id = this.form.getId();
//       DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT); 
//       let docFile = DriveApp.getFileById(id);
//       DriveApp.removeFile(docFile);
//       while(this.destination.hasNext()) {
//         this.destination.next().addFile(docFile);
//       }
//       console.info(`Form Successfully Created : ${this.url}`);
//     } catch (err) {
//       console.error(`${err} : Couldn't delete the form in that spot. Probably still has the form linked.` );
//     }
//     return this.url;
//   }
// }








