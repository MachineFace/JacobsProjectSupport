/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating Response Messages
 * Properties accessed via `this.receivedMessage` or `this.failedMessage`
 * @param {string} name
 * @param {string} projectname
 * @param {number} id
 * @param {string} mat1
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {string} mat2
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @param {string} designspecialist
 * @param {string} designspecialistemaillink
 */
class MessageService {
  constructor({
    name : name, 
    projectname : projectname, 
    id : id, 
    rowData : rowData,
    designspecialist : designspecialist, 
    designspecialistemaillink : designspecialistemaillink, 
    cost : cost,
  }) {
    this.name = name ? name.toString() : `Unknown Name`;
    this.projectname = projectname ? projectname.toString() : `Unknown Project Name`;
    this.id = id ? id.toString() : IDService.createId();

    // let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
    // mat1quantity, mat1, mat2quantity, mat2, 
    // mat3quantity, mat3, mat4quantity, mat4, 
    // mat5quantity, mat5, affiliation, elapsedTime, estimate, 
    // price1, price2, sheetName, row, } = rowData;

    this.rowData = rowData;

    this.designspecialist = designspecialist ? designspecialist.toString() : `Staff`;
    this.designspecialistemaillink = designspecialistemaillink ? designspecialistemaillink : `<a href = "mailto:${SERVICE_EMAIL}">${SERVICE_EMAIL}</a>`;
    this.cost = cost ? Number(cost).toFixed(2) : 0;
    this.costFormatted = `$ ${this.cost.toString()}`;

    /** @private */
    this.greetings = `Hi ${this.name},<br/><br/>`;
    /** @private */
    this.thanks = `Thank you for applying to ${SERVICE_NAME}.<br/><br/>`;
    /** @private */
    this.location = `<b>Pick-Up & Drop-off Location:<br/>
        <a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby.<br/>
        2530 Ridge Rd, Berkeley, CA 94709</a></b><br/><br/>`;
    /** @private */
    this.hours = `<b>Pick-Up & Drop-off Hours:<br/>${PICKUP_HOURS}</b><br/><br/>`;
    /** @private */
    this.help = `If you have questions or need assistance please email ${this.designspecialistemaillink}.<br/>`;
    /** @private */
    this.salutations = `<p>Best,<br/>Jacobs Hall Staff</p>`;
    /** @private */
    this.survey = `<p><small>Please help us improve JPS by taking a moment for a brief survey:<br/><a href="https://docs.google.com/forms/d/1fICKWXj67v8k6EznXgkYz6qgiy45V8bV-X8dlRwRPDc/viewform">Take Survey</a></small></p><br/>`;
  }

