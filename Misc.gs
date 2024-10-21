/**
 * MISC FUNCTIONS
 * ----------------------------------------------------------------------------------------------------------------
 */


/**
 * Search all Sheets for a value
 * @required {string} value
 * @returns {[sheet, [values]]} list of sheets with lists of indexes
 */
const Search = (value) => {
  if (value) value.toString().replace(/\s+/g, "");
  let res = {};
  Object.values(SHEETS).forEach(sheet => {
    const finder = sheet.createTextFinder(value).findAll();
    if (finder != null) {
      temp = [];
      finder.forEach(result => temp.push(result.getRow()));
      res[sheet.getName()] = temp;
    }
  })
  console.info(JSON.stringify(res));
  return res;
}

/**
 * Search a Specific Sheets for a value
 * @required {string} value
 * @returns {[sheet, [values]]} list of sheets with lists of indexes
 */
const SearchSpecificSheet = (sheet, value) => { 
  try {
    if (value && value != undefined) value.toString().replace(/\s+/g, "");
    const finder = sheet.createTextFinder(value).findNext();
    if (!finder) return false;
    return finder.getRow();
  } catch(err) {
    console.error(`"SearchSpecificSheet()" failed : ${err}`);
    return 1;
  }
}

/**
 * Search all Sheets for one specific value
 * @required {string} value
 * @returns {[sheet, [number]]} [sheetname, row]
 */
const FindOne = (value) => {
  if (value) value.toString().replace(/\s+/g, "");
  let res = {};
  for(const [key, sheet] of Object.entries(SHEETS)) {
    const finder = sheet.createTextFinder(value).findNext();
    if (finder != null) {
      // res[key] = finder.getRow();
      res = SheetService.GetRowData(sheet, finder.getRow());
    }
  }
  return res;
}

/**
 * Find an index in an array
 * @param {any} search
 * @returns {int} index
 */
const FindIndexInArray = (array = [], search = ``) => {
  if (search == ``) return false;
  for (let i = 0; i < array.length; i++) {
    if (array[i].toString().indexOf(search) > -1) return i;
  }
  return -1;
};

/**
 * Find Missing Elements in Array
 * @param {[]} array 1
 * @param {[]} array 2
 * @return {[]} array of indexes
 */
const FindMissingElementsInArrays = (array1 = [], array2 = []) => {
  let indexes = [];
  array1.forEach( item => {
    let i = array2.indexOf(item);
    indexes.push(i);
  })
  return indexes;
}



/**
 * Look up Item's Info in Store Sheet
 * @param {sheet} sheet
 * @param {material} material
 * @param {object} row data
 */
const GetStoreInfo = (sheet, material) => {
  sheet = sheet ? sheet : SHEETS.Laser;
  material = material ? material : SheetService.GetByHeader(sheet, HEADERNAMES.mat1, 2);

  const storesheet = GetStoreSheet(sheet);
  const row = SearchSpecificSheet(storesheet, material);
  const data = SheetService.GetRowData(storesheet, row);
  return data;
}

/**
 * Get All Project Names
 * @returns {object} { sheetname : [...projectnames] }
 * @NOTIMPLEMENTED
 */
const GetAllProjectNames = () => {
  let names = {}
  Object.values(SHEETS).forEach(sheet => {
    const sheetName = sheet.getName();
    let titles = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.projectName)]
      .filter(Boolean)
      .filter(x => x != `FORMULA ROW`);
    names[sheetName] = [...new Set(titles).values()];
  });
  console.info(names);
  return names;
}

/**
 * Build Estimate
 */
const BuildEstimate = (sheet, row = 2) => {
  try {
    if(row < 2) throw new Error(`Row ${row}, not allowed...`);
    if(!SheetService.IsValidSheet(sheet)) throw new Error(`Forbidden Sheet....`);

    const rowData = SheetService.GetRowData(sheet, row);
    let { status, ds, priority, ticket, id, timestamp, email, name, sid, projectName, 
      mat1quantity, mat1, mat2quantity, mat2, 
      mat3quantity, mat3, mat4quantity, mat4, 
      mat5quantity, mat5, affiliation, elapsedTime, estimate, 
      price1, price2, printColor, printSize, printCount, sheetName, } = rowData;

    let productPrices = [];
    const materials = [ mat1, mat2, mat3, mat4, mat5 ];
    const quantities = [ mat1quantity, mat2quantity, mat3quantity, mat4quantity, mat5quantity ];
    materials.forEach( (material, index) => {
      if(material) {
        Object.values(STORESHEETS).forEach(materialSheet => {
          const idx = SearchSpecificSheet(materialSheet, material);
          if(idx) {
            const price = materialSheet.getRange(idx, 6, 1, 1).getValue();
            let subtotal = price * quantities[index];
            productPrices.push(subtotal);
          }
        });
      }
    });
    console.info(`Sheet Info: ${productPrices}`);
    estimate = productPrices ? productPrices.reduce((a,b) => a + b) : 0.0;
    console.info(`Final Estimate = $${estimate}`);
    SheetService.SetByHeader(sheet, HEADERNAMES.estimate, row, estimate);
    return estimate;
  } catch(err) {
    console.error(`BuildEstimate() failed: ${err}`);
    return 1;
  }
}

/**
 * 
 *
const _testEstimate = () => {
  BuildEstimate(SHEETS.Advancedlab, 10);
}
*/

/**
 * Helper Method for TitleCasing Names
 * @param {string} string
 * @returns {string} titlecased
 */
const TitleCase = (str = ``) => {
  str = str
    .toLowerCase()
    .split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}






