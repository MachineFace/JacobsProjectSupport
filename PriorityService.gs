/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## Class for Checking Priority
 */
class PriorityService {
  constructor() {
    
  }

  /** 
   * ### Is Staff
   * Determines if a user is a staff memeber. 
   * Returns false if unknown.
   * 
   * @private
   * @param {string} email
   * @returns {Priority | boolean} priority
   */
  IsStaff(email) {
    try {
      const finder = OTHERSHEETS.Staff.createTextFinder(email).findNext();
      if(!finder) {
        console.warn(`(${email}) is not staff.`)
        return false;
      }
      console.info(`Priority set to: 1`);
      return PRIORITY.Tier1;
    } catch (err) {
      console.error(`"IsStaff()" failed: ${err}`);
      return PRIORITY.None;
    } 
  }

  /** 
   * ### Is Authorized Email
   * Determines if a user is authorized user based on email.
   * Returns false if unknown
   * 
   * @private
   * @param {string} email
   * @returns {Priority | boolean} priority
   */
  IsAuthorizedEmail(email) {
    try {
      const finder = OTHERSHEETS.Approved.createTextFinder(email).findNext();
      if(!finder) {
        console.warn(`Email: (${email}) not found.`)
        return false;
      }
      const row = finder.getRow();
      const priority = SheetService.GetByHeader(OTHERSHEETS.Approved, `Tier`, row);
      console.info(`Email: (${email}) is registered. Priority: ${priority}`);
      return priority;
    } catch(err) {
      console.error(`"IsAuthorizedEmail()" failed: ${err}`);
      return PRIORITY.None;
    }
  }

  /** 
   * ### Is Authorized SID
   * Determines if a user is authorized user based on ID.
   * Returns false if unknown.
   * 
   * @private
   * @param {string} ID
   * @returns {Priority | boolean} priority
   */
  IsAuthorizedSID(sid) {
    try {
      let finder = OTHERSHEETS.Approved.createTextFinder(sid).findNext();
      if(!finder) {
        console.warn(`(${sid}) NOT FOUND.`);
        return false;
      }
      const row = finder.getRow();
      const priority = SheetService.GetByHeader(OTHERSHEETS.Approved, `Tier`, row);
      console.info(`SID: (${this.sid}) is registered. Priority: ${priority}`);
      return priority;
    } catch(err) {
      console.error(`"IsAuthorizedSID()" failed: ${err}`);
      return PRIORITY.None;
    } 

  }

  /**
   * ### Get the Priority for a user.
   * Returns the priority tier of a given user based on their email or sid
   * This function will check if they are staff first, then check if their email is authorized,
   * and if unsuccessful will check via SID. Will return NONE if all checks fail.
   * 
   * @param {string} email
   * @param {string} sid
   * @returns {number | boolean} priority
   */
  static GetPriority(email, sid) {
    try {
      if(!email && !sid) {
        return PRIORITY.None;
      }
      let priority = false;
      if(!priority) priority = PriorityService.prototype.IsStaff(email);
      if(!priority) priority = PriorityService.prototype.IsAuthorizedEmail(email);
      if(!priority) priority = PriorityService.prototype.IsAuthorizedSID(sid);
      if(!priority) priority = PRIORITY.None;
      return priority;      
    } catch (err) {
      console.error(`"Priority()" failed: ${err}`);
      return PRIORITY.None;
    }
  }

  /**
   * ### Check Missing Access Students 
   * Check Users with Missing Access for their Priority Number if it exists.
   * 
   * @returns {Array} list
   */
  static CheckMissingAccessStudents() {
    try {
      let list = [];
      const results = SheetService.Search(PRIORITY.None);
      if (!Object.values(results).some(list => list.length)) {
        console.info(`No Users with Missing Access found.`);
        return;
      }
      
      for(const [sheetName, values] of Object.entries(results)) {
        values.forEach( row => {
          const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
          let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, } = SheetService.GetRowData(thisSheet, row);

          priority = PriorityService.GetPriority(email, sid);
          SheetService.SetByHeader(thisSheet, HEADERNAMES.priority, row, priority);
          console.info(`Email: ${email}, SID: ${sid}, Priority: ${p}`);

          if(priority != PRIORITY.None && status == STATUS.missingAccess) {
            list.push(email);
            SheetService.SetByHeader(thisSheet, HEADERNAMES.status, row, STATUS.received);
          }
        });
      }
      return list;
    } catch (err) {
      console.error(`"CheckMissingAccessStudents()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Validate an email string
   * 
   * @private
   * @param {string} email
   * @returns {bool} boolean
   */
  ValidateEmail(email = ``) {
    try {
      const regex = new RegExp(/^[a-zA-Z0-9+_.-]+@[berkeley.edu]+$/);
      let match = regex.test(email);
      console.warn(`Email is valid?: ${match}`);
      return match;
    } catch(err) {
      console.error(`"ValidateEmail()" failed`);
      return null;
    }
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * ### Check Students with Missing Access for their Priority Number if it exists.
 */
const CheckMissingAccessStudents = () => PriorityService.CheckMissingAccessStudents();


