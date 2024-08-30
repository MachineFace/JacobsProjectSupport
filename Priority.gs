/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Checking Priority
 * @param {string} email
 * @param {string} sid
 */
class CheckPriority {
  constructor({
    email : email = SERVICE_EMAIL,
    sid : sid = 1293487129348,
  }) {
    this.email = email ? email.toString().replace(/\s+/g, "") : SERVICE_EMAIL;
    this.sid = sid ? sid.toString().replace(/\s+/g, "") : 19238471239847;
  }

  /** @private */
  _CheckForStaff () {
    try {
      console.warn(`Checking if ${this.email} is staff....`);
      let finder = OTHERSHEETS.Staff.createTextFinder(this.email).findNext();
      if(!finder) {
        console.warn(`${this.email} is not staff.`)
        return false;
      }
      console.info(`Priority set to: 1`);
      return PRIORITY.Tier1;
    } catch (err) {
      console.error(`"_CheckForStaff()" failed : ${err}`);
      return PRIORITY.None;
    } 
  }

  /** @private */
  _CheckViaEmail () {
    try {
      console.warn(`Checking priority via email for ${this.email}....`);
      let finder = OTHERSHEETS.Approved.createTextFinder(this.email).findNext();
      if(!finder) {
        console.warn(`${this.email} not found.`)
        return false;
      }
      let row = finder.getRow();
      let priority = GetByHeader(OTHERSHEETS.Approved, `Tier`, row);
      console.info(`${this.email} is registered. Priority: ${priority}`);
      return priority;
    } catch(err) {
      console.error(`"_CheckViaEmail()" failed : ${err}`);
      return PRIORITY.None;
    }
  }

  /** @private */
  _CheckViaSID () {
    try {
      console.warn(`Checking priority via SID for ${this.email}....`);
      let finder = OTHERSHEETS.Approved.createTextFinder(this.sid).findNext();
      if(!finder) {
        console.warn(`${this.email} not found.`);
        return false;
      }
      let row = finder.getRow();
      let priority = GetByHeader(OTHERSHEETS.Approved, `Tier`, row);
      console.info(`${this.email}, ${this.sid} is registered. Priority: ${priority}`);
      return priority;
    } catch(err) {
      console.error(`${err}: Whoops, couldn't check via SID`);
      return PRIORITY.None;
    } 

  }

  get Priority () {
    // Try email first
    try {
      let priority = false;
      if(priority == false) priority = this._CheckViaEmail();
      if(priority == false) priority = this._CheckViaSID();
      if(priority == false) priority = this._CheckForStaff();
      if(priority == false) priority = PRIORITY.None;
      return priority;      
    } catch (err) {
      console.error(`"Priority()" failed : ${err}`);
      return PRIORITY.None;
    }
  }

  
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Check Students with Missing Access for their Priority Number if it exists.
 */
const CheckMissingAccessStudents = () => {
  let list = [];
  const results = Search(PRIORITY.None);
  if(results != null) {
    for(const [sheetName, values] of Object.entries(results)) {
      values.forEach( row => {
        const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

        let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, } = GetRowData(thisSheet, row);
        priority = new CheckPriority({ email : email, sid : sid }).Priority;
        console.info(`Email : ${email}, SID : ${sid}, Priority : ${p}`);

        SetByHeader(thisSheet, HEADERNAMES.priority, row, p);
        if(p != PRIORITY.None && status == STATUS.missingAccess) {
          list.push(email);
          SetByHeader(thisSheet, HEADERNAMES.status, row, STATUS.received);
        }
      });
    }
  }
  return list;
};




const _testCheck = () => {
  CheckMissingAccessStudents();
}
