
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
    ScriptApp.newTrigger(`SetRowHeight`)
      .timeBased()
      .everyMinutes(10)
      .create();
    ScriptApp.newTrigger(`Metrics`)
      .timeBased()
      .everyMinutes(30)
      .create();
    ScriptApp.newTrigger(`GenerateMissingTickets`)
      .timeBased()
      .everyMinutes(30)
      .create();
    ScriptApp.newTrigger(`SetConditionalFormatting`)
      .timeBased()
      .everyHours(1)
      .create();
    ScriptApp.newTrigger(`SetStatusDropdowns`)
      .timeBased()
      .everyHours(1)
      .create();
    ScriptApp.newTrigger(`SetSummaryPageRowHeight`)
      .timeBased()
      .everyDays(1)
      .create();
  } catch (err) {
    console.error(`"CreateTimeDrivenTrigger()" failed : ${err}`);
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
    ScriptApp.newTrigger(`Metrics`)
      .timeBased()
      .everyMinutes(30)
      .create();
    console.info(`Removed Triggers for Summary Emails`);
    return 0;
  } catch (err) {
    console.error(`"RemoveTimedTriggers()" failed : ${err}`);
    return 1;
  }
};


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
  Object.values(SHEETS).forEach(sheet => {
    const rule = SpreadsheetApp
      .newDataValidation()
      .requireValueInList(Object.values(STATUS));
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
const SetSummaryPageRowHeight = () => {
  OTHERSHEETS.Summary.setRowHeightsForced(3, OTHERSHEETS.Summary.getMaxRows() - 3, 21);
  OTHERSHEETS.Summary.getRange(3, 1, OTHERSHEETS.Summary.getMaxRows() -1, OTHERSHEETS.Summary.getMaxColumns()).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  console.info(`Set Row Height.`)
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
    cell.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    return 0;
  } catch (err) {
    console.error(`"FormatCell()" failed : ${err}`);
    return 1;
  }
}

