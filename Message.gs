/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating Response Messages
 * Properties accessed via `this.receivedMessage` or `this.failedMessage`
 * @param {string} name
 * @param {string} projectname
 * @param {number} jobnumber
 * @param {string} mat1
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {string} mat2
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @param {string} designspecialist
 * @param {string} designspecialistemaillink
 */
class CreateMessage {
  constructor({
    name : name, 
    projectname : projectname, 
    jobnumber : jobnumber, 
    rowData : rowData,
    designspecialist : designspecialist, 
    designspecialistemaillink : designspecialistemaillink, 
    cost : cost,
  }) {
    this.name = name ? name.toString() : `Unknown Name`;
    this.projectname = projectname ? projectname.toString() : `Unknown Project Name`;
    this.jobnumber = jobnumber ? jobnumber.toString() : new JobnumberService().jobnumber;

    // let { status, ds, priority, ticket, jobnumber, timestamp, email, name, sid, projectName, 
    // mat1quantity, mat1, mat2quantity, mat2, 
    // mat3quantity, mat3, mat4quantity, mat4, 
    // mat5quantity, mat5, affiliation, elapsedTime, estimate, 
    // price1, price2, sheetName, row, } = rowData;

    this.rowData = rowData;

    this.designspecialist = designspecialist ? designspecialist.toString() : `Staff`;
    this.designspecialistemaillink = designspecialistemaillink ? designspecialistemaillink : `<a href = "mailto:jacobsprojectsupport@berkeley.edu">jacobsprojectsupport@berkeley.edu</a>`;
    this.cost = cost ? Number(cost).toFixed(2) : 0;
    this.costFormatted = `$ ${this.cost.toString()}`;
  }

