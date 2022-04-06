/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Checking Priority
 * @param {string} email
 * @param {string} sid
 */
class Priority
{
  constructor({
    email : email,
    sid : sid,
  }) {
    this.email = email ? email.toString().replace(/\s+/g, "") : `jacobsprojectsupport@berkeley.edu`;
    this.sid = sid ? sid.toString().replace(/\s+/g, "") : 19238471239847;
    this.GetPriority();
    this.priority;
  }

  GetPriority () {
    // Try email first
    try {
      if (this.email) {
        let finder = OTHERSHEETS.Approved.createTextFinder(this.email).findNext();
        if (finder != null) {
          let row = finder.getRow();
          this.priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
          console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${this.priority}`);
          return this.priority;
        } else if (!finder) {
          // try SID
          finder = OTHERSHEETS.Approved.createTextFinder(this.sid).findNext();
          if (finder != null) {
            let row = finder.getRow();
            this.priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
            console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${this.priority}`);
            return this.priority;
          } else if (!finder) {
            this.priority = "STUDENT NOT FOUND!";
            console.error(`EMAIL: ${this.email}, ${this.priority}`);
            return this.priority;
          }
        }
      } else if(this.sid) {
        let finder = OTHERSHEETS.Approved.createTextFinder(this.sid.toString()).findNext();
        if (finder != null) {
          let row = finder.getRow();
          this.priority = OTHERSHEETS.Approved.getRange(row, 4, 1, 1).getValue();
          console.info(`EMAIL: ${this.email}, ROW: ${row}, PRIORITY: ${this.priority}`);
          return this.priority;
        } else if (!finder) {
          this.priority = "STUDENT NOT FOUND!";
          console.error(`PRIORITY : ${this.priority}`);
          return this.priority;
        }
      } else this.priority = "STUDENT NOT FOUND!";
      
      return this.priority;
      
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
    const priority = new Priority({
      email : type[1].email,
      sid : type[1].sid,
    });
    console.info(priority.priority);
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




