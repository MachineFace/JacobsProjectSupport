/**
 * -----------------------------------------------------------------------------------------------------------------
 * Send an Email
 * @required {string} User Email
 * @required {string} Status
 */
class EmailService {
  constructor() {

  }

  /**
   * Send an email using Google Apps Script's MailApp service.
   *
   * @param {string} toEmail - Recipient email address.
   * @param {string} fromEmail - Sender email address.
   * @param {string} subject - Email subject line.
   * @param {string|Object} message - HTML body or message object (rendered).
   * @param {string} status - Optional status string (e.g., "received").
   * @param {string} staffEmail - Optional fallback staff email.
   * @returns {boolean} true on success, false on failure.
   */
  static Email(
    to_email = SERVICE_EMAIL, 
    from_email = SERVICE_EMAIL, 
    subject = ``, 
    message = new MessageService({}), 
    status = STATUS.received, 
    staffEmail = SERVICE_EMAIL,
  ) {
    try {
      if (!to_email || typeof to_email !== 'string') throw new Error(`Invalid recipient email: ${to_email}`);
      if (!message) throw new Error(`Missing message content`);

      const resolvedSubject = subject || `${SERVICE_NAME}: ${status}`;

      const messageMap = {
        [STATUS.received]: message?.receivedMessage,
        [STATUS.inProgress]: message?.inProgressMessage,
        [STATUS.completed]: message?.completedMessage,
        [STATUS.abandoned]: message?.abandonedMessage,
        [STATUS.pickedUp]: message?.pickedUpMessage,
        [STATUS.failed]: message?.failedMessage,
        [STATUS.rejectedByStudent]: message?.rejectedByStudentMessage,
        [STATUS.rejectedByStaff]: message?.rejectedByStaffMessage,
        [STATUS.cancelled]: message?.rejectedByStaffMessage, 
        [STATUS.billed]: message?.billedMessage,
        [STATUS.waitlist]: message?.waitlistMessage,
        [STATUS.missingAccess]: message?.noAccessMessage,
      };

      const msg = messageMap[status];
      console.info(messageMap);

      if (!msg) {
        console.warn(`No email message mapped for status: "${status}"`);
        return;
      }

      const options = {
        htmlBody: msg,
        from: from_email || SERVICE_EMAIL,
        name: SERVICE_NAME,
        // cc: staffEmail,
        bcc: `codyglen@berkeley.edu` || staffEmail,
        noReply: true,
      }

      MailApp.sendEmail(to_email, resolvedSubject, ``, options);
      console.warn(`📨 User (${to_email}) sent ${status} email.`);
      return 0;
    } catch (err) {
      console.error(`❌ "Email()" failed: ${err}`);
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
    EmailService.Email(obj.email, obj.email, `${SERVICE_NAME}: ${obj.status}`, obj.message, obj.status, obj.email);
  });

  console.warn(`Email fucking sent...`);

}