  get defaultMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `A Design Specialist is reviewing you application, and will respond to you shortly.<br/><br/>`;
      message += `</p>`;
      message += this.help;
      message += this.salutations; 
      message += this.survey;
    return message; 
  }
  get receivedMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project, <b><i>${this.projectname}</i></b> has been received.<br/>`;
      message += `Your part or parts have been assigned an ID: <b><i>${this.id}.</i></b><br/>`;
      message += `We will update you when it has been started by a staff member.`;
      message += `</p>`;
      message += this.help;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get inProgressMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project has started. <br/>`;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> has been started by ${this.designspecialist}.<br/>`;
      message += `ID Number: <b><i>${this.id}.</i></b><br/>`;
      message += `Please email ${this.designspecialistemaillink} for further details.<br/><br/>`;
      message += `<b>We will update you when it is done.</b>`;
      message += `</p>`;
      message += this.help;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get completedMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> are finished.<br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/><br/>`;
      message += `<b>Your parts are now available for pickup.</b><br/>`;
      message += `</p>`;
      message += `<p>`;
      message += `Your Jacobs Store account will be billed for:<br/>`;
      message += `<ul>`;
      if (this.rowData?.mat1) message += `<li>${this.rowData?.mat1quantity} of ${this.rowData?.mat1}</li>`;   
      if (this.rowData?.mat2) message += `<li>${this.rowData?.mat2quantity} of ${this.rowData?.mat2}</li>`; 
      if (this.rowData?.mat3) message += `<li>${this.rowData?.mat3quantity} of ${this.rowData?.mat3}</li>`; 
      if (this.rowData?.mat4) message += `<li>${this.rowData?.mat4quantity} of ${this.rowData?.mat4}</li>`; 
      if (this.rowData?.mat5) message += `<li>${this.rowData?.mat5quantity} of ${this.rowData?.mat5}</li>`;  
      message += `</ul></p>`;
      if (this.cost == "" || this.cost == undefined){
        message += `<p>`;
        message += `The cost is not specified.<br/>`;
        message += `Please speak to a Design Specialist about this if you have questions.`;
        message += `</p>`;
      } else {
        message += `<p>The cost is estimated to be ${this.costFormatted}</p>`;
      }
      message += `<p>`;
      message += `Completed projects can be picked up in-person.<br/><br/>`;
      message += this.location;
      message += this.hours;
      message += this.help;
      message += `</p>`
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get pickedUpMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> have been picked up and the project is now <b>CLOSED.</b><br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/>`;
      message += this.help;
      message += `</p>`;
      message += this.salutations; 
      message += this.survey;
    return message;
  }
  get abandonedMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> are finished and have not been picked up yet.<br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/>`;
      message += `<font style="color:#FF0000";><b>Please pick up your parts SOON before they are disposed of in the free-prints bin.</b></font><br/>`;
      message += `Completed projects can be picked up in-person.<br/><br/>`;
      message += this.location;
      message += this.hours;
      message += this.help;
      message += `</p>`;
      message += this.salutations; 
      message += this.survey;
    return message;
  }
  get failedMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project, <b><i>${this.projectname}</i></b> has unfortunately failed.<br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/><br/>`;
      message += this.help;
      message += `</p>`;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get rejectedByStudentMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `You have elected not to proceed with the design process.<br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/><br/>`;
      message += `Please contact ${this.designspecialist} for more information, or if you believe this to be an error: ${this.designspecialistemaillink}<br/><br/>`;
      message += this.help;
      message += `</p>`;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get rejectedByStaffMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `A staff member has cancelled and/or declined this project with the Project Name: <b><i>${this.projectname}</b></i>.<br/>`;
      message += `ID Number: <b><i>${this.id}</i></b><br/><br/>`;
      message += `Please contact ${this.designspecialist} for more information, or if you believe this to be an error: ${this.designspecialistemaillink}<br/><br/>`;
      message += `You may also choose to resubmit this project as a new submission.<br/>`;
      message += this.help;
      message += `</p>`;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get waitlistMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project, <b><i>${this.projectname}</i></b> has been temporarily waitlisted. `;
      message += `You will be notified when your project starts.<br/>`; 
      message += `ID Number: <b><i>${this.id}</i></b><br/><br/>`;
      message += `Please contact ${this.designspecialist} for more information: ${this.designspecialistemaillink}.<br/>`;
      message += `No action is required at this time.<br/><br/>`;
      message += this.help;
      message += `</p>`;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get billedMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project <b><i>${this.projectname}</b></i> is now <b>CLOSED.</b><br/>`;
      message += `ID Number: <b><i>${this.id}.</i></b><br/><br/>`;
      message += `Your Jacobs Store account has been billed for: <br/> `;
      message += `</p>`;
      message += `<p><ul>`;
      if (this.rowData?.mat1) message += `<li>${this.rowData?.mat1quantity} of ${this.rowData?.mat1}</li>`;   
      if (this.rowData?.mat2) message += `<li>${this.rowData?.mat2quantity} of ${this.rowData?.mat2}</li>`; 
      if (this.rowData?.mat3) message += `<li>${this.rowData?.mat3quantity} of ${this.rowData?.mat3}</li>`; 
      if (this.rowData?.mat4) message += `<li>${this.rowData?.mat4quantity} of ${this.rowData?.mat4}</li>`; 
      if (this.rowData?.mat5) message += `<li>${this.rowData?.mat5quantity} of ${this.rowData?.mat5}</li>`;  
      message += `</ul></p>`;     // dont forget to end the bullet point list (unordered list)
      if (this.cost == "" || this.cost == undefined || this.cost == 0){
        message += `<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br/></p></br>`;
      } else {
        message += `<p>The cost is estimated to be ${this.costFormatted}</p><br/><br/>`;
      }
      message += `If you have not picked up your parts, they can be picked up in-person.`;
      message += `</p>`;
      message += this.help;
      message += this.salutations;
      message += this.survey;
    return message;
  }
  get noAccessMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Your project: <b><i>${this.projectname}</i></b> has been prevented from advancing until we have received confirmation of your approval. <br/><br/>`;
      message += `You may be receiving this message because:`;
      message += `<ol>`;
      message += `<li><b><a href="https://jacobsaccess.ist.berkeley.edu/jps/signup">You haven't registered for this service yet.</a></b></li>`;
      message += `<li>Researchers are added when we receive IOC payment approval from their PI.</li>`; 
      message += `<li>Researchers are urged to contact their PI to ensure they have appropriate approval.</li>`;
      message += `<li>DES INV and affiliated courses students are approved automatically upon registration submission.</li>`; 
      message += `</ol>`;
      message += `Information on how to gain access can be found at <a href="https://jacobsinstitute.berkeley.edu/jps/"><b>Here</b></a><br/><br/>`;
      message += `Please register if you have not done so yet: <br/>`;
      message += `<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>`;
      message += `Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.`;
      message += `</p>`;
      message += this.help;
      message += this.salutations;
      message += this.survey;
    return message;
  }
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Submission Response Message
 * @param {string} name
 * @param {string} projectname
 * @param {string} id
 */
