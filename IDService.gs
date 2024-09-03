/**
 * ----------------------------------------------------------------------------------------------------------------
 * ID Service
 */
class IDService {
  constructor() {

  }

  /**
   * Get a New UUID
   * @return {string} uuid
   */
  get id(){
    return Utilities.getUuid();
  }

  /**
   * Get a new UUID
   * @return {string} uuid
   */
  static createId() {
    return Utilities.getUuid();
  }

  /**
   * Is Valid UUID
   * @param {string} uuid
   * @returns {bool} valid
   */
  IsValid(uuid) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  };

  /**
   * Is Valid UUID
   * @param {string} uuid
   * @returns {bool} valid
   */
  static isValid(uuid) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  };

  /**
   * Find by ID
   * @param {string} uuid
   * @returns {object} sheet and row 
   */
  FindByID(id) {
    let res = {};
    try {
      if (!this.IsValid(id)) throw new Error(`Invalid id supplied...`);
      Object.values(SHEETS).forEach(sheet => {
        const finder = sheet.createTextFinder(id).findNext();
        if (finder != null) res[sheet.getName()] = finder.getRow();
      });
      console.info(JSON.stringify(res));
      return res;
    } catch(err) {
      console.error(`"FindByID()" failed: ${err}`);
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

/**
 * Create ID
 * @return {string} uuid
 */
const CreateID = () => IDService.createId();

/**
 * 
 *
const _testJ = () => {
  console.time(`Instanced`);
  const j = new IDService().id;
  console.info(j);
  console.timeEnd(`Instanced`);

  console.time(`Non Instanced`);
  const k = IDService.createId();
  console.info(k);
  console.timeEnd(`Non Instanced`);

  const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
  const dec = IDService.toDecimal(testUUID);
  console.info(`TEST: ${testUUID} ---> ${dec}`);

  const back = IDService.decimalToUUID(dec);
  console.info(`BACK: ${dec} ----> ${back}`);
  const val = IDService.isValid(back);
  console.info(`Valid? : ${val}`);
}
*/


