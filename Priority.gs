/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Checking Priority
 * @param {string} email
 * @param {string} sid
 */
class CheckPriority
{
  constructor({
    email : email,
    sid : sid,
  }) {
    this.email = email ? email.toString().replace(/\s+/g, "") : `jacobsprojectsupport@berkeley.edu`;
    this.sid = sid ? sid.toString().replace(/\s+/g, "") : 19238471239847;
  }

  get Priority () {
    // Try email first
    try {
      let priority = ``;
      console.warn(`Checking priority via email for ${this.email}....`);
      let finder = OTHERSHEETS.Approved.createTextFinder(this.email).findNext();
      if (finder) {
        let row = finder.getRow();
        priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue().toString();
        console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${priority}`);
      } else if (!finder) {
        // try staff
        console.warn(`Checking if ${this.email} is staff....`)
        let secondsearch = OTHERSHEETS.Staff.createTextFinder(this.email).findNext();
        if (secondsearch) priority = `1`;
      } else if (!finder) {
        // try SID
        console.warn(`Checking via email failed. Trying via SID : ${this.sid}`)
        finder = OTHERSHEETS.Approved.createTextFinder(this.sid).findNext();
        if (finder != null) {
          let row = finder.getRow();
          priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue().toString();
          console.info(`EMAIL: ${this.sid}, ROW: ${row}, PRIORITY: ${priority}`);
        } else if (!finder) {
          priority = `STUDENT NOT FOUND!`;
          console.error(`NOT FOUND ---> EMAIL: ${this.email}, SID: ${this.sid}, PRIORITY: ${priority}`);
        }
      }

      console.warn(`Checking via email failed. Trying via SID: ${this.sid}`)
      let finder2 = OTHERSHEETS.Approved.createTextFinder(this.sid.toString()).findNext();
      if (finder2 != null) {
        let row = finder2.getRow();
        priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue().toString();
        console.info(`EMAIL: ${this.sid}, ROW: ${row}, PRIORITY: ${priority}`);
      } else if (!finder2) {
        priority = `STUDENT NOT FOUND!`;
        console.error(`NOT FOUND ---> PRIORITY : ${priority}`);
      }

      return priority;      
    } catch (err) {
      console.error(`Whoops ---> ${err}`);
    }
  }

  
}


const _testPriority = () => {
  let typesOfPriority = {
    goodEgoodS : {
      email : `ashchu@berkeley.edu`,
      sid : 3033841568
    },
    goodEbadS : {
      email : `ashchu@berkeley.edu`,
      sid : 12938749123,
    },
    badEgoodS : {
      email : `ding@bat.edu`,
      sid : 3033841568,
    },
    badEbadS : {
      email : `ding@bat.edu`,
      sid : 2394872349587,
    }
  }
  console.time(`Priority`);
  Object.entries(typesOfPriority).forEach(type => {
    // console.info(type[1])
    const p = new CheckPriority({
      email : type[1].email,
      sid : type[1].sid,
    }).Priority;
    console.info(p);
  }) 
  
  console.timeEnd(`Priority`);

}


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
        let email = GetByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), HEADERNAMES.email, row);
        let sid = GetByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), HEADERNAMES.sid, row)
        const p = new CheckPriority({email : email, sid : sid}).Priority;
        console.info(`Email : ${email}, SID : ${sid}, Priority : ${p}`);
        if(p != `STUDENT NOT FOUND!`) {
          list.push(email);
          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getRange(row, 3, 1, 1).setValue(p);
        }
      })
    }
  }
  return list;
};




