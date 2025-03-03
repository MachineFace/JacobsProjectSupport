
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Creates Time-Driven Triggers : ONLY RUN ONCE AFTER DELETING PREVIOUS TRIGGERS. DO NOT DELETE
 * Used in EnableJPS()
 */
const CreateTimeDrivenTrigger = () => {
  try {
    // ScriptApp.newTrigger('myFunction').timeBased().everyHours(6).create();
    const timetoEmail = 6; // Trigger summary email to every DS every Weekday at 07:00.
    const triggerName = `CreateSummaryEmail`;
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
    ScriptApp.newTrigger(`SetSummaryPageRowHeight`)
      .timeBased()
      .everyHours(2)
      .create();
    ScriptApp.newTrigger(`Metrics`)
      .timeBased()
      .everyHours(2)
      .create();
    ScriptApp.newTrigger(`GenerateMissingTickets`)
      .timeBased()
      .everyHours(6)
      .create();
    ScriptApp.newTrigger(`SetConditionalFormatting`)
      .timeBased()
      .everyHours(6)
      .create();
    ScriptApp.newTrigger(`SetStatusDropdowns`)
      .timeBased()
      .everyHours(6)
      .create();
    ScriptApp.newTrigger(`SetSummaryPageRowHeight`)
      .timeBased()
      .everyDays(1)
      .atHour(5)
      .create();
    ScriptApp.newTrigger(`BuildSummaryEquation`)
      .timeBased()
      .everyWeeks(1)
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(2)
      .create();
    ScriptApp.newTrigger(`AuxillaryEquations`)
      .timeBased()
      .everyWeeks(1)
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(5)
      .create();
    return 0;
  } catch (err) {
    console.error(`"CreateTimeDrivenTrigger()" failed : ${err}`);
    return 1;
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Remove Triggers when Disabling JPS - DO NOT DELETE
 * Used in 'DisableJPS()'
 */
const RemoveTimedTriggers = () => {
  try {
    let triggers = ScriptApp.getProjectTriggers();
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
    // ScriptApp.newTrigger(`Metrics`)
    //   .timeBased()
    //   .everyHours(6)
    //   .create();
    // ScriptApp.newTrigger(`SetConditionalFormatting`)
    //   .timeBased()
    //   .everyHours(6)
    //   .create();
    // ScriptApp.newTrigger(`SetStatusDropdowns`)
    //   .timeBased()
    //   .everyHours(6)
    //   .create();
    // ScriptApp.newTrigger(`SetSummaryPageRowHeight`)
    //   .timeBased()
    //   .everyDays(1)
    //   .atHour(5)
    //   .create();
    // ScriptApp.newTrigger(`BuildSummaryEquation`)
    //   .timeBased()
    //   .everyWeeks(1)
    //   .onWeekDay(ScriptApp.WeekDay.MONDAY)
    //   .atHour(5)
    //   .create();
    // ScriptApp.newTrigger(`AuxillaryEquations`)
    //   .timeBased()
    //   .everyWeeks(1)
    //   .onWeekDay(ScriptApp.WeekDay.MONDAY)
    //   .atHour(5)
    //   .create();
    console.info(`Removed Triggers for Summary Emails`);
    return 0;
  } catch (err) {
    console.error(`"RemoveTimedTriggers()" failed : ${err}`);
    return 1;
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn OFF JPS - DO NOT DELETE
 * Used in conjunction with 'EnableJPS()',  'RemoveTimedTriggers()', 'CreateTimeDrivenTrigger()'
 */
const DisableJPS = () => {
  try {
    for (let name in FORMS) {
      FormApp.openById(FORMS[name]).setAcceptingResponses(false);
      console.warn(`${name} : ${FORMS[name]} IS NOW DISABLED.`);
    }
    RemoveTimedTriggers();
    console.warn(`Turned off JPS Form Response Collection : JPS is DISABLED. ENJOY THE BREAK.`);
    return 0;
  } catch (err) {
    console.error(`"DisableJPS()" failed : ${err}`);
    return 1;
  }
}


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
    CreateTimeDrivenTrigger();
    console.warn(`Created Daily Summary Email Triggers.`);
    return 0;
  } catch(err) {
    console.error(`"EnableJPS()" failed : ${err}`);
    return 1;
  }
}



/**
 * Set Dropdowns for status
 * @TRIGGERED
 */
const SetStatusDropdowns = () => {
  try {
    const start_row = 2;
    Object.values(SHEETS).forEach(sheet => {
      const rule = SpreadsheetApp
        .newDataValidation()
        .requireValueInList(Object.values(STATUS));
      sheet.getRange(start_row, 1, sheet.getLastRow(), 1).setDataValidation(rule);
    });
    return 0;
  } catch(err) {
    console.error(`"SetStatusDropdowns()" failed: ${err}`);
    return 1;
  }
}



/**
 * Set the Conditional Formatting for each page
 * @TRIGGERED
 */
const SetConditionalFormatting = () => {
  try {
    const start_row = 2;
    // Mapping status values to their formatting options
    const format_mapping = {
      [STATUS.received]:     { bg: COLORS.green_light,      font: COLORS.green_dark_2 },
      [STATUS.inProgress]:   { bg: COLORS.yellow_light,     font: COLORS.yellow_dark_2 },
      [STATUS.missingAccess]:{ bg: COLORS.orange_light,     font: COLORS.orange_bright },
      [STATUS.cancelled]:    { bg: COLORS.purle_light,      font: COLORS.purple },
      [STATUS.completed]:    { bg: COLORS.green_light,      font: COLORS.grey },
      [STATUS.closed]:       { bg: COLORS.grey_light,       font: COLORS.grey },
      [STATUS.billed]:       { bg: COLORS.grey_light,       font: COLORS.grey },
      [STATUS.failed]:       { bg: COLORS.red_light,        font: COLORS.red },
      [STATUS.pickedUp]:     { bg: COLORS.grey_light,       font: COLORS.grey },
      [STATUS.abandoned]:    { bg: COLORS.red_light,        font: COLORS.red_dark_berry_2 },
      [STATUS.waitlist]:     { bg: COLORS.orange,           font: COLORS.orange_dark_2 }
    };

    Object.values(SHEETS).forEach(sheet => {
      if(sheet.getSheetName() == SHEETS.Advancedlab.getSheetName()) return;
      const last_row = sheet.getLastRow();
      const last_column = sheet.getLastColumn();
      const range = sheet.getRange(start_row, 1, last_row - start_row + 1, last_column);
      console.warn(`Setting Conditional Formatting for: ${sheet.getSheetName()}`);

      // Build conditional formatting rules based on the mapping.
      const rules = Object.entries(format_mapping).map(([status, format]) => {
        return SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$A2="${status}"`)
          .setRanges([range])
          .setBackground(format.bg)
          .setFontColor(format.font)
          .build();
      });

      sheet.setConditionalFormatRules(rules);
    });
    return 0;
  } catch(err) {
    console.error(`"SetConditionalFormatting()" failed: ${err}`);
    return 1;
  }
}


/**
 * Resize the Summary page Rows back to Default
 * @TRIGGERED
 */
const SetSummaryPageRowHeight = () => {
  try {
    const sheet = OTHERSHEETS.Summary;
    const max_rows = sheet.getMaxRows();
    const max_cols = sheet.getMaxColumns();
    const height = 21;
    sheet.setRowHeightsForced(3, max_rows - 3, height);
    sheet.getRange(3, 1, max_rows -1, max_cols).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    console.info(`Set Row Height.`);
    return 0;
  } catch(err) {
    console.error(`"SetSummaryPageRowHeight()" failed: ${err}`);
    return 1;
  }
}


/**
 * Set Row Height
 */
const SetRowHeight = () => {
  try {
    Object.values(SHEETS).forEach(sheet => {
      const start_row = 2;
      const last_row = sheet.getMaxRows();
      const last_column = sheet.getMaxColumns();
      sheet
        .setRowHeightsForced(start_row, last_row, 21);
      sheet
        .getRange(start_row, 1, last_row, last_column)
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
      console.info(`Set Row Height for ${sheet.getSheetName()}`);
    });
    return 0;
  } catch(err) {
    console.error(`"SetRowHeight()" failed: ${err}`);
    return 1;
  }
}





/**  
 * Delete Files older than some number of days
 * @param {number} RetentionPeriod
 */
const DeleteOldFiles = () => {
  try {
    const folder = DriveApp.getFoldersByName(`Job Forms`);
    const processFolder = (folder) => {
      let files = folder.getFiles();
      while (files.hasNext()) {
        let file = files.next();
        if (new Date() - file.getLastUpdated() > RETENTION_PERIOD) {
          //file.setTrashed(true); //uncomment this line to put them in the trash
          //Drive.Files.remove(file.getId()); //uncomment this line to delete them immediately; CAREFUL!
        }
      }
    }
    return 0;
  } catch(err) {
    console.error(`"DeleteOldFiles()" failed: ${err}`);
    return 1;
  }
};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Format cell to fix overlap issue
 * @param {cell} cell
 */
const FormatCell = (cell) => {
  try {
    cell.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    return 0;
  } catch (err) {
    console.error(`"FormatCell()" failed : ${err}`);
    return 1;
  }
}




/**
 * Build Summary Equation:
 * @TRIGGERED
 * FORMAT: `QUERY(${sheetName}!A2:U, "Select * Where A = 'Received' OR A = 'In-Progress' or A = '(INTERNAL) Status' or A = 'Pending Approval' or A = 'Waitlist' or A = 'Missing Access' LABEL A '${sheetName}' ")`
 */
const BuildSummaryEquation = () => {
  try {
    let query = `={`
    Object.values(SHEETS).forEach((sheet, idx) => {
      // console.info(`ENTRY: IDX: ${idx}, Value: ${sheet.getSheetName()}`);
      const sheetName = sheet.getSheetName();
      const queryString = `QUERY('${sheetName}'!A2:U, "Select * Where 
        A = '${STATUS.received}' or 
        A = '${STATUS.inProgress}' or 
        A = '(INTERNAL) Status' or 
        A = '${STATUS.waitlist}' or 
        A = '${STATUS.missingAccess}' LABEL A '${sheetName}' ")`;
      query += queryString;
      if(idx != Object.values(SHEETS).length -1) {
        query += `;\n`; // The very last semicolon throws an error when present.
      }
    });
    query += `}`;
    console.info(query);
    OTHERSHEETS.Summary.getRange(3, 1, 1, 1).setValue(query);
    return 0;
  } catch(err) {
    console.error(`"BuildSummaryEquation()" failed: ${err}`);
    return 1;
  }
}

/**
 * Auxillary Equations
 * @TRIGGERED
 */
const AuxillaryEquations = () => {
  try {
    const start_row = 2;
    const eq1 = `=SUM(COUNTIF(A2:A, "${STATUS.received}"), COUNTIF(A2:A, "${STATUS.inProgress}"), COUNTIF(A2:A, "${STATUS.waitlist}"), COUNTIF(A2:A, "(INTERNAL) Status"), 0)`;
    const eq2 = `=IF(B2=0,"  <-- Party on Dude! Let's go to the beach!", "")`;
    OTHERSHEETS.Summary.getRange(start_row, 2, 1, 2).setValues([[ eq1, eq2 ]]);
    return 0;
  } catch(err) {
    console.error(`"AuxillaryEquations()" failed: ${err}`);
    return 1;
  }
}

const _test_triggers = () => {
  let func_names = [];
  let triggers = ScriptApp.getProjectTriggers();
  triggers.forEach( trigger => {
    const func = trigger.getHandlerFunction();
    func_names.push(func);
    // console.info(`Name: ${func}, Match: ${func.match(`Metrics`)}`);
  });
  console.info(`Names: ${func_names}`);

}




