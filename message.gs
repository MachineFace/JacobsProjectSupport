/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating Response Messages
 * Properties accessed via 'this.receivedMessage' or 'this.failedMessage'
 * @param {string} name
 * @param {string} projectname
 * @param {number} jobnumber
 * @param {string} approvalURL
 * @param {string} mat1
 * @param {string} material1URL
 * @param {number} material1Quantity
 * @param {string} material1Name
 * @param {string} mat2
 * @param {string} material2URL
 * @param {number} material2Quantity
 * @param {string} material2Name
 * @param {string} designspecialist
 * @param {string} designspecialistemaillink
 */
class CreateMessage
{
    constructor(name, projectname, jobnumber, approvalURL,
    material1URL, material1Quantity, material1Name,
    material2URL, material2Quantity, material2Name,
    material3URL, material3Quantity, material3Name,
    material4URL, material4Quantity, material4Name,
    material5URL, material5Quantity, material5Name,
    designspecialist, designspecialistemaillink, cost)
    {
      this.name = name;
      this.projectname = projectname;
      this.jobnumber = jobnumber;
      this.approvalURL = approvalURL;

      this.material1Name = material1Name;
      this.material2Name = material2Name;
      this.material3Name = material3Name;
      this.material4Name = material4Name;
      this.material5Name = material5Name;

      this.material1Quantity = material1Quantity;
      this.material2Quantity = material2Quantity;
      this.material3Quantity = material3Quantity;
      this.material4Quantity = material4Quantity;
      this.material5Quantity = material5Quantity;

      this.material1URL = material1URL;
      this.material2URL = material2URL;
      this.material3URL = material3URL;
      this.material4URL = material4URL;
      this.material5URL = material5URL;

      this.designspecialist = designspecialist;
      this.designspecialistemaillink = designspecialistemaillink;
      this.cost = cost;
      this.costFormatted = Utilities.formatString( '$%.2f', cost);
    }

