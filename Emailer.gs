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
    message : message = new MessageService(),
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

  SendEmail() {
    try {
      switch (this.status) {
        case STATUS.received:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.receivedMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.inProgress:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.inProgressMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.completed:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.completedMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.abandoned:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.abandonedMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.pickedUp:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.pickedUpMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.failed:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.failedMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.rejectedByStudent:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.rejectedByStudentMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.rejectedByStaff:
        case STATUS.cancelled:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.rejectedByStaffMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.billed:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.billedMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.waitlist:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.waitlistMessage,
            ds_email : this.designspecialistemail,
          });
          break;
        case STATUS.missingAccess:
          Emailer.Mail({
            to : this.email,
            status : this.status,
            message : this.message.noAccessMessage,
            ds_email : this.designspecialistemail,
          });
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

  /**
   * Mail
   * @private
   */
  static Mail({
    to : to = SERVICE_EMAIL,
    status : status = STATUS.received,
    message : message = new MessageService({}),
    ds_email : ds_email = SERVICE_EMAIL,
  }) {
    try {
      const staff = BuildStaff();
      const subject = `${SERVICE_NAME}: Project ${status}`;
      const options = {
        htmlBody: message,
        from: SERVICE_EMAIL,
        cc: `${ds_email}`,
        bcc: `${staff.Chris.email}, ${staff.Cody.email}`,
        name: SERVICE_NAME,
        noReply: true,
      }
      MailApp.sendEmail(to, subject, ``, options);
      console.warn(`User (${to}) emailed ${status} email.`);
      return 0;
    } catch(err) {
      console.error(`"Mail()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Send an email
   * @param {string} to
   * @param {string} from
   * @param {string} subject
   * @param {string} message
   * @param {string} status
   * @param {string} staff email
   * @returns {bool} success
   */
  static Email(to_email = SERVICE_EMAIL, from_email = SERVICE_EMAIL, subject = ``, message = new MessageService({}), status = STATUS.received, staffEmail = SERVICE_EMAIL,) {
    try {
      subject = subject ? subject : `${SERVICE_NAME} : ${status}`;
      const options = {
        htmlBody: message,
        from: from_email,
        cc: staffEmail,
        bcc: BuildStaff().Chris.email,
        name: SERVICE_NAME,
      }
      MailApp.sendEmail(to_email, subject, ``, options);
      console.warn(`User (${to_email}) sent ${status} email.`);
      return 0;
    } catch (err) {
      console.error(`"Email()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Count Total Emails Sent
   * @NOTIMPLEMENTED
   * @private
   */
  static async CountTotalEmailsSent() {
    try {
      let count = 0;
      let pageToken;
      while (pageToken) {
        const threadList = Gmail.Users.Threads.list('me', {
          q : `label:Jacobs Project Support/JPS Notifications`,
          pageToken : pageToken
        });
        count += threadList.threads.length;
        // if (threadList.threads && threadList.threads.length > 0) {
        //   threadList.threads.forEach(thread => {
        //     console.info(`Snip: ${thread.snippet}`);
        //   });
        // }
        pageToken = threadList.nextPageToken;
      }
      console.warn(`Total Emails Sent : ${count}`);
      return count;
    } catch (err) {
      console.error(`"CountTotalEmailsSent()" failed ----> ${err}`);
      return 1;
    }
  }

  /**
   * Lists, for each thread in the user's Inbox, a snippet associated with that thread.
   * @NOTIMPLEMENTED
   * @private
   */
  static ListInboxSnippets() {
    try {
      let pageToken;
      while (pageToken) {
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
      }
      return 0;
    } catch (err) {
      console.error(`"ListInboxSnippets()" failed ----> ${err}`);
      return 1;
    }
  }

  /**
   * Validate an email string
   * @param {string} email
   * @returns {bool} boolean
   */
  static ValidateEmail(email = ``) {
    const regex = new RegExp(/^[a-zA-Z0-9+_.-]+@[berkeley.edu]+$/);
    let match = regex.test(email);
    console.warn(`Email is valid? : ${match}`);
    return match;
  }
  
}



const _testEmail = async() => {
  Object.values(STATUS).forEach(status => {
    const obj = {
      name : `Dingus`,
      status : status,
      email : `codyglen@berkeley.edu`,
      message : new MessageService({
        name : `Dingus`,
        id : IDService.createId(),
        projectname : `Some Kinda Project`,
      }),
    }
    console.warn(`Emailing: ${JSON.stringify(obj, null, 3)}`);
    new Emailer(obj);
  });

  console.warn(`Email fucking sent...`);

}







