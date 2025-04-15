/**
 * -----------------------------------------------------------------------------------------------------------------
 * Class For Logging
 */
class Log {
  constructor() {
    /** @private */
    this.sheet = OTHERSHEETS.Logger;
    /** @private */
    this.date = this._FormatDate();
    /** @private */
    this.ERROR_TYPE = {
      Error : `ERROR!!`,
      Warning : `WARNING!`,
      Info : `INFO`,
      Debug : `DEBUG`,
    }
  }



  /**
   * Throw Error Message
   */
  Error(message = ``) {
    const text = [ this.date, this.ERROR_TYPE.Error, message, ];
    console.error(text);
    this.sheet.appendRow(text);
    this._PopItem();
    this._CleanupSheet();
    return this;
  }

  /**
   * Throw Warning Message
   */
  Warning(message = ``) {
    const text = [ this.date, this.ERROR_TYPE.Warning, message, ];
    console.warn(text);
    this.sheet.appendRow(text);
    this._PopItem();
    this._CleanupSheet();
    return this;
  }

  /**
   * Throw Info Message
   */
  Info(message = ``) {
    const text = [ this.date, this.ERROR_TYPE.Info, message, ];
    console.info(text);
    this.sheet.appendRow(text);
    this._PopItem();
    this._CleanupSheet();
    return this;
  }

  /**
   * Throw Debug Message
   */
  Debug(message = ``) {
    const text = [ this.date, this.ERROR_TYPE.Debug, message, ];
    console.log(text);
    this.sheet.appendRow(text);
    this._PopItem();
    this._CleanupSheet();
    return this;
  }

  /**
   * Remove First Item in Sheet
   * @private
   */
  _PopItem() {
    const row = this.sheet.getLastRow();
    if(row < 100) {
      this.sheet.insertRowAfter(sheet.getMaxRows() - 1);
      return this;
    }
    this.sheet.deleteRows(2, 1);
    return this;
  }

  /**
   * Cleanup Sheet
   * @private
   */
  _CleanupSheet() {
    const row = this.sheet.getLastRow();
    if(row < 2000) return this;
    this.sheet.deleteRows(2, 1999);
  }

  /**
   * Format Date
   * @private
   */
  _FormatDate(date = new Date()) {
    return Utilities.formatDate(date, "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
  }

  /**
   * Set Sheet Formatting
   * @private
   *
  _SetFormatting() {
    try {
      const sheet = OTHERSHEETS.Logger;
      const maxRows = sheet.getMaxRows();
      const maxColumns = sheet.getMaxColumns();
      let rules = [
        SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$B2="${LOG_TYPE.Info}"`)
          .setRanges([ sheet.getRange(2, 1, maxRows, maxColumns),])
          .setBackground(COLORS.grey_light)
          .setFontColor(COLORS.grey_dark)
          .build(),
        SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$B2="${LOG_TYPE.Warning}"`)
          .setRanges([ sheet.getRange(2, 1, maxRows, maxColumns), ])
          .setBackground(COLORS.orange_light)
          .setFontColor(COLORS.orange)
          .build(),
        SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$B2="${LOG_TYPE.Error}"`)
          .setRanges([ sheet.getRange(2, 1, maxRows, maxColumns), ])
          .setBackground(COLORS.red_light)
          .setFontColor(COLORS.red)
          .build(),
        SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=$B2="${LOG_TYPE.Debug}"`)
          .setRanges([ sheet.getRange(2, 1, maxRows, maxColumns),])
          .setBackground(COLORS.purle_light)
          .setFontColor(COLORS.purple_dark)
          .build(),
      ];
      sheet.setConditionalFormatRules(rules);
      return 0;
    } catch(err) {
      console.error(`_SetFormatting() failed: ${err}`);
      return 1;
    }
  }
  */
  
}


/**
 * Testing for Logger Class
 */
const _testWriteLog = () => {
  console.time(`EXECUTION TIMER`);
  const log = new Log();
  for (let i = 0; i < 5; i++) {
    log
      .Warning(`Ooopsies ----> Warning messaging.....`)
      .Info(`Some Info messaging.....`)
      .Error(`ERROR messaging....`)
      .Debug(`Debugging messaging....`);
  }
  console.timeEnd(`EXECUTION TIMER`);
}



  