    get defaultMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for applying to Jacobs Project Support.<br/><br/>';
            message += 'A Design Specialist is reviewing you application, and will respond to you shortly.<br/><br/>';
            message += 'If you have questions or need assistance please email ' + this.email + '. <br/></p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>'; 
        return message; 
    }
    get receivedMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'Your project, <b><i>' + this.projectname + '</i></b> has been received.<br/>';
            message += 'Your part or parts have been assigned a job number: <i>' + this.jobnumber + '</i>.<br/>';
            message += 'If you have questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += 'We will update you when it has been started by a staff member.</p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get pendingMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support. Your project is awaiting an approval or rejection from you. <br />';
            if (this.cost == "" || this.cost == undefined || this.cost == 0){
                message += '<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br /><p></br>';
            }
            else message += '<p>The cost is estimated to be ' + this.costFormatted + ' <br /><p></br>';
            message += 'Your project: <b><i>' + this.projectname + '</i></b> with the job number <i>' + this.jobnumber + '</i>, can be approved or rejected by clicking this link and approving or rejecting:';
            message += '<br/><br/><b>' + this.approvalURL + '</b><br/><br/>';
            message += 'Pending approval, your Jacobs Store account will be billed for: <br/> ';
            if (this.material1Name) message += '<p><ul>'; //start bulletpoint list
            if (this.material1Name) message += '<li><a href = "' + this.material1URL + '">' + this.material1Quantity + ' of ' + this.material1Name + '</a></li>';  
            if (this.material2Name) message += '<li><a href = "' + this.material2URL + '">' + this.material2Quantity + ' of ' + this.material2Name + '</a></li>';
            if (this.material3Name) message += '<li><a href = "' + this.material3URL + '">' + this.material3Quantity + ' of ' + this.material3Name + '</a></li>'; 
            if (this.material4Name) message += '<li><a href = "' + this.material4URL + '">' + this.material4Quantity + ' of ' + this.material4Name + '</a></li>'; 
            if (this.material5Name) message += '<li><a href = "' + this.material5URL + '">' + this.material5Quantity + ' of ' + this.material5Name + '</a></li>'; 
            else message += '<ul/><li>Your Jacobs Store account will be billed for the materials</a> required. </li><br/> ';
            message += '</ul>';     // end bulletpoint list
            message += '</p><br/>';
            message += 'If you have questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '.<br/>';
            message += '. <br />We will update you when it has been started.</p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get inProgressMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support. Your project has started. <br />';
            message += 'Your job number: <i>' + this.jobnumber + '</i>.<br/>';
            message += 'The part or parts requested for your project, <b><i>' + this.projectname + '</i></b> has been started by ' + this.designspecialist + '.<br/>';
            message += 'Please email ' + this.designspecialistemaillink + ' for further details.<br/>';
            message += 'If you have questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<br />We will update you when it is done.</p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get completedMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'The part or parts requested for your project, <b><i>' + this.projectname + '</i></b> are finished. Job Number: <i>' + this.jobnumber + '</i><br />';
            message += 'Your parts are now available for pickup.<br />';
            message += 'Please email ' + this.designspecialist + ' at ' + this.designspecialistemaillink + ' for further details.<br/>';
            message += 'Your Jacobs Store account will be billed for: <br/> ';
            message += '<p><ul>';
            if (this.material1Name) message += '<li><a href = "' + this.material1URL + '">' + this.material1Quantity + ' of ' + this.material1Name + '</a></li>';   
            if (this.material2Name) message += '<li><a href = "' + this.material2URL + '">' + this.material2Quantity + ' of ' + this.material2Name + '</a></li>'; 
            if (this.material3Name) message += '<li><a href = "' + this.material3URL + '">' + this.material3Quantity + ' of ' + this.material3Name + '</a></li>'; 
            if (this.material4Name) message += '<li><a href = "' + this.material4URL + '">' + this.material4Quantity + ' of ' + this.material4Name + '</a></li>'; 
            if (this.material5Name) message += '<li><a href = "' + this.material5URL + '">' + this.material5Quantity + ' of ' + this.material5Name + '</a></li>';  
            else message += 'Your Jacobs Store account will be billed for the materials used. <br/> ';    
            message += '</ul>';     // dont forget to end the bullet point list (unordered list)
            if (this.cost == "" || this.cost == undefined || this.cost == 0){
                message += '<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br /><p></br>';
            }
            else message += '<p>The cost is estimated to be ' + this.costFormatted + ' <br /><p></br>';
            message += '<br/>';
            message += 'Completed projects can be picked up in-person, unless otherwise noted with your instructor.<br/><br/>';
            message += '<b>Pick-Up Location:<br/>';
            message += '<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall South side - Room 110 Side Doors<br/>'; 
            message += '2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>';
            message += '<b>Pick-Up Hours:<br/>';
            message += 'Monday - Friday: 11am - 1pm & 5pm - 7pm.</b><br/><br/>'
            message += 'If you have any further questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Please take a moment to take our survey so we can improve JPS : <a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>'; 
        return message;
    }
    get shippingQuestion() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'You have requested shipping for your part <b><i>' + this.projectname + '</i></b>. Job Number: <i>' + this.jobnumber + '</i><br/>';
            message += 'In order to send your parts to you, please fill out this form:<br />';
            message += '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdgk5-CjHOWJmAGja3Vk7L8a7ddLwTsyJhGicqNK7G-I5RjIQ/viewform"><b>Shipping Form</b></a>';
            message += 'Please contact ' + this.designspecialist + ' for more information: ' + this.designspecialistemaillink + 'for further details.<br/>';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get shippedMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'The part or parts requested for your project, <b><i>' + this.projectname + '</i></b> are finished. Job Number: <i>' + this.jobnumber + '</i><br/>';
            message += 'Your parts will be shipped shortly.<br />';
            message += 'Please contact ' + this.designspecialist + ' for more information: ' + this.designspecialistemaillink + 'for further details.<br/>';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get failedMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'Your project, <b><i>' + this.projectname + '</i></b> has unfortunately failed. Job Number: <i>' + this.jobnumber + '</i><br /><br />';
            message += 'Please contact ' + this.designspecialist + ' for more information: ' + this.designspecialistemaillink + '<br /><br />';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get rejectedByStudentMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'You have elected not to proceed with the design process. Job Number: <i>' + this.jobnumber + '</i><br /><br />';
            message += 'Please contact ' + this.designspecialist + ' for more information, or if you believe this to be an error: ' + this.designspecialistemaillink + '<br /><br />';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get rejectedByStaffMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'A staff member has cancelled and/or declined this job with the Project Name: <b><i>' + this.projectname + '</b></i>. Job Number: <i>' + this.jobnumber + '</i><br /><br />';
            message += 'Please contact ' + this.designspecialist + ' for more information, or if you believe this to be an error: ' + this.designspecialistemaillink + '<br /><br />';
            message += 'You may also choose to resubmit this job as a new submission.<br/>';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';;
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get waitlistMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'Your project, <b><i>' + this.projectname + '</i></b> has been temporarily waitlisted. ';
            message += 'You will be notified when your job starts. Job Number: <b><i>' + this.jobnumber + '</i></b><br /><br />';
            message += 'Please contact ' + this.designspecialist + ' for more information: ' + this.designspecialistemaillink + '. No action is required at this time.<br /><br />';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get billedMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support. Your project <b><i>' + this.projectname + '</b></i> is now <b>CLOSED.</b><br />';
            message += 'Job Number: <i>' + this.jobnumber + '</i>. Your Jacobs Store account has been billed for: <br/> ';
            message += '<p><ul>';
            if (this.material1Name) message += '<li><a href = "' + this.material1URL + '">' + this.material1Quantity + ' of ' + this.material1Name + '</a></li>';  
            if (this.material2Name) message += '<li><a href = "' + this.material2URL + '">' + this.material2Quantity + ' of ' + this.material2Name + '</a></li>'; 
            if (this.material3Name) message += '<li><a href = "' + this.material3URL + '">' + this.material3Quantity + ' of ' + this.material3Name + '</a></li>'; 
            if (this.material4Name) message += '<li><a href = "' + this.material4URL + '">' + this.material4Quantity + ' of ' + this.material4Name + '</a></li>'; 
            if (this.material5Name) message += '<li><a href = "' + this.material5URL + '">' + this.material5Quantity + ' of ' + this.material5Name + '</a></li>';  
            else message += 'Materials Used, unless you provided your own material, in which case, you will not be charged.<br/> '; 
            message += '</ul>';     // dont forget to end the bullet point list (unordered list)
            if (this.cost == "" || this.cost == undefined || this.cost == 0){
                message += '<p>The cost is not specified. Speak to a Design Specialist about this if you have questions before approving. <br /><p></br>';
            }
            else message += '<p>The cost is estimated to be ' + this.costFormatted + ' <br /><p></br>';
            message += '<br/>';
            message += 'If you have not picked up your parts, they can be picked up in-person.<br/><br/>';
            message += 'If you have any further questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Please take a moment to take our survey so we can improve JPS : <a href="https://docs.google.com/forms/d/e/1FAIpQLSe_yCGqiGa4U51DodKWjOWPFt-ZfpxGUwaAYJqBV0GZ0q_IUQ/viewform">Take Survey</a></p><br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get noAccessMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support. ';
            message += 'Your project: <b><i>' + this.projectname + '</i></b> has been prevented from advancing until we have received confirmation of your approval. <br/><br/>';
            message += 'DES INV and affiliated courses students are approved automatically upon registration submission. '; 
            message += 'Researchers are added when we receive IOC payment approval from their PI. '; 
            message += 'Researchers are urged to contact their PI to ensure they have appropriate approval.<br/>';
            message += 'Information on how to gain access can be found at <a href="makerspace.jacobshall.org"><b>Here</b></a><br/><br/>';
            message += 'Please register if you have not done so yet: <br/>';
            message += '<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>';
            message += '</p>';
            message += 'If you have questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '. <br />Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.</p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
}

