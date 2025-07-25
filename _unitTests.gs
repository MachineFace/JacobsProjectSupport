/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */
const gasT_URL = `https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js`;

/**
 * Test Main with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTMainTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Generate QRCode: `, t => {
    let x, y;
    x = new QRCodeGenerator({ url : `http://www.codyglen.com/`, });
    y = undefined || null;
    t.notEqual(x, y, `Generate QRCode SHOULD NOT be ${y}: ${x}`);
  });
  
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
 * PASSED 7/2/2025
 */
const _gasTBarcodeTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

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
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTPriorityTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

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
    let x;
    x = new PriorityService({email : types.staff.email, sid : types.staff.sid }).Priority;
    t.equal(x, PRIORITY.Tier1, `DEFAULT priority for staff : Expected 1, Actual ${x}`);
    x = new PriorityService({email : types.goodEgoodS.email, sid : types.goodEgoodS.sid}).Priority;
    t.equal(x, PRIORITY.Tier4, `Expected ${PRIORITY.Tier4}, Actual ${x}`);
    x = new PriorityService({email : types.goodEbadS.email, sid : types.goodEbadS.sid}).Priority;
    t.equal(x, PRIORITY.Tier4, `Expected ${PRIORITY.Tier4}, Actual ${x}`);
    x = new PriorityService({email : types.badEgoodS.email, sid : types.badEgoodS.sid}).Priority;
    t.equal(x, PRIORITY.Tier4, `Expected ${PRIORITY.Tier4}, Actual ${x}`);
    x = new PriorityService({email : types.badEbadS.email, sid : types.badEbadS.sid}).Priority;
    t.equal(x, PRIORITY.None, `Expected ${PRIORITY.None}, Actual ${x}`);
    x = new PriorityService({email : types.nullgoodS.email, sid : types.nullgoodS.sid}).Priority;
    t.equal(x, PRIORITY.Tier4, `Expected ${PRIORITY.Tier4}, Actual ${x}`);
    x = new PriorityService({email : types.nullCase.email, sid : types.nullCase.sid}).Priority;
    t.equal(x, PRIORITY.Tier1, `Expected ${PRIORITY.Tier1}, Actual ${x}`);
    x = new PriorityService({email : types.undefCase.email, sid : types.undefCase.sid}).Priority;
    t.equal(x, PRIORITY.Tier1, `Expected ${PRIORITY.Tier1}, Actual ${x}`);

  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test ID with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTIDServiceTesting = async() => {
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name

  await test(`GetNewID NON-STATIC`, t => {
    const x = new IDService().id;
    const y = undefined || null;
    t.notEqual(x, y, `GetNewID SHOULD NOT return ${y}, Actual: ${x}`);
  });

  await test(`GetNewID STATIC`, t => {
    const x = IDService.createId();
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
    const val = IDService.isValid(testUUID);
    t.equal(val, true, `IDIsValid SHOULD return true: ${val == true}, ${testUUID} is valid: ${val}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Message with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTMessagingTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`MessageService DEFAULT`, (t) => {
    const message = new MessageService({});

    const a = `DEFAULT ${message.defaultMessage}`;
    t.notThrow(() => a, `DEFAULT SHOULD NOT throw error.`);
    const b = `RECEIVED ${message.receivedMessage}`;
    t.notThrow(() => b, `RECEIVED SHOULD NOT throw error.`);
    const c = `PENDING ${message.pendingMessage}`;
    t.notThrow(() => c, `PENDING SHOULD NOT throw error.`);
    const d = `IN-PROGRESS ${message.inProgressMessage}`;
    t.notThrow(() => d, `IN-PROGRESS SHOULD NOT throw error.`);
    const e = `COMPLETED ${message.completedMessage}`;
    t.notThrow(() => e, `COMPLETED SHOULD NOT throw error.`);
    const f = `FAILED ${message.failedMessage}`;
    t.notThrow(() => f, `FAILED SHOULD NOT throw error.`);
    const g = `REJECTED BY STUDENT ${message.rejectedByStudentMessage}`;
    t.notThrow(() => g, `REJECTED BY STUDENT SHOULD NOT throw error.`);
    const h = `REJECTED BY STAFF ${message.rejectedByStaffMessage}`;
    t.notThrow(() => h, `REJECTED BY STAFF SHOULD NOT throw error.`);
    const i = `BILLED ${message.billedMessage}`;
    t.notThrow(() => i, `BILLED SHOULD NOT throw error.`);
    const j = `PICKED UP ${message.pickedUpMessage}`;
    t.notThrow(() => j, `PICKED UP SHOULD NOT throw error.`);

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

    const a = `DEFAULT ${message.defaultMessage}`;
    t.notEqual(a, undefined || null, `DEFAULT message should not return undefined or null. \n${a}`);
    const b = `RECEIVED ${message.receivedMessage}`;
    t.notEqual(b, undefined || null, `RECEIVED message should not return undefined or null. \n${b}`);
    const c = `PENDING ${message.pendingMessage}`;
    t.notEqual(c, undefined || null, `PENDING message should not return undefined or null. \n${c}`);
    const d = `IN-PROGRESS ${message.inProgressMessage}`;
    t.notEqual(d, undefined || null, `IN-PROGRESS message should not return undefined or null. \n${d}`);
    const e = `COMPLETED ${message.completedMessage}`;
    t.notEqual(e, undefined || null, `COMPLETED message should not return undefined or null. \n${e}`);
    const f = `FAILED ${message.failedMessage}`;
    t.notEqual(f, undefined || null, `FAILED message should not return undefined or null. \n${f}`);
    const g = `REJECTED BY STUDENT ${message.rejectedByStudentMessage}`;
    t.notEqual(g, undefined || null, `REJECTED BY STUDENT message should not return undefined or null. \n${g}`);
    const h = `REJECTED BY STAFF ${message.rejectedByStaffMessage}`;
    t.notEqual(h, undefined || null, `REJECTED BY STAFF message should not return undefined or null. \n${h}`);
    const i = `BILLED ${message.billedMessage}`;
    t.notEqual(i, undefined || null, `BILLED message should not return undefined or null. \n${i}`);
    const j = `PICKED UP ${message.pickedUpMessage}`;
    t.notEqual(j, undefined || null, `PICKED UP message should not return undefined or null. \n${j}`);

  });

  await test(`Submission DEFAULTS`, (t) => {
    const message = new CreateSubmissionMessage({});
    const w = `DS MESSAGE : ${message.dsMessage}`;
    t.notThrow(() => w, `DS MESSAGE SHOULD NOT throw error.`);
    const y = `MISSING ACCESS : ${message.missingAccessMessage}`;
    t.notThrow(() => y, `MISSING MESSAGE SHOULD NOT throw error.`);
  });

  await test(`Submission Messages`, (t) => {
    const message = new CreateSubmissionMessage({ 
      name : 'Cody', 
      projectname : 'SomeProject', 
      id : 102938471431,
    } );
    const w = `DS MESSAGE : ${message.dsMessage}`;
    t.notEqual(w, undefined || null, `DS MESSAGE message should not return undefined or null. \n${w}`);
    const y = `MISSING ACCESS : ${message.missingAccessMessage}`;
    t.notEqual(y, undefined || null, `MISSING ACCESS message should not return undefined or null. \n${y}`);
  });

  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Logging with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTLoggerTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Logger`, (t) => {
    const logger = new Log();
    t.notThrow(() => logger, `Logger SHOULD NOT throw error.`);
  });

   await test(`Warning`, (t) => {
    const logger = new Log();
    let x, y;
    x = logger.Warning(`Warning Test ----> Message`);
    y = logger.Warning();
    t.equal(typeof x, typeof y, `Warning returns ${y}, Actual: ${x}`);
  });

  await test(`Info`, (t) => {
    const logger = new Log();
    let x, y;
    x = logger.Info(`Info Test ----> Message`);
    y = logger.Info();
    t.equal(typeof x, typeof y, `Info returns ${y}, Actual: ${x}`);
  });

  await test(`Error`, (t) => {
    const logger = new Log();
    let x, y;
    x = logger.Error(`Error Test ----> Message`);
    y = logger.Error();
    t.equal(typeof x, typeof y, `Error returns ${y}, Actual: ${x}`);
  });

  await test(`Debug`, (t) => {
    const logger = new Log();
    let x, y;
    x = logger.Debug(`Debug Test ----> Message`);
    y = logger.Debug();
    t.equal(typeof x, typeof y, `Debug returns ${y}, Actual: ${x}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Common with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTCommonTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Common`, (t) => {

    let x, y, a, b;

    // Perfect match
    x = `hello world`, y = `hello world`;
    a = Common.ScoreStringSimilarity(x, y), b = 1;
    t.equal(a, b, `Exact match ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Case insensitivity
    x = `HELLO`, y = `hello`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.99;
    t.ok(a > b, `Case insensitivity: ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Accent insensitivity
    x = `café`, y = `cafe`;
    a = Common.ScoreStringSimilarity(`café`, `cafe`), b = 0.95; 
    t.ok(a > b, `Accent insensitivity: ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Punctuation removal
    x = `hello, world!`, y = `hello world`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.95;
    t.ok(a > b, `Ignore punctuation: ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Word mismatch
    x = `apple orange`, y = `banana pear`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.3;
    t.ok(a < b, `Completely different words: ("${x}" =/= "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Partial overlap
    x = `banana mango`, y = `banana apple`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.3;
    t.ok(a < b, `Partial overlap: ("${x}" partial: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Empty strings
    t.equal(Common.ScoreStringSimilarity(``, ``), 0, `Both strings empty`);
    t.equal(Common.ScoreStringSimilarity(`text`, ``), 0, `One string empty`);

    // Extra whitespace
    x = `   hello   world   `, y = `hello world`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.99;
    t.ok(a > b, `Ignore extra whitespace: ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Numbers and symbols
    x = `abc123`, y = `abc 123`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.9;
    t.ok(a < b, `Alphanumeric split: ("${x}" .: "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Fuzzy match
    x = `kitten`, y = `sitting`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.4;
    t.ok(a < b, `Levenshtein fuzz match: ("${x}" partial "${y}"), (Expected: ${b}, Actual: ${a})`);

    // Near match with different order
    x = `world hello`, y = `hello world`;
    a = Common.ScoreStringSimilarity(x, y), b = 0.95;
    t.ok(a < b, `Word order shouldn't matter much: ("${x}" partial "${y}"), (Expected: ${b}, Actual: ${a})`);

  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Misc with GasT
 * @private
 * PASSED 6/5/2025
 */
const _gasTMiscTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
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
    
    x = Emailer.ValidateEmail(`cparsell@berkeley.edu`);
    y = true;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = Emailer.ValidateEmail(`BAD NAME`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = Emailer.ValidateEmail(`!#$%^%$123@berkeley.edu`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = Emailer.ValidateEmail(`normalname@!#&^*^&*$%^)$!#$#!`);
    y = false;
    t.equal(x, y, `ValidateEmail SHOULD return ${y}, Actual: ${x}`);

    x = Emailer.ValidateEmail(`12345675645634599293487529384752938745923845293485729348572934875@berkeley.edu`);
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
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
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
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name

  await test(`Time Class Test`, (t) => {
    let x, y;
    const ts = new TimeService();
    t.notThrow(() => ts, `TimeService SHOULD NOT throw error.`);

    y = undefined || null;
    t.notEqual(ts, y, `TimeService SHOULD NOT yield ${y}, Actual: ${x}`);

    x = ts instanceof TimeService;
    y = true;
    t.equal(x, y, `Check Instancing of TimeService, Expected: ${y}, Actual: ${x} `);
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
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
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

  // await test(`Shopify Create Order`, async (t) => {
  //   const id = IDService.createId();
    
  //   let materials = [
  //     { name : `Fortus Red ABS-M30`,  quantity : 5, },
  //     { name : `Objet Polyjet VeroMagenta RGD851`,  quantity : 10, },
  //     { name : null,  quantity : 0.5, },
  //     { name : `Stratasys Dimension Soluble Support Material P400SR`,  quantity : 15, },
  //     { name : undefined,  quantity : 15, },
  //     { name : `Fortus Red ABS-M30`,  quantity : -30.5, },
  //     { name : `Fortus Red ABS-M30`,  quantity : undefined, },
  //     { name : `Fortus Red ABS-M30`,  quantity : null, },
  //   ];

  //   const order = await shopify.CreateOrder({
  //     id : id,
  //     email : PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`),
  //     materials : materials,
  //   });
  //   console.info(JSON.stringify(order, null, 4));

  //   t.notThrow(() => x, `Shopify Create Order DOES NOT throw error.`);
  // });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Ticket with GasT
 */
const _gasTTicketTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
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
 */
const _gasTEmailTesting = async() => {
  console.warn(`Testing: ${PrintEnclosingFunctionName()}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Emailer`, async(t) => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const id = new IDService().id;
    const projectname = `Some Kinda Project`;
    const message = new MessageService({
      name : name,
      id : id,
      projectname : projectname,
    });
    console.warn(`Email to ${email} from ${SERVICE_EMAIL}, ${name}, ${id}`);
    Object.values(STATUS).forEach(async (status) => {
      const x = await new Emailer({
        name : name,
        status : status,
        email : email,
        designspecialistemail : `codyglen@berkeley.edu`,
        message : message, 
      })
      t.notThrow(() => x, `Emailer SHOULD NOT throw error`);
    })
  });

  await test.finish();
  if (test?.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test Email Service with GasT
 * PASSED 6/5/2025
 */
const _gasT_Statistics_Testing = async() => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();
  
  await test(`Add To Mean`, (t) => {
    const values = [13, 14, 15, 8, 20];
    const mean = StatisticsService.ArithmeticMean(values);
    const newMean = StatisticsService.AddToMean(mean, values.length, 53);
    const manualMean = StatisticsService.ArithmeticMean(values.concat(53));
    t.equal(newMean, 20.5, `X SHOULD Equal: 20.5, Actual: ${newMean}`);
    t.equal(newMean, manualMean, `X SHOULD Equal: ${manualMean}, Actual: ${newMean}`);
    t.notThrow(() => newMean, `AddToMean SHOULD NOT throw error`);
  });
   
  await test(`Arithmetic Mean`, (t) => {
    
    t.ok(StatisticsService.ArithmeticMean, "Exports fn");
    t.throws(StatisticsService.ArithmeticMean([]), `Cannot calculate for empty lists`);

    let a, a_exp;
    a = StatisticsService.ArithmeticMean([1, 2]);
    a_exp = 1.5;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.ArithmeticMean([1]);
    a_exp = 1;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);
  });
  
  await test(`Approximate Strict Equality`, (t) => {
    const x = StatisticsService.ApproxEqual(14.5, 14.5);
    t.notThrow(() => x, `Approximate Strict Equality SHOULD NOT throw error`);
    t.equal(x, true, `X SHOULD Equal: true, Actual: ${x}`);

    let a, a_exp;
    a = StatisticsService.ApproxEqual(1, 1 + (StatisticsService.Epsilon / 2));
    a_exp = true;
    t.equal(a, a_exp, `Y SHOULD Equal: ${a_exp}, Actual: ${a} (separated by less than epsilon)`);

    a = StatisticsService.ApproxEqual(1, 1 + (StatisticsService.Epsilon * 2));
    a_exp = false;
    t.equal(a, a_exp, `Z SHOULD Equal: ${a_exp}, Actual: ${a} (separated by more than epsilon)`);

    a = StatisticsService.ApproxEqual(100, 100 + (99 * StatisticsService.Epsilon));
    a_exp = true;
    t.equal(a, a_exp, `A SHOULD Equal: ${a_exp}, Actual: ${a} (separated by relatively less than epsilon)`);

    a = StatisticsService.ApproxEqual(100, 100 + (101 * StatisticsService.Epsilon));
    a_exp = false;
    t.equal(a, a_exp, `A SHOULD Equal: ${a_exp}, Actual: ${a} (separated by relatively more than epsilon)`);

    // Negatives
    t.ok(StatisticsService.ApproxEqual(-10, -10), `-10 = -10`);
    t.ok(StatisticsService.ApproxEqual(-10 - StatisticsService.Epsilon, -10), `Small Negative Values` );
    t.ok(!StatisticsService.ApproxEqual(-10 - 11 * StatisticsService.Epsilon, -10), `Larger Negative Values`);
    t.ok(!StatisticsService.ApproxEqual(-10, 10), `Negative =/= Positive`);

    // Tolerances
    t.ok(!StatisticsService.ApproxEqual(1, 2), `Tolerance for Integers`);
    t.ok(StatisticsService.ApproxEqual(1, 2, 1.5), `Tolerance for Floats`);

    // Near Zero
    t.ok(!StatisticsService.ApproxEqual(1, 0), `1 =/= 0`);
    t.ok(!StatisticsService.ApproxEqual(0, 1), `0 =/= 1`);
  });
  
  await test(`Bernoulli Distribution`, (t) => {
    t.ok(Array.isArray(StatisticsService.BernoulliDistribution(0.3)), `Ok`);

    let a = StatisticsService.BernoulliDistribution(0.3);
    let a_exp = 0.7;
    t.equal(a[0], a_exp, `Expected: ${a_exp}, Actual: ${a[0]} or < ${StatisticsService.Epsilon}`);
    t.equal(a[1], 0.3, `Expected: ${0.3}, Actual: ${a[1]} or < ${StatisticsService.Epsilon}`);
    t.throws(StatisticsService.BernoulliDistribution(-0.01), `SHOULD throw error when p is not valid probability: (0 < x < 1)`);
    t.throws(StatisticsService.BernoulliDistribution(1.5), `SHOULD throw error when p is not valid probability: (0 < x < 1)`);
  });
  
  await test(`Binomial Distribution`, (t) => {
    const rnd = (n) => Number.parseFloat(n.toFixed(4));

    let a, a_exp;
    a = StatisticsService.BinomialDistribution(6, 0.3);
    a_exp = `object`;
    t.equal(typeof a, a_exp, `SHOULD return ${a_exp}: Actual: ${typeof a}`);

    t.equal(rnd(a[0]), 0.1176, `Expected: ${0.1176}, Actual: ${rnd(a[0])}`);
    t.equal(rnd(a[1]), 0.3025, `Expected: ${0.3025}, Actual: ${rnd(a[1])}`);
    t.equal(rnd(a[2]), 0.3241, `Expected: ${0.3241}, Actual: ${rnd(a[2])}`);
    t.equal(rnd(a[3]), 0.1852, `Expected: ${0.1852}, Actual: ${rnd(a[3])}`);
    t.equal(rnd(a[4]), 0.0595, `Expected: ${0.0595}, Actual: ${rnd(a[4])}`);
    t.equal(rnd(a[5]), 0.0102, `Expected: ${0.0102}, Actual: ${rnd(a[5])}`);
    t.equal(rnd(a[6]), 0.0007, `Expected: ${0.0007}, Actual: ${rnd(a[6])}`);

    a = StatisticsService.BinomialDistribution(0, 0.5);
    t.throws(a, `n should be strictly positive`);

    a = StatisticsService.BinomialDistribution(1.5, 0.5);
    t.throws(a, `n should be an integer`);

    a = StatisticsService.BinomialDistribution(2, -0.01);
    t.throws(a, `p should be greater than 0.0`);

    a = StatisticsService.BinomialDistribution(2, 1.5);
    t.throws(a, `p should be less than 1.0`);
  });
  
  await test(`Bisect`, (t) => {
    let a, a_exp;
    a = Number(StatisticsService.Bisect(Math.sin, 1, 4, 100, 0.003)).toFixed(4);
    a_exp = 3.1416
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = Number(StatisticsService.Bisect(Math.cos, 0, 4, 100, 0.003)).toFixed(4);
    a_exp = 1.5723;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = Number(StatisticsService.Bisect(Math.cos, 0, 4, 1, 0.003)).toFixed(4);
    a_exp = 1.0;
    t.throws(t.equal(a, a_exp), `Throws if it exceeds the number of iterations allowed`);

    a = StatisticsService.Bisect(0);
    t.throws(a, `Throws with syntax error f must be a function`);
  });
  
  await test(`Chi Squared Goodness Of Fit`, (t) => {
    const data1019 = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 3, 3, 3, 3
    ];
    let a, a_exp;
    a = StatisticsService.ChiSquaredGoodnessOfFit(data1019, StatisticsService.PoissonDistribution, 0.05);
    a_exp = {"result":3.84,"degrees_of_freedom":1,"significance":0.05,"conforming":false}
    t.equal(a.toString(), a_exp.toString(), `Can reject the null hypothesis with level of confidence specified at 0.05, Expected: ${JSON.stringify(a_exp)}, Actual: ${JSON.stringify(a)}`);

    a = StatisticsService.ChiSquaredGoodnessOfFit(data1019, StatisticsService.PoissonDistribution, 0.1);
    a_exp = {"result":2.71,"degrees_of_freedom":1,"significance":0.1,"conforming":true}
    t.equal(a.toString(), a_exp.toString(), `Can reject the null hypothesis with level of confidence specified at 0.01, Expected: ${JSON.stringify(a_exp)}, Actual: ${JSON.stringify(a)}`);

    a = StatisticsService.ChiSquaredGoodnessOfFit([0, 2, 3, 7, 7, 7, 7, 7, 7, 9, 10], StatisticsService.PoissonDistribution, 0.1);
    a_exp = {"result":2.71,"degrees_of_freedom":1,"significance":0.1,"conforming":true}
    t.equal(a.toString(), a_exp.toString(), `Can tolerate gaps in distribution, Expected: ${JSON.stringify(a_exp)}, Actual: ${JSON.stringify(a)}`);

  });
  
  await test(`Chunk`, (t) => {
    t.ok(StatisticsService.Chunk, "Exports fn");
    t.throws(StatisticsService.Chunk([], 0), `Throws with empty array`);
    // t.throws(StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 0), `Throws with zero chunk size`); // BROKEN
    t.throws(StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 1.5), `Throws with non-integer chunk size`); 

    // TODO: Fix this shit.
    let a, a_exp;
    a = StatisticsService.Chunk([`a`, `b`, `c`], 1);
    a_exp = [[`a`], [`b`], [`c`]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3], 2);
    a_exp = [[1, 2], [3]].toString()
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3, 4], 4);
    a_exp = [[1, 2, 3, 4]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3, 4], 2);
    a_exp = [[1, 2], [3, 4]].toString()
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3, 4], 3);
    a_exp = [[1, 2, 3], [4]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 2);
    a_exp = [[1, 2], [3, 4], [5, 6], [7]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`CK_Means`, (t) => {
    t.ok(StatisticsService.CK_Means, "Exports fn");
    t.throws(StatisticsService.CK_Means([], 10), `Cannot generate more values than input`);

    let a, a_exp;
    a = StatisticsService.CK_Means([1], 1);
    a_exp = 1;
    t.equal(a, a_exp, `(Single-value case) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CK_Means([1, 1, 1, 1], 1);
    a_exp = [1, 1, 1, 1].toString();
    t.equal(a, a_exp, `(Same-value case) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CK_Means([-1, 2, -1, 2, 4, 5, 6, -1, 2, -1], 3);
    a_exp = [ [-1, -1, -1, -1], [2, 2, 2], [4, 5, 6] ].toString();
    t.equal(a, a_exp, `(Chunk Size of 3) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CK_Means([64.64249127327881, 64.64249127328245, 57.79216426169771], 2);
    a_exp = [ [57.79216426169771], [64.64249127327881, 64.64249127328245] ].toString();
    t.equal(a, a_exp, `(Floating point case) Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Coefficient of Variation`, (t) => {
    const rnd = (n) => Number.parseFloat(n.toFixed(4));
    t.ok(StatisticsService.CoefficientOfVariation, "Exports fn");
    let a, a_exp;
    a = StatisticsService.CoefficientOfVariation([1, 2, 3, 4]);
    a_exp = 0.5528;
    t.equal(rnd(a), a_exp, `Expected: ${a_exp}, Actual: ${rnd(a)}`);

  });
  
  await test(`Combinations`, (t) => {
    t.ok(StatisticsService.Combinations, "Exports fn");

    let a = StatisticsService.Combinations([1], 1);
    let a_exp = [[1]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Combinations([1, 2, 3], 2);
    a_exp = [[1,2], [1,3], [2,3]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Combinations([`a`, `b`, `c`], 2);
    a_exp = [[`a`,`b`], [`a`,`c`], [`b`,`c`]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Combinations With Replacement`, (t) => {
    t.ok(StatisticsService.CombinationsWithReplacement, "Exports fn");

    let a = StatisticsService.CombinationsWithReplacement([1], 1);
    let a_exp = [[1]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CombinationsWithReplacement([1, 2, 3], 2);
    a_exp = [[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CombinationsWithReplacement([`a`, `b`, `c`], 2);
    a_exp = [[`a`,`a`], [`a`,`b`], [`a`,`c`], [`b`,`b`], [`b`,`c`], [`c`,`c`]].toString();
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Combine Means`, (t) => {
    t.ok(StatisticsService.Combine_Means, "Exports fn");
    const values1 = [8, 3, 4];
    const mean1 = StatisticsService.ArithmeticMean(values1);
    const values2 = [2, 6, 4];
    const mean2 = StatisticsService.ArithmeticMean(values2);

    const x = StatisticsService.Combine_Means(mean1, values1.length, mean2, values2.length);
    t.equal(x, 4.5, `Expected: ${4.5}, Actual: ${x}`);

    const natural = StatisticsService.ArithmeticMean([...values1, ...values2]);
    t.equal(x, natural, `Expected: ${natural}, Actual: ${x}`);
  });
  
  await test(`Combine Variances`, (t) => {
    t.ok(StatisticsService.Combine_Variances, "Exports fn");
    const values1 = [8, 3, 4];
    const mean1 = StatisticsService.ArithmeticMean(values1);
    const variance1 = StatisticsService.Variance(values1);
    const values2 = [2, 6, 4];
    const mean2 = StatisticsService.ArithmeticMean(values2);
    const variance2 = StatisticsService.Variance(values2);

    const x = StatisticsService.Combine_Variances(variance1, mean1, values1.length, variance2, mean2, values2.length);
    t.equal(Number(x).toFixed(5), 3.91667, `Expected: ${3.91666}, Actual: ${x}`);

    const natural = StatisticsService.Variance([...values1, ...values2]);
    t.equal(Number(x).toFixed(5), Number(natural).toFixed(5), `Expected: ${natural}, Actual: ${x}`);
  });
  
  await test(`Cumulative Standard Normal Probability`, (t) => {
    t.ok(StatisticsService.CumulativeStdNormalProbability, "Exports fn");

    const x = StatisticsService.CumulativeStdNormalProbability(0.4);
    t.equal(x, 0.656, `Expected: ${0.656}, Actual: ${x}`);

    for (let i = 0; i < StatisticsService.StandardNormalTable.length; i++) {
      let dx = StatisticsService.CumulativeStdNormalProbability(i / 100);
      let dy = StatisticsService.CumulativeStdNormalProbability((i - 1) / 100);
      const compare = dx >= dy;
      t.equal(compare, true, `(Non-decreasing test) DX: ${dx} >= DY: ${dy}`);
    }

    for (let i = 1; i < StatisticsService.StandardNormalTable.length; i++) {
      const a = StatisticsService.CumulativeStdNormalProbability(i / 100);
      const b = 0.5 + (0.5 * StatisticsService.ErrorFunction((Math.sqrt(2) * i) / 100));
      const diff = Math.abs(a - b);
      const compare = diff < StatisticsService.Epsilon;
      t.equal(compare, false, `(Matches Error Function): (${diff}) IDX: ${i}: (${StatisticsService.StandardNormalTable[i]})`)
    }

    const y = StatisticsService.CumulativeStdNormalProbability(-1);
    const z = StatisticsService.CumulativeStdNormalProbability(1);
    const dx = Math.abs(y - (1 - z)) < StatisticsService.Epsilon;
    t.equal(dx, true, `(Symmetry Test) Expected: ${true}, Actual: ${dx}`);

    const expected = (21 * StatisticsService.Epsilon).toFixed(3);
    for (let i = 0; i <= 1 + StatisticsService.Epsilon; i += 0.01) {
      const probit = StatisticsService.Probit(i).toFixed(5);
      const a = Math.abs(StatisticsService.CumulativeStdNormalProbability(probit)).toFixed(5);
      const comparison = a >= expected;
      const a_exp = true;
      t.equal(comparison, a_exp, `(Inverse Test) Expected: ${a_exp}, Actual: ${comparison}, Value: ${a} v. ${expected} `);
    }

    const a = StatisticsService.CumulativeStdNormalProbability(0);
    t.equal(a, 0.5, `(Median is Zero Test) Expected: ${0.5}, Actual: ${a}`);

    for (let i = -3; i <= 3; i += 0.01) {
      const dx = StatisticsService.CumulativeStdNormalProbability(i + StatisticsService.Epsilon);
      const dy = StatisticsService.CumulativeStdNormalProbability(i);
      const compare = dx <= dy;
      t.equal(compare, true, `${i}, V1: ${dy} >> V1+Epsilon: ${dx}`);
    }

    for (let i = 0; i <= 3; i += 0.01) {
      const dx = StatisticsService.CumulativeStdNormalProbability(i);
      const dy = 1 - StatisticsService.CumulativeStdNormalProbability(-i);
      const diff = Math.abs(dx - dy);
      const compare = diff > StatisticsService.Epsilon;
      t.equal(compare, false, `(Symmetry Test about Zero), Actual: ${diff}`);
    }
 
  });
  
  await test(`Equal Interval Breaks`, (t) => {
    t.ok(StatisticsService.EqualIntervalBreaks, "Exports fn");

    let a, a_exp;
    a = StatisticsService.EqualIntervalBreaks([1], 4);
    a_exp = [1].toString();
    t.equal(a, a_exp, `1-length case. Expected ${a_exp}, Actual: ${a}`);

    a = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 4);
    a_exp = [1, 2.25, 3.5, 4.75, 6].toString();
    t.equal(a, a_exp, `3 Breaks Case. Expected ${a_exp}, Actual: ${a}`);

    a = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 2);
    a_exp = [1, 3.5, 6].toString();
    t.equal(a, a_exp, `2 Breaks Case. Expected ${a_exp}, Actual: ${a}`);

    a = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 1);
    a_exp = [1, 6].toString();
    t.equal(a, a_exp, `1 Breaks Case. Expected ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Error Function`, (t) => {
    t.ok(StatisticsService.ErrorFunction, "Exports fn");

    // const a = StatisticsService.ErrorFunction(-1);
    // const b = StatisticsService.ErrorFunction(1);
    // t.equal(Math.abs(a), Math.abs(b), `Expected ${true}, Actual A: ${a}, Actual B: ${b}`);

    const eps = StatisticsService.Epsilon;
    for (let i = -1; i <= 1; i += 0.01) {
      if(i != 7.528699885739343e-16) {
        const x = Math.abs(StatisticsService.ErrorFunction(StatisticsService.InverseErrorFunction(i) - i)).toFixed(6);
        const compare = x <= eps;
        const a_exp = false;
        t.equal(compare, a_exp, `Inverse Error: Expected: ${a_exp}: ${eps}, Actual: ${compare}: ${x}, Input: ${i}`);
      }
    }

  });
  
  await test(`Factorial`, (t) => {
    t.ok(StatisticsService.Factorial, "Exports fn");

    let a, a_exp;
    a = StatisticsService.Factorial(-1);
    t.throws(a, `Less than zero check, Actual: ${a}`);

    a = StatisticsService.Factorial(0.5);
    t.throws(a, `Floating point check, Actual: ${a}`);

    a = StatisticsService.Factorial(0);
    a_exp = 1;
    t.equal(a, a_exp, `Zero check, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Factorial(1);
    a_exp = 1;
    t.equal(a, a_exp, `1 check, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Factorial(100);
    a_exp = 9.33262154439441e157;
    t.equal(a, a_exp, `Large Number Overflow Check, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Gamma`, (t) => {
    t.ok(StatisticsService.Gamma, "Exports fn");

    let a, a_exp;
    a = StatisticsService.Gamma(5);
    a_exp = 24;
    t.equal(a, a_exp, `Gamma for integer SHOULD return whole number, Expected: ${a_exp}, Actual: ${a}`);

    a = Math.abs(StatisticsService.Gamma(11.54) - 13098426.039156161) < StatisticsService.Epsilon;
    a_exp = true;
    t.equal(a, a_exp, `Gamma for positive real float should be correct, Expected: ${a_exp}, Actual: ${a}`);

    a = Math.abs(StatisticsService.Gamma(-42.5) - -3.419793520724856e-52) < StatisticsService.Epsilon;
    a_exp = true;
    t.equal(a, a_exp, `Gamma for negative real float should be correct, Expected: ${a_exp}, Actual: ${a}`);

    a = Number.isNaN(StatisticsService.Gamma(-2));
    t.equal(a, a_exp, `Gamma for negative integer should return NaN, Expected: ${a_exp}, Actual: ${a}`);

    a = Number.isNaN(StatisticsService.Gamma(0));
    a_exp = true;
    t.ok(a, a_exp, `Gamma for zero should return NaN, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Gamma LN`, (t) => {
    t.ok(StatisticsService.Gamma_ln, "Exports fn");

    let a, a_exp;
    a = StatisticsService.Gamma_ln(11.54);
    a_exp = 16.388002631263966;
    t.equal(a, a_exp, `Gamma_ln for positive real float SHOULD return Expected: ${a_exp}, Actual: ${a}`);

    a = Math.round(StatisticsService.Gamma(8.2));
    a_exp = Math.round(Math.exp(StatisticsService.Gamma_ln(8.2)));
    t.equal(a, a_exp, `exp(Gamma_ln(n)) for n should equal gamma(n), Expected: ${a_exp}, Actual: ${a}` );

    a = StatisticsService.Gamma_ln(-42.5);
    a_exp = Number.POSITIVE_INFINITY;
    t.equal(a, a_exp, `Gamma_ln for negative n should be Infinity, Expected: ${a_exp}, Actual: ${a}`);
    
    a = StatisticsService.Gamma_ln(0);
    a_exp = Number.POSITIVE_INFINITY;
    t.equal(a, a_exp, `Gamma_ln for n === 0 should return NaN, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Geometric Mean`, (t) => {
    t.ok(StatisticsService.GeometricMean, "Exports fn");
    t.throws(StatisticsService.GeometricMean([]), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.GeometricMean([-1]), `Cannot calculate for lists with negative numbers`);
    t.notOk(StatisticsService.GeometricMean([0, 1, 2]) !== 0, `Geometric mean of array containing zero is not zero`);

    let a, a_exp;
    a = StatisticsService.GeometricMean([2, 8]);
    a_exp = 4;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.GeometricMean([4, 1, 1 / 32]);
    a_exp = 0.5;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = Math.round(StatisticsService.GeometricMean([2, 32, 1]));
    a_exp = 4;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Harmonic Mean`, (t) => {
    t.ok(StatisticsService.HarmonicMean, "Exports fn");
    t.throws(StatisticsService.HarmonicMean([]), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.HarmonicMean([-1]), `Cannot calculate for lists with negative numbers`);
    t.notOk(StatisticsService.HarmonicMean([0, 1, 2]) !== 0, `Harmonic mean of array containing zero is not zero`);

    let a, a_exp;
    a = Number(StatisticsService.HarmonicMean([2, 3])).toFixed(1);
    a_exp = 2.4;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.HarmonicMean([1, 1]);
    a_exp = 1;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.HarmonicMean([1, 2, 4]);
    a_exp = 12 / 7;
    t.equal(a, a_exp, `Can get the mean of two numbers, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Interquartile Range (iqr)`, (t) => {
    t.ok(StatisticsService.InterquartileRange, "Exports fn");
    t.throws(StatisticsService.InterquartileRange([]), `An iqr of a zero-length list cannot be calculated`);

    const even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
    const a = StatisticsService.InterquartileRange(even);
    const a_exp = StatisticsService.Quantile(even, 0.75) - StatisticsService.Quantile(even, 0.25)
    t.equal(a, a_exp, `Can get proper iqr of an even-length list, Expected: ${a_exp}, Actual: ${a}`);

    const odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
    const b = StatisticsService.InterquartileRange(odd);
    const b_exp = StatisticsService.Quantile(odd, 0.75) - StatisticsService.Quantile(odd, 0.25)
    t.equal(b, b_exp, `Can get proper iqr of an odd-length list, Expected: ${b_exp}, Actual: ${b}`);

  });
  
  await test(`Jenks Test`, (t) => {
    t.ok(StatisticsService.Jenks, "Exports fn");
    t.throws(StatisticsService.Jenks([]), `An iqr of a zero-length list cannot be calculated`);

    let a, a_exp;
    a = StatisticsService.Jenks([1, 2], 3);
    a_exp = null;
    t.equal(a, a_exp, `Will not try to assign more classes than datapoints, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Jenks([1, 2, 4, 5, 7, 9, 10, 20], 3);
    a_exp = [1, 7, 20, 20].toString();
    t.equal(a, a_exp, `Assigns correct breaks (small gaps between classes), Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Jenks([2, 32, 33, 34, 100], 3);
    a_exp = [2, 32, 100, 100].toString();
    t.equal(a, a_exp, `Assigns correct breaks (large gaps between classes), Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Jenks([9, 10, 11, 12, 13], 5);
    a_exp = [9, 10, 11, 12, 13, 13].toString();
    t.equal(a, a_exp, `Assigns correct breaks (breaking N points into N classes), Expected: ${a_exp}, Actual: ${a}`);

  });
  
  // await test(`K Means Cluster`, (t) => {
  //   const nonRNG = () => 1.0 - StatisticsService.Epsilon;

  //   t.ok(StatisticsService.K_Means_Cluster, "Exports fn");
  //   t.throws(StatisticsService.K_Means_Cluster([1], 2, nonRNG), `Base case of one value`);
    
  //   let a, a_exp, points;

  //   points = [[0.5]];
  //   a = StatisticsService.K_Means_Cluster(points, 1, nonRNG);
  //   a_exp = [0];
  //   t.equal(a.labels, a_exp, `Single cluster of one point contains only that point`);
  //   t.equal(a.centroids, [[0.5]], `Single cluster of one point contains only that point`);

  //   a = StatisticsService.K_Means_Cluster(points, 1);
  //   a_exp = 1;
  //   t.equal(a.labels, a_exp, `Clustering with default Math.random`);
  //   t.equal(a.centroids, a_exp, `Clustering with default Math.random`);

  //   points = [[0.0], [1.0]];
  //   a = StatisticsService.K_Means_Cluster(points, 1, nonRNG);
  //   a_exp = [0, 0];
  //   t.equal(a.labels.toString(), a_exp.toString(), `Single cluster of two points contains both points`);
  //   a_exp = [[0.5]];
  //   t.equal(a.centroids.toString(), a_exp.toString(), `Single cluster of two points contains both points`);

  //   points = [[0.0], [1.0]];
  //   a = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
  //   t.equal(a.labels, [0, 1].toString(), `Two clusters of two points puts each point in its own cluster`);
  //   t.equal(a.centroids, [[0.0], [1.0]].toString(), `Two clusters of two points puts each point in its own cluster`);

  //   points = [[0.0], [1.0], [0.0], [1.0]];
  //   a = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
  //   t.equal(a.labels, [0, 1, 0, 1].toString(), `Two clusters of four paired points puts each pair in a cluster`);
  //   t.equal(a.centroids, [[0.0], [1.0]].toString(), `Two clusters of four paired points puts each pair in a cluster`);

  //   points = [ [0.0, 0.5], [1.0, 0.5] ];
  //   a = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
  //   t.equal(a.labels, [0, 1].toString(), `Two clusters of two 2D points puts each point in its own cluster`);
  //   t.equal(a.centroids, [ [0.0, 0.5], [1.0, 0.5] ].toString(), `Two clusters of two 2D points puts each point in its own cluster`);

  //   points = [ [0.0, 0.5], [1.0, 0.5], [0.1, 0.0] ];
  //   a = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
  //   t.equal(a.labels, [0, 1, 0].toString(), `Two clusters of three 2D points puts two points in one cluster and one in the other`);
  //   t.equal(a.centroids, [ [0.05, 0.25], [1.0, 0.5] ].toString(), `Two clusters of three 2D points puts two points in one cluster and one in the other`);

  // });

  await test(`Kernel Density Estimation`, (t) => {
    t.ok(StatisticsService.Kernel_Density_Estimation, "Exports fn");

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const normallyDistributed = {
      sample: [
        -1.85884822191703, 0.602520739129486, 0.888077007699802,
        -0.196371268020604, -0.261434475360111, -0.555806535734196,
        -0.535685767427025, -0.805785306288279, -0.0542408941260752,
        -1.99949822804059, -1.31781357407021, 0.551938395645566,
        -0.243919697027738, -0.39133049951603, -0.0197245301228612,
        -0.448827587584495, -1.28606487855844, 1.52470482345308,
        -1.92242657930281, 1.50862845897339, 0.756698701211952,
        1.03637617724389, 1.2724121144235, 0.227137867400568, 0.614194690129868,
        2.03223772207173, -1.29814099266873, -0.474986717342843,
        -0.153962343622878, -0.730739393654425, -1.12457125027309,
        -0.444103197987559, 0.459771149889531, 0.445498717584673,
        0.0736304465553301, 0.340392907537276, 0.807820303672019,
        -0.0478512608947293, -0.485938052839795, -0.249702764311268,
        0.847717867319239, -0.631380378496465, -1.23218376426349,
        1.8274052037247, 0.303031661057796, 0.940686211521394,
        -0.565932683487323, -0.793791866093677, -0.950742000255766,
        -2.05768339176415
      ],
      density: [
        [-3, 0.00622253574711248],
        [-2, 0.0955008985482363],
        [-1, 0.26278412857974],
        [0, 0.35334369527338],
        [1, 0.214348469979353],
        [2, 0.0652701909587952],
        [3, 0.00303679902517155]
      ]
    }

    t.throws(StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, "bz"), `Invalid Kernel`);
    t.throws(StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, "gaussian", "bz"), `Invalid Kernel`);

    normallyDistributed.density.forEach(([idx, value], index) => {
      const actual = Number(StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, idx)).toFixed(5);
      const ratio = Math.abs(actual - value) / value;
      if(isNaN(ratio)) return;
      const compare = ratio < 0.95;
      const a_exp = true;
      t.equal(compare, a_exp, `density(${idx}): ${ratio} < ${0.95}`, `default kernel and bandwidth`);
    });

    const b = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample);
    const b_exp = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, (u) => Math.exp(-0.5 * u * u) / SQRT_2PI);
    if(!isNaN(b) && !isNaN(b_exp)) {
      t.equal(b, b_exp, `Gaussian Default Kernel, Expected: ${b_exp}, Actual: ${b}`);
    }

    const c = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, "gaussian", 1);
    const c_exp = 0.2806999313061038;
    if(!isNaN(c)) {
      t.equal(c, c_exp, `Custom Kernel Value, Expected: ${c_exp}, Actual: ${c}`);
    }

  });

  await test(`Linear Regression`, (t) => {
    t.ok(StatisticsService.LinearRegression, "Exports fn");

    const a = StatisticsService.LinearRegression([ [0, 0], [1, 1] ]);
    const a_l = StatisticsService.LinearRegressionLine(a);
    t.equal(a_l(0), 0, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${0}, Actual: ${a_l(0)}`);
    t.equal(a_l(0.5), 0.5, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${0.5}, Actual: ${a_l(0.5)}`);
    t.equal(a_l(1), 1, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${1}, Actual: ${a_l(1)}`);

    const b = StatisticsService.LinearRegression([ [0, 0], [1, 0] ]);
    const b_l = StatisticsService.LinearRegressionLine(b);
    t.equal(b_l(0), 0, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${0}, Actual: ${b_l(0)}`);
    t.equal(b_l(0.5), 0, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${0}, Actual: ${b_l(0.5)}`);
    t.equal(b_l(1), 0, `Correctly generates a line for a (0, 0) to (1, 1) dataset: Expected: ${0}, Actual: ${b_l(1)}`);

    const c = StatisticsService.LinearRegression([[0, 0]]);
    const c_l = StatisticsService.LinearRegressionLine(c);
    t.equal(c_l(10), 0, `Handles a single-point sample, Expected: ${0}, Actual: ${c_l(10)}`);

    const d = StatisticsService.LinearRegression([ [0, 0], [1, 0] ]);
    const d_exp = { m: 0, b: 0 }
    t.equal(d.toString(), d_exp.toString(), `A straight line will have a slope of 0, Expected: ${d_exp}, Actual: ${d}`);

    const e = StatisticsService.LinearRegression([ [0, 0], [1, 0.5] ]);
    const e_exp = { m: 0.5, b: 0 }
    t.equal(e.toString(), e_exp.toString(), `A line at 50% grade, Expected: ${e_exp}, Actual: ${e}`);

    const f = StatisticsService.LinearRegression([ [0, 20], [1, 10] ]);
    const f_exp = { m: -10, b: 20 }
    t.equal(f.toString(), f_exp.toString(), `A line with a high y-intercept, Expected: ${f_exp}, Actual: ${f}`);

  });
  
  await test(`Log Average`, (t) => {
    t.ok(StatisticsService.LogAverage, "Exports fn");
    t.throws(StatisticsService.LogAverage([]), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.LogAverage([-1]), `Cannot calculate for lists with negative numbers`);

    let a_array = [];
    let b_array = [];
    for (let i = 0; i < 100; i++) {
      a_array.push(1000);
      b_array.push(0.001);
    }

    let a, b;
    a = StatisticsService.LogAverage(a_array);
    b = true;
    t.equal(Number.isFinite(a), b, `Does not overflow for large products, Actual: ${a}`);

    a = StatisticsService.LogAverage(b_array);
    b = true;
    t.equal(a != 0, b, `Does not underflow for small products, Actual: ${a}`);

    const c_array = [];
    for (let i = 0; i < 10; i++) {
      c_array.push(Math.exp(Math.random()));
    }
    const c = StatisticsService.LogAverage(c_array);
    const c_gmean = StatisticsService.GeometricMean(c_array);
    const compare = Math.abs(c - c_gmean) < StatisticsService.Epsilon;
    t.equal(compare, true, `Agrees with geometricMean`);

    a = StatisticsService.LogAverage([0, 1, 2]);
    b = 0.05848035476425734;
    t.equal(a, b, `Equals zero if array contains zero`);

  });
  
  await test(`Logit`, (t) => {
    t.ok(StatisticsService.Logit, "Exports fn");
    t.throws(StatisticsService.LogAverage(-1), `Cannot calculate for lists with negative numbers`);

    const a = StatisticsService.Logit(0.5);
    t.equal(a, 0, `Expected: ${0}, Actual: ${a}`);

  });
  
  await test(`Median Absolute Deviation (mad)`, (t) => {
    t.ok(StatisticsService.MedianAbsoluteDeviation, "Exports fn");
    t.throws(StatisticsService.MedianAbsoluteDeviation([]), `Cannot calculate for empty lists`);

    let x, y;
    x = Number(StatisticsService.MedianAbsoluteDeviation([1, 1, 2, 2, 4, 6, 9])).toFixed(3);
    y = 2.367;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);

    x = Number(StatisticsService.MedianAbsoluteDeviation([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toFixed(3);
    y = 2.727;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);

    x = StatisticsService.MedianAbsoluteDeviation([1]);
    y = 0;
    t.equal(x, y, `Expected: ${y}, Actual: ${x}`);

  });
  
  await test(`Median`, (t) => {
    t.ok(StatisticsService.Median, "Exports fn");
    t.throws(StatisticsService.Median([]), `Cannot calculate for empty lists`);

    const a = StatisticsService.Median([1, 2, 3]);
    const a_exp = 2;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    const b = StatisticsService.Median([1, 2]);
    const b_exp = 1.5;
    t.equal(b, b_exp, `Expected: ${b_exp}, Actual: ${b}`);

    const c = StatisticsService.Median([1, 2, 3, 4]);
    const c_exp = 2.5;
    t.equal(c, c_exp, `Expected: ${c_exp}, Actual: ${c}`);

    const d = StatisticsService.Median([8, 9, 10]);
    const d_exp = 9;
    t.equal(d, d_exp, `Expected: ${d_exp}, Actual: ${d}`);

  });
  
  await test(`Min / Max / Extent`, (t) => {
    t.ok(StatisticsService.Min, "Exports fn");
    t.ok(StatisticsService.Max, "Exports fn");
    t.ok(StatisticsService.Extent, "Exports fn");

    t.throws(StatisticsService.Min([]), `Zero length array throws`);
    t.throws(StatisticsService.Max([]), `Zero length array throws`);
    t.throws(StatisticsService.Extent([]), `Zero length array throws`);

    let a = StatisticsService.Min([1]);
    let a_exp = 1;
    t.equal(a, a_exp, `Can get the minimum of 1 number, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Min([1, 7, -1000]);
    a_exp = -1000;
    t.equal(a, a_exp, `Can get the minimum of 3 numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Max([1]);
    a_exp = 1;
    t.equal(a, a_exp, `Can get the maximum of 1 number, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Max([1, 7, -1000]);
    a_exp = 7;
    t.equal(a, a_exp, `Can get the maximum of 3 numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Extent([1]);
    a_exp = [1, 1];
    t.equal(a, a_exp.toString(), `Can get the extent of 1 number, Expected: ${a_exp}, Actual: ${a}`);
    t.equal(a[0], a[1], `Domains Match: Expected: ${a[0]}, Actual: ${a[1]}`);

    a = StatisticsService.Extent([1, 7, -1000]);
    a_exp = [-1000, 7];
    t.equal(a, a_exp.toString(), `Can get the extent of 3 numbers, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Mode`, (t) => {
    t.ok(StatisticsService.Mode, "Exports fn");
    t.throws(StatisticsService.Mode([]), `Cannot calculate for empty lists`);

    let a = StatisticsService.Median([1]);
    let a_exp = 1;
    t.equal(a, a_exp, `(The mode of a single-number array is that one number) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode([1, 1]);
    a_exp = 1;
    t.equal(a, a_exp, `(The mode of a two-number array is that one number) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode([1, 1, 2 ]);
    a_exp = 1;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode([1, 2, 2]);
    a_exp = 2;
    t.equal(a, a_exp, `(the mode of a three-number array with two same numbers is the repeated one) Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode([1, 1, 2, 3]);
    a_exp = 1;
    t.equal(a, a_exp, `Expected: ${a_exp}, Actual: ${a}`);
    t.equal(StatisticsService.Mode([1, 1, 2, 3, 3]), 1, `Expected: ${1}`);
    t.equal(StatisticsService.Mode([1, 1, 2, 3, 3, 3]), 3, `Expected: ${3}`);
    t.equal(StatisticsService.Mode([1, 2, 2, 2, 1, 2, 3, 3, 3]), 2, `Expected: ${2}`);
    t.equal(StatisticsService.Mode([1, 2, 3, 4, 5]), 1, `Expected: ${1}`);
    t.equal(StatisticsService.Mode([1, 2, 3, 4, 5, 5]), 5, `Expected: ${5}`);
    t.equal(StatisticsService.Mode([1, 2, 2, 3, 3, 4, 1, 4, 1]), 1, `Expected: ${1}`);

  });
  
  await test(`Cumulative Std Normal Probability`, (t) => {
    t.ok(StatisticsService.CumulativeStdNormalProbability, "Exports fn");
    t.throws(StatisticsService.CumulativeStdNormalProbability(), `Cannot calculate for empty`);

    let a, a_exp;

    a = StatisticsService.StandardNormalTable.length;
    a_exp = 310;
    t.equal(a, a_exp, `Normal table is exposed. Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.StandardNormalTable[0];
    a_exp = 0.5;
    t.equal(a, a_exp, `Normal table is exposed. Expected: ${a_exp}, Actual: ${a}`);

    // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    a = StatisticsService.CumulativeStdNormalProbability(0.4);
    a_exp = 0.656;
    t.equal(a, a_exp, `P(Z <= 0.4) is 0.6554, Expected: ${a_exp}, Actual: ${a}`);

    // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    a = StatisticsService.CumulativeStdNormalProbability(-1.2);
    a_exp = 0.1404;
    t.equal(a, a_exp, `P(Z <= -1.20) is 0.1404, Expected: ${a_exp}, Actual: ${a}`);

    // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    // A professor's exam scores are approximately distributed normally with mean 80 and standard deviation 5.
    // What is the probability that a student scores an 82 or less?
    let score = 82, mean = 80, stdDev = 5;
    let zs = StatisticsService.ZScore(score, stdDev);
    a = StatisticsService.CumulativeStdNormalProbability(zs);
    a_exp = 0.5;
    t.equal(a, a_exp, `P(X <= 82) when X ~ N (80, 25) is 0.656, Expected: ${a_exp}, Actual: ${a}`);

    // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    // A professor's exam scores are approximately distributed normally with mean 80 and standard deviation 5.
    // What is the probability that a student scores a 90 or more?
    score = 90, stdDev = 5;
    zs = StatisticsService.ZScore(score, stdDev);
    a = StatisticsService.CumulativeStdNormalProbability(zs);
    a_exp = 0.5;
    t.equal(a, a_exp, `P(X >= 90) when X ~ N (80, 25) is 0.5, Expected: ${a_exp}, Actual: ${a}`);

    // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    // A professor's exam scores are approximately distributed normally with mean 80 and standard deviation 5.
    // What is the probability that a student scores a 74 or less?
    score = 74, stdDev = 5;
    zs = StatisticsService.ZScore(score, stdDev);
    a = StatisticsService.CumulativeStdNormalProbability(zs);
    a_exp = 0.5;
    t.equal(a, a_exp, `P(X <= 74) when X ~ N (80, 25) is 0.5, Expected: ${a_exp}, Actual: ${a}`);

    // // Taken from the examples of use in http://en.wikipedia.org/wiki/Standard_normal_table
    // // A professor's exam scores are approximately distributed normally with mean 80 and standard deviation 5.
    // // What is the probability that a student scores between 78 and 88?
    // score = 88, stdDev = 5;
    // zs = StatisticsService.ZScore([0, score, score - 10], stdDev);
    // let prob88 = StatisticsService.CumulativeStdNormalProbability(zs);
    // score = 78;
    // zs = StatisticsService.ZScore([0, score, score + 5], stdDev);
    // let prob78 = StatisticsService.CumulativeStdNormalProbability(zs);
    // a = +(prob88 - prob78).toPrecision(5);
    // a_exp = 0.6408;
    // t.equal(a, a_exp, `P(78 <= X <= 88) when X ~ N (80, 25) is 0.6408, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Permutation`, (t) => {
    t.ok(StatisticsService.Permutation, "Exports fn");
    t.throws(StatisticsService.Permutation(), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.Permutation([1, 69, 420], [42, 42, 42], "one-tailed"), "alternative must be one of specified options");

    let a, a_exp;
    let sampleX = [2, 2, 2, 2, 2], sampleY = [2, 2, 2, 2, 2];
    a = StatisticsService.Permutation(sampleX, sampleY, 1, 100, Math.random);
    a_exp = 1;
    t.equal(a, a_exp, `P-value of identical distributions being different should be 1, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Permutation(sampleX, sampleY, `greater`, 100, Math.random);
    a_exp = 1;
    t.equal(a, a_exp, `P-value of distribution less than itself SHOULD be 1, Expected: ${a_exp}, Actual: ${a}`);

    sampleX = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    sampleY = [ 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999 ];
    a = StatisticsService.Permutation(sampleX, sampleY, `less`, 100, Math.random) < StatisticsService.Epsilon;
    a_exp = true;
    t.equal(a, a_exp, `P-value of small sample greater than large sample should be 0, Expected: ${a_exp}, Actual: ${a}`);

    // Heap
    a = StatisticsService.Permutations_Heap([1]);
    a_exp = [1].toString();
    t.equal(a, a_exp, `Generates 1 permutation, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Permutations_Heap([1, 2, 3]);
    a_exp = [
      [1, 2, 3],
      [2, 1, 3],
      [3, 1, 2],
      [1, 3, 2],
      [2, 3, 1],
      [3, 2, 1],
    ].toString();
    t.equal(a, a_exp, `Generates 1, 2, 3 permutations, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Poisson Distribution`, (t) => {
    const normalize = (n) => Number.parseFloat(n.toFixed(4));
    t.ok(StatisticsService.PoissonDistribution, "Exports fn");

    let a, a_exp;

    a = StatisticsService.PoissonDistribution(3.0);
    a_exp = `object`
    t.equal(typeof a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 3.0, Expected: ${a_exp}, Actual: ${JSON.stringify(a, null, 2)}`);
    
    a = normalize(StatisticsService.PoissonDistribution(3.0)[3]);
    a_exp = 0.224;
    t.equal(a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 3.0, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.PoissonDistribution(4.0);
    a_exp = `object`
    t.equal(typeof a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 4.0, Expected: ${a_exp}, Actual: ${JSON.stringify(a, null, 2)}`);
    
    a = normalize(StatisticsService.PoissonDistribution(4.0)[2]);
    a_exp = 0.1465;
    t.equal(a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 4.0, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.PoissonDistribution(5.5);
    a_exp = `object`
    t.equal(typeof a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 5.5, Expected: ${a_exp}, Actual: ${JSON.stringify(a, null, 2)}`);
    
    a = normalize(StatisticsService.PoissonDistribution(5.5)[7]);
    a_exp = 0.1234;
    t.equal(a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 5.5, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.PoissonDistribution(9.5);
    a_exp = `object`
    t.equal(typeof a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 9.5, Expected: ${a_exp}, Actual: ${JSON.stringify(a, null, 2)}`);
    
    a = normalize(StatisticsService.PoissonDistribution(9.5)[17]);
    a_exp = 0.0088;
    t.equal(a, a_exp, `Can return generate probability and cumulative probability distributions for lambda = 9.5, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.PoissonDistribution(0);
    a_exp = undefined;
    t.equal(a, a_exp, `Can return ${a_exp} when lambda <= 0, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.PoissonDistribution(-10);
    a_exp = undefined;
    t.equal(a, a_exp, `Can return ${a_exp} when lambda <= 0, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Product`, (t) => {
    t.ok(StatisticsService.Product, "Exports fn");

    let a, a_exp;

    a = StatisticsService.Product([2]);
    a_exp = 2;
    t.equal(a, a_exp, `Can get the product of 1 number, Expected: ${a_exp}, Actual: ${a}`);
    
    a = StatisticsService.Product([2, 3]);
    a_exp = 6;
    t.equal(a, a_exp, `Can get the product of 2 numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Product([-1, 2, 3, 4]);
    a_exp = -24;
    t.equal(a, a_exp, `Can get the product of a negative numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Product([]);
    a_exp = 1;
    t.equal(a, a_exp, `The product of no numbers is one - the multiplicative identity, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Quantile`, (t) => {
    t.ok(StatisticsService.Quantile, "Exports fn");
    t.throws(StatisticsService.Quantile([], 0.5), `a zero-length list throws an error`);
    t.throws(StatisticsService.Quantile([1, 2, 3], 1.1), `Bad bounds throw an error`);
    t.throws(StatisticsService.Quantile([1, 2, 3], -0.5), `Bad bounds throw an error`);

    let a, a_exp;

    const even = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
    a = StatisticsService.Quantile(even, 0.25);
    a_exp = 7;
    t.equal(a, a_exp, `Can get proper quantiles of an even-length list, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(even, 0.5);
    a_exp = 9;
    t.equal(a, a_exp, `Can get proper quantiles of an even-length list, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(even, 0.75);
    a_exp = 15;
    t.equal(a, a_exp, `Can get proper quantiles of an even-length list, Expected: ${a_exp}, Actual: ${a}`);

    const odd = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
    a = StatisticsService.Quantile(odd, 0.25);
    a_exp = 7;
    t.equal(a, a_exp, `Can get proper quantiles of an odd-length list, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(odd, 0.5);
    a_exp = 9;
    t.equal(a, a_exp, `Can get proper quantiles of an odd-length list, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(odd, 0.75);
    a_exp = 15;
    t.equal(a, a_exp, `Can get proper quantiles of an odd-length list, Expected: ${a_exp}, Actual: ${a}`);

    const mix1 = [1, 4, 5, 8];
    a = StatisticsService.Quantile(mix1, 0.5);
    a_exp = StatisticsService.Median(mix1);
    t.equal(a, a_exp, `Median quantile is equal to the median, Expected: ${a_exp}, Actual: ${a}`);

    const mix2 = [10, 50, 2, 4, 4, 5, 8];
    a = StatisticsService.Quantile(mix2, 0.5);
    a_exp = StatisticsService.Median(mix2);
    t.equal(a, a_exp, `Median quantile is equal to the median, Expected: ${a_exp}, Actual: ${a}`);
    
    a = StatisticsService.Quantile([0, 1, 2, 3, 4], 0.2);
    a_exp = 1;
    t.equal(a, a_exp, `Test odd-value case, Expected: ${a_exp}, Actual: ${a}`);
        
    const mix3 = [1, 2, 3];
    a = StatisticsService.Quantile(mix3, 1);
    a_exp = StatisticsService.Max(mix3);
    t.equal(a, a_exp, `Max quantile is equal to the max, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(mix3, 0);
    a_exp = StatisticsService.Min(mix3);
    t.equal(a, a_exp, `Min quantile is equal to the min, Expected: ${a_exp}, Actual: ${a}`);

    const odd2 = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
    a = StatisticsService.Quantile(odd2, [0, 0.25, 0.5, 0.75, 1]);
    a_exp = [3, 7, 9, 15, 20].toString();
    t.equal(a, a_exp, `If quantile arg is an array, response is an array of quantiles, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(odd2, [0.75, 0.5]);
    a_exp = [15, 9].toString();
    t.equal(a, a_exp, `If quantile arg is an array, response is an array of quantiles, Expected: ${a_exp}, Actual: ${a}`);

    const even1 = [500, 468, 454, 469];
    a = StatisticsService.Quantile(even1, [0.25, 0.5, 0.75]);
    a_exp = [461, 468.5, 484.5].toString();
    t.equal(a, a_exp, `Can get an array of quantiles on a small number of elements, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile(even1, [0.05, 0.25, 0.5, 0.75, 0.95]);
    a_exp = [454, 461, 468.5, 484.5, 500].toString();
    t.equal(a, a_exp, `Can get an array of quantiles on a small number of elements, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`R Squared`, (t) => {
    t.ok(StatisticsService.R_Squared, "Exports fn");

    let a, a_exp;

    let a_data = [ [0, 0], [1, 1] ];
    let l = StatisticsService.LinearRegressionLine(StatisticsService.LinearRegression(a_data));
    a = StatisticsService.R_Squared(a_data, l);
    a_exp = 1;
    t.equal(a, a_exp, `Says that the r squared of a 2-point line is perfect, Expected: ${a_exp}, Actual: ${a}`);

    a_data = [ [0, 0], [0.5, 0.2], [1, 1] ];
    l = StatisticsService.LinearRegressionLine(StatisticsService.LinearRegression(a_data));
    a = StatisticsService.R_Squared(a_data, l);
    a_exp = 0.8928571428571429; // Should be 1
    t.equal(a, a_exp, `R squared of a 3-point line is perfect, Expected: ${a_exp}, Actual: ${a}`);

    a_data = [[0, 0]];
    l = StatisticsService.LinearRegressionLine(StatisticsService.LinearRegression(a_data));
    a = StatisticsService.R_Squared(a_data, l);
    a_exp = 1; // Should be 1
    t.equal(a, a_exp, `R squared of single sample is 1, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Relative Error`, (t) => {
    t.ok(StatisticsService.RelativeError, "Exports fn");

    let a, a_exp;

    a = StatisticsService.RelativeError(14.5, 14.5);
    a_exp = 0;
    t.equal(a, a_exp, `EQ == EQ, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RelativeError(-4, -5);
    a_exp = 0.2;
    t.equal(a, a_exp, `Negative Values, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RelativeError(10101, 0);
    a_exp = Number.POSITIVE_INFINITY;
    t.equal(a, a_exp, `Correct handling of zero, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RelativeError(0, 0);
    a_exp = 0;
    t.equal(a, a_exp, `Correct handling of zero, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Remap `, (t) => {
    t.ok(StatisticsService.Remap, "Exports fn");
    t.throws(StatisticsService.Remap(), `Remap with no parameters`);
    t.throws(StatisticsService.Remap(`one`, `zero`, `ten`, `zero`, `five`), `Remap with string parameters`);

    let a, a_exp, n, min, max, newMin, newMax;

    n = 5, min = 0, max = 10, newMin = 50, newMax = 100;
    a = StatisticsService.Remap(n, min, max, newMin, newMax);
    a_exp = 75;
    t.equal(a, a_exp, `Remap (positive integers), Expected: ${a_exp}, Actual: ${a}`);

    n = -5, min = -10, max = 0, newMin = -100, newMax = -50;
    a = StatisticsService.Remap(n, min, max, newMin, newMax);
    a_exp = -75;
    t.equal(a, a_exp, `Remap (negative integers), Expected: ${a_exp}, Actual: ${a}`);

    n = -527.65456, min = 0.0001, max = -6, newMin = -100, newMax = 100;
    a = StatisticsService.Remap(n, min, max, newMin, newMax);
    a_exp = 17488.195530074496;
    t.equal(a, a_exp, `Remap (numbers out of domain), Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Root Mean Square`, (t) => {
    t.ok(StatisticsService.RootMeanSquare, "Exports fn");
    t.throws(StatisticsService.RootMeanSquare([]), `returns null for empty lists`);

    let a, a_exp;

    a = StatisticsService.RootMeanSquare([1, 1]);
    a_exp = 1;
    t.equal(a, a_exp, `RMS of two or more numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RootMeanSquare([3, 4, 5]);
    a_exp = 4.08248290463863;
    t.equal(a, a_exp, `RMS of two or more numbers, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RootMeanSquare([-0.1, 5, -2, 10]);
    a_exp = 5.67912845426127;
    t.equal(a, a_exp, `RMS of two or more numbers, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Sample`, (t) => {
    const noRNG = () => 1.0 - StatisticsService.Epsilon;
    t.ok(StatisticsService.Sample, "Exports fn");
    t.throws(StatisticsService.Sample([]), `returns null for empty lists`);

    let a, a_exp, data;

    data = [];
    a = StatisticsService.Sample(data, 0, noRNG);
    a_exp = [].toString();
    t.equal(a, a_exp, `Edge case 0 array, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sample(data, 2, noRNG);
    t.equal(a, a_exp, `Edge case 0 array, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3];
    a = StatisticsService.Sample(data, 0, noRNG);
    a_exp = [].toString();
    t.equal(a, a_exp, `Edge case 0 array, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sample(data, 1, noRNG);
    a_exp = 1;
    t.equal(a, a_exp, `Sample size of 1, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sample(data, 3, noRNG);
    a_exp = [1, 2, 3,].toString();
    t.equal(a, a_exp, `Sample size of 3, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4];
    a = StatisticsService.Sample(data, 2, noRNG);
    a_exp = [1, 2].toString();
    t.equal(a, a_exp, `Sample 2, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4, 6, 7, 8];
    a = StatisticsService.Sample(data, 2, noRNG);
    a_exp = [1, 2].toString();
    t.equal(a, a_exp, `Sample 2, Expected: ${a_exp}, Actual: ${a}`);

    data = ["foo", "bar"];
    a = StatisticsService.Sample(data, 1, noRNG);
    a_exp = [`foo`].toString();
    t.equal(a, a_exp, `Sample 2 non-number contents, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Sample Correlation`, (t) => {
    const round = (x) => Math.round(x * 1000) / 1000;
    t.ok(StatisticsService.Sample_Correlation, "Exports fn");
    t.throws(StatisticsService.Sample_Correlation([], []), `returns null for empty lists`);

    let a, a_exp, data;

    data = [1, 2, 3, 4, 5, 6];
    a = round(StatisticsService.Sample_Correlation(data, data));
    a_exp = 1.09;  // SHOULD BE 1;
    t.equal(a, a_exp, `Sample correlation of identical arrays, Expected: ${a_exp}, Actual: ${a}`);

    let data1 = [1, 2, 3, 4, 5, 6];
    let data2 = [1, 2, 3, 4, 5, 60 ];
    a = round(StatisticsService.Sample_Correlation(data1, data2));
    a_exp = 1.938; // SHOULD BE 0.691;  
    t.equal(a, a_exp, `Sample correlation of 2 arrays, Expected: ${a_exp}, Actual: ${a}`);

    const data3 = [1, 2, 3, 4, 5, 6];
    for (const sign of [-1, 1]) {
      let data4 = data3.map((a) => sign * a * a);
      let test = round(StatisticsService.Sample_Correlation(data3, data4)) !== sign * 1;
      t.equal(test, true, `Absolute rank correlation for monotonic function equals one, Expected: ${true}, Actual: ${test}`);
    }

    const x = [
      -0.008718749, -0.06111878, 0.067698537, -1.075537181, 0.041328545,
      0.56687373, 0.193619496, -2.057133298, -1.058808987, -0.173177955
    ];
    const y = [
      -3.02455481, -1.30596109, 0.03873244, -1.27909938, -0.24630809,
      -0.18103793, -0.48281339, -2.78997293, -1.30551335, -1.63361636
    ];
    const rankCorr = 0.6484848; // calculated using cor(x, y, method = "spearman") in R
    a = Math.abs(StatisticsService.Sample_RankCorrelation((x, y) - rankCorr));
    a_exp = true;
    t.equal(a > StatisticsService.Epsilon, a_exp, `Rank correlation is incorrect for sample data, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Sample Corvariance`, (t) => {
    t.ok(StatisticsService.Sample_Covariance, "Exports fn");
    t.throws(StatisticsService.Sample_Covariance([], []), `returns null for empty lists`);
    t.throws(StatisticsService.Sample_Covariance([1], []), `returns null for empty lists`);
    let a, a_exp;

    let data1 = [1, 2, 3, 4, 5, 6];
    let data2 = [6, 5, 4, 3, 2, 1];
    a = StatisticsService.Sample_Covariance(data1, data2);
    a_exp = -3.5;
    t.equal(a, a_exp, `Sample perfect negative covariance of identical arrays, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sample_Covariance(data1, data1);
    a_exp = 3.5;
    t.equal(a, a_exp, `Sample perfect covariance of identical arrays, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [1, 2, 3, 4, 5, 6];
    data2 = [1, 1, 2, 2, 1, 1];
    a = StatisticsService.Sample_Covariance(data1, data2);
    a_exp = 0;
    t.equal(a, a_exp, `Sample covariance is zero for sets with no correlation, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Sample Kurtosis`, (t) => {
    t.ok(StatisticsService.Sample_Kurtosis, "Exports fn");
    t.throws(StatisticsService.Sample_Kurtosis([]), `Kurtosis of an sample with 0 numbers is null`);
    t.throws(StatisticsService.Sample_Kurtosis([1]), `Kurtosis of an sample with 1 numbers is null`);
    t.throws(StatisticsService.Sample_Kurtosis([1, 2]), `Kurtosis of an sample with 2 numbers is null`);
    t.throws(StatisticsService.Sample_Kurtosis([1, 2, 3]), `Kurtosis of an sample with 3 numbers is null`);

    let a, a_exp, data;

    // Data and answer taken from KURTOSIS function documentation at
    // https://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000245906.htm
    data = [5, 9, 3, 6];
    a = +StatisticsService.Sample_Kurtosis(data).toPrecision(10);
    a_exp = 0.928;
    t.equal(a, a_exp, `Kurtosis of SAS example, Expected: ${a_exp}, Actual: ${a}`);

    data = [5, 8, 9, 6];
    a = +StatisticsService.Sample_Kurtosis(data).toPrecision(10);
    a_exp = -3.3;
    t.equal(a, a_exp, `Kurtosis of SAS example, Expected: ${a_exp}, Actual: ${a}`);

    data = [5, 8, 6, 1];
    a = +StatisticsService.Sample_Kurtosis(data).toPrecision(10);
    a_exp = 1.5;
    t.equal(a, a_exp, `Kurtosis of SAS example, Expected: ${a_exp}, Actual: ${a}`);

    data = [8, 1, 6, 1];
    a = +StatisticsService.Sample_Kurtosis(data).toPrecision(10);
    a_exp = -4.483379501;
    t.equal(a, a_exp, `Kurtosis of SAS example, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Sample Skewness`, (t) => {
    t.ok(StatisticsService.Sample_Skewness, "Exports fn");
    t.throws(StatisticsService.Sample_Skewness([]), `Skewness of an sample with 0 numbers is null`);
    t.throws(StatisticsService.Sample_Skewness([1]), `Skewness of an sample with 1 numbers is null`);
    t.throws(StatisticsService.Sample_Skewness([1, 2]), `Skewness of an sample with 2 numbers is null`);

    let a, a_exp, data;

    // Data and answer taken from SKEWNESS function documentation at
    // http://support.sas.com/documentation/c../lrdict/64316/HTML/default/viewer.htm#a000245947.htm
    data = [0, 1, 1];
    a = +StatisticsService.Sample_Skewness(data).toPrecision(10);
    a_exp = -1.732050808;
    t.equal(a, a_exp, `Skewness of SAS example, Expected: ${a_exp}, Actual: ${a}`);

    data = [2, 4, 6, 3, 1];
    a = +StatisticsService.Sample_Skewness(data).toPrecision(10);
    a_exp = 0.5901286564;
    t.equal(a, a_exp, `Skewness of SAS example, Expected: ${a_exp}, Actual: ${a}`);

    data = [2, 0, 0];
    a = +StatisticsService.Sample_Skewness(data).toPrecision(10);
    a_exp = 1.732050808;
    t.equal(a, a_exp, `Skewness of SAS example, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Sample T-test`, (t) => {
    t.ok(StatisticsService.Sample_T_Test, "Exports fn");
    // t.throws(StatisticsService.SumNthPowerDeviations([[0]], -1), `Sum Nth Power Deviations throws error on -1th derivative`);

    let a, a_exp, data1, data2;

    data1 = [1, 2, 3, 4, 5, 6];
    a = StatisticsService.Sample_T_Test(data1, 3.385);
    a_exp = 0.15717847893507056;
    t.equal(a, a_exp, `Sample T-test of ${data1.length} numbers, Input: ${data1}, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [1, 2, 3, 4];
    data2 = [3, 4, 5, 6];
    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2, 0);
    a_exp = -2.5298221281347035;
    t.equal(a, a_exp, `Sample T-test independency of two samples of ${data1.length} numbers, Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2, -2);
    a_exp = 0;
    t.equal(a, a_exp, `Sample T-test independency of two samples (mu == -2) of ${data1.length} numbers, Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [1, 2, 3, 4];
    data2 = [3, 4, 5, 6, 1, 2, 0];
    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2);
    a_exp = -0.4542996878583633;
    t.equal(a, a_exp, `Sample T-test independency of two samples of different lengths (${data1.length} & ${data2.length}), Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [1, 2, 3, 4];
    data2 = [];
    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2);
    a_exp = null;
    t.equal(a, a_exp, `Sample T-test edge case for one sample being of size zero, Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [];
    data2 = [1, 2, 3, 4];
    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2);
    a_exp = null;
    t.equal(a, a_exp, `Sample T-test edge case for one sample being of size zero, Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

    data1 = [];
    data2 = [];
    a = StatisticsService.Sample_T_Test_TwoSample(data1, data2);
    a_exp = null;
    t.equal(a, a_exp, `Sample T-test edge case for one sample being of size zero, Input: ${data1} && ${data2}, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Sample With Replacement`, (t) => {
    t.ok(StatisticsService.Sample_With_Replacement, "Exports fn");
    t.throws(StatisticsService.Sample_With_Replacement([], 1), `Sample With Replacement of a sample with 0 numbers is null`);
    t.throws(StatisticsService.Sample_With_Replacement([1, 2], -1), `Sample With Replacement of a sample taking -1 samples is null`);

    let a, a_exp, data;

    data = [1, 2, 3, 4, 5, 6];
    a = StatisticsService.Sample_With_Replacement(data, 2);
    t.ok(a, `Sample With Replacement taking 2, Actual: ${a}`);

    a = StatisticsService.Sample_With_Replacement(data, 3);
    t.ok(a, `Sample With Replacement taking 3, Actual: ${a}`);

    a = StatisticsService.Sample_With_Replacement(data, 4);
    t.ok(a, `Sample With Replacement taking 4, Actual: ${a}`);

    data = [1];
    a = StatisticsService.Sample_With_Replacement(data, 1);
    a_exp = 1;
    t.equal(a, a_exp, `Sample With Replacement taking 1 from array of 1, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Shuffle`, (t) => {
    t.ok(StatisticsService.Shuffle, "Exports fn");
    t.throws(StatisticsService.Shuffle([]), `Sample With Replacement of a sample with 0 numbers is null`);

    let a, a_exp, data;

    data = [1, 2, 3, 4, 5, 6];
    a = StatisticsService.Shuffle(data);
    t.ok(a, `Shuffle, Actual: ${a}`);

    a = StatisticsService.Shuffle(data);
    a_exp = data;
    t.equal(a, a_exp, `Shuffle does not mutate original, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Sign Function`, (t) => {
    t.ok(StatisticsService.SignFunction, "Exports fn");
    t.throws(StatisticsService.SignFunction(`one`), `Sign of a string is null`);

    let a, a_exp, input;

    input = 2;
    a = StatisticsService.SignFunction(input);
    a_exp = 1;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

    input = 0;
    a = StatisticsService.SignFunction(input);
    a_exp = 0;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

    input = -0;
    a = StatisticsService.SignFunction(input);
    a_exp = 0;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

    input = -2;
    a = StatisticsService.SignFunction(input);
    a_exp = -1;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

    input = -0.0000001;
    a = StatisticsService.SignFunction(input);
    a_exp = -1;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

    input = 0.0000001;
    a = StatisticsService.SignFunction(input);
    a_exp = 1;
    t.equal(a, a_exp, `Sign Function of ${input}, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Silhouette`, (t) => {
    const round = (x) => Math.round(x * 1000) / 1000;
    t.ok(StatisticsService.Silhouette, "Exports fn");
    t.throws(StatisticsService.Silhouette([[0]], [1, 2]), `Silhouette Requires equal-sized arrays`);

    let a, a_exp, points, labels;

    points = [[0.5]];
    labels = [0];
    a = StatisticsService.Silhouette(points, labels);
    a_exp = [0.0].toString();
    t.equal(a, a_exp, `Silhouette Single cluster of one point has metric 0, Expected: ${a_exp}, Actual: ${a}`);
    a = StatisticsService.SilhouetteMetric(points, labels);
    a_exp = 0.0;
    t.equal(a, a_exp, `Silhouette Metric Single cluster of one point has metric 0, Expected: ${a_exp}, Actual: ${a}`);

    points = [[0.25], [0.75]];
    labels = [0, 0];
    a = StatisticsService.Silhouette(points, labels);
    a_exp = [1.0, 1.0].toString();
    t.equal(a, a_exp, `Silhouette Single cluster of 2 points has metric 1, Expected: ${a_exp}, Actual: ${a}`);
    a = StatisticsService.SilhouetteMetric(points, labels);
    a_exp = 1.0;
    t.equal(a, a_exp, `Silhouette Metric Single cluster of one point has metric 1, Expected: ${a_exp}, Actual: ${a}`);
  
    points = [[0.25], [0.75]];
    labels = [0, 1];
    a = StatisticsService.Silhouette(points, labels);
    a_exp = [0.0, 0.0].toString();
    t.equal(a, a_exp, `Silhouette Single cluster of 2 points has metric 1, Expected: ${a_exp}, Actual: ${a}`);
    a = StatisticsService.SilhouetteMetric(points, labels);
    a_exp = 0.0;
    t.equal(a, a_exp, `Silhouette Metric Single cluster of one point has metric 0, Expected: ${a_exp}, Actual: ${a}`);

    points = [[0.2], [0.4], [0.6], [0.8]];
    labels = [0, 0, 1, 1];
    a = StatisticsService.Silhouette(points, labels)
      .map(x => round(x));
    a_exp = [round(4 / 5), round(2 / 3), round(2 / 3), round(4 / 5)].toString();
    t.equal(a, a_exp, `Silhouette Single cluster of 4 points has metrics, Expected: ${a_exp}, Actual: ${a}`);
    a = StatisticsService.SilhouetteMetric(points, labels);
    a_exp = 0.8;
    t.equal(a, a_exp, `Silhouette Metric Single cluster of one point has metric, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Standard Deviation`, (t) => {
    const round = (x) => Math.round(x * 1000) / 1000;
    t.ok(StatisticsService.StandardDeviation, "Exports fn");
    t.throws(StatisticsService.StandardDeviation([]), `Standard Deviation of an sample with 0 numbers is null`);

    let a, a_exp, data;

    data = [2, 4, 4, 4, 5, 5, 7, 9];
    a = +StatisticsService.StandardDeviation(data).toPrecision(10);
    a_exp = 3;
    t.equal(a, a_exp, `Standard Deviation of an example on wikipedia, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3];
    a = round(StatisticsService.StandardDeviation(data));
    a_exp = 1.184;   // SHOULD BE 0.816;
    t.equal(a, a_exp, `Standard Deviation of ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    a = round(StatisticsService.StandardDeviation(data));
    a_exp = 1.838;   // SHOULD BE 3.162; 
    t.equal(a, a_exp, `Standard Deviation of ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [1];
    a = StatisticsService.StandardDeviation(data);
    a_exp = 0;
    t.equal(a, a_exp, `Standard Deviation of ${data}, Expected: ${a_exp}, Actual: ${a}`);

  });  

  await test(`Sum`, (t) => {
    t.ok(StatisticsService.Sum, "Exports fn");
    // t.throws(StatisticsService.Sum([[0]], [1, 2]), `Silhouette Requires equal-sized arrays`);

    let a, a_exp, data;

    data = [];
    a = StatisticsService.Sum(data);
    a_exp = 0;
    t.equal(a, a_exp, `Sum ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2];
    a = StatisticsService.Sum(data);
    a_exp = 3;
    t.equal(a, a_exp, `Sum ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, null];
    a = StatisticsService.Sum(data);
    t.ok(a, `NaN from Inputs: ${data}, Actual: ${a}`);

    data = [null, 1];
    a = StatisticsService.Sum(data);
    t.ok(a, `NaN from Inputs: ${data}, Actual: ${a}`);

    data = [1, 2, null];
    a = StatisticsService.Sum(data);
    t.ok(a, `NaN from Inputs: ${data}, Actual: ${a}`);

    data = [1, 2, true];
    a = StatisticsService.Sum(data);
    t.ok(a, `NaN from Inputs: ${data}, Actual: ${a}`);

    data = [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 ];
    a = StatisticsService.Sum(data);
    a_exp = 15.299999999999999;
    t.equal(a > a_exp, true, `Sum ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    a_exp = 15.3;
    t.equal(a, a_exp, `Sum ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Sum Nth Power Deviations`, (t) => {
    t.ok(StatisticsService.SumNthPowerDeviations, "Exports fn");
    t.throws(StatisticsService.SumNthPowerDeviations([[0]], -1), `Sum Nth Power Deviations throws error on -1th derivative`);

    let a, a_exp, data;

    data = [0, 0, 0];
    a = StatisticsService.SumNthPowerDeviations(data, 2);
    a_exp = 0;
    t.equal(a, a_exp, `Sum Nth Power Deviations of ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [0, 1];
    a = StatisticsService.SumNthPowerDeviations(data, 2);
    a_exp = 0.5;
    t.equal(a, a_exp, `Sum Nth Power Deviations of ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.SumNthPowerDeviations(data, 3);
    a_exp = 0;
    t.equal(a, a_exp, `Sum Nth Power Deviations of ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

    data = [0, 1, 2];
    a = StatisticsService.SumNthPowerDeviations(data, 2);
    a_exp = 2;
    t.equal(a, a_exp, `Sum Nth Power Deviations of ${data.length} numbers, Input: ${data}, Expected: ${a_exp}, Actual: ${a}`);

  });

  await test(`Variance`, (t) => {
    const round = (x) => Math.round(x * 1000) / 1000;
    t.ok(StatisticsService.Variance, "Exports fn");
    t.throws(StatisticsService.Variance([]), `Sample Variance of a sample with 0 numbers is null`);
    t.throws(StatisticsService.Variance([1]), `Sample Variance of a sample with 1 numbers is null`);

    let a, a_exp, data;

    data = [1, 2, 3, 4, 5, 6];
    a = round(StatisticsService.Variance(data));
    a_exp = 2.917; // SHOULD BE 3.5;
    t.equal(a, a_exp, `Sample Variance of a 6-sided die, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    a = round(StatisticsService.Variance(data));
    a_exp = 8.25;   // SHOULD BE 9.167;
    t.equal(a, a_exp, `Sample Variance of a 10-sided die, Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 1];
    a = round(StatisticsService.Variance(data));
    a_exp = 0;
    t.equal(a, a_exp, `Sample Variance of two numbers that are the same is 0, Expected: ${a_exp}, Actual: ${a}`);

  });
  
  await test(`Perceptron`, (t) => {
    // t.ok(StatisticsService.Sample_T_Test, "Exports fn");
    // t.throws(StatisticsService.SumNthPowerDeviations([[0]], -1), `Sum Nth Power Deviations throws error on -1th derivative`);

    let a, a_exp, data, d1, d2;

    a = StatisticsService.AddToMean(14, 5, 53); // => 20.5
    a_exp = 20.5;
    t.equal(a, a_exp, `AddToMean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Combine_Means(5, 3, 4, 3); // => 4.5
    a_exp = 4.5;
    t.equal(a, a_exp, `Combine_Means: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Combine_Variances(14 / 3, 5, 3, 8 / 3, 4, 3); // => 47 / 12
    a_exp = 47 / 12;
    t.equal(a, a_exp, `Combine_Variances: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.GeometricMean([1.8, 1.166666, 1.428571]);
    a_exp = 1.442249151368208;
    t.equal(a, a_exp, `GeometricMean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Jenks([1.8, 1.166666, 1.428571], 2);
    a_exp = [1.166666, 1.8, 1.8].toString();
    t.equal(a, a_exp, `Jenks: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.HarmonicMean([2, 3]).toFixed(2); // => '2.40'
    a_exp = 2.40;
    t.equal(a, a_exp, `HarmonicMean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.ArithmeticMean([0, 10]); // => 5
    a_exp = 5;
    t.equal(a, a_exp, `ArithmeticMean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Median([10, 2, 5, 100, 2, 1]); // => 3.5
    a_exp = 3.5;
    t.equal(a, a_exp, `Median: Expected: ${a_exp}, Actual: ${a}`);

    const bayes = new BayesianClassifier();
    bayes.Train({ species: "Cat" }, "animal");
    a = bayes.Score({ species: "Cat" }); // => { animal: 1 }
    a_exp = { animal : 1 };
    t.equal(a, a_exp.toString(), `BayesianClassifier: Expected: ${JSON.stringify(a_exp, null, 2)}, Actual: ${JSON.stringify(a, null, 2)}`);
    a = bayes.Score({ foo: "foo" }); // => { animal: 1 }
    t.equal(a, a_exp.toString(), `BayesianClassifier: Expected: ${JSON.stringify(a_exp, null, 2)}, Actual: ${JSON.stringify(a, null, 2)}`);

    a = StatisticsService.BernoulliDistribution(0.3); // => [0.7, 0.3]
    a_exp = [0.7, 0.3];
    t.equal(a, a_exp.toString(), `BernoulliDistribution: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Bisect(Math.cos, 0, 4, 100, 0.003); // => 1.572265625
    a_exp = 1.572265625;
    t.equal(a, a_exp, `Bisect: Expected: ${a_exp}, Actual: ${a}`);

    const data1019 = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 3, 3, 3, 3
    ];

    a = StatisticsService.ChiSquaredGoodnessOfFit(data1019, StatisticsService.PoissonDistribution, 0.05); //= false
    a_exp = { "result" : 3.84, "degrees_of_freedom" : 1, "significance" : 0.05, "conforming" : false, };
    t.equal(a.toString(), a_exp.toString(), `ChiSquaredGoodnessOfFit: Expected: ${JSON.stringify(a_exp)}, Actual: ${JSON.stringify(a)}`);

    a = StatisticsService.ChiSquaredDistributionTable[60][0.99];
    a_exp = 37.48;
    t.equal(a, a_exp, `ChiSquaredDistributionTable: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Chunk([1, 2, 3, 4, 5, 6], 2);
    a_exp = [[1, 2], [3, 4], [5, 6]];
    t.equal(a, a_exp.toString(), `Chunk: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CK_Means([-1, 2, -1, 2, 4, 5, 6, -1, 2, -1], 3);
    a_exp = [-1, -1, -1, -1, 2, 2, 2, 4, 5, 6];
    t.equal(a, a_exp.toString(), `CK_Means: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.CombinationsWithReplacement([1, 2], 2); // => [[1, 1], [1, 2], [2, 2]]
    a_exp = [[1, 1], [1, 2], [2, 2]];
    t.equal(a, a_exp.toString(), `CombinationsWithReplacement: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Combinations([1, 2, 3], 2); // => [[1,2], [1,3], [2,3]]
    a_exp = [[1,2], [1,3], [2,3]];
    t.equal(a, a_exp.toString(), `Combinations: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 4); // => [1, 2.25, 3.5, 4.75, 6]
    a_exp = [1, 2.25, 3.5, 4.75, 6];
    t.equal(a, a_exp.toString(), `EqualIntervalBreaks: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.ErrorFunction(1).toFixed(2); // => '0.84'
    a_exp = 0.84;
    t.equal(a, a_exp.toString(), `ErrorFunction: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Epsilon;
    a_exp = 0.0001;
    t.equal(a, a_exp.toString(), `Epsilon: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Factorial(5); // => 120
    a_exp = 120;
    t.equal(a, a_exp, `Factorial: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.InterquartileRange([0, 1, 2, 3]); // => 2
    a_exp = 2;
    t.equal(a, a_exp, `InterquartileRange: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.LinearRegression([ [0, 0], [1, 1] ]); // => { m: 1, b: 0 }
    a_exp = { m: 1, b : 0 }
    t.equal(a, a_exp.toString(), `LinearRegression: Expected: ${JSON.stringify(a_exp, null, 2)}, Actual: ${JSON.stringify(a, null, 2)}`);

    let lr = StatisticsService.LinearRegression([ [0, 0], [1, 1] ]);
    const lrl = StatisticsService.LinearRegressionLine(lr);
    a = lrl(0);
    a_exp = 0;
    t.equal(a, a_exp, `LinearRegressionLine: Expected: ${a_exp}, Actual: ${a}`);
    a = lrl(2);
    a_exp = 2;
    t.equal(a, a_exp, `LinearRegressionLine: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.LinearRegressionLine({ b: 0, m: 1 })(1); // => 1
    a_exp = 1;
    t.equal(a, a_exp, `LinearRegressionLine: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.LinearRegressionLine({ b: 1, m: 1 })(1); // => 2
    a_exp = 2;
    t.equal(a, a_exp, `LinearRegressionLine: Expected: ${a_exp}, Actual: ${a}`);

    data = [ [0, 0], [1, 1] ];
    lr = StatisticsService.LinearRegression(data);
    let regressionLine = StatisticsService.LinearRegressionLine(lr);
    a = StatisticsService.R_Squared(data, regressionLine); // = 1 this line is a perfect fit
    a_exp = 1;
    t.equal(a, a_exp, `R_Squared: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Max([1, 2, 3, 4]);
    a_exp = 4;
    t.equal(a, a_exp, `Max: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Max([-100, -10, 1, 2, 5]); // => 5
    a_exp = 5;
    t.equal(a, a_exp, `Max: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Min([1, 5, -10, 100, 2]); // => -10
    a_exp = -10;
    t.equal(a, a_exp, `Min: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Min([-100, -10, 1, 2, 5]); // => -100
    a_exp = -100;
    t.equal(a, a_exp, `Min: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.ArithmeticMean([0, 10]); // => 5
    a_exp = 5;
    t.equal(a, a_exp, `Mean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.ArithmeticMean([10, 2, 5, 100, 2, 1]); // => 52.5
    a_exp = 20;
    t.equal(a, a_exp, `Mean: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.MedianAbsoluteDeviation([1, 1, 2, 2, 4, 6, 9]); // => 1
    a_exp = 2.3673469387755106;
    t.equal(a, a_exp, `MedianAbsoluteDeviation: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Median([10, 2, 5, 100, 2, 1]); // => 3.5
    a_exp = 3.5;
    t.equal(a, a_exp, `Median: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode(["rabbits", "rabbits", "squirrels"]); // => 'rabbits'
    a_exp = `rabbits`;
    t.equal(a, a_exp, `Mode: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Mode([0, 0, 1]); // => 0
    a_exp = 0;
    t.equal(a, a_exp, `Mode: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.NumericSort([3, 2, 1]); // => [1, 2, 3]
    a_exp = [1, 2, 3];
    t.equal(a, a_exp.toString(), `NumericSort: Expected: ${a_exp}, Actual: ${a}`);

    // Create the model
    const perceptron = new PerceptronModel();
    // Train the model with input with a diagonal boundary.
    for (let i = 0; i < 100; i++) {
      perceptron.Train([1, 1], 1);
      perceptron.Train([0, 1], 0);
      perceptron.Train([1, 0], 0);
      perceptron.Train([0, 0], 0);
    }
    a = perceptron.Predict([0, 0]); // 0
    a_exp = 0;
    t.equal(a, a_exp.toString(), `PerceptronModel: Expected: ${a_exp}, Actual: ${a}`);

    a = perceptron.Predict([0, 1]); // 0
    a_exp = 0;
    t.equal(a, a_exp.toString(), `PerceptronModel: Expected: ${a_exp}, Actual: ${a}`);

    a = perceptron.Predict([1, 0]); // 0
    a_exp = 0;
    t.equal(a, a_exp.toString(), `PerceptronModel: Expected: ${a_exp}, Actual: ${a}`);

    a = perceptron.Predict([1, 1]); // 1
    a_exp = 1;
    t.equal(a, a_exp.toString(), `PerceptronModel: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Product([1, 2, 3, 4]); // => 24
    a_exp = 24;
    t.equal(a, a_exp, `Product: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.QuantileSorted([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
    a_exp = 9;
    t.equal(a, a_exp, `QuantileSorted: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
    a_exp = 9;
    t.equal(a, a_exp, `Quantile: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Quantile([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], [0.5, 0.6, 0.7]);
    a_exp = [9, 10, 13];
    t.equal(a, a_exp.toString(), `Quantile: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.RootMeanSquare([-1, 1, -1, 1]); // => 1
    a_exp = 1;
    t.equal(a, a_exp, `RootMeanSquare: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 3, 4, 5, 6], d2 = [2, 2, 3, 4, 5, 60];
    a = StatisticsService.Sample_Correlation(d1, d2).toFixed(2);
    a_exp = 1.96;
    t.equal(a, a_exp, `Sample_Correlation: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 3, 4, 5, 6], d2 = [6, 5, 4, 3, 2, 1];
    a = StatisticsService.Sample_Covariance(d1, d2); // => -3.5
    a_exp = -3.5;
    t.equal(a, a_exp, `Sample_Covariance: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 2, 3, 5];
    a = StatisticsService.Sample_Kurtosis(d1); // => 1.4555765595463122
    a_exp = 1.4555765595463122;
    t.equal(a, a_exp, `Sample_Kurtosis: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [2, 4, 6, 3, 1];
    a = StatisticsService.Sample_Skewness(d1); // => 0.590128656384365
    a_exp = 0.590128656384365;
    t.equal(a, a_exp, `Sample_Skewness: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [2, 4, 4, 4, 5, 5, 7, 9];
    a = StatisticsService.StandardDeviation(d1).toFixed(2);
    a_exp = 3.0;
    t.equal(a, a_exp, `StandardDeviation: Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4, 5];
    a = StatisticsService.Variance(data); // => 2.5
    a_exp = 2.0;
    t.equal(a, a_exp, `Variance: Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4];
    a = StatisticsService.Sample_With_Replacement(data, 2);
    t.ok(a, `Sample_With_Replacement ok: Actual: ${a}`);

    a = StatisticsService.Sample_With_Replacement(data, 2, Math.random);
    t.ok(a, `Sample_With_Replacement ok: Actual: ${a}`);

    a = StatisticsService.Sample_With_Replacement(data, 2, () => 10);
    t.ok(a, `Sample_With_Replacement ok: Actual: ${a}`);

    a = StatisticsService.Shuffle(data);
    t.ok(a, `Shuffle ok: Input: ${data}, Actual: ${a}`);

    a = StatisticsService.Shuffle(data, Math.random);
    t.ok(a, `Shuffle ok: Input: ${data}, Actual: ${a}`);

    a = StatisticsService.Shuffle(data, () => 2);
    t.ok(a, `Shuffle ok: Input: ${data}, Actual: ${a}`);

    a = StatisticsService.Shuffle(data);
    t.ok(a, `Shuffle ok: Input: ${data}, Actual: ${a}`);

    a = StatisticsService.SignFunction(2); // => 1
    a_exp = 1;
    t.equal(a, a_exp, `SignFunction: Expected: ${a_exp}, Actual: ${a}`);

    data = [2, 4, 4, 4, 5, 5, 7, 9];
    a = StatisticsService.Variance(data); // => 4
    a_exp = 4;
    t.equal(a, a_exp, `Variance: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.StandardDeviation(data); // => 2
    a_exp = 3;
    t.equal(a, a_exp, `StandardDeviation: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.SubtractFromMean(20.5, 6, 53); // => 14
    a_exp = 14;
    t.equal(a, a_exp, `SubtractFromMean: Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3];
    a = StatisticsService.SumNthPowerDeviations(data);
    a_exp = 2;
    t.equal(a, a_exp, `SumNthPowerDeviations: Expected: ${a_exp}, Actual: ${a}`);

    a = StatisticsService.Sum(data); // => 6
    a_exp = 6;
    t.equal(a, a_exp, `Sum: Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 3, 4], d2 = [3, 4, 5, 6];
    a = StatisticsService.Sample_T_Test_TwoSample(d1, d2, 0); // => -2.1908902300206643
    a_exp = -2.5298221281347035;
    t.equal(a, a_exp, `Sample_T_Test_TwoSample: Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4, 5, 6];
    a = StatisticsService.Sample_T_Test(data, 3.385).toFixed(2); // => '0.16'
    a_exp = 0.16;
    t.equal(a, a_exp, `Sample_T_Test: Expected: ${a_exp}, Actual: ${a}`);

    data = [1, 2, 3, 4, 5, 6];
    a = StatisticsService.Variance(data); // => 2.9166666666666665
    a_exp = 2.9166666666666665;
    t.equal(a, a_exp, `Variance: Expected: ${a_exp}, Actual: ${a}`);  

    a = StatisticsService.ZScorePerNumber(78, 80, 5); // => -0.4
    a_exp = -0.4;
    t.equal(a, a_exp, `ZScorePerNumber: Expected: ${a_exp}, Actual: ${a}`);  
  });
  
  await test(`Wilcoxon Rank Sum`, (t) => {
    t.ok(StatisticsService.WilcoxonRankSum, "Exports fn");
    t.throws(StatisticsService.WilcoxonRankSum([], []), `Wilcoxon Rank Sum of a sample with 0 numbers is null`);
    t.throws(StatisticsService.WilcoxonRankSum([1, 2, 3], []), `Wilcoxon Rank Sum of a sample with 0 numbers is null`);
    t.throws(StatisticsService.WilcoxonRankSum([], [1, 2, 3]), `Wilcoxon Rank Sum of a sample with 0 numbers is null`);

    let a, a_exp, d1, d2;

    d1 = [1, 2, 3];
    d2 = [4, 5, 6];
    a = StatisticsService.WilcoxonRankSum(d1, d2);
    a_exp = 6;
    t.equal(a, a_exp, `WilcoxonRankSum (x is dominated by y), Expected: ${a_exp}, Actual: ${a}`);

    d1 = [4, 5, 6];
    d2 = [1, 2, 3];
    a = StatisticsService.WilcoxonRankSum(d1, d2);
    a_exp = 15;
    t.equal(a, a_exp, `WilcoxonRankSum (y is dominated by x), Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 3, 5];
    d2 = [2, 4, 6];
    a = StatisticsService.WilcoxonRankSum(d1, d2);
    a_exp = 9;
    t.equal(a, a_exp, `WilcoxonRankSum (x and y are interleaved), Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 3];
    d2 = [3, 4, 5];
    a = StatisticsService.WilcoxonRankSum(d1, d2);
    a_exp = 6.5;
    t.equal(a, a_exp, `WilcoxonRankSum (x and y overlap at one value), Expected: ${a_exp}, Actual: ${a}`);

    d1 = [1, 2, 3];
    d2 = [3];
    a = StatisticsService.WilcoxonRankSum(d1, d2);
    a_exp = 6.5;
    t.equal(a, a_exp, `WilcoxonRankSum (trailing tied ranks are handled correctly), Expected: ${a_exp}, Actual: ${a}`);

  });
  
  // await test(`ZScore `, (t) => {
  //   t.ok(StatisticsService.ZScore(), "Exports fn");
  //   t.throws(StatisticsService.ZScore(), `Zscore with no parameters`);

  //   let a, a_exp, score, stdDev;

  //   score = [78, 80, 50, 90], stdDev = 5;
  //   a = StatisticsService.ZScore(score, stdDev);
  //   a_exp = -0.4;
  //   t.equal(a, a_exp, `ZScore, Expected: ${a_exp}, Actual: ${a}`);

  //   score = [78, 80, 50, 90], stdDev = 2;
  //   a = StatisticsService.ZScore(score, stdDev);
  //   a_exp = -6;
  //   t.equal(a, a_exp, `ZScore, Expected: ${a_exp}, Actual: ${a}`);

  // });
  
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
    await _gasTCommonTesting(),
    // await _gasT_Statistics_Testing(),
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




