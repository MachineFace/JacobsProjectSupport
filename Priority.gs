/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Checking Priority
 * @param {string} email
 * @param {string} sid
 */
class Priority
{
  constructor({
    email = `jacobsprojectsupport@berkeley.edu`,
    sid = 19238471239847,
  }) {
    this.email = email;
    this.sid = sid;
    this.GetPriority();
    this.priority;
  }

  GetPriority () {
    // Try email first
    try {
      if (this.email) {
        this.email.toString().replace(/\s+/g, "");
        let finder = OTHERSHEETS.approved.createTextFinder(this.email).findNext();
        if (finder != null) {
          let row = finder.getRow();
          this.priority = OTHERSHEETS.approved.getRange(row, 4, 1, 1).getValue();
          console.info(`ROW : ${row} : PRIORITY : ${this.priority}`);
        } else if (!finder) {
          // try SID
          this.sid.toString().replace(/\s+/g, "");
          finder = OTHERSHEETS.approved.createTextFinder(this.sid.toString()).findNext();
          if (finder != null) {
            let row = finder.getRow();
            this.priority = OTHERSHEETS.approved.getRange(row, 4, 1, 1).getValue();
            console.info(`ROW : ${row} : PRIORITY : ${this.priority}`);
          } else if (!finder) {
            this.priority = "STUDENT NOT FOUND!";
            console.warn(`PRIORITY : ${this.priority}`);
          }
        }
      } else if(this.sid) {
        // try SID
        this.sid.toString().replace(/\s+/g, "");
        finder = OTHERSHEETS.approved.createTextFinder(this.sid.toString()).findNext();
        if (finder != null) {
          let row = finder.getRow();
          this.priority = OTHERSHEETS.approved.getRange(row, 4, 1, 1).getValue();
          console.info(`ROW : ${row} : PRIORITY : ${this.priority}`);
        } else if (!finder) {
          this.priority = "STUDENT NOT FOUND!";
          console.warn(`PRIORITY : ${this.priority}`);
        }
      } else this.priority = "STUDENT NOT FOUND!";
      
      return this.priority;
      
    } catch (err) {
      console.error(`Whoops ---> ${err}`);
    }
  }

  
}






const _testPriority = () => {
  console.time(`Priority`);
  const priority = new Priority({
    email : `effiejia@berkeley.edu`,
    sid : 19238741293847,
  });
  console.info(priority.priority);
  console.timeEnd(`Priority`);
  // let p1 = GetPriority(`laxbop@berkeley.edu`,3036051329) // Good Email and Good SID
  // let p2 = GetPriority(`laxbop@berkeley.edu`, 12938749123) // Good Email, Bad SID
  // let p3 = GetPriority(`ding@bat.edu`, 3036051329) // Bad Email, Good SID
  // let p4 = GetPriority(`ding@bat.edu`, 2394872349587) // Bad Email, Bad SID

}

const _t = () => {
  // const e = `effiejia@berkeley.edu`;
  const e = `angelviolinist@berkeley.edu`;
  try{
    let finder = OTHERSHEETS.staff.createTextFinder(e).findNext();
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