class CreateSubmissionMessage
{
    constructor(name, projectname, jobnumber) {
        this.name = name;
        this.projectname = projectname;
        this.jobnumber = jobnumber;
    }
    get dsMessage() {
        let message = '<p>Hello!</p> ';
            message += '<p>You have a new submission to your area.<br />';
            message += 'Please assign yourself as the DS in the <a href = "https://docs.google.com/spreadsheets/d/1xOPFKH3-gku_UrN7mMS4wynKcmvYH70FmhVihgHbSWQ/">Spreadsheet</a><br />';
            message += 'Reminder: Only changing the status of the job will trigger emails to you and the student. Below is a summary of the student submission.<br/>';
            message += '<p>Best,<br />Jacobs Project Support</p>';
            message += '<br/>';
            message += 'SUMMARY:';
            message += '<br/>';
        return message;
    }
    get shippingMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Hall Project Support.<br />';
            message += 'You have requested shipping for your part <b><i>' + this.projectname + '</i></b>. '; 
            message += 'You MUST fill out this form EVERY time you request shipping. Your information will not be retained for the next shipment.<br/><br/>';
            message += 'In order to send your parts to you, please fill out this form:<br/><br/>';
            message += '<a href="https://docs.google.com/forms/d/e/1FAIpQLSdgk5-CjHOWJmAGja3Vk7L8a7ddLwTsyJhGicqNK7G-I5RjIQ/viewform"><b>Shipping Form</b></a><br/><br/>';
            message += 'Please note, shipping adds an additional flat-rate cost for your parts (between $5 and $12) for domestic FEDEX shipping. ';
            message += 'International shipping will be handled seperately, and you are encouraged to talk with a staff member if you need special considerations.<br/><br/>';
            message += 'If you have any questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get creaformMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support.<br />';
            message += 'Part scanning has been requested for your project. Job Number: <i>' + this.jobnumber + '</i><br />';
            message += '<br/>';
            message += 'Parts can be dropped off in-person safely at our touchless dropoff window. <br/><br/>';
            message += '<b>Drop-off Location:<br/>';
            message += '<a href="https://www.google.com/maps/d/edit?mid=19_zxiFYyxGysWTUDnMZl27gPX9b--2gz&usp=sharing">Jacobs Hall South side - Room 110 Side Doors<br/>'; 
            message += '2530 Ridge Rd, Berkeley, CA 94709</a><br/><br/></b>';
            message += '<b>Drop-off Hours:<br/>';
            message += 'Monday - Friday: 11am - 1pm & 5pm - 7pm.</b><br/><br/>'
            message += 'Please email ' + InvokeDS("Chris", "fullname") + ' at ' + InvokeDS("Chris", "emaillink") + ' for further details.<br/>';
            message += 'If you have any further questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
    get missingAccessMessage() {
        let message = '<p>Hi ' + this.name + ',</p>';
            message += '<p>Thank you for choosing Jacobs Project Support. Your project: <b><i>' + this.projectname + '</i></b> has been prevented from advancing until we have received confirmation of your approval. ';
            message += 'If you recently applied, please allow approximately 3 days for the approval to move through the system, and disregard this email.<br/><br/>';
            message += 'DES INV and affiliated courses students are approved automatically upon registration submission. Researchers are added when we receive IOC payment approval from their PI. ';
            message += 'Researchers are urged to contact their PI to ensure they have appropriate approval.<br/>';
            message += 'Information on how to gain access can be found <a href="makerspace.jacobshall.org"><b>Here.</b></a><br/><br/>';
            message += 'Please register if you have not done so yet: <br/>';
            message += '<a href="https://jacobsaccess.ist.berkeley.edu/jps/signup"><b>Registration</b></a> <br/><br/>';
            message += '</p>';
            message += 'If you have questions or need assistance please email ' + InvokeDS("Staff", "emaillink") + '. <br/>';
            message += '. <br />Once your registration has been updated, or your PI has fixed the issue, we will update you when your project has been started.</p>';
            message += '<p>Best,<br />Jacobs Hall Staff</p>';
        return message;
    }
}