class CreateSubmissionMessage {
  constructor({
    name : name, 
    projectname : projectname, 
    id : id,
  }) {
    this.name = name ? name : `Unknown Name`;
    this.projectname = projectname ? projectname : `Unknown Project Name`;
    this.id = id ? id : IDService.createId();

    /** @private */
    this.greetings = `Hi ${this.name},`;
    /** @private */
    this.thanks = `Thank you for choosing ${SERVICE_NAME}.<br/>`;
    /** @private */
    this.help = `If you have questions or need assistance please email <a href = "mailto:${SERVICE_EMAIL}">${SERVICE_EMAIL}.</a><br/>`;
    /** @private */
    this.salutations = `<p>Best,<br/>Jacobs Hall Staff</p>`;
  }
  get dsMessage() {
    let message = `<p>Hello!</p> `;
      message += `<p>`;
      message += `You have a new submission to your area.<br/>`;
      message += `Please assign yourself as the DS in the <a href = "https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ/">Spreadsheet</a><br/>`;
      message += `Reminder: Only changing the status of the submission will trigger emails to you and the student.<br/>`; 
      message += `Below is a summary of the student submission.<br/>`;
      message += `</p>`;
      message += `<p>Best,<br/>${SERVICE_NAME}</p>`;
      message += `<br/>`;
      message += `<b>SUMMARY:</b>`;
      message += `<br/>`;
    return message;
  }
  get gsiPlotterMessage() {
    let message = `<p>`;
      message += this.greetings;
      message += this.thanks;
      message += `Large-format paper plotting has been requested for your course.<br/>`;
      message += `ID Number: <i>${this.id}</i><br/>`;
      message += `<br/>`;
      message += `A staff member will begin plotting your courses prints as soon as possible. <br/><br/>`;
      message += `</p>`;
      message += `<p>`;
      message += `<b>Pick-up Location:<br/>`;
      message += `<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby<br/>`; 
      message += `2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>`;
      message += `<b>Pick-up Hours:<br/>`;
      message += `${PICKUP_HOURS}</b><br/><br/>`
      message += this.help;
      message += `</p>`;
      message += this.salutations;
    return message;
  }
  get missingAccessMessage() {
    let message = `<p>`;
      message += `Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br/>`;
      message += `Your project: <b><i>${this.projectname}</i></b> has been prevented from advancing until we have received confirmation of your approval.<br/>`;
      message += `You may be receiving this message because:`;
      message += `<ol>`;
      message += `<li><b><a href="https://jacobsaccess.ist.berkeley.edu/jps/signup">You haven't registered for this service yet.</a></b></li>`;
      message += `<li>Researchers are added when we receive IOC payment approval from their PI.</li>`; 
      message += `<li>Researchers are urged to contact their PI to ensure they have appropriate approval.</li>`;
      message += `<li>DES INV and affiliated courses students are approved automatically upon registration submission.</li>`; 
      message += `</ol>`;
      message += `If you recently applied, please allow approximately 3 days for the approval to move through the system, and disregard this email.<br/><br/>`;
      message += `Information on how to gain access can be found <a href="https://jacobsinstitute.berkeley.edu/jps/"><b>Here.</b></a><br/><br/>`;
      message += `Please register if you have not done so yet: <br/>`;
      message += `<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>`;
      message += `Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.</p>`;
      message += `</p>`;
      message += this.help;
      message += this.salutations;
    return message;
  }
}









