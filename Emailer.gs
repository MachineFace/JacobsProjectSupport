/**
 * -----------------------------------------------------------------------------------------------------------------
 * Send an Email
 * @required {string} Student Email
 * @required {string} Status
 */
class Emailer
{
  constructor({ 
    headsetID,
    status,
    name,
    email, 
    checkedOutDate,
    returnedDate, 
    designspecialist,
    designspecialistemail,
    designspecialistemaillink, 
  }) {
    this.headsetID = headsetID ? headsetID : `1000001`;
    this.status = status ? status : STATUS.checkedOut;
    this.name = name ? name : `Your Name`;
    this.email = email ? email : `Unknown Email`;
    this.gmailName = `Jacobs VR Hardware Tracking Bot`;
    this.checkedOutDate = checkedOutDate ? checkedOutDate : Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    this.returnedDate = returnedDate ? returnedDate : Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();

    this.supportAlias = GmailApp.getAliases()[0];
    this.designspecialist = designspecialist ? designspecialist : `Staff`;
    this.designspecialistemail = designspecialistemail ? designspecialistemail : `jacobsprojectsupport@berkeley.edu`;
    this.designspecialistemaillink = designspecialistemaillink ? designspecialistemaillink : `<a href="mailto:jacobsprojectsupport@berkeley.edu">jacobsprojectsupport@berkeley.edu</a>`;

    this.message = new CreateMessage({
      name : name, 
      headsetID : headsetID,
      checkedOutDate : checkedOutDate,
      returnedDate : returnedDate, 
      designspecialist : designspecialist,
      designspecialistemaillink : designspecialistemaillink,
    });
    this.SendEmail();
  }

  SendEmail () {
    switch (this.status) {
      case STATUS.checkedOut:
        GmailApp.sendEmail(this.email, `${this.gmailName} : Headset Checked Out`, "", {
          htmlBody: this.message.checkedOutMessage,
          from: this.supportAlias,
          cc: this.designspecialistemail,
          bcc: "",
          name: this.gmailName,
        });
        console.warn(`Student ${this.name} emailed ${this.status} message...`);
        break;
      case STATUS.checkedIn:
        GmailApp.sendEmail(this.email, `${this.gmailName} : Headset Returned`, "", {
            htmlBody: this.message.returnedMessage,
            from: this.supportAlias,
            cc: this.designspecialistemail,
            bcc: "",
            name: this.gmailName,
        });
        console.warn(`Student ${this.name} emailed ${this.status} message...`);
        break;
      case "":
      case undefined:
        console.warn(`Student ${this.name} NOT emailed...`);
        break;
    }
  }
}

/**
 * -----------------------------------------------------------------------------------------------------------------
 * Unit Test for Emailer
 */
const _testEmailer = () => {
  Object.values(STATUS).forEach(async (status) => {
    await new Emailer({
      headsetID : `1000001`,
      checkedOutDate : Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString(),
      returnedDate : Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString(), 
      email : "codyglen@berkeley.edu",
      status : status,
      name : `Dingus Dongus`,
      designspecialist : `Cody Glen`,
      designspecialistemail : `codyglen@berkeley.edu`,
      designspecialistemaillink : `<a href="mailto:codyglen@berkeley.edu">codyglen@berkeley.edu</a>`, 
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