  get defaultMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for applying to ${SERVICE_NAME}.<br/><br/>`;
      message += `A Design Specialist is reviewing you application, and will respond to you shortly.<br/><br/>`;
      message += `If you have questions or need assistance please email ${this.email}. <br/></p>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`; 
    return message; 
  }
  get receivedMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `Your project, <b><i>${this.projectname}</i></b> has been received.<br/>`;
      message += `Your part or parts have been assigned a job number: <i>${this.jobnumber}</i>.<br/>`;
      message += `If you have questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `We will update you when it has been started by a staff member.</p>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get inProgressMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}. Your project has started. <br />`;
      message += `Your job number: <i>${this.jobnumber}</i>.<br/>`;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> has been started by ${this.designspecialist}.<br/>`;
      message += `Please email ${this.designspecialistemaillink} for further details.<br/>`;
      message += `If you have questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<br />We will update you when it is done.</p>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get completedMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> are finished. Job Number: <i>${this.jobnumber}</i><br />`;
      message += `Your parts are now available for pickup.<br />`;
      message += `Please email ${this.designspecialist} at ${this.designspecialistemaillink} for further details.<br/>`;
      message += `Your Jacobs Store account will be billed for: <br/> `;
      message += `<p><ul>`;
      if (this.rowData?.mat1) message += `<li>${this.rowData?.mat1quantity} of ${this.rowData?.mat1}</li>`;   
      if (this.rowData?.mat2) message += `<li>${this.rowData?.mat2quantity} of ${this.rowData?.mat2}</li>`; 
      if (this.rowData?.mat3) message += `<li>${this.rowData?.mat3quantity} of ${this.rowData?.mat3}</li>`; 
      if (this.rowData?.mat4) message += `<li>${this.rowData?.mat4quantity} of ${this.rowData?.mat4}</li>`; 
      if (this.rowData?.mat5) message += `<li>${this.rowData?.mat5quantity} of ${this.rowData?.mat5}</li>`;  
      message += `</ul>`;     // dont forget to end the bullet point list (unordered list)
      if (this.cost == "" || this.cost == undefined){
        message += `<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br /><p></br>`;
      }
      else message += `<p>The cost is estimated to be ${this.costFormatted} <br /><p></br>`;
      message += `<br/>`;
      message += `Completed projects can be picked up in-person.<br/><br/>`;
      message += `<b>Pick-Up Location:<br/>`;
      message += `<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby. <br/>`; 
      message += `2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>`;
      message += `<b>Pick-Up Hours:<br/>`;
      message += `${PickupHours}</b><br/><br/>`
      message += `If you have any further questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Please take a moment to take our survey so we can improve JPS : `
      message += `<a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`; 
    return message;
  }
  get pickedUpMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> have been picked up and the project is now CLOSED. Job Number: <i>${this.jobnumber}</i><br />`;
      message += `Please email ${this.designspecialist} at ${this.designspecialistemaillink} if you have any additional questions.<br/>`;
      message += `<p>Please take a moment to take our survey so we can improve JPS : `
      message += `<a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`; 
    return message;
  }
  get abandonedMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `The part or parts requested for your project, <b><i>${this.projectname}</i></b> are finished and have not been picket up yet. Job Number: <i>${this.jobnumber}</i><br />`;
      message += `<font style="color:#FF0000";><b>Please pick up your parts SOON before they are disposed of in the free-prints bin.</b></font><br />`;
      message += `Please email ${this.designspecialist} at ${this.designspecialistemaillink} if you have questions or concerns.<br/>`;
      message += `Completed projects can be picked up in-person.<br/><br/>`;
      message += `<b>Pick-Up Location:<br/>`;
      message += `<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby. <br/>`; 
      message += `2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>`;
      message += `<b>Pick-Up Hours:<br/>`;
      message += `${PickupHours}</b><br/><br/>`
      message += `If you have any further questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Please take a moment to take our survey so we can improve JPS : `
      message += `<a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`; 
    return message;
  }
  get failedMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `Your project, <b><i>${this.projectname}</i></b> has unfortunately failed. Job Number: <i>${this.jobnumber}</i><br /><br />`;
      message += `Please contact ${this.designspecialist} for more information: ${this.designspecialistemaillink}<br /><br />`;
      message += `If you have any questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get rejectedByStudentMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `You have elected not to proceed with the design process. Job Number: <i>${this.jobnumber}</i><br /><br />`;
      message += `Please contact ${this.designspecialist} for more information, or if you believe this to be an error: ${this.designspecialistemaillink}<br /><br />`;
      message += `If you have any questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get rejectedByStaffMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `A staff member has cancelled and/or declined this job with the Project Name: <b><i>${this.projectname}</b></i>. Job Number: <i>${this.jobnumber}</i><br /><br />`;
      message += `Please contact ${this.designspecialist} for more information, or if you believe this to be an error: ${this.designspecialistemaillink}<br /><br />`;
      message += `You may also choose to resubmit this job as a new submission.<br/>`;
      message += `If you have any questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get waitlistMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `Your project, <b><i>${this.projectname}</i></b> has been temporarily waitlisted. `;
      message += `You will be notified when your job starts. Job Number: <b><i>${this.jobnumber}</i></b><br /><br />`;
      message += `Please contact ${this.designspecialist} for more information: ${this.designspecialistemaillink}. No action is required at this time.<br /><br />`;
      message += `If you have any questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get billedMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}. Your project <b><i>${this.projectname}</b></i> is now <b>CLOSED.</b><br />`;
      message += `Job Number: <i>${this.jobnumber}</i>. Your Jacobs Store account has been billed for: <br/> `;
      message += `<p><ul>`;
      if (this.rowData?.mat1) message += `<li>${this.rowData?.mat1quantity} of ${this.rowData?.mat1}</li>`;   
      if (this.rowData?.mat2) message += `<li>${this.rowData?.mat2quantity} of ${this.rowData?.mat2}</li>`; 
      if (this.rowData?.mat3) message += `<li>${this.rowData?.mat3quantity} of ${this.rowData?.mat3}</li>`; 
      if (this.rowData?.mat4) message += `<li>${this.rowData?.mat4quantity} of ${this.rowData?.mat4}</li>`; 
      if (this.rowData?.mat5) message += `<li>${this.rowData?.mat5quantity} of ${this.rowData?.mat5}</li>`;  
      message += `</ul>`;     // dont forget to end the bullet point list (unordered list)
      if (this.cost == "" || this.cost == undefined || this.cost == 0){
        message += `<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br /><p></br>`;
      }
      else message += `<p>The cost is estimated to be ${this.costFormatted} <br /><p></br>`;
      message += `<br/>`;
      message += `If you have not picked up your parts, they can be picked up in-person.<br/><br/>`;
      message += `If you have any further questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Please take a moment to take our survey so we can improve JPS : `
      message += `<a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get noAccessMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}. `;
      message += `Your project: <b><i>${this.projectname}</i></b> has been prevented from advancing until we have received confirmation of your approval. <br/><br/>`;
      message += `You may be receiving this message because you haven't registered for this service yet. `;
      message += `DES INV and affiliated courses students are approved automatically upon registration submission. `; 
      message += `Researchers are added when we receive IOC payment approval from their PI. `; 
      message += `Researchers are urged to contact their PI to ensure they have appropriate approval.<br/>`;
      message += `Information on how to gain access can be found at <a href="https://jacobsinstitute.berkeley.edu/jps/"><b>Here</b></a><br/><br/>`;
      message += `Please register if you have not done so yet: <br/>`;
      message += `<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>`;
      message += `</p>`;
      message += `If you have questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `. <br />Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.</p>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Submission Response Message
 * @param {string} name
 * @param {string} projectname
 * @param {string} jobnumber
 */
