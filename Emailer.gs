/**
 * -----------------------------------------------------------------------------------------------------------------
 * Send an Email
 * @required {string} Student Email
 * @required {string} Status
 */
class Emailer {
  constructor({ 
    name : name = `Unknown Name`, 
    status : status = STATUS.received,
    email : email = `Unknown Email`,    
    designspecialistemail : designspecialistemail = SERVICE_EMAIL,
    message : message = ``,
  }) {
    /** @private */
    this.name = name;
    /** @private */
    this.status = status;
    /** @private */
    this.email = email;
    /** @private */
    this.designspecialistemail = designspecialistemail;
    /** @private */
    this.message = message;

    this.SendEmail();
  }

  SendEmail () {
    try {
      const staff = BuildStaff();
      switch (this.status) {
        case STATUS.received:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : ${STATUS.received}`, "", {
            htmlBody: this.message.receivedMessage,
            from: SERVICE_EMAIL,
            cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.inProgress:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Started`, "", {
              htmlBody: this.message.inProgressMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.completed:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Completed`, "", {
              htmlBody: this.message.completedMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.abandoned:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project waiting for you to pick up!`, "", {
              htmlBody: this.message.abandonedMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.pickedUp:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Picked Up`, "", {
              htmlBody: this.message.pickedUpMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.failed:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has Failed`, "", {
              htmlBody: this.message.failedMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.rejectedByStudent:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has been Declined`, "", {
              htmlBody: this.message.rejectedByStudentMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.rejectedByStaff:
        case STATUS.cancelled:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has been Cancelled`, "", {
              htmlBody: this.message.rejectedByStaffMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.billed:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Closed`, "", {
            htmlBody: this.message.billedMessage,
            from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.waitlist:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Waitlisted`, "", {
              htmlBody: this.message.waitlistMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;
        case STATUS.missingAccess:
          console.warn(`Sending ${this.status} email to student.`);
          MailApp.sendEmail(this.email, `${SERVICE_NAME} : Missing Access`, "", {
              htmlBody: this.message.noAccessMessage,
              from: SERVICE_EMAIL,
              cc: `${this.designspecialistemail}, ${SERVICE_EMAIL}`,
              bcc: staff.Chris.email,
              name: SERVICE_NAME,
          });
          console.warn(`Sent ${this.status} email to student.`);
          break;   
        case "":
        case undefined:
          break;
      }
    } catch(err) {
      console.error(`"SendEmail()" failed : ${err}`);
      return 1;
    }
  }
}


/**
 * Send an email
 * @NOTIMPLEMENTED
 *
const SendEmail = async ({
  email : email = SERVICE_EMAIL,
  staffEmail : staffEmail = SERVICE_EMAIL,
  status : status = `Default`,
  message : message = new CreateMessage({}),
}) => {
  try {
    await MailApp.sendEmail(email, `${SERVICE_NAME} : ${status}`, ``, {
      htmlBody: message,
      from: SERVICE_EMAIL,
      cc: staffEmail,
      bcc: staff.Chris.email,
      name: SERVICE_NAME,
    });
    console.warn(`"${status}" Email sent to student and status set to "${status}".`);
    return 0;
  } catch (err) {
    console.error(`Could not email: ${err}`);
    return 1;
  }
}
*/

/** 
 * @NOTIMPLEMENTED
 *
const __CountTotalEmailsSent__ = async () => {
  let count = 0;
  try {
    let pageToken;
    do {
      const threadList = Gmail.Users.Threads.list('me', {
        q: `label:Jacobs Project Support/JPS Notifications`,
        pageToken: pageToken
      });
      count += threadList.threads.length;
      // if (threadList.threads && threadList.threads.length > 0) {
      //   threadList.threads.forEach(thread => {
      //     console.info(`Snip: ${thread.snippet}`);
      //   });
      // }
      pageToken = threadList.nextPageToken;
    } while (pageToken);
  } catch (err) {
    console.error(`Whoops ----> ${err}`);
  }
  console.warn(`Total Emails Sent : ${count}`);
  return count;
}
*/

/**
 * Lists, for each thread in the user's Inbox, a
 * snippet associated with that thread.
 *
 *
const _ListInboxSnippets = () => {
  try {
    let pageToken;
    do {
      const threadList = Gmail.Users.Threads.list('me', {
        q: `label:inbox`,
        pageToken: pageToken
      });
      if (threadList.threads && threadList.threads.length > 0) {
        threadList.threads.forEach(thread => {
          console.info(`Snip: ${thread.snippet}`);
        });
      }
      pageToken = threadList.nextPageToken;
    } while (pageToken);
  } catch (err) {
    console.error(`Whoops ----> ${err}`);
  }
}
*/


const _testEmail = async() => {
  const name = `Dingus`; 
  const email = `codyglen@berkeley.edu`;
  const id = new IDService().id;
  const projectname = `Some Kinda Project`;
  const message = new CreateMessage({
    name : name,
    id : id,
    projectname : projectname,
  });
  console.warn(`Email to ${email} from ${SERVICE_EMAIL}, ${name}, ${id}`);

  MailApp.sendEmail(email, `${SERVICE_NAME} : Project Closed`, "", {
    htmlBody: message.billedMessage,
    from: SERVICE_EMAIL,
    cc: email,
    name: SERVICE_NAME,
  });

  console.warn(`Email fucking sent...`);

}







