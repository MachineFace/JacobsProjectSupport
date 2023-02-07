
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Writing a Log
 */
class WriteLogger
{
  constructor() { 
    this.sheet = OTHERSHEETS.Logger;
  }
  Error(message) {
    try{
      const text = [new Date().toUTCString(), "ERROR!", message, ];
      this.sheet.appendRow(text);
      console.error(`${text[0]}, ${text[1]} : ${message}`);
      this._PopItem();
      this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  Warning(message) {
    try{
      const text = [new Date().toUTCString(), "WARNING", message, ];
      this.sheet.appendRow(text);
      console.warn(`${text[0]}, ${text[1]} : ${message}`);
      this._PopItem();
      this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  Info(message) {
    try {
      const text = [new Date().toUTCString(), "INFO", message, ];
      this.sheet.appendRow(text);
      console.info(`${text[0]}, ${text[1]} : ${message}`);
      this._PopItem();
      this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  Debug(message) {
    try {
      const text = [new Date().toUTCString(), "DEBUG", message, ];
      this.sheet.appendRow(text);
      console.log(`${text[0]}, ${text[1]} : ${message}`);
      this._PopItem();
      this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  _PopItem() {
    try {
      if(this.sheet.getLastRow() >= 500) this.sheet.deleteRow(2);
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  _CleanupSheet() {
    try {
      if(this.sheet.getLastRow() > 2000) {
        this.sheet.deleteRows(2, 1998);
      } else return 1;
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  
}
