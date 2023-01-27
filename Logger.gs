
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Writing a Log
 */
class WriteLogger
{
  constructor() { 
    this.sheet = OTHERSHEETS.Logger;
  }
  async Error(message) {
    try{
      const text = [new Date().toUTCString(), "ERROR!", message, ];
      await this.sheet.appendRow(text);
      await console.error(`${text[0]}, ${text[1]} : ${message}`);
      await this._PopItem();
      await this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  async Warning(message) {
    try{
      const text = [new Date().toUTCString(), "WARNING!", message, ];
      await this.sheet.appendRow(text);
      await console.warn(`${text[0]}, ${text[1]} : ${message}`);
      await this._PopItem();
      await this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  async Info(message) {
    try {
      const text = [new Date().toUTCString(), "INFO!", message, ];
      await this.sheet.appendRow(text);
      await console.info(`${text[0]}, ${text[1]} : ${message}`);
      await this._PopItem();
      await this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  async Debug(message) {
    try {
      const text = [new Date().toUTCString(), "DEBUG", message, ];
      await this.sheet.appendRow(text);
      await console.log(`${text[0]}, ${text[1]} : ${message}`);
      await this._PopItem();
      await this._CleanupSheet();
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  async _PopItem() {
    try {
      if(this.sheet.getLastRow() + 1 > 500) {
        await this.sheet.deleteRows(2, 1);
      } else {
        await this.sheet.insertRowAfter(this.sheet.getLastRow() - 1);
      }
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  async _CleanupSheet() {
    try {
      if(this.sheet.getLastRow() + 1 > 2000) {
        await this.sheet.deleteRows(2, 1999);
      } else return 1;
    } catch(err) {
      console.error(`Whoops ---> ${err}`);
    }
  }
  
}

/**
 * -----------------------------------------------------------------------------------------------------------------
 * Testing for Logger Class
 */
const _testWriteLog = async () => {
  console.time(`WriteLogger Time `);
  const write = new WriteLogger();
  await write.Warning(`Ooopsies ----> Warning`);
  // for (let i = 0; i < 5; i++) {
  //   await write.Warning(`Ooopsies ----> Warning`);
  //   await write.Info(`Some Info`);
  //   await write.Error(`ERROR`);
  //   await write.Debug(`Debugging`);
  //   await write._CleanupSheet();
  // }
  console.timeEnd(`WriteLogger Time `);
}