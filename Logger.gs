
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Writing a Log
 */
class WriteLogger
{
  constructor() { 
    this.date = new Date().toUTCString();
    this.sheet = OTHERSHEETS.logger;
    this.row = OTHERSHEETS.logger.getLastRow() + 1;
    this.sheetLength = OTHERSHEETS.logger.getMaxRows();
  }
  Error(message) {
    const text = [this.date, "ERROR!", message, ];
    this.sheet.appendRow(text);
    console.error(`${text[0]}, ${text[1]} : ${message}`);
    this._PopItem();
    this._CleanupSheet();
  }
  Warning(message) {
    const text = [this.date, "WARNING!", message, ];
    this.sheet.appendRow(text);
    console.warn(`${text[0]}, ${text[1]} : ${message}`);
    this._PopItem();
    this._CleanupSheet();
  }
  Info(message) {
    const text = [this.date, "INFO!", message, ];
    this.sheet.appendRow(text);
    console.info(`${text[0]}, ${text[1]} : ${message}`);
    this._PopItem();
    this._CleanupSheet();
  }
  Debug(message) {
    const text = [this.date, "DEBUG", message, ];
    this.sheet.appendRow(text);
    console.log(`${text[0]}, ${text[1]} : ${message}`);
    this._PopItem();
    this._CleanupSheet();
  }
  _PopItem() {
    if(this.row > 100) {
      this.sheet.deleteRows(1, 1);
    } else {
      this.sheet.insertRowAfter(this.sheetLength - 1);
    }
  }
  _CleanupSheet() {
    if(this.row > 2000) {
      this.sheet.deleteRows(1, 1999);
    } else return;
  }
  
}

/**
 * -----------------------------------------------------------------------------------------------------------------
 * Testing for Logger Class
 */
const _testWriteLog = () => {
  const write = new WriteLogger();
  console.time(`EXECUTION TIMER`);
  for (let i = 0; i < 5; i++) {
    write.Warning(`Ooopsies ----> Warning`);
    write.Info(`Some Info`);
    write.Error(`ERROR`);
    write.Debug(`Debugging`);
    write._CleanupSheet();
  }
  console.timeEnd(`EXECUTION TIMER`);
}