/**
 * Unit Test for Making 'OnEdit' Messages
 */
let _testOnEditMessages = async () => {
  let message = new CreateMessage('Cody', 'Test Project', '101293874098', 'url',
    'material1URL', 45, 'TestPLA',
    'material2URL', 15, 'TestBreakaway',
    'mat3URL', 23, 'Steel',
    'mat4URL', 24, 'Aluminum',
    'mat5URL', 75, 'Plastic',
    'designspecialist', 'cody@glen.com', 45.50);

    Logger.log('DEFAULT' + message.defaultMessage);
    Logger.log('RECEIVED' + message.receivedMessage);
    Logger.log('PENDING' + message.pendingMessage);
    Logger.log('IN-PROGRESS' + message.inProgressMessage);
    Logger.log('COMPLETED' + message.completedMessage);
    Logger.log('SHIPPING QUESTION' + message.shippingQuestion);
    Logger.log('SHIPPED' + message.shippedMessage);
    Logger.log('FAILED' + message.failedMessage);
    Logger.log('R1' + message.rejectedByStudentMessage);
    Logger.log('BILLED' + message.billedMessage);

    return Promise.resolve( message );
}

/**
 * Unit Test for Making 'OnformSubmit' messages
 */
let _testOnformSubmitMessages = async () => {
    let message = new CreateSubmissionMessage('Cody', 'SomeProject', 102938471431 );
    Logger.log('DS MESSAGE' + message.dsMessage);
    Logger.log('CREAFORM MESSAGE' + message.creaformMessage);
    Logger.log('MISSING ACCESS' + message.missingAccessMessage);
    Logger.log('SHIPPING MESSAGE' + message.shippingMessage);

    return Promise.resolve( message );
}

/**
 * Unit Test for Running Both 'OnEdit' & 'OnFormSubmit' Messages asynchronously. 
 */
let _testAllMessages = async () => {

    Promise.all([
        await _testOnEditMessages(),
        await _testOnformSubmitMessages(),
    ])
    .then(Logger.log('Test Success'))
    .catch(Error => {
        Logger.log(Error + 'Failure');
    }); 
}







