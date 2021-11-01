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
  // value = "laxbop@berkeley.edu";  // test good sid
  if (value) value.toString().replace(/\s+/g, "");
  let res = {};
  for(const [key, sheet] of Object.entries(SHEETS)) {
    const finder = sheet.createTextFinder(value).findAll();
    if (finder != null) {
      temp = [];
      finder.forEach(result => temp.push(result.getRow()));
      res[sheet.getName()] = temp;
    }
  }
  Logger.log(JSON.stringify(res));
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
  for(const [key, sheet] of Object.entries(SHEETS)) {
    const finder = sheet.createTextFinder(jobnumber).findNext();
    if (finder != null) {
      res[sheet.getName()] = finder.getRow();
    }
  }
  Logger.log(JSON.stringify(res));
  return res;
}


/**  
 * Delete Files older than some number of days
 * @param {number} RetentionPeriod
 */
const DeleteOldFiles = () => {
  const folder = DriveApp.getFoldersByName("Job Forms");
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
    Logger.log(`${err} : Cell failed to be clipped.`);
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the value of a cell by column name and row number
 * Tested and confirmed
 * @param {string} colName
 * @param {number} row
 */
 const getByHeader = (theSheet, colName, row) => {
  // let data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  try {
    let data = theSheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row - 1][col];
      // Logger.log(`Value of col: ${colName} row: ${row} is ${data[row - 1][col]}`);
    }
  } catch (err) {
    Logger.log(`${err} : getByHeader failed - Sheet: ${theSheet} Col Name specified: ${colName} Row: ${row}`);
  }
};



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Set the value of a cell by column name and row number
 * Tested and confirmed
 * @param {string} colName
 * @param {number} row
 * @param {any} val
 */
const setByHeader = (theSheet, colName, row, val) => {
  //let theSheet = SpreadsheetApp.getActiveSheet();
  try {
    const data = theSheet.getDataRange().getValues();
    const col = data[0].indexOf(colName);
    let range = theSheet.getRange(row, col+1);
    range.setValue(val);
    //Logger.log(`Value of row: ${row} col: ${col} set to ${val}`);
  } catch (err) {
    Logger.log(`${err} : setByHeader failed - Sheet: ${theSheet} Row: ${row} Col: ${col} Value: ${val}`);
  }
};




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
  //ScriptApp.newTrigger('myFunction').timeBased().everyHours(6).create();

  var timetoEmail = 6;
  // Trigger summary email to every DS every Weekday at 07:00.
  try {
    ScriptApp.newTrigger("CreateSummaryEmail")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger("CreateSummaryEmail")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.TUESDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger("CreateSummaryEmail")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger("CreateSummaryEmail")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.THURSDAY)
      .atHour(timetoEmail)
      .create();
    ScriptApp.newTrigger("CreateSummaryEmail")
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.FRIDAY)
      .atHour(timetoEmail)
      .create();
  } catch (err) {
    Logger.log(`${err} : Could not create triggers`);
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
        Logger.log(`OnEdit Trigger : ${trigger.getUniqueId()}`); //KEEP THIS TRIGGER
      if (trigger.getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT)
        Logger.log(`OnFormSubmit Trigger : ${trigger.getUniqueId()}`); //KEEP THIS TRIGGER
      if (trigger.getEventType() == ScriptApp.EventType.CLOCK) {
        Logger.log(`TimeBased Trigger : ${trigger.getUniqueId()}`);
        ScriptApp.deleteTrigger(trigger);
      }
    })
    Logger.log(`Removed Triggers for Summary Emails`);
  } catch (err) {
    Logger.log(`${err} : Couldnt remove triggers for whatever reason.`);
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
      Logger.log(`${name} : ${FORMS[name]} IS NOW DISABLED.`);
    }
    Logger.log(`Turned off JPS Form Response Collection : JPS is DISABLED. ENJOY THE BREAK.`);
  } catch (err) {
    Logger.log(`${err} : Couldnt disable Accepting Responses on Forms`);
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
      Logger.log(`${name} : ${FORMS[name]} IS NOW ENABLED.`);
    }
    Logger.log(`Turned ON JPS Form Response Collection : JPS is ENABLED. HERE COMES THE AVALANCH!!`);
  } catch (err) {
    Logger.log(err + " : Couldnt enable Accepting Responses on Forms");
  }

  //Create Triggers
  try {
    CreateTimeDrivenTrigger();
    Logger.log("Created Daily Summary Email Triggers.");
  } catch (err) {
    Logger.log(`${err} : Couldnt install triggers for whatever reason.`);
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
 *
 * Test Async
 */
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate Turnaround Time
 * @param {time} start
 * @param {time} end
 * @returns {duration} formatted time
 */
const TimeDiff = (start, end) => {
  try {
    end = end ? end : new Date(); //if supplied with nothing, set end time to now
    start = start ? start : new Date(end - 87000000); //if supplied with nothing, set start time to now minus 24 hours.

    let timeDiff = Math.abs((end - start) / 1000); //Milliseconds to sec

    let secs = Math.floor(timeDiff % 60); //Calc seconds
    timeDiff = Math.floor(timeDiff / 60); //Difference seconds to minutes
    let secondsAsString = secs < 10 ? "0" + secs : secs + ""; //Pad with a zero

    let mins = timeDiff % 60; //Calc mins
    timeDiff = Math.floor(timeDiff / 60); //Difference mins to hrs
    let minutesAsString = mins < 10 ? "0" + mins : mins + ""; //Pad with a zero

    let hrs = timeDiff % 24; //Calc hrs
    timeDiff = Math.floor(timeDiff / 24); //Difference hrs to days
    let days = timeDiff;

    //Write
    let formatted =
      days + " " + hrs + ":" + minutesAsString + ":" + secondsAsString;
    Logger.log("Duration = " + formatted);

    return new Promise((resolve) => {
      resolve(formatted);
      Logger.log(formatted);
    });
  } catch (err) {
    Logger.log(`${err} : Calculating the duration has failed for some reason.`);
  }
};




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
        let email = getByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), "Email Address", row);
        let sid = getByHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName), "Your Student ID Number?", row)
        let priority = GetPriority(email, sid);
        Logger.log(`Email : ${email}, SID : ${sid}, Priority : ${priority}`);
        if(priority != `STUDENT NOT FOUND!`) {
          list.push(email);
          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getRange(row, 3, 1, 1).setValue(priority);
        }
      })
    }
  }
  return list;
};