class CreateSubmissionMessage {
  constructor({
    name : name, 
    projectname : projectname, 
    jobnumber : jobnumber,
  }) {
    this.name = name ? name : `Unknown Name`;
    this.projectname = projectname ? projectname : `Unknown Project Name`;
    this.jobnumber = jobnumber ? jobnumber : new JobnumberService().jobnumber;
  }
  get dsMessage() {
    let message = `<p>Hello!</p> `;
      message += `<p>You have a new submission to your area.<br />`;
      message += `Please assign yourself as the DS in the <a href = "https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ/">Spreadsheet</a><br />`;
      message += `Reminder: Only changing the status of the job will trigger emails to you and the student. Below is a summary of the student submission.<br/>`;
      message += `<p>Best,<br />${SERVICE_NAME}</p>`;
      message += `<br/>`;
      message += `SUMMARY:`;
      message += `<br/>`;
    return message;
  }
  get creaformMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `Part scanning has been requested for your project. Job Number: <i>${this.jobnumber}</i><br />`;
      message += `<br/>`;
      message += `Parts can be dropped off in-person safely at our touchless dropoff window. <br/><br/>`;
      message += `<b>Drop-off Location:<br/>`;
      message += `<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby<br/>`; 
      message += `2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>`;
      message += `<b>Drop-off Hours:<br/>`;
      message += `${PickupHours}</b><br/><br/>`
      message += `Please email ${InvokeDS("Chris", "fullname")} at ${InvokeDS("Chris", "emaillink")} for further details.<br/>`;
      message += `If you have any further questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get gsiPlotterMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}.<br />`;
      message += `Large-format paper plotting has been requested for your course. Job Number: <i>${this.jobnumber}</i><br />`;
      message += `<br/>`;
      message += `A staff member will begin plotting your courses prints as soon as possible. <br/><br/>`;
      message += `<b>Pick-up Location:<br/>`;
      message += `<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall LeRoy Ave. Main Entrance - Room 234 / Lobby<br/>`; 
      message += `2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>`;
      message += `<b>Pick-up Hours:<br/>`;
      message += `${PickupHours}</b><br/><br/>`
      message += `Please email ${InvokeDS("Cody", "fullname")} at ${InvokeDS("Cody", "emaillink")} for further details.<br/>`;
      message += `If you have any further questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
  get missingAccessMessage() {
    let message = `<p>Hi ${this.name},</p>`;
      message += `<p>Thank you for choosing ${SERVICE_NAME}. Your project: <b><i>${this.projectname}</i></b> has been prevented from advancing until we have received confirmation of your approval. `;
      message += `If you recently applied, please allow approximately 3 days for the approval to move through the system, and disregard this email.<br/><br/>`;
      message += `DES INV and affiliated courses students are approved automatically upon registration submission. Researchers are added when we receive IOC payment approval from their PI. `;
      message += `Researchers are urged to contact their PI to ensure they have appropriate approval.<br/>`;
      message += `Information on how to gain access can be found <a href="https://jacobsinstitute.berkeley.edu/jps/"><b>Here.</b></a><br/><br/>`;
      message += `Please register if you have not done so yet: <br/>`;
      message += `<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>`;
      message += `</p>`;
      message += `If you have questions or need assistance please email ${InvokeDS("Staff", "emaillink")}. <br/>`;
      message += `. <br />Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.</p>`;
      message += `<p>Best,<br />Jacobs Hall Staff</p>`;
    return message;
  }
}









