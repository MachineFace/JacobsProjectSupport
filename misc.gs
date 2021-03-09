

/**  TESTES
 * ----------------------------------------------------------------------------------------------------------------
 * Delete Files older than some number of days
 * @param {number} RetentionPeriod
 */
var DeleteOldFiles = function () {
    var folder = DriveApp.getFoldersByName("Job Forms");

    function processFolder(folder) {
        var files = folder.getFiles();
        while (files.hasNext()) {
            var file = files.next();
            if (new Date() - file.getLastUpdated() > RetentionPeriod) {
                //file.setTrashed(true); //uncomment this line to put them in the trash
                //Drive.Files.remove(file.getId()); //uncomment this line to delete them immediately; CAREFUL!
            }
        }
    }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Format cell to fix overlap issue
 * @param {cell} cell
 */
var formatCell = function (cell) {
    try {
        let strategy = SpreadsheetApp.WrapStrategy.CLIP;
        cell.setWrapStrategy(strategy);
    }
    catch(err) {
        Logger.log(err + ' : Cell failed to be clipped.');
    }
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return the value of a cell by column name and row number
 * 
 * Tested and confirmed
 * 
 * @param {string} colName
 * @param {number} row
 */
var getByHeader = function (colName, row) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row-1][col];
    }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Custom Logger function - Writes to the tab called "Logger" for debugging purposes
 * @param {string} message
 * @returns message to specific logger sheet
 */
var Logg = function (message) {
    let logger = sheetDict.logger;
    let thisRow = logger.getLastRow() + 1;
    let time = new Date();
    try {
        logger.getRange(thisRow, 1).setValue(time);
        logger.getRange(thisRow, 2).setValue('INFO');
        logger.getRange(thisRow, 3).setValue(message);
    }
    catch (err) {
        Logger.log(err + ' : Couldnt log messages to sheet for whatever reason.');
    }
}




/** 
* Materials Class function
*/
var materials = function (index, quantity, name, url) {
    this.index = index;
    this.quantity = quantity;
    this.name = name;
    this.url = url;
}






/**
 * ----------------------------------------------------------------------------------------------------------------
 * Creates Time-Driven Triggers : ONLY RUN ONCE AFTER DELETING PREVIOUS TRIGGERS. DO NOT DELETE
 * Used in EnableJPS()
 */
var CreateTimeDrivenTrigger = function () {
    // Trigger every 6 hours.
    //ScriptApp.newTrigger('myFunction').timeBased().everyHours(6).create();

    var timetoEmail = 6;
    // Trigger summary email to every DS every Weekday at 07:00.
    try {
        ScriptApp.newTrigger('CreateSummaryEmail').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(timetoEmail).create();
        ScriptApp.newTrigger('CreateSummaryEmail').timeBased().onWeekDay(ScriptApp.WeekDay.TUESDAY).atHour(timetoEmail).create();
        ScriptApp.newTrigger('CreateSummaryEmail').timeBased().onWeekDay(ScriptApp.WeekDay.WEDNESDAY).atHour(timetoEmail).create();
        ScriptApp.newTrigger('CreateSummaryEmail').timeBased().onWeekDay(ScriptApp.WeekDay.THURSDAY).atHour(timetoEmail).create();
        ScriptApp.newTrigger('CreateSummaryEmail').timeBased().onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(timetoEmail).create();
    }
    catch (err) {
        Logg(err + ' : Could not create triggers');
    }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Remove Triggers when Disabling JPS - DO NOT DELETE
 * Used in 'DisableJPS()'
 */
var RemoveTimedTriggers = function () {
    let triggers = ScriptApp.getProjectTriggers();
    try {
        for (var i = 0; i < triggers.length; i++) {
            if (triggers[i].getEventType() == ScriptApp.EventType.ON_EDIT) Logger.log('OnEdit Trigger : ' + triggers[i].getUniqueId()); //KEEP THIS TRIGGER
            if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) Logger.log('OnFormSubmit Trigger : ' + triggers[i].getUniqueId());  //KEEP THIS TRIGGER  
            if (triggers[i].getEventType() == ScriptApp.EventType.CLOCK) {
                Logger.log('TimeBased Trigger : ' + triggers[i].getUniqueId());
                ScriptApp.deleteTrigger(triggers[i]);
            }
        }
        Logger.log('Removed Triggers for Summary Emails');
    }
    catch (err) {
        Logger.log(err + ' : Couldnt remove triggers for whatever reason.')
    }
}





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn OFF JPS - DO NOT DELETE
 * Used in conjunction with 'EnableJPS()',  'RemoveTimedTriggers()', 'CreateTimeDrivenTrigger()'
 */
