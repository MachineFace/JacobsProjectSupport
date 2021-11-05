
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Writing a Log
 */
class WriteLogger
{
  constructor() { 
    this.date = new Date();
    this.sheet = OTHERSHEETS.logger;
    this.row = OTHERSHEETS.logger.getLastRow() + 1;
    this.sheetLength = OTHERSHEETS.logger.getMaxRows();
  }
  Error(message){
    if(this.row > this.sheetLength) {
      this.sheet.appendRow([this.date, "ERROR!", message,]);
    } else {
      SetByHeader(this.sheet, "Date", this.row, this.date);
      SetByHeader(this.sheet, "Type", this.row, "ERROR!");
      SetByHeader(this.sheet, "Message", this.row, message);
    }
    Logger.log(`ERROR : ${this.date.toUTCString()}, ${message}`);
    this._PopItem();
  }
  Warning(message) {
    if(this.row > this.sheetLength) {
      this.sheet.appendRow([this.date, "WARNING!", message,]);
    } else {
      SetByHeader(this.sheet, "Date", this.row, this.date);
      SetByHeader(this.sheet, "Type", this.row, "WARNING!");
      SetByHeader(this.sheet, "Message", this.row, message);
    }
    Logger.log(`WARNING : ${this.date.toUTCString()}, ${message}`);
    this._PopItem();
  }
  Info(message) {
    if(this.row > this.sheetLength) {
      this.sheet.appendRow([this.date, "INFO!", message,]);
    } else {
      SetByHeader(this.sheet, "Date", this.row, this.date);
      SetByHeader(this.sheet, "Type", this.row, "INFO");
      SetByHeader(this.sheet, "Message", this.row, message);
    }
    Logger.log(`INFO : ${this.date.toUTCString()}, ${message}`);
    this._PopItem();
  }
  Debug(message) {
    if(this.row > this.sheetLength) {
      this.sheet.appendRow([this.date, "DEBUG", message,]);
    } else {
      SetByHeader(this.sheet, "Date", this.row, this.date);
      SetByHeader(this.sheet, "Type", this.row, "DEBUG");
      SetByHeader(this.sheet, "Message", this.row, message);
    }
    Logger.log(`DEBUG : ${this.date.toUTCString()}, ${message}`);
    this._PopItem();
  }
  _PopItem() {
    if(this.row > 2000) {
      this.sheet.deleteRows(2, 1);
    } else return;
  }
  _CleanupSheet() {
    if(this.row > 2000) {
      this.sheet.deleteRows(2, 1999);
    } else return;
  }
  
}

const _testWriteLog = () => {
  const write = new WriteLogger();
  write.Warning(`Ooopsies ----> Warning`);
  write.Info(`Some Info`);
  write.Error(`ERROR`);
  write.Debug(`Debugging`);
}