const CountTotalEmailsSent = async () => {
  const supportAlias = GmailApp.getAliases()[0];
  let labelName = "JPS Notifications";

  var labels = GmailApp.getUserLabels();
  // labels.forEach(label => {
  //     let name = label.getName()
  //     Logger.log(`Labels : ${name}`)
  // })

  let now = new Date();
  let oldest = now;
  let pageSize = 50;
  let start = 0;
  let threads;

  do {
    threads = await GmailApp.search(`label:jacobs-project-support-jps-notifications `, start, pageSize);
    // threads = await GmailApp.getInboxThreads(start, pageSize);
    threads.forEach((thread) => {
        oldest = thread.getLastMessageDate() < oldest ? thread.getLastMessageDate() : oldest;
    });

    start += pageSize;
    Utilities.sleep(1000);
  } while(threads.length > 0);
  
  // calculate age of oldest messag in days
  let ageOfOldest = Math.round((datetimeToDate(now) - datetimeToDate(oldest)) / (1000 * 60 * 60 * 24))

  // get all threads in inbox as an array in order to count 
  var threadsCount = GmailApp.getInboxThreads();
  
  // Add a row of the spreadsheet's first sheet and include the following data:
  // current date & time | username / email address | # of message threads in inbox | Age in days of oldest message
  Logger.log(`Time Now : ${now}, Number of Emails in Inbox : ${threadsCount.length}, Oldest Email : ${ageOfOldest}`);
}

const datetimeToDate = (d) => {
  return new Date(d.getYear(), d.getMonth(), d.getDate());
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
  constructor(date){
    this.date = date ? date : new Date();
    this.jobnumber;
  }

  Create() {
    let testedDate = this.IsValidDate();
    try {
      if ( this.date == undefined || this.date == null || this.date == "" || testedDate == false ) {
        this.jobnumber = +Utilities.formatDate(new Date(), `PST`, `yyyyMMddHHmmss`);
        Logger.log(`Set Jobnumber to a new time because timestamp was missing.`);
      } else {
        this.jobnumber = +Utilities.formatDate(this.date, `PST`, `yyyyMMddhhmmss`);
        Logger.log(`Input time: ${this.date}, Set Jobnumber: ${this.jobnumber}`);
      }
    } catch (err) {
      Logger.log(`${err} : Couldn't fix jobnumber.`);
    }
    if (this.jobnumber == undefined || testedDate == false) {
      this.jobnumber = +Utilities.formatDate(new Date(), `PST`, `yyyyMMddHHmmss`);
    }
    Logger.log(`Returned Job Number : ${this.jobnumber}`);
    return this.jobnumber.toString();
  };

  Format() {
    return new Date(this.date.getYear(), this.date.getMonth(), this.date.getDate() -1);
  }

  IsValidDate() {
    if (Object.prototype.toString.call(this.date) !== "[object Date]") return false;
    return !isNaN(this.date.getTime());
  };
}

const _testJobNumberGen = () => {
  const gen = new JobNumberGenerator(new Date(2015, 10, 3));
  const num = gen.Create();
  Logger.log(num);
  const formatted = gen.Format();
  Logger.log(formatted);
}






