var DisableJPS = function () {
    //Disable Forms
    try {
        for (var name in formDict) {
            FormApp.openById(formDict[name]).setAcceptingResponses(false);
            Logger.log(name + ' : ', formDict[name] + ' IS NOW DISABLED.');
        }
        Logger.log('Turned off JPS Form Response Collection : JPS is DISABLED. ENJOY THE BREAK.');
    }
    catch (err) {
        Logger.log(err + ' : Couldnt disable Accepting Responses on Forms');
    }

    //Delete Timebased Triggers for Daily Emails
    RemoveTimedTriggers();
}





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn ON JPS - DO NOT DELETE
 * Used in conjunction with 'DisableJPS()',  'RemoveTimedTriggers()', 'CreateTimeDrivenTrigger()'
 */
var EnableJPS = function () {
    //Disable Forms
    try {
        for (var name in formDict) {
            FormApp.openById(formDict[name]).setAcceptingResponses(true);
            Logger.log(name + ' : ', formDict[name] + ' IS NOW ENABLED.');
        }
        Logger.log('Turned ON JPS Form Response Collection : JPS is ENABLED. HERE COMES THE AVALANCH!!');
    }
    catch (err) {
        Logger.log(err + ' : Couldnt enable Accepting Responses on Forms');
    }

    //Create Triggers
    try {
        CreateTimeDrivenTrigger();
        Logger.log('Created Daily Summary Email Triggers.');
    }
    catch (err) {
        Logger.log(err + ' : Couldnt install triggers for whatever reason.')
    }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find some data in the column
 * @param {spreadsheet} sheet
 * @param {string} column
 * @param {any} data
 */
var FindDataInColumn = function (sheet, column, data) {
    var indexes = [];
    var values = sheet.getRange(column + ":" + column).getValues();  // like A:A
    var row = 2;

    while (values[row] && values[row][0] !== data) row++;
    if (values[row][0] === data)
        indexes.push(row + 1);
    else
        return -1;
    return indexes;

}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find some data in the row
 * @param {spreadsheet} sheet
 * @param {any} data
 * @returns {[int]} column indexes
 */
var FindDataInRow = function (sheet, data) {
    var indexes = [];
    var rows = sheet.getDataRange.getValues();

    //Loop through all the rows and return a matching index
    for (var r = 1; r < rows.length; r++) {
        let index = rows[r].indexOf(data) + 1;
        indexes.push(index);
        /*
        if ( rows[r].join("#").indexOf(data) !== -1 )
        {
          indexes.push(r + 1);
        }
        */

    }
    return indexes;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Recolors a single row on a sheet based on 'Status' ***DEFUNCT***
 * @param {row} wholerow
 */
var Recolor = function (wholerow, status, shippingQuestion) {
    try {   
        switch (shippingQuestion) {
            case 'Yes':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#3c78d8'); //Dark blue
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#cfe2f3'); //Light Blue
                break;
            case 'No':
                wholerow.setFontColor(null); //unset
                wholerow.setBackground(null); //Unset previous color
                break;
            default:
                break;
        }

        switch (status) {
            case 'Received':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#00785A');  //Dark mint
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#30E6B4'); //Light mint
                break;
            case 'Pending Approval':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#f1c232');  //Dark Yellow
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#fff2cc'); //Light yellow
                break;
            case 'In-Progress':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#38761d');  //green
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#d9ead3'); //Light green
                break;
            case 'Completed':
                wholerow.setFontColor(null); //Unset previous color
                wholerow.setFontColor('#7D7D7D');  //Gray
                wholerow.setBackground(null); //unset
                break;
            case 'CLOSED':
            case 'Billed':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#999999');  //Dark Gray
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#efefef'); //Light Grey
                break;
            case 'Cancelled':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#9900ff'); //Purple
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#d9d2e9'); //Light purple
                break;
            case 'FAILED':
                wholerow.setFontColor(null); //unset
                wholerow.setFontColor('#ff0000'); //Red
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#e6b8af'); //Light red
                break;
            case 'Waitlist':
            case 'Missing Access':
                wholerow.setFontColor(null); //Unset previous color
                wholerow.setFontColor('#ff9900'); //Orange
                wholerow.setBackground(null); //unset
                wholerow.setBackground('#fce5cd'); //Light orange
                break;
            case undefined:
                wholerow.setFontColor(null); //Unset Color
                wholerow.setBackground(null); //Unset previous color
                break;
            default:
                wholerow.setFontColor(null); //Unset Color
                wholerow.setBackground(null); //Unset previous color
                break;
        }
    }
    catch (err) {
        Logg(err + ' : Cant change row color for some reason. ');
    }

}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Find an index in an array
 * @param {any} search
 */
Array.prototype.findIndex = function (search) {
    if (search == "") return false;
    for (var i = 0; i < this.length; i++)
        if (this[i].toString().indexOf(search) > -1) return i;

    return -1;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Test if value is a date and return true or false
 * @param {date} d
 * @returns {boolean} b
 */
var isValidDate = function (d) {
    if (Object.prototype.toString.call(d) !== "[object Date]") return false;
    return !isNaN(d.getTime());
}










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
function TimeDiff(start, end) {
    try {
        end = end ? end : new Date();  //if supplied with nothing, set end time to now
        start = start ? start : new Date(end - 87000000);  //if supplied with nothing, set start time to now minus 24 hours.

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
        let formatted = days + ' ' + hrs + ':' + minutesAsString + ':' + secondsAsString;
        Logger.log("Duration = " + formatted);

        return new Promise(resolve => {
          resolve(formatted);
          Logger.log(formatted);
        })
        
    }
    catch (err) {
        Logg(err + " : Calculating the duration has failed for some reason.");
    }
}


async function test() {
    let first = await TimeDiff();
    let second = await TimeDiff( new Date(1996,6,5), new Date(1941,2,9) );
    Logger.log(first);
    Logger.log(second);  

    /*
    //Paralell Processing
    await Promise.all([
        (async() => await TimeDiff())(),
        (async() => await TimeDiff( new Date(1996,6,5), new Date(1941,2,9) ))(),
    ])
    */
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Check Students with Missing Access for their Priority Number if it exists.
 */
var CheckMissingAccessStudents = () => {
    let accessPool = {
        'Ultimaker' : sheetDict.ultimaker.getRange(2, 3, sheetDict.ultimaker.getLastRow() -1, 1).getValues(),
        'Laser Cutter' : sheetDict.laser.getRange(2, 3, sheetDict.laser.getLastRow() -1, 1).getValues(),
        'Fablight' : sheetDict.fablight.getRange(2, 3, sheetDict.fablight.getLastRow() -1, 1).getValues(),
        'Waterjet' : sheetDict.waterjet.getRange(2, 3, sheetDict.waterjet.getLastRow() -1, 1).getValues(),
        'Advanced Lab' : sheetDict.advancedlab.getRange(2, 3, sheetDict.advancedlab.getLastRow() -1, 1).getValues(),
        'Shopbot' : sheetDict.shopbot.getRange(2, 3, sheetDict.shopbot.getLastRow() -1, 1).getValues(),
        'Haas & Tormach' : sheetDict.haas.getRange(2, 3, sheetDict.haas.getLastRow() -1, 1).getValues(),
        'Vinyl Cutter' : sheetDict.vinyl.getRange(2, 3, sheetDict.vinyl.getLastRow() -1, 1).getValues(),
        'Othermill' : sheetDict.othermill.getRange(2, 3, sheetDict.othermill.getLastRow() -1, 1).getValues(),
        'Other Tools' : sheetDict.othertools.getRange(2, 3, sheetDict.othertools.getLastRow() -1, 1).getValues(),
    }

    let ids = [];
    let names = [];
    for (let [page, values] of Object.entries(accessPool)) {
        values.forEach( (item, index) => {
            if(item == 'STUDENT NOT FOUND!') {
                let i = index + 2;
                //Logger.log('Item : ' + item  + ', Index : ' + i)
                let id = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(i, 11, 1, 1).getValue().toString();
                ids.push(id);
                let name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(i, 10, 1, 1).getValue().toString();
                names.push(name);

                let priority = GetPriority(id);
                SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(i, 3, 1, 1).setValue(priority);
            }
        })
    }
    Logger.log(ids)
    Logger.log(names)

    //Return the names of the missing students
    return names;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * 
 */
function Help() {
    //go to some kind of help file that breaks down using JPS, step by step.
    let info = [
      "Note : All status changes trigger an email to the student except for 'CLOSED' status",
      "New Project comes into a sheet and status will automatically be set to 'Received'.",
      "Assign yourself as the DS / SS and fill in the materials as best you can.",
      "Change the status to 'In-Progress' when you're ready to start the project.",
      "Wait 30 seconds for the printable ticket to generate, and print it.",
      "Fabricate the project.",
      "When it's done, bag the project + staple the ticket to the bag and change the status to 'Completed'.",
      "Select any cell in the row and choose 'Generate Bill' to bill the student. The status will change itself to 'Billed'.",
      "If you don't need to bill the student, choose 'CLOSED' status.",
      "If you need to cancel the job, choose 'Cancelled'. ",
      "If the project can't be fabricated at all, choose 'FAILED', and email the student why it failed.",
      "If you need student approval before proceeding, choose 'Pending Approval'. ",
      "'Missing Access' will be set automatically, and you should not choose this as an option.",
      "If the student needs to be waitlisted for more information or space, choose 'Waitlisted'. ",
      "See Cody or Chris for additional help + protips."
    ]
    return info;
}



