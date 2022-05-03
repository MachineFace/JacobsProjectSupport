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
      if (this.email) {
        console.warn(`Checking priority via email....`);
        let finder = OTHERSHEETS.Approved.createTextFinder(this.email).findNext();
        if (finder) {
          let row = finder.getRow();
          priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
          console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${priority}`);
          return priority;
        } else if (!finder) {
          // try staff
          console.warn(`Checking if this person is staff....`)
          let secondsearch = OTHERSHEETS.Staff.createTextFinder(this.email).findNext();
          if (secondsearch) priority = 1;
          return priority;
        } else if (!finder) {
          // try SID
          console.warn(`Checking via email failed. Trying via SID`)
          finder = OTHERSHEETS.Approved.createTextFinder(this.sid).findNext();
          if (finder != null) {
            let row = finder.getRow();
            priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
            console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${priority}`);
            return priority;
          } else if (!finder) {
            priority = "STUDENT NOT FOUND!";
            console.error(`NOT FOUND ---> EMAIL: ${this.email}, ${priority}`);
            return priority;
          }
        }
      } else if(!this.email && this.sid) {
        console.warn(`Checking via email failed. Trying via SID`)
        let finder = OTHERSHEETS.Approved.createTextFinder(this.sid.toString()).findNext();
        if (finder != null) {
          let row = finder.getRow();
          priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
          console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${priority}`);
          return priority;
        } else if (!finder) {
          priority = "STUDENT NOT FOUND!";
          console.error(`NOT FOUND ---> PRIORITY : ${priority}`);
          return priority;
        }
      } else priority = "STUDENT NOT FOUND!";
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
      sid : 3034858776
    },
    goodEbadS : {
      email : `ashchu@berkeley.edu`,
      sid : 12938749123,
    },
    badEgoodS : {
      email : `ding@bat.edu`,
      sid : 3034858776,
    },
    badEbadS : {
      email : `ding@bat.edu`,
      sid : 2394872349587,
    }
  }
  console.time(`Priority`);
  Object.entries(typesOfPriority).forEach(type => {
    console.info(type[1])
    const p = new CheckPriority({
      email : type[1].email,
      sid : type[1].sid,
    }).Priority;
    console.info(p);
  }) 
  
  console.timeEnd(`Priority`);

}

const _t = () => {
  // const e = `effiejia@berkeley.edu`;
  const e = `angelviolinist@berkeley.edu`;
  try{
    let finder = OTHERSHEETS.Staff.createTextFinder(e).findNext();
    if (finder != null) {
      let row = finder.getRow();
      console.info(row);
      return 1;
    }
    else console.warn(`Nothing found.`);
  }
  catch (err) {
    console.error(`Whoops ---> ${err}`);
  }
  
}




