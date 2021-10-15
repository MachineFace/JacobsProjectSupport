class WriteLogger
{
  constructor() { }
  Error(message){
    const row = OTHERSHEETS.logger.getLastRow() + 1;
    const date = new Date();
    OTHERSHEETS.logger.getRange(row, 1, 1, 1).setValue(date);
    OTHERSHEETS.logger.getRange(row, 2, 1, 1).setValue("ERROR!");
    OTHERSHEETS.logger.getRange(row, 3, 1, 1).setValue(message);
    Logger.log(`ERROR : ${date}, ${message}`);
  }
  Warning(message) {
    const row = OTHERSHEETS.logger.getLastRow() + 1;
    const date = new Date();
    OTHERSHEETS.logger.getRange(row, 1, 1, 1).setValue(date);
    OTHERSHEETS.logger.getRange(row, 2, 1, 1).setValue("WARNING");
    OTHERSHEETS.logger.getRange(row, 3, 1, 1).setValue(message);
    Logger.log(`WARNING : ${date}, ${message}`);
  }
  Info(message) {
    const row = OTHERSHEETS.logger.getLastRow() + 1;
    const date = new Date();
    OTHERSHEETS.logger.getRange(row, 1, 1, 1).setValue(date);
    OTHERSHEETS.logger.getRange(row, 2, 1, 1).setValue("INFO");
    OTHERSHEETS.logger.getRange(row, 3, 1, 1).setValue(message);
    Logger.log(`INFO : ${date}, ${message}`);
  }
  Debug(message) {
    const row = OTHERSHEETS.logger.getLastRow() + 1;
    const date = new Date();
    OTHERSHEETS.logger.getRange(row, 1, 1, 1).setValue(date);
    OTHERSHEETS.logger.getRange(row, 2, 1, 1).setValue("DEBUG");
    OTHERSHEETS.logger.getRange(row, 3, 1, 1).setValue(message);
    Logger.log(`DEBUG : ${date}, ${message}`);
  }
  
}

const _testWriteLog = () => {
  const write = new WriteLogger();
  write.Warning(`Ooopsies ----> Warning`);
  write.Info(`Some Info`);
  write.Error(`ERROR`);
  write.Debug(`Debugging`);
}