/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Checking Priority
 * @param {string} email
 * @param {string} sid
 */
class CheckPriority
{
  constructor({
    email : email = `jacobsprojectsupport@berkeley.edu`,
    sid : sid = 1293487129348,
  }) {
    this.email = email ? email.toString().replace(/\s+/g, "") : `jacobsprojectsupport@berkeley.edu`;
    this.sid = sid ? sid.toString().replace(/\s+/g, "") : 19238471239847;
  }

  get Priority () {
    // Try email first
    try {
      let priority = this._CheckViaEmail();
      if(priority == false) priority = this._CheckViaSID();
      if(priority == false) priority = this._CheckForStaff();
      if(priority == false) priority = `STUDENT NOT FOUND!`;
      return priority;      
    } catch (err) {
      console.error(`Whoops ---> ${err}`);
    }
  }

  _CheckForStaff () {
    try {
      console.warn(`Checking if ${this.email} is staff....`);
      let finder = OTHERSHEETS.Staff.createTextFinder(this.email).findNext();
      if(!finder) {
        console.warn(`${this.email} is not staff.`)
        return false;
      }
      return 1;
    } catch (err) {
      console.error(`${err} : Whoops, couldn't check if this person is staff`);
    } 
  }

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
      console.error(`${err} : Whoops, checking via email failed....`);
    }
  }

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
    } 

  }

  
}

/** 
 * @NOTIMPLEMENTED
const _testPriority = () => {
  let typesOfPriority = {
    goodEgoodS : {
      email : `sequin@cs.berkeley.edu`,
      sid : 3038201402
    },
    // goodEbadS : {
    //   email : `sequin@cs.berkeley.edu`,
    //   sid : 12938749123,
    // },
    badEgoodS : {
      email : `ding@bat.edu`,
      sid : 3038201402,
    },
    badEbadS : {
      email : `ding@bat.edu`,
      sid : 2394872349587,
    },
    // other : {
    //   email : `ggrigoriadis@berkeley.edu`,
    //   sid : 29384762983472,
    // },
  }
  console.time(`Priority`);
  Object.entries(typesOfPriority).forEach(type => {
    console.info(type[1])
    const p = new CheckPriority({
      email : type[1].email,
      sid : type[1].sid,
    }).Priority;
    console.info(`Testing produced ---> ${p}`);
  }) 
  
  console.timeEnd(`Priority`);

}
*/

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Check Students with Missing Access for their Priority Number if it exists.
 */
const CheckMissingAccessStudents = () => {
  let list = [];
  let results = Search("STUDENT NOT FOUND!");
  if(results != null) {
    for(const [sheetName, values] of Object.entries(results)) {
      values.forEach( row => {
        let thisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        let email = GetByHeader(thisSheet, HEADERNAMES.email, row);
        let sid = GetByHeader(thisSheet, HEADERNAMES.sid, row)
        const p = new CheckPriority({email : email, sid : sid}).Priority;
        console.info(`Email : ${email}, SID : ${sid}, Priority : ${p}`);
        if(p != `STUDENT NOT FOUND!`) {
          list.push(email);
          SetByHeader(thisSheet, HEADERNAMES.priority, row, p);
          SetByHeader(thisSheet, HEADERNAMES.status, row, STATUS.received);
        }
      })
    }
  }
  return list;
};



