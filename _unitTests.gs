/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */
const gasT_URL = `https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js`;
if ((typeof GasTap) === 'undefined') {
  var cs = CacheService.getScriptCache().get('gast');
  if(!cs){
    cs = UrlFetchApp.fetch(gasT_URL).getContentText();
    CacheService.getScriptCache().put('gast', cs, 21600);
  }
  eval(cs);
}


/**
 * Test Main with GasT
 * @private
 * PASSED 6/5/2026
 */
const _gasTMainTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();
  
  await test(`Design Specialist Creation`, (t) => {
    let x ,y;
    x = new DesignSpecialist({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    y = `Testa Nama`;
    t.equal(x.fullname, y, `DS ${x.name} created.`);
    y = true;
    t.equal(x.isAdmin, y, `Admin check should be ${y}, Actual: ${x}`);
  });

  await test(`Manager Creation`, (t) => {
    let x, y;
    x = new Manager({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    y = `Testa Nama`;
    t.equal(x.fullname, y, `DS ${x.name} created.`);
    y = true;
    t.equal(x.isAdmin, y, `Admin check should be ${y}, Actual: ${x}`);
  });

  await test(`StudentSupervisor Creation`, (t) => {
    let x, y;
    x = new StudentSupervisor({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    y = `Testa Nama`;
    t.equal(x.fullname, y, `DS ${x.name} created.`);
    y = false;
    t.equal(x.isAdmin, y, `Admin check should be ${y}, Actual: ${x}`);
  });
  
  await test(`Make Staff`, (t) => {
    const staff = new StaffService().Staff;
    t.equal(staff.Cody.name, `Cody`, `Staff member (${staff.Cody.name}) created successfully.`);
  });
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Barcode with GasT
 * @private
 * PASSED 5/6/2026
 */
const _gasTBarcodeTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`BarcodeService Class Test`, (t) => {
    let x, y;
    const ts = BarcodeService;
    t.notThrow(() => ts, `BarcodeService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `BarcodeService SHOULD NOT yield ${y}, Actual: ${x}`);

  });

  await test(`Generate Barcode: `, async (t) => {
    let x, y;

    x = await BarcodeService.GenerateBarCodeForTicketHeader(20230119105523);
    y = undefined || null;
    t.notEqual(x, y, `Barcode SHOULD NOT be ${y}: ${x}`);

    x = await BarcodeService.GenerateBarCodeForTicketHeader(`alskdfjalsdkfj`);
    t.notEqual(x, y, `Barcode SHOULD NOT be ${y}: ${x}`);

    x = await BarcodeService.GenerateBarCodeForTicketHeader({});
    t.notEqual(x, y, `Barcode SHOULD NOT be ${y}: ${x}`);
  });
  
  await test(`Generate QRCode: `, async (t) => {
    let x, y;

    x = await BarcodeService.GenerateQRCode(`cody_qr`,{ url: `http://www.codyglen.com/`, size: `1200x1200`, });
    y = undefined || null;
    t.notEqual(x, y, `Generate QRCode SHOULD NOT be ${y}: ${x}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test with GasT
 * @private
 * PASSED 6/5/2026
 */
const _gasTPriorityTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`PriorityService Class Test`, (t) => {
    let x, y;
    const ts = new PriorityService({});
    t.notThrow(() => ts, `PriorityService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `PriorityService SHOULD NOT yield ${y}, Actual: ${x}`);

    x = ts instanceof PriorityService;
    y = true;
    t.equal(x, y, `Check Instancing of PriorityService, Expected: ${y}, Actual: ${x} `);
  });

  await test(`Priority Test`, (t) => {
    let types = {
      staff : {
        email : `codyglen@berkeley.edu`,
        sid : 91283741923,
      },
      goodEgoodS : {
        email : `anukala@berkeley.edu`,
        sid : 3034682275
      },
      goodEbadS : {
        email : `anukala@berkeley.edu`,
        sid : 12938749123,
      },
      badEgoodS : {
        email : `ding@bat.edu`,
        sid : 1919304,
      },
      badEbadS : {
        email : `ding@bat.edu`,
        sid : 2394872349587,
      },
      nullgoodS : {
        email : null,
        sid : 1919304,
      },
      nullCase : {
        email : null,
        sid : null,
      },
      undefCase : {
        email : undefined,
        sid : undefined,
      }
    }

    let x, y;

    x = new PriorityService({ email : types.staff.email, sid : types.staff.sid }).Priority;
    y = PRIORITY.Tier1;
    t.equal(x, y, `DEFAULT priority for staff : Expected ${y}, Actual ${x}`);
    
    x = new PriorityService({ email : types.goodEgoodS.email, sid : types.goodEgoodS.sid}).Priority;
    y = PRIORITY.Tier4;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.goodEbadS.email, sid : types.goodEbadS.sid}).Priority;
    y = PRIORITY.Tier4;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.badEgoodS.email, sid : types.badEgoodS.sid}).Priority;
    y = PRIORITY.Tier4;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.badEbadS.email, sid : types.badEbadS.sid}).Priority;
    y = PRIORITY.None;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.nullgoodS.email, sid : types.nullgoodS.sid}).Priority;
    y = PRIORITY.Tier4;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.nullCase.email, sid : types.nullCase.sid}).Priority;
    y = PRIORITY.Tier1;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);
    
    x = new PriorityService({ email : types.undefCase.email, sid : types.undefCase.sid}).Priority;
    y = PRIORITY.Tier1;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);

  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test ID with GasT
 * @private
 * PASSED 6/5/2026
 */
