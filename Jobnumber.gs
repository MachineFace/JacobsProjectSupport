/**
 * ----------------------------------------------------------------------------------------------------------------
 * Generate new Job number from a date
 * @param {time} date
 * @return {number} job number
 */
class JobnumberService {
  constructor() {

  }

  /**
   * Get a New Jobnumber
   * @return {string} uuid
   */
  get jobnumber(){
    const id = Utilities.getUuid();
    console.info(`Id Created: ${id}`);
    return id;
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
  static isValid(jobnumber) {
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

  /**
   * Convert a UUID to decimal
   * @param {string} uuid
   * @return {number} decimals
   */
  static toDecimal(uuid) {
    const hex = uuid.replace(/-/g, '');
    const decimal = BigInt(`0x${hex}`).toString();  // Convert hexadecimal to decimal
    const paddedDecimal = decimal.padStart(40, '0');  // Pad decimal with leading zeros to ensure 40 digits
    return paddedDecimal;
  }

  /**
   * Convert a Decimal Value to UUID
   * @param {number} decimal
   * @return {string} uuid
   */
  static decimalToUUID(decimal) {
    const paddedDecimal = decimal.toString().padStart(40, '0');  // Pad decimal with leading zeros to ensure 40 digits
    const hex = BigInt(paddedDecimal).toString(16);   // Convert decimal to hexadecimal

    // Insert dashes to create the UUID format
    const uuid = [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');

    return uuid;
  }
}

const _testJ = () => {
  const j = new JobnumberService().jobnumber;
  console.info(j)
  // const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
  // const dec = JobnumberService.toDecimal(testUUID);
  // console.info(`TEST: ${testUUID} ---> ${dec}`);
  // const back = JobnumberService.decimalToUUID(dec);
  // console.info(`BACK: ${dec} ----> ${back}`);
  // const val = JobnumberService.isValid(back);
  // console.info(`Valid? : ${val}`);
}



