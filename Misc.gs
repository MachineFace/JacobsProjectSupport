/**
 * MISC FUNCTIONS
 * ----------------------------------------------------------------------------------------------------------------
 */



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
 * Look up Item's Info in Store Sheet
 * @param {sheet} sheet
 * @param {material} material
 * @param {object} row data
 */
const GetStoreInfo = (sheet, material) => {
  sheet = sheet ? sheet : SHEETS.Laser;
  material = material ? material : SheetService.GetByHeader(sheet, HEADERNAMES.mat1, 2);

  const storesheet = GetStoreSheet(sheet);
  const row = SheetService.SearchSpecificSheet(storesheet, material);
  const data = SheetService.GetRowData(storesheet, row);
  return data;
}


/**
 * Build Estimate
 * [Replaces: =IFERROR(ARRAYFORMULA(TO_DOLLARS(((AQ2:AQ * P2:P)) * O2:O)),"")]
 */
const BuildEstimate = (sheet, row = 2) => {
  try {
    if(row < 2) throw new Error(`Row ${row}, not allowed...`);
    if(!SheetService.IsValidSheet(sheet)) throw new Error(`Forbidden Sheet....`);

    const rowData = SheetService.GetRowData(sheet, row);
    let { mat1quantity, mat1, mat2quantity, mat2, mat3quantity, mat3, mat4quantity, mat4, mat5quantity, mat5,
      unit_cost1, unit_cost2, unit_cost3, unit_cost4, unit_cost5, 
      estimate, sheetName, } = rowData;

    let productPrices = [];
    let materials = [ mat1, mat2, mat3, mat4, mat5, ];
    let quantities = [ mat1quantity, mat2quantity, mat3quantity, mat4quantity, mat5quantity, ];
    let unit_costs = [ unit_cost1, unit_cost2, unit_cost3, unit_cost4, unit_cost5, ];
    materials.forEach( (material, index) => {
      if(!material) return;
      let storeData = GetStoreInfo(sheet, material);
      let unit_price = storeData.Price > 0 ? storeData.Price : 0.0;
      unit_costs[index] = unit_price;
      let subtotal = unit_price * quantities[index];
      productPrices.push(subtotal);      
    });

    // Write Unit costs to sheet
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost1, row, unit_costs[0]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost2, row, unit_costs[1]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost3, row, unit_costs[2]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost4, row, unit_costs[3]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost5, row, unit_costs[4]);

    // Estimate Total
    console.info(`Product Subtotals: [${productPrices}]`);
    estimate = productPrices.length > 0 ? productPrices.reduce((a,b) => a + b) : 0.0;
    console.info(`Estimate: $${estimate}`);
    SheetService.SetByHeader(sheet, HEADERNAMES.estimate, row, estimate);
    return estimate;
  } catch(err) {
    console.error(`BuildEstimate() failed: ${err}`);
    return 1;
  }
}

/**
 * 
 */
const _testEstimate = () => {
  BuildEstimate(SHEETS.Laser, 2);
}


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






