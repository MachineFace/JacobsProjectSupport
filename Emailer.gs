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
    designspecialistemail : designspecialistemail = `jacobsprojectsupport@berkeley.edu`,
    message : message = ``,
  }) {
    this.name = name;
    this.status = status;
    this.email = email;
    this.designspecialistemail = designspecialistemail;
    this.message = message;

    this.SendEmail();
  }

  SendEmail () {
    const staff = BuildStaff();
    switch (this.status) {
      case STATUS.received:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : ${STATUS.received}`, "", {
          htmlBody: this.message.receivedMessage,
          from: SUPPORT_ALIAS,
          cc: this.designspecialistemail,
          bcc: staff.Chris.email,
          name: SERVICE_NAME,
        });
        break;
      case STATUS.inProgress:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Started`, "", {
            htmlBody: this.message.inProgressMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.completed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Completed`, "", {
            htmlBody: this.message.completedMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.abandoned:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project waiting for you to pick up!`, "", {
            htmlBody: this.message.abandonedMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.pickedUp:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Picked Up`, "", {
            htmlBody: this.message.pickedUpMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.failed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has Failed`, "", {
            htmlBody: this.message.failedMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.rejectedByStudent:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has been Declined`, "", {
            htmlBody: this.message.rejectedByStudentMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.rejectedByStaff:
      case STATUS.cancelled:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project has been Cancelled`, "", {
            htmlBody: this.message.rejectedByStaffMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.billed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Closed`, "", {
          htmlBody: this.message.billedMessage,
          from: SUPPORT_ALIAS,
          cc: this.designspecialistemail,
          bcc: staff.Chris.email,
          name: SERVICE_NAME,
        });
        break;
      case STATUS.waitlist:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Project Waitlisted`, "", {
            htmlBody: this.message.waitlistMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;
      case STATUS.missingAccess:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${SERVICE_NAME} : Missing Access`, "", {
            htmlBody: this.message.noAccessMessage,
            from: SUPPORT_ALIAS,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: SERVICE_NAME,
        });
        break;   
      case "":
      case undefined:
        break;
    }

  }
}


/**
 * Send an email
 * @NOTIMPLEMENTED
 */
const SendEmail = async ({
  email : email = `jacobsprojectsupport@berkeley.edu`,
  staffEmail : staffEmail = `jacobsprojectsupport@berkeley.edu`,
  status : status = `Default`,
  message : message = new CreateMessage({}),
}) => {
  try {
    await GmailApp.sendEmail(email, `${SERVICE_NAME} : ${status}`, ``, {
      htmlBody: message,
      from: SUPPORT_ALIAS,
      cc: staffEmail,
      bcc: staff.Chris.email,
      name: SERVICE_NAME,
    });
    console.warn(`"${status}" Email sent to student and status set to "${status}".`);
    return 0;
  } catch (err) {
    console.error(`Could not email: ${err}`);
  }
}

/** 
 * @NOTIMPLEMENTED
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
const __ListInboxSnippets__ = () => {
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









