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

    // TODO: Fix this messy shit.
    if(sheet.getSheetName() == SHEETS.Plotter.getSheetName() || sheet.getSheetName() == SHEETS.GSI_Plotter.getSheetName()) {
      mat1 = rowData.material;
      mat1quantity = rowData.mat1quantity;
    }

    let productPrices = [];
    let materials = [ mat1, mat2, mat3, mat4, mat5, ];
    let quantities = [ mat1quantity, mat2quantity, mat3quantity, mat4quantity, mat5quantity, ];
    let unit_costs = [ unit_cost1, unit_cost2, unit_cost3, unit_cost4, unit_cost5, ];
    for(let i = 0; i < materials.length; i++) {
      if(materials[i]) {
        let storeData = GetStoreInfo(sheet, materials[i]);
        let unit_price = storeData && storeData.Price > 0 ? storeData.Price : 0.0;
        unit_costs[i] = !isNaN(unit_price) ? Number(unit_price).toFixed(2) : 0.0;
        let quantity = !isNaN(quantities[i]) && quantities[i] > 0 ? Number(quantities[i]).toFixed(2) : 0.0;
        let subtotal = Number(unit_price * quantity).toFixed(2);
        productPrices.push(subtotal); 
        console.info(`Material: ${materials[i]}, Unit Price: ${unit_price}, Quantity: ${quantity} vs Quantity: ${quantities[i]}, SubTotal: ${subtotal}`);     
      }
    }

    // Estimate Total
    console.info(`Product Subtotals: [${productPrices}]`);
    estimate = productPrices.length > 0 ? productPrices.reduce((a,b) => {
      a = !isNaN(a) && a > 0 ? Number(a) : 0;
      b = !isNaN(b) && b > 0 ? Number(b) : 0;
      return Number(a + b).toFixed(2);
    }) : 0.0;
    console.info(`Estimate: $${estimate}`);

    // Write Unit costs to sheet
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost1, row, unit_costs[0]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost2, row, unit_costs[1]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost3, row, unit_costs[2]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost4, row, unit_costs[3]);
    SheetService.SetByHeader(sheet, HEADERNAMES.unit_cost5, row, unit_costs[4]);
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
  BuildEstimate(SHEETS.Fablight, 2);
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

/**
 * Print Enclosing Function Name
 */
const PrintEnclosingFunctionName = () => {
  const fname = new Error().stack.split('\n')[2].split(`at `)[1];
  // console.warn(`Testing: ${fname}`);
  return fname;
}


/**
 * Execute with Timeout
 * Note: Appscript is synchronous, so this function doesn't work....
 * @param {function} some function to run
 * @param {number} timeout in seconds
 * @returns {Promise} race
 *
const ExecuteWithTimeout = (fn, timeout = 2) => {
  timeout = timeout > 0 ? timeout * 1000 : 2000;
  const startTime = new Date().getTime();

  const timeoutPromise = new Promise((_, reject) => {
    // Continuously check the elapsed time without setTimeout
    while (new Date().getTime() - startTime < timeout) {
      // No operation, just waiting
    }
    reject("Execution timed out!");
  });

  // Wrap the function execution in a promise
  const executionPromise = new Promise((resolve, reject) => {
    try {
      const result = fn();  // Execute the function
      resolve(result);
    } catch (error) {
      reject(`Error during execution: ${error.message}`);
    }
  });
  
  return Promise.race([executionPromise, timeoutPromise]);  // Use Promise.race() to return whichever promise resolves or rejects first
}
*/






