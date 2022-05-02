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
  if (value) value.toString().replace(/\s+/g, "");

  const finder = sheet.createTextFinder(value).findNext();
  if (finder != null) {
    return finder.getRow();
  } else return false;
}

/**
 * Search all Sheets for a jobnumber
 * @required {string} jobnumber
 * @returns {[sheet, row]} list of sheets with a row
 */
const FindByJobNumber = (jobnumber) => {
  jobnumber = 20211025144607;  // test good jnum
  if (jobnumber) jobnumber.toString().replace(/\s+/g, "");
  let res = {};
  Object.values(SHEETS).forEach(sheet => {
    const finder = sheet.createTextFinder(jobnumber).findNext();
    if (finder != null) {
      res[sheet.getName()] = finder.getRow();
    }
  })
  console.info(JSON.stringify(res));
  return res;
}


/**  
 * Delete Files older than some number of days
 * @param {number} RetentionPeriod
 */
const DeleteOldFiles = () => {
  const folder = DriveApp.getFoldersByName(`Job Forms`);
  const processFolder = (folder) => {
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      if (new Date() - file.getLastUpdated() > RetentionPeriod) {
        //file.setTrashed(true); //uncomment this line to put them in the trash
        //Drive.Files.remove(file.getId()); //uncomment this line to delete them immediately; CAREFUL!
      }
    }
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Format cell to fix overlap issue
 * @param {cell} cell
 */
const FormatCell = (cell) => {
  try {
    const strategy = SpreadsheetApp.WrapStrategy.CLIP;
    cell.setWrapStrategy(strategy);
  } catch (err) {
    console.error(`${err} : Cell failed to be clipped.`);
  }
};


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
    if (col != -1) return data[row - 1][col];
  } catch (err) {
    console.error(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName} Row: ${row}`);
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
    let colData = data.map(d => d[col]);
    colData.splice(0, 1);
    if (col != -1) return colData;
  } catch (err) {
    console.error(`${err} : GetByHeader failed - Sheet: ${sheet} Col Name specified: ${columnName}`);
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
      headers[index] = Object.keys(HEADERNAMES).find(key => HEADERNAMES[key] === name);
    })
    let data = sheet.getRange(row, 1, 1, sheet.getMaxColumns()).getValues()[0];
    headers.forEach( (header, index) => {
      dict[header] = data[index];
    });
    dict[`sheetName`] = sheet.getSheetName();
    dict[`row`] = row;
    // console.info(dict);
    return dict;
  } catch (err) {
    console.error(`${err} : GetRowData failed - Sheet: ${sheet} Row: ${row}`);
  }
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
    sheet.getRange(row, col).setValue(val);
  } catch (err) {
    console.error(`${err} : SetByHeader failed - Sheet: ${sheet} Row: ${row} Col: ${col} Value: ${val}`);
  }
};


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
const _testFindOne = () => {
  num = 20220302070954;
  const res = FindOne(num);
  console.info(res);
}




/**
 * Materials Class function
 */
const materials = (index, quantity, name, url) => {
  this.index = index;
  this.quantity = quantity;
  this.name = name;
  this.url = url;
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Creates Time-Driven Triggers : ONLY RUN ONCE AFTER DELETING PREVIOUS TRIGGERS. DO NOT DELETE
 * Used in EnableJPS()
 */
const CreateTimeDrivenTrigger = () => {
  // Trigger every 6 hours.
  // ScriptApp.newTrigger('myFunction').timeBased().everyHours(6).create();

  const timetoEmail = 6; // Trigger summary email to every DS every Weekday at 07:00.
  const triggerName = `CreateSummaryEmail`;
  try {
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.TUESDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.THURSDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger(triggerName)
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.FRIDAY)
      .atHour(timetoEmail)
      .create();
  } catch (err) {
    console.error(`${err} : Could not create triggers`);
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Remove Triggers when Disabling JPS - DO NOT DELETE
 * Used in 'DisableJPS()'
 */
const RemoveTimedTriggers = () => {
  let triggers = ScriptApp.getProjectTriggers();
  try {
    triggers.forEach( trigger => {
      if (trigger.getEventType() == ScriptApp.EventType.ON_EDIT)
        console.info(`OnEdit Trigger : ${trigger.getUniqueId()}`); // KEEP THIS TRIGGER
      if (trigger.getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT)
        console.info(`OnFormSubmit Trigger : ${trigger.getUniqueId()}`); // KEEP THIS TRIGGER
      if (trigger.getEventType() == ScriptApp.EventType.CLOCK) {
        console.info(`TimeBased Trigger : ${trigger.getUniqueId()}`);
        ScriptApp.deleteTrigger(trigger);
      }
    })
    console.info(`Removed Triggers for Summary Emails`);
  } catch (err) {
    console.error(`${err} : Couldnt remove triggers for whatever reason.`);
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn OFF JPS - DO NOT DELETE
 * Used in conjunction with 'EnableJPS()',  'RemoveTimedTriggers()', 'CreateTimeDrivenTrigger()'
 */
const DisableJPS = () => {
  //Disable Forms
  try {
    for (let name in FORMS) {
      FormApp.openById(FORMS[name]).setAcceptingResponses(false);
      console.warn(`${name} : ${FORMS[name]} IS NOW DISABLED.`);
    }
    console.warn(`Turned off JPS Form Response Collection : JPS is DISABLED. ENJOY THE BREAK.`);
  } catch (err) {
    console.error(`${err} : Couldnt disable Accepting Responses on Forms`);
  }

  //Delete Timebased Triggers for Daily Emails
  RemoveTimedTriggers();
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn ON JPS - DO NOT DELETE
 * Used in conjunction with 'DisableJPS()',  'RemoveTimedTriggers()', 'CreateTimeDrivenTrigger()'
 */
const EnableJPS = () => {
  try {
    for (let name in FORMS) {
      FormApp.openById(FORMS[name]).setAcceptingResponses(true);
      console.warn(`${name} : ${FORMS[name]} IS NOW ENABLED.`);
    }
    console.warn(`Turned ON JPS Form Response Collection : JPS is ENABLED. HERE COMES THE AVALANCH!!`);
  } catch (err) {
    console.error(err + " : Couldnt enable Accepting Responses on Forms");
  }

  //Create Triggers
  try {
    CreateTimeDrivenTrigger();
    console.warn("Created Daily Summary Email Triggers.");
  } catch (err) {
    console.error(`${err} : Couldnt install triggers for whatever reason.`);
  }
};


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
 * ----------------------------------------------------------------------------------------------------------------
 * Test if value is a date and return true or false
 * @param {date} d
 * @returns {boolean} b
 */
const isValidDate = (d) => {
  if (Object.prototype.toString.call(d) !== "[object Date]") return false;
  return !isNaN(d.getTime());
};

/**
 * Convert Datetime to Date
 * @param {date} d
 * @return {date} date
 */
const datetimeToDate = (d) => new Date(d.getYear(), d.getMonth(), d.getDate());




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Check Students with Missing Access for their Priority Number if it exists.
 */
const CheckMissingAccessStudents = () => {
  let list = [];
  let results = Search("STUDENT NOT FOUND!");
  if(results != null) {
    for(const [sheetName, values] of Object.entries(results)) {
      values.forEach( row => {
        let email = GetByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), HEADERNAMES.email, row);
        let sid = GetByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), HEADERNAMES.sid, row)
        const p = new Priority({email : email, sid : sid});
        console.info(`Email : ${email}, SID : ${sid}, Priority : ${p.priority}`);
        if(p.priority != `STUDENT NOT FOUND!`) {
          list.push(email);
          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getRange(row, 3, 1, 1).setValue(p.priority);
        }
      })
    }
  }
  return list;
};





/**
 * Check if this sheet is forbidden
 * @param {sheet} sheet to check
 * @returns {bool} false if sheet is allowed
 * @returns {bool} true if forbidden
 */
const CheckSheetIsForbidden = (someSheet) => {
  let forbiddenNames = [];
  Object.values(NONITERABLESHEETS).forEach( sheet => forbiddenNames.push(sheet.getName()));
  const index = forbiddenNames.indexOf(someSheet.getName());
  if(index == -1 || index == undefined) {
    console.info(`Sheet is NOT FORBIDDEN : ${someSheet.getName()}`)
    return false;
  } else {
    console.error(`SHEET FORBIDDEN : ${forbiddenNames[index]}`);
    return true;
  }
}
const _testSheetChecker = () => {
  const val = CheckSheetIsForbidden(OTHERSHEETS.Logger);
  console.info(`Logger Should be true-forbidden : ${val}`);
  const val2 = CheckSheetIsForbidden(SHEETS.Fablight);
  console.info(`Fablight Should be false-not_forbidden: ${val2}`);
  const val3 = CheckSheetIsForbidden(STORESHEETS.FablightStoreItems);
  console.info(`Store Should be true-forbidden: ${val3}`);
}


const FindMissingElementsInArrays = (array1, array2) => {
  let indexes = [];
  array1.forEach( item => {
    let i = array2.indexOf(item);
    indexes.push(i);
  })
  return indexes;
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Generate new Job number from a date
 * @param {time} date
 * @return {number} job number
 */
class JobNumberGenerator
{
  constructor({
    date : date,
  }){
    this.date = date ? new Date(date) : new Date();
    this.jobnumber;
    this.Create();
  }

  Create() {
    try {
      if (!this.IsValidDate()) this.jobnumber = this.FormatDateAsJobnumber(new Date());
      else if (!this.date || !this.IsValidDate()) {
        this.jobnumber = this.FormatDateAsJobnumber(new Date());
        console.warn(`Set Jobnumber to a new time because timestamp was missing.`);
        return this.jobnumber;
      } else {
        this.jobnumber = this.FormatDateAsJobnumber(this.date);
        console.info(`Input time: ${this.date}, Set Jobnumber: ${this.jobnumber}`);
        return this.jobnumber;
      }
    } catch (err) {
      console.error(`${err} : Couldn't fix jobnumber.`);
    }
    console.info(`Returned Job Number : ${this.jobnumber}`);
    return this.jobnumber.toString();
  };

  FormatDate() {
    return new Date(this.date.getYear(), this.date.getMonth(), this.date.getDate() -1);
  }

  FormatDateAsJobnumber (date) {
    return +Utilities.formatDate(date, `PST`, `yyyyMMddHHmmss`)
  }

  IsValidDate() {
    if (Object.prototype.toString.call(this.date) !== "[object Date]") return false;
    else return !isNaN(this.date.getTime());
  };
}

