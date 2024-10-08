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
 * ----------------------------------------------------------------------------------------------------------------
 * Return the value of a cell by column name and row number
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 */
const GetByHeader = (sheet, columnName, row) => {
  try {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(columnName);
    if (col == -1) return false;
    return data[row - 1][col];
  } catch (err) {
    console.error(`"GetByHeader()" failed : ${err}`);
    return 1;
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the values of a column by the name
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 */
const GetColumnDataByHeader = (sheet, columnName) => {
  try {
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName);
    if (col == -1) return false;
    let colData = data.map(d => d[col]);
    colData.splice(0, 1);
    return colData;
  } catch (err) {
    console.error(`"GetColumnDataByHeader()" failed : ${err}`);
    return 1;
  }
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the values of a row by the number
 * @param {sheet} sheet
 * @param {number} row
 * @returns {dict} {header, value}
 */
const GetRowData = (sheet, row) => {
  let dict = {};
  try {
    let headers = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()[0];
    headers.forEach( (name, index) => {
      let linkedKey = Object.keys(HEADERNAMES).find(key => HEADERNAMES[key] === name);
      if(!linkedKey) headers[index] = name;
      else headers[index] = linkedKey;
    })
    let data = sheet.getRange(row, 1, 1, sheet.getMaxColumns()).getValues()[0];
    headers.forEach( (header, index) => {
      dict[header] = data[index];
    });
    dict[`sheetName`] = sheet.getSheetName();
    dict[`row`] = row;
    console.info(dict);
    return dict;
  } catch (err) {
    console.error(`"GetRowData()" failed : ${err}`);
    return 1;
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the values of a row by the number
 * @param {sheet} sheet
 * @param {number} row
 * @param {JSON} data
 * @returns {dict} {header, value}
 */
const SetRowData = (sheet, data) => {
  let dict = {};
  try {
    let sheetHeaderNames = Object.values(GetRowData(sheet, 1));
    let values = [];
    Object.entries(data).forEach(pair => {
      let headername = HEADERNAMES[pair[0]];
      let index = sheetHeaderNames.indexOf(headername);
      values[index] = pair[1];
    });
    console.info(values);
    sheet.appendRow(values);
    return 0;
  } catch (err) {
    console.error(`"SetRowData()" failed : ${err}`);
    return 1;
  }
}

const testSetRow = () => {
  const rowdata = { 
    status: STATUS.received,
    ds: 'Cody',
    priority: PRIORITY.Tier1,
    id: new IDService().id,
    timestamp: new Date().toDateString(),
    email: 'dingus@berkeley.edu',
    name: 'Testy Fiesty',
    sid: 3035180162,
    projectName: 'Testy',
    affiliation: 'DES INV Student',
    Color: 'Red',
    roughDimensions: '3x5',
    numberOfParts: 25 ,
  }
  SetRowData(SHEETS.Vinyl, rowdata);
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set the value of a cell by column name and row number
 * @param {sheet} sheet
 * @param {string} colName
 * @param {number} row
 * @param {any} val
 */
const SetByHeader = (sheet, columnName, row, val) => {
  try {
    const data = sheet.getDataRange().getValues();
    const col = data[0].indexOf(columnName) + 1;
    if(col == -1) return false;
    sheet.getRange(row, col).setValue(val);
    return 0;
  } catch (err) {
    console.error(`"SetByHeader()" failed : ${err}`);
    return 1;
  }
};


/**
 * Check if this sheet is forbidden
 * @param {sheet} sheet to check
 * @returns {bool} false if sheet is allowed
 * @returns {bool} true if forbidden
 */
const IsValidSheet = (someSheet = SHEETS.Laser) => {
  try {
    const thisSheetName = someSheet.getSheetName();
    let forbiddenNames = [];
    Object.values(NONITERABLESHEETS).forEach(sheet => forbiddenNames.push(sheet.getSheetName()));
    return !forbiddenNames.includes(thisSheetName);
  } catch(err) {
    console.error(`"IsValidSheet()" failed : ${err}`);
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
      res = GetRowData(sheet, finder.getRow());
    }
  }
  return res;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find some data in the column
 * @param {spreadsheet} sheet
 * @param {string} column
 * @param {any} data
 * @returns {int} indexes
 */
const FindDataInColumn = (sheet, column, data) => {
  let indexes = [];
  let values = sheet.getRange(column + ":" + column).getValues(); // like A:A
  let row = 2;

  while (values[row] && values[row][0] !== data) row++;
  if (values[row][0] === data) indexes.push(row + 1);
  else return -1;
  return indexes;
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find some data in the row
 * @param {spreadsheet} sheet
 * @param {any} data
 * @returns {[int]} column indexes
 */
const FindDataInRow = (sheet, data) => {
  let indexes = [];
  let rows = sheet.getDataRange.getValues();

  //Loop through all the rows and return a matching index
  for (let r = 1; r < rows.length; r++) {
    let index = rows[r].indexOf(data) + 1;
    indexes.push(index);
  }
  return indexes;
};




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find an index in an array
 * @param {any} search
 * @returns {int} index
 */
Array.prototype.findIndex = (search) => {
  if (search == "") return false;
  for (let i = 0; i < this.length; i++)
    if (this[i].toString().indexOf(search) > -1) return i;
  return -1;
};







/**
 * Find Missing Elements in Array
 * @param {[]} array 1
 * @param {[]} array 2
 * @return {[]} array of indexes
 */
const FindMissingElementsInArrays = (array1, array2) => {
  let indexes = [];
  array1.forEach( item => {
    let i = array2.indexOf(item);
    indexes.push(i);
  })
  return indexes;
}

/**
 * Validate an email string
 * @param {string} email
 * @returns {bool} boolean
 */
const ValidateEmail = (email) => {
  const regex = new RegExp(/^[a-zA-Z0-9+_.-]+@[berkeley.edu]+$/);
  let match = regex.test(email);
  console.warn(`Email is valid? : ${match}`)
  return match;
}

/**
 * Get Store Sheet Association
 * @param {sheet} sheet
 * @returns {sheet} store sheet
 */
const GetStoreSheet = (sheet) => {
  const sheetName = sheet.getSheetName();
  switch(sheetName) {
    case SHEETS.Laser.getSheetName():
      return STORESHEETS.LaserStoreItems;
    case SHEETS.Fablight.getSheetName():
      return STORESHEETS.FablightStoreItems;
    case SHEETS.Waterjet.getSheetName():
      return STORESHEETS.WaterjetStoreItems;
    case SHEETS.Advancedlab.getSheetName():
      return STORESHEETS.AdvLabStoreItems;
    case SHEETS.Shopbot.getSheetName():
      return STORESHEETS.ShopbotStoreItems;
    case SHEETS.Vinyl.getSheetName():
      return STORESHEETS.VinylCutterStoreItems;
    case SHEETS.Othertools.getSheetName():
      return STORESHEETS.OthermillStoreItems;
    case SHEETS.Plotter.getSheetName():
    case SHEETS.GSI_Plotter.getSheetName():
      return STORESHEETS.VinylCutterStoreItems;
    default:
      return STORESHEETS.LaserStoreItems;
  }  
}

/**
 * Look up Item's Info in Store Sheet
 * @param {sheet} sheet
 * @param {material} material
 * @param {object} row data
 */
const GetStoreInfo = (sheet, material) => {
  sheet = sheet ? sheet : SHEETS.Laser;
  material = material ? material : GetByHeader(sheet, HEADERNAMES.mat1, 2);

  const storesheet = GetStoreSheet(sheet);
  const row = SearchSpecificSheet(storesheet, material);
  const data = GetRowData(storesheet, row);
  return data;
}


const GetAllProjectNames = () => {
  let names = {}
  Object.values(SHEETS).forEach(sheet => {
    let titles = [...GetColumnDataByHeader(sheet, HEADERNAMES.projectName)]
      .filter(Boolean)
      .filter(x => x != `FORMULA ROW`);
    names[sheet.getName()] = [...new Set(titles)];
  });
  console.info(names);
  return names;
}


const BuildEstimate = (sheet, row) => {
  try {
    if(row < 2) throw new Error(`Row ${row}, not allowed...`);
    if(!IsValidSheet(sheet)) throw new Error(`Forbidden Sheet....`);

    const rowData = GetRowData(sheet, row);
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
    SetByHeader(sheet, HEADERNAMES.estimate, row, estimate);
    return estimate;
  } catch(err) {
    console.error(`BuildEstimate() failed: ${err}`);
    return 1;
  }
}

const _testEstimate = () => {
  BuildEstimate(SHEETS.Advancedlab, 10);
}


/**
 * Helper Method for TitleCasing Names
 * @param {string} string
 * @returns {string} titlecased
 */
const TitleCase = (str) => {
  str = str
    .toLowerCase()
    .split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}