const _gasTIDServiceTesting = async() => {
  const test = new GasTap();
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name

  await test(`GetNewID NON-STATIC`, t => {
    const x = IDService.id;
    const y = undefined || null;
    t.notEqual(x, y, `GetNewID SHOULD NOT return ${y}, Actual: ${x}`);
  });

  await test(`GetNewID STATIC`, t => {
    const x = IDService.CreateId();
    const y = undefined || null;
    t.notEqual(x, y, `GetNewID STATIC SHOULD NOT return ${y}, Actual: ${x}`);
  });

  await test(`TestUUIDToDecimal`, t => {
    const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
    const x = IDService.toDecimal(testUUID);
    const y = `0244711056233028958513683553892786000406`;
    t.equal(x, y, `TestUUIDToDecimal SHOULD return ${y}: ${y == x}, ${x}`);
  });

  await test(`TestDecimalToUUID`, t => {
    const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
    const dec = `0244711056233028958513683553892786000406`;
    const x = IDService.decimalToUUID(dec);
    t.equal(x, testUUID, `TestDecimalToUUID SHOULD return ${testUUID}: ${x == testUUID}, ${x}`);
  });

  await test(`IDIsValid`, t => {
    const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
    const val = IDService.IsValid(testUUID);
    t.equal(val, true, `IDIsValid SHOULD return true: ${val == true}, ${testUUID} is valid: ${val}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Message with GasT
 * @private
 * PASSED 6/5/2026
 */
const _gasTMessagingTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`MessageService Class Test`, (t) => {
    let x, y;
    const ts = new MessageService({});
    t.notThrow(() => ts, `MessageService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `MessageService SHOULD NOT yield ${y}, Actual: ${x}`);

    x = ts instanceof MessageService;
    y = true;
    t.equal(x, y, `Check Instancing of MessageService, Expected: ${y}, Actual: ${x} `);
  });

  await test(`MessageService DEFAULT`, (t) => {
    const message = new MessageService({});

    let x, y;

    x = `DEFAULT ${message.defaultMessage}`;
    t.notThrow(() => x, `DEFAULT SHOULD NOT throw error.`);

    x = `RECEIVED ${message.receivedMessage}`;
    t.notThrow(() => x, `RECEIVED SHOULD NOT throw error.`);

    x = `PENDING ${message.pendingMessage}`;
    t.notThrow(() => x, `PENDING SHOULD NOT throw error.`);

    x = `IN-PROGRESS ${message.inProgressMessage}`;
    t.notThrow(() => x, `IN-PROGRESS SHOULD NOT throw error.`);

    x = `COMPLETED ${message.completedMessage}`;
    t.notThrow(() => x, `COMPLETED SHOULD NOT throw error.`);

    x = `FAILED ${message.failedMessage}`;
    t.notThrow(() => x, `FAILED SHOULD NOT throw error.`);

    x = `REJECTED BY STUDENT ${message.rejectedByStudentMessage}`;
    t.notThrow(() => x, `REJECTED BY STUDENT SHOULD NOT throw error.`);

    x = `REJECTED BY STAFF ${message.rejectedByStaffMessage}`;
    t.notThrow(() => x, `REJECTED BY STAFF SHOULD NOT throw error.`);

    x = `BILLED ${message.billedMessage}`;
    t.notThrow(() => x, `BILLED SHOULD NOT throw error.`);

    x = `PICKED UP ${message.pickedUpMessage}`;
    t.notThrow(() => x, `PICKED UP SHOULD NOT throw error.`);

    x = `NO ACCESS ${message.noAccessMessage}`;
    t.notThrow(() => x, `NO ACCESS SHOULD NOT throw error.`);

    x = `INITIAL MISSING ACCESS ${message.initialMissingAccessMessage}`;
    t.notThrow(() => x, `INITIAL MISSING ACCESS SHOULD NOT throw error.`);

    x = `GSI PLOTTER ${message.gsiPlotterMessage}`;
    t.notThrow(() => x, `GSI PLOTTER SHOULD NOT throw error.`);

    x = `DS MESSAGE ${message.dsMessage}`;
    t.notThrow(() => x, `DS MESSAGE SHOULD NOT throw error.`);

  });

  await test(`MessageService`, (t) => {
    const rowData = SheetService.GetRowData(SHEETS.Fablight, 2);
    const message = new MessageService({
      name : 'Cody', 
      projectname : 'Test Project',
      id : '101293874098', 
      rowData : rowData,
      designspecialist : 'designspecialist', 
      designspecialistemaillink : 'cody@glen.com', 
      cost : 45.50,
    });

    let x, y;

    x = `DEFAULT ${message.defaultMessage}`;
    y = undefined || null;
    t.notEqual(x, y, `DEFAULT message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `RECEIVED ${message.receivedMessage}`;
    t.notEqual(x, y, `RECEIVED message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `PENDING ${message.pendingMessage}`;
    t.notEqual(x, y, `PENDING message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x= `IN-PROGRESS ${message.inProgressMessage}`;
    t.notEqual(x, y, `IN-PROGRESS message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `COMPLETED ${message.completedMessage}`;
    t.notEqual(x, y, `COMPLETED message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `FAILED ${message.failedMessage}`;
    t.notEqual(x, y, `FAILED message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `REJECTED BY STUDENT ${message.rejectedByStudentMessage}`;
    t.notEqual(x, y, `REJECTED BY STUDENT message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `REJECTED BY STAFF ${message.rejectedByStaffMessage}`;
    t.notEqual(x, y, `REJECTED BY STAFF message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `BILLED ${message.billedMessage}`;
    t.notEqual(x, y, `BILLED message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);
    
    x = `PICKED UP ${message.pickedUpMessage}`;
    t.notEqual(x, y, `PICKED UP message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `NO ACCESS ${message.noAccessMessage}`;
    t.notEqual(x, y, `NO ACCESS message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `INITIAL MISSING ACCESS ${message.initialMissingAccessMessage}`;
    t.notEqual(x, y, `INITIAL MISSING ACCESS message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `GSI PLOTTER ${message.gsiPlotterMessage}`;
    t.notEqual(x, y, `GSI PLOTTER message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

    x = `DS MESSAGE ${message.dsMessage}`;
    t.notEqual(x, y, `DS MESSAGE message SHOULD NOT return ${y}, Expected ${y}, Actual: \n${x}`);

  });
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Logging with GasT
 * @private
 * PASSED 8/19/2026
 */
const _gasTLoggerTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  await test(`Log Class Test`, (t) => {
    let x, y;
    const ts = Log;
    t.notThrow(() => ts, `Log SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `Log SHOULD NOT yield ${y}, Actual: ${x}`);
  });

  await test(`Logger`, (t) => {
    let x, y;
    x = Log;
    y = 1;
    t.notThrow(() => x, `Logger SHOULD NOT throw error.`);
    t.notEqual(x, y, `Logger SHOULD NOT return ${y}, Expected: ${y}, Actual: ${x}`);
  });

   await test(`Warning`, (t) => {
    let x, y;
    x = Log.Warning(spreadsheet, `Warning Test ----> Message`);
    t.notThrow(() => x, `WARNING SHOULD NOT throw error.`);
  });

  await test(`Info`, (t) => {
    let x, y;
    x = Log.Info(spreadsheet, `Info Test ----> Message`);
    t.notThrow(() => x, `INFO SHOULD NOT throw error.`);
  });

  await test(`Error`, (t) => {
    let x, y;
    x = Log.Error(spreadsheet, `Error Test ----> Message`);
    t.notThrow(() => x, `ERROR SHOULD NOT throw error.`);
  });

  await test(`Debug`, (t) => {
    let x, y;
    x = Log.Debug(spreadsheet, `Debug Test ----> Message`);
    t.notThrow(() => x, `DEBUG SHOULD NOT throw error.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Misc with GasT
 * @private
 * PASSED 6/5/2026
 */
const _gasTMiscTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`Search`, (t) => {
    let x, y;
    x = SheetService.Search(`Cody`);
    y = undefined || null;
    t.notEqual(x, y, `Search should not return ${y}, Actual: ${JSON.stringify(x)}`);
  });

  await test(`Search Specific Sheet`, (t) => {
    let x, y;
    x = SheetService.SearchSpecificSheet(SHEETS.Fablight,`Cody`);
    y = undefined || null;
    t.notEqual(x, y, `SearchSpecificSheet should not return ${y}, Actual: ${JSON.stringify(x)}`);
  });

  await test(`GetByHeader`, (t) => {
    let x, y;
    x = SheetService.GetByHeader(SHEETS.Fablight, HEADERNAMES.email, 2);
    y = `codyglen@berkeley.edu`;
    t.equal(x, y, `Should fetch ${y}, Actual: ${x}`);

    x = SheetService.GetByHeader(SHEETS.Laser, `BAD COLUMN NAME`, 2);
    y = 1;
    t.equal(x, y, `GetByHeader SHOULD return "${y}", Actual: ${x}`);

    x = SheetService.GetByHeader(`BAD SHEET`, HEADERNAMES.email, 2);
    t.throws(x, `GetByHeader SHOULD throw an error on bad sheet name: ${x}`);

    x = SheetService.GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.throws(x, `GetByHeader SHOULD throw an error on bad sheet name: ${x}`);

  });

  await test(`GetColumnDataByHeader`, (t) => {
    let x, y;

    x = SheetService.GetColumnDataByHeader(SHEETS.Fablight, HEADERNAMES.email);
    y = undefined || null;
    t.notEqual(x, y, `GetColumnDataByHeader SHOULD NOT return ${y}, Actual: ${x}`);

    x = SheetService.GetColumnDataByHeader(SHEETS.Laser, `BAD COLUMN NAME`);
    y = 1;
    t.equal(x, y, `GetColumnDataByHeader SHOULD return "${y}", Actual: ${x}`);

    x = SheetService.GetColumnDataByHeader(`BAD SHEET`, `BAD COLUMN NAME`);
    t.throws(x, `GetColumnDataByHeader SHOULD throw an error on bad sheet name: ${x}`);

  });

  await test(`GetRowData`, (t) => {
    let x, y;

    x = SheetService.GetRowData(SHEETS.Fablight, 2);
    y = undefined || null;
    t.notEqual(x, y, `GetRowData SHOULD NOT return ${y}, Actual: ${JSON.stringify(x)}`);

    x = SheetService.GetRowData(SHEETS.Laser, `BAD COLUMN NAME`);
    y = 1;
    t.equal(x, y, `GetRowData SHOULD return "${y}", Actual: ${x}`);

    x = SheetService.GetRowData(`BAD SHEET`, `BAD COLUMN NAME`);
    y = 1;
    t.equal(x, y, `GetRowData SHOULD return "${y}", Actual: ${x}`);

  });

  await test(`FindOne`, (t) => {
    let x, y;
    x = SheetService.FindOne(`cparsell@berkeley.edu`);
    y = undefined || null;
    t.notEqual(x, y, `FindOne should not return ${y}, Actual: ${JSON.stringify(x)}`);

    x = SheetService.FindOne(`BAD NAME`);
    y = Object.entries(x).length
    t.equal(0, y, `FindOne SHOULD return ${y}, Actual: ${JSON.stringify(x)}`);
  });

  await test(`ValidateEmail`, (t) => {
    let x, y;
    
    x = EmailService.ValidateEmail(`cparsell@berkeley.edu`);
    y = true;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = EmailService.ValidateEmail(`BAD NAME`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = EmailService.ValidateEmail(`!#$%^%$123@berkeley.edu`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = EmailService.ValidateEmail(`normalname@!#&^*^&*$%^)$!#$#!`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = EmailService.ValidateEmail(`12345675645634599293487529384752938745923845293485729348572934875@berkeley.edu`);
    y = true;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

  });

  await test(`SetByHeader`, (t) => {
    const x = SheetService.SetByHeader(OTHERSHEETS.Logger, `Date`, OTHERSHEETS.Logger.getLastRow(), `TESTING FUNCTIONALITY....`);
    t.notThrow(() => x, `SetByHeader SHOULD NOT throw an error. ${x}`);
    t.equal(x, 0, `SetByHeader SHOULD return "0": Actual: ${x}`);

    const y = SheetService.SetByHeader(`BAD SHEET`, `Date`, OTHERSHEETS.Logger.getLastRow(), `TESTING FUNCTIONALITY....`);
    t.equal(y, 1, `SetByHeader SHOULD return "1": Actual: ${y}`);

    const z = SheetService.SetByHeader(OTHERSHEETS.Logger, `BAD TITLE`, OTHERSHEETS.Logger.getLastRow(), `TESTING FUNCTIONALITY....`);
    t.throws(z, `SetByHeader SHOULD throw an error on bad column name: ${z}`)
    t.equal(z, 1, `SetByHeader SHOULD return "1": Actual: ${z}`);

    const a = SheetService.SetByHeader(OTHERSHEETS.Logger, `Date`, -1, `TESTING FUNCTIONALITY....`);
    t.throws(a, `SetByHeader SHOULD throw an error on bad row number: ${a}`)
    t.equal(a, 1, `SetByHeader SHOULD return "1": Actual: ${a}`);

  });

  await test(`Sheet Permitted Check`, (t) => {
    const val = SheetService.IsValidSheet(OTHERSHEETS.Logger);
    t.equal(false, val, `Logger Should be  (false): ${val}`);

    const val2 = SheetService.IsValidSheet(SHEETS.Fablight);
    t.equal(true, val2, `Fablight Should be not_forbidden (true): ${val2}`);

    const val3 = SheetService.IsValidSheet(STORESHEETS.FablightStoreItems);
    t.equal(false, val3, `Store Should be forbidden (false): ${val3}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Calculations with GasT
 * @private
 * PASSED 7/2/2025
 */
const _gasTCalculationTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();
  const c = new Calculate();

  await test(`Calc Average Turnaround`, (t) => {
    const x = c.GetAverageTurnaround(SHEETS.Laser);
    t.ok(x, `Time string is ok.`);
  });
  
  await test(`Count Active Users`, (t) => {
    const x = c.CountActiveUsers();
    t.notEqual(x, undefined, `Count of active users should not return undefined.`);
  });
  
  await test(`Count Each Submission`, (t) => {
    const x = c.CountEachSubmission();
    t.notEqual(x, undefined, `Count Each Submission should not return undefined.`);
  });
  
  
  await test(`Create Top Ten`, (t) => {
    const x = c.CreateTopTen();
    t.notThrow(() => x, `CreateTopTen SHOULD NOT throw error`);
  });

  await test(`Find an Email.`, (t) => {
    const x = c._FindEmail(`Cody`);
    t.equal(x, `codyglen@berkeley.edu`, `Function should find my email: ${x}.`);
    t.notEqual(x, undefined || null, `Find an Email should not return undefined or null.`);
  });

  await test(`Calc Distribution`, (t) => {
    const x = c.GetUserDistribution();
    t.notEqual(x, undefined, `Distribution should not return undefined.`);
  });

  await test(`Count Types`, (t) => {
    const x = c.CountTypes();
    t.notEqual(x, undefined, `Count Types should not return undefined.`);
  });
  
  await test(`Calc Standard Deviation`, (t) => {
    const x = c.GetUserSubmissionStandardDeviation();
    t.notEqual(x, undefined || null, `Standard Deviation should not return undefined or null.`);
  });

  await test(`Calculate Arithmetic Mean`, (t) => {
    const x = c.GetUserSubmissionArithmeticMean();
    t.notEqual(x, undefined || null, `Arithmetic Mean should not return undefined or null.`);
  });
  
  await test(`Count Tiers`, (t) => {
    const x = c.CountTiers();
    t.notEqual(x, undefined || null, `Count Tiers should not return undefined or null.`);
  });
  
  await test(`Count Statuses`, (t) => {
    const x = c.CountStatuses();
    t.notEqual(x, undefined || null, `Count Statuses should not return undefined or null.`);
  });
  
  await test(`Count Funding`, (t) => {
    const x = c.CountFunding();
    console.warn(x);
    t.notEqual(x, undefined || null, `Count Funding should not return undefined or null.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test TimeService with GasT
 * @private
 * PASSED 7/2/2025
 */
const _gasTTimeTesting = async() => {
  const test = new GasTap();
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name

  await test(`Time Class Test`, (t) => {
    let x, y;
    const ts = TimeService;
    t.notThrow(() => ts, `TimeService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `TimeService SHOULD NOT yield ${y}, Actual: ${x}`);

  });

  await test(`FormatTimerToString`, (t) => {
    let x, y, value;

    // x = TimeService.FormatTimerToString(15, 6, 35, 12);
    // t.equal(x, `15 days, 06:35:12`, `Format Timer GOOD: ${x}`);

    // Test Function
    x = typeof TimeService.FormatTimerToString;
    y = typeof Function;
    t.equal(x, y, `FormatTimerToString SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.FormatTimerToString(15, 6, 35, 12);
    t.notThrow(() => x, `FormatTimerToString SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.FormatTimerToString(15, 6, 35, 12);
    y = undefined || null;
    t.notEqual(x, y, `FormatTimerToString SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    x = TimeService.FormatTimerToString(15, 6, 35, 12);
    y = `15 days, 06:35:12`
    t.equal(x, y, `FormatTimerToString SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = TimeService.FormatTimerToString(`ten`, `six`, `35`, `12`);
    y = `ten days, six:35:12`;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // ----------------------
    // TODO: Handle these cases:
    // // Negative Numbers
    // x = TimeService.FormatTimerToString(-15, -6, -35, -12);
    // y = `-15 days, 0-6:0-35:0-12`;
    // t.equal(x, y, `FormatTimerToString, Expected: $${y}, Actual: $${x}`);

    // // Infinite
    // value = TimeService.FormatTimerToString(Infinity, Infinity, Infinity, Infinity);
    // x = !isNaN(value) && isFinite(value) && Math.abs(value) == 0;
    // y = true;
    // t.equal(x, y, `Infinite FormatTimerToString SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

    // // Null
    // value = TimeService.FormatTimerToString(null, null, null, null);
    // x = !isNaN(value) && isFinite(value) && Math.abs(value) == 0;
    // y = true;
    // t.equal(x, y, `Null FormatTimerToString SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

  });

  await test(`TimerStringToMilliseconds`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.TimerStringToMilliseconds;
    y = typeof Function;
    t.equal(x, y, `TimerStringToMilliseconds SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.TimerStringToMilliseconds(`0 days, 0:34:18`);
    t.notThrow(() => x, `TimerStringToMilliseconds SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.TimerStringToMilliseconds(`0 days, 0:34:18`);
    y = undefined || null;
    t.notEqual(x, y, `TimerStringToMilliseconds SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Good Test
    x = TimeService.TimerStringToMilliseconds(`0 days, 0:34:18`);
    y = 2058000;
    t.equal(x, y, `TimerStringToMilliseconds GOOD, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = TimeService.TimerStringToMilliseconds(10);
    y = 1;
    t.equal(x, y, `TimerStringToMilliseconds BAD: Expected: ${y}, Actual: ${x}`);

    // Null
    x = TimeService.TimerStringToMilliseconds(null);
    y = 1;
    t.equal(x, y, `Null TimerStringToMilliseconds SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

  });

  await test(`DateToMilliseconds`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.DateToMilliseconds;
    y = typeof Function;
    t.equal(x, y, `DateToMilliseconds SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.DateToMilliseconds(new Date(1986, 0, 2));
    t.notThrow(() => x, `DateToMilliseconds SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.DateToMilliseconds(new Date(1986, 0, 2));
    y = undefined || null;
    t.notEqual(x, y, `DateToMilliseconds SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Good Test
    x = TimeService.DateToMilliseconds(new Date(1986, 0, 2));
    y = 505036800000;
    t.equal(x, y, `DateToMilliseconds GOOD, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    value = TimeService.DateToMilliseconds(`Date`);
    x = !isNaN(value) && isFinite(value) && value > 0;
    y = true;
    t.equal(x, y, `DateToMilliseconds BAD: Expected: ${y}, Actual: ${x}`);

    // Infinite
    value = TimeService.DateToMilliseconds(Infinity);
    x = isNaN(value) || !isFinite(value) || Math.abs(value) == 0;
    y = false;
    t.equal(x, y, `Infinite DateToMilliseconds SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

    // Null
    value = TimeService.DateToMilliseconds(null);
    x = !isNaN(value) && isFinite(value) && value > 0;
    y = true;
    t.equal(x, y, `Null DateToMilliseconds SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

  });

  await test(`MillisecondsToTimerString`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.MillisecondsToTimerString;
    y = typeof Function;
    t.equal(x, y, `MillisecondsToTimerString SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.MillisecondsToTimerString(507715200000);
    t.notThrow(() => x, `MillisecondsToTimerString SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.MillisecondsToTimerString(507715200000);
    y = undefined || null;
    t.notEqual(x, y, `MillisecondsToTimerString SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Good Test
    x = TimeService.MillisecondsToTimerString(507715200000);
    y = `5876 days, 08:000:000`;
    t.equal(x, y, `MillisecondsToTimerString GOOD, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = TimeService.MillisecondsToTimerString(`Date`);
    y = `NaN days, NaN:NaN:NaN`;
    t.equal(x, y, `MillisecondsToTimerString BAD: Expected: ${y}, Actual: ${x}`);

    // Infinite
    x = TimeService.MillisecondsToTimerString(Infinity);
    y = `Infinity days, NaN:NaN:NaN`;
    t.equal(x, y, `Infinite MillisecondsToTimerString SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

    // Null
    x = TimeService.MillisecondsToTimerString(null);
    y = `0 days, 00:000:000`;
    t.equal(x, y, `Null MillisecondsToTimerString SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

  });

  await test(`Duration`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.Duration;
    y = typeof Function;
    t.equal(x, y, `Duration SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.Duration(new Date(1986, 01, 02), new Date(2086, 01, 02));
    t.notThrow(() => x, `Duration SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.Duration(new Date(1986, 01, 02), new Date(2086, 01, 02));
    y = undefined || null;
    t.notEqual(x, y, `Duration SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Good Test
    x = TimeService.Duration(new Date(1986, 01, 02), new Date(2086, 01, 02));
    y = `36525 days, 00:000:000`;
    t.equal(x, y, `Duration GOOD, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = TimeService.Duration(`Date`);
    y = `NaN days, NaN:NaN:NaN`;
    t.equal(x, y, `Duration BAD: Expected: ${y}, Actual: ${x}`);

    // Infinite
    x = TimeService.Duration(Infinity);
    y = `Infinity days, NaN:NaN:NaN`;
    t.equal(x, y, `Infinite Duration SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

    // Null
    x = TimeService.Duration(null);
    t.throws(x, `Null Duration SHOULD throw error, Actual: ${x}`);

  });

  await test(`ReturnDate`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.ReturnDate;
    y = typeof Function;
    t.equal(x, y, `ReturnDate SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.ReturnDate(new Date(1986, 01, 02));
    t.notThrow(() => x, `ReturnDate SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.ReturnDate(new Date(1986, 01, 02));
    y = undefined || null;
    t.notEqual(x, y, `ReturnDate SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Good Test
    value = TimeService.ReturnDate(new Date(1986, 01, 02));
    x = !isNaN(value) && isFinite(value) && value > 0;
    y = true;
    t.equal(x, y, `ReturnDate GOOD, Expected: ${y}, Actual: ${x}, Value: ${value}`);

    // Bad Inputs
    value = TimeService.ReturnDate(`Date`);
    x = !isNaN(value) && isFinite(value) && value > 0;
    y = true;
    t.equal(x, y, `ReturnDate BAD: Expected: ${y}, Actual: ${x}, Value: ${value}`);

    // Infinite
    value = TimeService.ReturnDate(Infinity);
    x = !isNaN(value) && isFinite(value) && value > 0;
    y = true;
    t.equal(x, y, `Infinite ReturnDate SHOULD return ${y}, Expected: ${y}, Actual: ${x}, value: ${value}`);

    // Null
    x = TimeService.ReturnDate(null);
    t.throws(x, `Null ReturnDate SHOULD throw error, Actual: ${x}`);

  });

  await test(`RemainingTime`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.RemainingTime;
    y = typeof Function;
    t.equal(x, y, `RemainingTime SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.RemainingTime(new Date(1986, 01, 02));
    t.notThrow(() => x, `RemainingTime SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = TimeService.RemainingTime(new Date(1986, 01, 02));
    y = undefined || null;
    t.notEqual(x, y, `RemainingTime SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);


  });

  await test(`Days to Millis`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof TimeService.DaysToMillis;
    y = typeof Function;
    t.equal(x, y, `RemainingTime SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = TimeService.DaysToMillis(100);
    t.notThrow(() => x, `RemainingTime SHOULD NOT throw an error, Actual: ${x}`);

    x = TimeService.DaysToMillis(100);
    y = 8640000000;
    t.equal(x, y, `Days to Millis GOOD, Expected: ${y}, Actual: ${x}`);
  });
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Shopify API with GasT
 * PASSED 7/3/2025
 */
const _gasTShopifyTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  const shopify = new ShopifyAPI();

  await test(`Shopify Class Test`, (t) => {
    let x, y;
    const ts = new ShopifyAPI();
    t.notThrow(() => ts, `Shopify Class SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `Shopify Class SHOULD NOT yield ${y}, Actual: ${x}`);

    x = ts instanceof ShopifyAPI;
    y = true;
    t.equal(x, y, `Check Instancing of Shopify Class, Expected: ${y}, Actual: ${x} `);
  });

  await test(`GetLastOrder`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof shopify.GetOrdersList;
    y = typeof Function;
    t.equal(x, y, `GetLastOrder SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = shopify.GetLastOrder();
    t.notThrow(() => x, `GetLastOrder SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = shopify.GetLastOrder();
    y = undefined || null;
    t.notEqual(x, y, `GetLastOrder SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

  });
  
  await test(`GetOrdersList`, async(t) => {
    let x, y, value;

    // Test Function
    x = typeof shopify.GetOrdersList;
    y = typeof Function;
    t.equal(x, y, `GetOrdersList SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = shopify.GetOrdersList();
    t.notThrow(() => x, `GetOrdersList SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = shopify.GetOrdersList();
    y = undefined || null;
    t.notEqual(x, y, `GetOrdersList SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

  });

  await test(`Shopify _GetStoreProductID`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof shopify._GetStoreProductID;
    y = typeof Function;
    t.equal(x, y, `_GetStoreProductID SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = shopify._GetStoreProductID(`Fortus Red ABS-M30`);
    t.notThrow(() => x, `_GetStoreProductID SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = shopify._GetStoreProductID(`Fortus Red ABS-M30`);
    y = undefined || null;
    t.notEqual(x, y, `_GetStoreProductID SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    x = shopify._GetStoreProductID(`Fortus Red ABS-M30`);
    y = 3940700420;
    t.equal(x, y, `_GetStoreProductID SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = shopify._GetStoreProductID(`ten`);
    y = 7665297916070;  // Default product
    t.equal(x, y, `_GetStoreProductID BAD: Expected: ${y}, Actual: ${x}`);

    // Null
    x = shopify._GetStoreProductID(null);
    y = 1;
    t.throws(x, `Null _GetStoreProductID SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);

  });

  await test(`Shopify GetProductByID`, async (t) => {

    let x, y, value;

    // Test Function
    x = typeof shopify.GetProductByID;
    y = typeof Function;
    t.equal(x, y, `GetProductByID SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = shopify.GetProductByID(3940700420);
    t.notThrow(() => x, `GetProductByID SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = shopify.GetProductByID(3940700420);
    y = undefined || null;
    t.notEqual(x, y, `GetProductByID SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    x = shopify.GetProductByID(3940700420);
    t.notThrow(() => x, `GetProductByID SHOULD not throw, Actual: ${x}`);

    // Bad Inputs
    x = shopify.GetProductByID(`ten`);
    t.throws(x, `GetProductByID BAD: Actual: ${x}`);

    // Null
    x = shopify.GetProductByID(null);
    y = 1;
    t.throws(x, `Null GetProductByID SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);
  });

  await test(`Shopify GetCustomerByEmail`, async (t) => {
    let x, y, value;

    // Test Function
    x = typeof shopify.GetCustomerByEmail;
    y = typeof Function;
    t.equal(x, y, `GetCustomerByEmail SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    t.notThrow(() => x, `GetCustomerByEmail SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    y = undefined || null;
    t.notEqual(x, y, `GetCustomerByEmail SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    // TODO: FIX
    value = await shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    x = typeof value == typeof Object;
    y = false;
    t.equal(x, y, `GetCustomerByEmail SHOULD return ${y}, Expected: ${y}, Actual: ${x}, Value: ${value}`);

    // Bad Inputs
    x = shopify.GetCustomerByEmail(`ten`);
    t.throws(x, `GetCustomerByEmail BAD: Actual: ${x}`);

    // Null
    x = shopify.GetCustomerByEmail(null);
    y = 1;
    t.throws(x, `Null GetCustomerByEmail SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);
  });

  await test(`Shopify Create Order`, async (t) => {
    const id = IDService.createId();
    
    let materials = [
      { name : `Fortus Red ABS-M30`,  quantity : 5, },
      { name : `Objet Polyjet VeroMagenta RGD851`,  quantity : 10, },
      { name : null,  quantity : 0.5, },
      { name : `Stratasys Dimension Soluble Support Material P400SR`,  quantity : 15, },
      { name : undefined,  quantity : 15, },
      { name : `Fortus Red ABS-M30`,  quantity : -30.5, },
      { name : `Fortus Red ABS-M30`,  quantity : undefined, },
      { name : `Fortus Red ABS-M30`,  quantity : null, },
    ];

    const order = await shopify.CreateOrder({
      id : id,
      email : PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`),
      materials : materials,
    });
    console.info(JSON.stringify(order, null, 4));

    t.notThrow(() => x, `Shopify Create Order DOES NOT throw error.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Ticket with GasT
 * PASSED 6/5/2026
 */
const _gasTTicketTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`Ticket`, t => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const id = new IDService().id;
    const projectname = `Some Kinda Project`;
    const rowData = SheetService.GetRowData(SHEETS.Fablight, 2);

    let tick = new Ticket({
      name : name, 
      email : email, 
      id : id,
      projectname : projectname,
      rowData : rowData,
    });
    const x = tick.CreateTicket();
    console.info(tick);
    t.notEqual(tick, undefined || null, `Ticket SHOULD NOT yield null.`);
    t.notEqual(x, undefined || null, `Generation SHOULD NOT yield null. ${x}`);
  });

  await test(`GenerateMissingTickets`, t => {
    const x = GenerateMissingTickets();
    t.equal(x, 0, `GenerateMissingTickets SHOULD yield "0".`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Email Service with GasT
 * PASSED 6/5/2026
 */
const _gasTEmailTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`EmailService Class Test`, (t) => {
    let x, y;
    const ts = new EmailService();
    t.notThrow(() => ts, `EmailService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `EmailService SHOULD NOT yield ${y}, Actual: ${x}`);

    x = ts instanceof EmailService;
    y = true;
    t.equal(x, y, `Check Instancing of EmailService, Expected: ${y}, Actual: ${x} `);
  });

  await test(`ValidateEmail`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof EmailService.ValidateEmail;
    y = typeof Function;
    t.equal(x, y, `ValidateEmail SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = EmailService.ValidateEmail(`test@berkeley.edu`)
    t.notThrow(() => x, `ValidateEmail SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = EmailService.ValidateEmail(`test@berkeley.edu`);
    y = undefined || null;
    t.notEqual(x, y, `ValidateEmail SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    x = EmailService.ValidateEmail(`test@berkeley.edu`);
    y = true;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.ValidateEmail(`test@gmail.com`);
    y = false;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.ValidateEmail(12345);
    y = false;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.ValidateEmail(Infinity);
    y = false;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.ValidateEmail(null);
    y = false;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

  });

  await test(`Email`, (t) => {
    let x, y, value;

    // Test Function
    x = typeof EmailService.Email;
    y = typeof Function;
    t.equal(x, y, `Email SHOULD be ${y}, Expected: ${y}, Actual: ${x}`);

    // No Throw
    x = EmailService.Email(`test@berkeley.edu`)
    t.notThrow(() => x, `Email SHOULD NOT throw an error, Actual: ${x}`);

    // Function not null
    x = EmailService.Email(`test@berkeley.edu`);
    y = undefined || null;
    t.notEqual(x, y, `Email SHOULD NOT be ${y}, Expected: ${y}, Actual: ${x}`);

    // Normal Test
    x = EmailService.Email(`test@berkeley.edu`);
    y = 0;
    t.equal(x, y, `Email SHOULD return ${y}, Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.Email(`test@gmail.com`);
    y = 0;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.Email(12345);
    y = 1;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.Email(Infinity);
    y = 1;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

    // Bad Inputs
    x = EmailService.Email(null);
    y = 0;
    t.equal(x, y, `Format Timer BAD: Expected: ${y}, Actual: ${x}`);

  });

  await test(`EmailService`, async(t) => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const id = new IDService().id;
    const projectname = `Some Kinda Project`;
    const designspecialistemail = `codyglen@berkeley.edu`;
    const message = new MessageService({
      name : name,
      id : id,
      projectname : projectname,
    });
    console.warn(`Email to ${email} from ${SERVICE_EMAIL}, ${name}, ${id}`);
    Object.values(STATUS).forEach(async (status) => {
      const subject = `${SERVICE_NAME}: ${status}`;
      const x = await EmailService.Email(email, designspecialistemail, subject, message, status, designspecialistemail); 
      t.notThrow(() => x, `EmailService SHOULD NOT throw error`);
    })
  });

  await test.finish();
  if (test?.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test All with GasT
 */
const _gasTTestAll = async() => {
  Promise.all([
    await _gasTMainTesting(),
    await _gasTPriorityTesting(),
    await _gasTIDServiceTesting(),
    await _gasTMessagingTesting(),
    await _gasTLoggerTesting(),
    await _gasTMiscTesting(),
    await _gasTCalculationTesting(),
    await _gasTTimeTesting(),
    await _gasTShopifyTesting(),
    await _gasTTicketTesting(),
    await _gasTEmailTesting(),
  ])
  .then(console.info('Test Success.'))
  .catch(err => {
    console.error(`Failure: ${err}`);
  });
}


// /**
//  * Unit Test for Running Both 'OnEdit' & 'OnFormSubmit' Messages asynchronously. 
//  */
// const _testAllMessages = async() => {

//     Promise.all([
//         await _testOnEditMessages(),
//         await _testOnformSubmitMessages(),
//     ])
//     .then(console.info('Test Success'))
//     .catch(Error => {
//         console.error(Error + 'Failure');
//     }); 
// }




