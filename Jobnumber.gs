/**
 * ----------------------------------------------------------------------------------------------------------------
 * Generate new Job number from a date
 * @param {time} date
 * @return {number} job number
 */
class JobnumberService {
  constructor() {

  }
  get jobnumber(){
    return Utilities.getUuid();
  }

  /**
   * Is Valid UUID
   * @param {string} uuid
   * @returns {bool} valid
   */
  IsValid(jobnumber) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(jobnumber);
  };

  /**
   * Find by Jobnumber
   * @param {string} uuid
   * @returns {object} sheet and row 
   */
  FindByJobNumber(jobnumber) {
    let res = {};
    try {
      if (!this.IsValid(jobnumber)) throw new Error(`Invalid jobnumber supplied...`);
      Object.values(SHEETS).forEach(sheet => {
        const finder = sheet.createTextFinder(jobnumber).findNext();
        if (finder != null) res[sheet.getName()] = finder.getRow();
      });
      console.info(JSON.stringify(res));
      return res;
    } catch(err) {
      console.error(`"FindByJobnumber()" failed: ${err}`);
    }
  }
}

const _testJ = () => console.info(new JobnumberService().IsValid(`b819a295-66b7-4b82-8f91-81cf227c5216`));



