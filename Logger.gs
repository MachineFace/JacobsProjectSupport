/**
 * -----------------------------------------------------------------------------------------------------------------
 * Class For Logging
 */
class Log {
  constructor() {
    
  }

  /**
   * Throw Error Message
   */
  static Error(message = ``) {
    const date = Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    const sheet = OTHERSHEETS.Logger;
    const values = [ date, LOG_TYPE.Error, message, ];
    console.error(values);
    sheet.appendRow(values);
    this.prototype._PopItem();
    this.prototype._CleanupSheet();
    return;
  }

  /**
   * Throw Warning Message
   */
  static Warning(message = ``) {
    const date = Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    const sheet = OTHERSHEETS.Logger;
    const values = [ date, LOG_TYPE.Warning, message, ];
    console.warn(values);
    sheet.appendRow(values);
    this.prototype._PopItem();
    this.prototype._CleanupSheet();
    return;
  }

  /**
   * Throw Info Message
   */
  static Info(message = ``) {
    const date = Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    const sheet = OTHERSHEETS.Logger;
    const values = [ date, LOG_TYPE.Info, message, ];
    console.info(values);
    sheet.appendRow(values);
    this.prototype._PopItem();
    this.prototype._CleanupSheet();
    return;
  }

  /**
   * Throw Debug Message
   */
  static Debug(message = ``) {
    const date = Utilities.formatDate(new Date(), "PST", "MM/dd/yyyy 'at' HH:mm:ss z").toString();
    const sheet = OTHERSHEETS.Logger;
    const values = [ date, LOG_TYPE.Debug, message, ];
    console.log(values);
    sheet.appendRow(values);
    this.prototype._PopItem();
    this.prototype._CleanupSheet();
    return;
  }

  /**
   * Remove First Item in Sheet
   * @private
   */
  _PopItem() {
    const sheet = OTHERSHEETS.Logger;
    const maxRows = sheet.getMaxRows();
    if(this.row > 100) {
      sheet.deleteRows(2, 1);
    } else {
      sheet.insertRowAfter(maxRows - 1);
    }
  }

  /**
   * Cleanup Sheet
   * @private
   */
  _CleanupSheet() {
    const sheet = OTHERSHEETS.Logger;
    const lastRow = sheet.getLastRow();
    if(lastRow < 2000) return;
    sheet.deleteRows(2, 1999);
  }

  /**
   * Set Sheet Formatting
   * @private
   */
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
  
}

const _testWrite = () => {
  // for(let i = 0; i < 2; i++) {
  //   Log.Info(`${i} Some Info...`);
  //   Log.Warning(`${i} Some Warning....`);
  //   Log.Error(`${i} Some Error....`);
  //   Log.Debug(`${i} Some Debug....`);
  // }
  const l = new Log();
  l._SetFormatting();
}

