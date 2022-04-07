/**
 * -----------------------------------------------------------------------------------------------------------------
 * Send an Email
 * @required {string} Student Email
 * @required {string} Status
 */
class Emailer
{
  constructor({ 
    name : name, 
    status : status,
    email : email,    
    designspecialistemail : designspecialistemail,
    message : message,
  }) {
    this.name = name ? name.toString() : `Unknown Name`;
    this.status = status ? status : STATUS.received;
    this.email = email ? email : `Unknown Email`;
    this.designspecialistemail = designspecialistemail ? designspecialistemail : `jacobsprojectsupport@berkeley.edu`;
    this.message = message;

    this.gmailName = `Jacobs Project Support`;
    this.supportAlias = GmailApp.getAliases()[0];

    this.SendEmail();
  }

  SendEmail () {
    const staff = BuildStaff();
    switch (this.status) {
      case STATUS.received:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : ${STATUS.received}`, "", {
          htmlBody: this.message.receivedMessage,
          from: this.supportAlias,
          cc: this.designspecialistemail,
          bcc: staff.Chris.email,
          name: this.gmailName,
        });
        break;
      case STATUS.pendingApproval:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Needs Your Approval`, "", {
            htmlBody: this.message.pendingMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.inProgress:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Started`, "", {
            htmlBody: this.message.inProgressMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.completed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Completed`, "", {
            htmlBody: this.message.completedMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.pickedUp:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Picked Up`, "", {
            htmlBody: this.message.pickedUpMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.shipped:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Shipped`, "", {
            htmlBody: this.message.shippedMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.failed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project has Failed`, "", {
            htmlBody: this.message.failedMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.rejectedByStudent:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project has been Declined`, "", {
            htmlBody: this.message.rejectedByStudentMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.rejectedByStaff:
      case STATUS.cancelled:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project has been Cancelled`, "", {
            htmlBody: this.message.rejectedByStaffMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.billed:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Closed`, "", {
          htmlBody: this.message.billedMessage,
          from: this.supportAlias,
          cc: this.designspecialistemail,
          bcc: staff.Chris.email,
          name: this.gmailName,
        });
        break;
      case STATUS.waitlist:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Project Waitlisted`, "", {
            htmlBody: this.message.waitlistMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;
      case STATUS.missingAccess:
        console.warn(`Sending ${this.status} email to student.`);
        GmailApp.sendEmail(this.email, `${this.gmailName} : Missing Access`, "", {
            htmlBody: this.message.noAccessMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: staff.Chris.email,
            name: this.gmailName,
        });
        break;   
      case "":
      case undefined:
        break;
    }

  }
}

/**
 * -----------------------------------------------------------------------------------------------------------------
 * Unit Test for Emailer
 */
const _testEmailer = () => {
  const name = `Dingus Dongus`; 
  const email = "codyglen@berkeley.edu";
  const jobnumber = new JobNumberGenerator({ date : new Date()}).jobnumber;
  const projectname = `Some Kinda Project`;
  const message = new CreateMessage({
    name : name,
    jobnumber : jobnumber,
    projectname : projectname,
  });
  Object.values(STATUS).forEach(async (status) => {
    await new Emailer({
      name : name,
      status : status,
      email : email,
      designspecialist : `Cody Glen`,
      designspecialistemail : `codyglen@berkeley.edu`,
      designspecialistemaillink : `<a href="mailto:codyglen@berkeley.edu">codyglen@berkeley.edu</a>`,
      message : message, 
    })
  })
}



const CountTotalEmailsSent = async () => {
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


/**
 * Lists, for each thread in the user's Inbox, a
 * snippet associated with that thread.
 */
const ListInboxSnippets = () => {
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