const _testJobNumberGen = () => {
  const jobnumbertypes = {
    GoodDate : new Date(2015, 10, 3),
    BadDate : `20200505`,
  }
  Object.values(jobnumbertypes).forEach(date => {
    const num = new JobNumberGenerator({ date : date });
    console.info(num.jobnumber.toString());
  })
}



const GetAllProjectNames = () => {
  let names = {}
  Object.values(SHEETS).forEach(sheet => {
    titles = [].concat(...GetColumnDataByHeader(sheet, HEADERNAMES.projectName));
    let culled = titles.filter(Boolean);
    names[sheet.getName()] = [...new Set(culled)];
  });
  console.info(names);
  return names;
}



/**
 * Set Dropdowns for status
 */
const SetStatusDropdowns = () => {
  Object.values(SHEETS).forEach(sheet => {
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(Object.values(STATUS));
    sheet.getRange(2, 1, sheet.getLastRow(), 1).setDataValidation(rule);
  })
}



/**
 * Set the Conditional Formatting for each page
 * @TRIGGERED
 */
const SetConditionalFormatting = () => {
  Object.values(SHEETS).forEach(sheet => {
    if(sheet.getSheetName() == SHEETS.Advancedlab.getSheetName()) return;
    console.warn(`Changing sheet: ${sheet.getSheetName()}'s conditional formatting rules....`);
    let rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.received}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.green_light)
        .setFontColor(COLORS.green_dark_2)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.inProgress}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.yellow_light)
        .setFontColor(COLORS.yellow_dark_2)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.missingAccess}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.orange_light)
        .setFontColor(COLORS.orange_bright)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.cancelled}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.purle_light)
        .setFontColor(COLORS.purple)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.completed}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.green_light)
        .setFontColor(COLORS.grey)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.closed}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.grey_light)
        .setFontColor(COLORS.grey)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.billed}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.grey_light)
        .setFontColor(COLORS.grey)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.failed}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.red_light)
        .setFontColor(COLORS.red)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.pickedUp}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.grey_light)
        .setFontColor(COLORS.grey)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.abandoned}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.red_light)
        .setFontColor(COLORS.red_dark_berry_2)
        .build()
      ,
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=$A2="${STATUS.waitlist}"`)
        .setRanges([sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()),])
        .setBackground(COLORS.orange)
        .setFontColor(COLORS.orange_dark_2)
        .build()
      ,
    ];
    // let existingRules = sheet.getConditionalFormatRules();
    // console.warn(existingRules)
    // existingRules.push(rules)
    sheet.setConditionalFormatRules(rules);
  });
}


/**
 * Resize the Summary page Rows back to Default
 * @TRIGGERED
 */
const SetRowHeight = () => {
  OTHERSHEETS.Summary.setRowHeightsForced(3, OTHERSHEETS.Summary.getMaxRows() - 3, 21);
  OTHERSHEETS.Summary.getRange(3, 1, OTHERSHEETS.Summary.getMaxRows() -1, OTHERSHEETS.Summary.getMaxColumns()).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
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









