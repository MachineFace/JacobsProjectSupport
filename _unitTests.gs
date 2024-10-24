/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */
const gasT_URL = `https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js`;

/**
 * Test with GasT
 */
const _gasTMainTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
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
        email : `danielwongweihan@berkeley.edu`,
        sid : 3034682275
      },
      goodEbadS : {
        email : `danielwongweihan@berkeley.edu`,
        sid : 12938749123,
      },
      badEgoodS : {
        email : `ding@bat.edu`,
        sid : 3034682275,
      },
      badEbadS : {
        email : `ding@bat.edu`,
        sid : 2394872349587,
      },
    }
    const st = new CheckPriority({email : types.staff.email, sid : types.staff.sid }).Priority;
    t.equal(st, PRIORITY.Tier1, `DEFAULT priority for staff : Expected 1, Actual ${st}`);
    const gg = new CheckPriority({email : types.goodEgoodS.email, sid : types.goodEgoodS.sid}).Priority;
    t.equal(gg, PRIORITY.Tier4, `Expected 4, Actual ${gg}`);
    const gb = new CheckPriority({email : types.goodEbadS.email, sid : types.goodEbadS.sid}).Priority;
    t.equal(gb, PRIORITY.Tier4, `Expected 4, Actual ${gb}`);
    const bg = new CheckPriority({email : types.badEgoodS.email, sid : types.badEgoodS.sid}).Priority;
    t.equal(bg, PRIORITY.None, `Expected ${PRIORITY.None}, Actual ${bg}`);
    const bb = new CheckPriority({email : types.badEbadS.email, sid : types.badEbadS.sid}).Priority;
    t.equal(bb, PRIORITY.None, `Expected ${PRIORITY.None}, Actual ${bb}`);

  });
  
  /** 
  await test(`FormBuilder Test`, (t) => {
    const x = new ApprovalFormBuilder({
      name : "Dingus",
      id : 19238712398,
      cost : 50.00,
    });
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  });
  */

  await test(`Generate Barcode: `, (t) => {
    const x = new BarcodeGenerator({ id : 20230119105523 }).GenerateBarCodeForTicketHeader();
    t.notEqual(x, undefined || null, `Barcode SHOULD NOT be undefined or null : ${x}`);
    const y = new BarcodeGenerator({ id : `alskdfjalsdkfj` }).GenerateBarCodeForTicketHeader();
    t.notEqual(y, undefined || null, `Barcode SHOULD NOT be undefined or null : ${y}`);
    const z = new BarcodeGenerator({}).GenerateBarCodeForTicketHeader();
    t.notEqual(z, undefined || null, `Barcode SHOULD NOT be undefined or null : ${z}`);
  });

  await test(`Generate QRCode: `, t => {
    const x = new QRCodeGenerator({ url : `http://www.codyglen.com/`, });
    t.notEqual(x, undefined || null, `Generate QRCode SHOULD NOT be undefined or null : ${x}`);
  });
  
  await test(`Design Specialist Creation`, (t) => {
    const x = new DesignSpecialist({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    t.equal(x.fullname, `Testa Nama`, `DS ${x.name} created.`);
    t.equal(x.isAdmin, true, `Admin check should be true.`);
  });

  await test(`Manager Creation`, (t) => {
    const x = new Manager({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    t.equal(x.fullname, `Testa Nama`, `DS ${x.name} created.`);
    t.equal(x.isAdmin, true, `Admin check should be true.`);
  });

  await test(`StudentSupervisor Creation`, (t) => {
    const x = new StudentSupervisor({ name : `Testa`, fullname : `Testa Nama`, email: `some@thing.com` });
    t.equal(x.fullname, `Testa Nama`, `DS ${x.name} created.`);
    t.equal(x.isAdmin, false, `Admin check should be false.`);
  });
  
  await test(`Make Staff`, (t) => {
    const staff = new MakeStaff().Staff;
    t.equal(staff.Cody.name, `Cody`, `Staff member (${staff.Cody.name}) created successfully.`);
  });
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}

/**
 * Test ID with GasT
 */
const _gasTIDServiceTesting = async () => {
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name

  await test(`GetNewID NON-STATIC`, t => {
    const j = new IDService().id;
    t.notEqual(j, undefined || null, `GetNewID SHOULD NOT return undefined or null: ${j}`);
  });

  await test(`GetNewID STATIC`, t => {
    const k = IDService.createId();
    t.notEqual(k, undefined || null, `GetNewID SHOULD NOT return undefined or null: ${k}`);
  });

  await test(`TestUUIDToDecimal`, t => {
    const testUUID = `b819a295-66b7-4b82-8f91-81cf227c5216`;
    const decInterp = `0244711056233028958513683553892786000406`;
    const dec = IDService.toDecimal(testUUID);
    t.equal(dec, decInterp, `TestUUIDToDecimal SHOULD return ${decInterp}: ${decInterp == dec}, ${dec}`);
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
 * Test Logger and Message with GasT
 */
const _gasTMessagingTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`CreateMessage DEFAULT`, (t) => {
    const message = new CreateMessage({});

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

  await test(`CreateMessage`, (t) => {
    const rowData = GetRowData(SHEETS.Fablight, 2);
    const message = new CreateMessage({
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
 */
const _gasTLoggerTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Log`, (t) => {
    const x = Log.Warning(`Warning Test ----> Message`);
    const y = Log.Info(`Info Test ----> Message`);
    const z = Log.Error(`ERROR Test ----> Message`);
    const w = Log.Debug(`Debugging Test ----> Message`);
    t.notThrow(() => x, `Warning SHOULD NOT throw error.`);
    t.notThrow(() => y, `Info SHOULD NOT throw error.`);
    t.notThrow(() => z, `Error SHOULD NOT throw error.`);
    t.notThrow(() => w, `Debug SHOULD NOT throw error.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Misc with GasT
 */
const _gasTMiscTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Search`, (t) => {
    const x = SheetService.Search(`Cody`);
    t.notEqual(x, undefined || null, `Search should not return undefined or null. ${JSON.stringify(x)}`);
  });

  await test(`Search Specific Sheet`, (t) => {
    const x = SheetService.SearchSpecificSheet(SHEETS.Fablight,`Cody`);
    t.notEqual(x, undefined || null, `SearchSpecificSheet should not return undefined or null. ${JSON.stringify(x)}`);
  });

  await test(`GetByHeader`, (t) => {
    const x = SheetService.GetByHeader(SHEETS.Fablight, HEADERNAMES.email, 2);
    t.equal(x, `codyglen@berkeley.edu`, `Should fetch my email from that sheet.`);

    const y = SheetService.GetByHeader(SHEETS.Laser, `BAD COLUMN NAME`, 2);
    t.equal(y, false, `GetByHeader SHOULD return "false": ${y}`);

    const z = SheetService.GetByHeader(`BAD SHEET`, HEADERNAMES.email, 2);
    t.throws(z, `GetByHeader SHOULD throw an error on bad sheet name: ${z}`);

    const a = SheetService.GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.throws(a, `GetByHeader SHOULD throw an error on bad sheet name: ${a}`);

  });

  await test(`GetColumnDataByHeader`, (t) => {
    const x = SheetService.GetColumnDataByHeader(SHEETS.Fablight, HEADERNAMES.email);
    t.notEqual(x, undefined || null, `GetColumnDataByHeader SHOULD NOT return undefined or null: ${x}`);

    const y = SheetService.GetColumnDataByHeader(SHEETS.Laser, `BAD COLUMN NAME`);
    t.equal(y, false, `GetByHeader SHOULD return "false": ${y}`);

    const z = SheetService.GetColumnDataByHeader(`BAD SHEET`, `BAD COLUMN NAME`);
    t.throws(z, `GetColumnDataByHeader SHOULD throw an error on bad sheet name: ${z}`);

  });

  await test(`GetRowData`, (t) => {
    const x = SheetService.GetRowData(SHEETS.Fablight, 2);
    t.notEqual(x, undefined || null, `GetRowData SHOULD NOT return undefined or null: ${JSON.stringify(x)}`);

    const y = SheetService.GetRowData(SHEETS.Laser, `BAD COLUMN NAME`);
    t.equal(y, 1, `GetRowData SHOULD return "1": ${y}`);

    const z = SheetService.GetRowData(`BAD SHEET`, `BAD COLUMN NAME`);
    t.equal(z, 1, `GetRowData SHOULD return "1": ${z}`);

  });

  await test(`FindOne`, (t) => {
    const x = SheetService.FindOne(`cparsell@berkeley.edu`);
    t.notEqual(x, undefined || null, `FindOne should not return undefined or null. ${JSON.stringify(x)}`);

    const y = SheetService.FindOne(`BAD NAME`);
    t.equal(0, Object.entries(y).length, `FindOne SHOULD return empty object: ${JSON.stringify(y)}`);
  });

  await test(`ValidateEmail`, (t) => {
    const x = Emailer.ValidateEmail(`cparsell@berkeley.edu`);
    t.equal(x, true, `ValidateEmail SHOULD return true: ${x}`);

    const y = Emailer.ValidateEmail(`BAD NAME`);
    t.equal(y, false, `ValidateEmail SHOULD return false: ${y}`);

    const z = Emailer.ValidateEmail(`!#$%^%$123@berkeley.edu`);
    t.equal(z, false, `ValidateEmail SHOULD return false: ${z}`);

    const a = Emailer.ValidateEmail(`normalname@!#&^*^&*$%^)$!#$#!`);
    t.equal(a, false, `ValidateEmail SHOULD return false: ${a}`);

    const b = Emailer.ValidateEmail(`12345675645634599293487529384752938745923845293485729348572934875@berkeley.edu`);
    t.equal(b, true, `ValidateEmail SHOULD return true: ${b}`);

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
 */
const _gasTCalculationTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Calc Average Turnaround`, (t) => {
    const x = Calculate.GetAverageTurnaround(SHEETS.Laser);
    t.ok(x, `Time string is ok.`);
  });
  
  await test(`Count Active Users`, (t) => {
    const x = Calculate.CountActiveUsers();
    t.notEqual(x, undefined, `Count of active users should not return undefined.`);
  });
  
  await test(`Count Each Submission`, (t) => {
    const x = Calculate.CountEachSubmission();
    t.notEqual(x, undefined, `Count Each Submission should not return undefined.`);
  });
  
  
  await test(`Create Top Ten`, (t) => {
    const x = Calculate.CreateTopTen();
    t.notThrow(() => x, `CreateTopTen SHOULD NOT throw error`);
  });

  await test(`Find an Email.`, (t) => {
    const x = Calculate._FindEmail(`Cody`);
    t.equal(x, `codyglen@berkeley.edu`, `Function should find my email: ${x}.`);
    t.notEqual(x, undefined || null, `Find an Email should not return undefined or null.`);
  });

  await test(`Calc Distribution`, (t) => {
    const x = Calculate.GetUserDistribution();
    t.notEqual(x, undefined, `Distribution should not return undefined.`);
  });

  await test(`Count Types`, (t) => {
    const x = Calculate.CountTypes();
    t.notEqual(x, undefined, `Count Types should not return undefined.`);
  });
  
  await test(`Calc Standard Deviation`, (t) => {
    const x = Calculate.GetUserSubmissionStandardDeviation();
    t.notEqual(x, undefined || null, `Standard Deviation should not return undefined or null.`);
  });

  await test(`Calculate Arithmetic Mean`, (t) => {
    const x = Calculate.GetUserSubmissionArithmeticMean();
    t.notEqual(x, undefined || null, `Arithmetic Mean should not return undefined or null.`);
  });
  
  await test(`Count Tiers`, (t) => {
    const x = Calculate.CountTiers();
    t.notEqual(x, undefined || null, `Count Tiers should not return undefined or null.`);
  });
  
  await test(`Count Statuses`, (t) => {
    const x = Calculate.CountStatuses();
    t.notEqual(x, undefined || null, `Count Statuses should not return undefined or null.`);
  });
  
  await test(`Count Funding`, (t) => {
    const x = Calculate.CountFunding();
    console.warn(x);
    t.notEqual(x, undefined || null, `Count Funding should not return undefined or null.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test TimeService with GasT
 * @private
 */
const _gasTTimeTesting = async () => {
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name

  await test(`Format Timer GOOD`, (t) => {
    const x = TimeService.FormatTimerToString(15, 6, 35, 12);
    t.equal(x, `15 days, 06:35:12`, `Format Timer GOOD: ${x}`);
  });

  await test(`Format Timer BAD`, (t) => {
    const x = TimeService.FormatTimerToString(`ten`, `six`, `35`, `12`);
    t.equal(x, `ten days, six:35:12`, `Format Timer BAD: ${x}`);
  });

  await test(`Timer String to Millis`, (t) => {
    const x = TimeService.TimerStringToMilliseconds(`0 days, 0:34:18`);
    t.equal(x, 2058000, `Timer String to Millis GOOD: ${x}`);
  });

  await test(`Date to Millis`, (t) => {
    const x = TimeService.DateToMilliseconds(new Date(1986, 1, 2));
    t.equal(x, 507715200000, `Date to Millis GOOD: ${x}`);
  });

  await test(`Millis to Timer String`, (t) => {
    const x = TimeService.MillisecondsToTimerString(507715200000);
    t.equal(x, `5876 days, 08:000:000`, `Millis to Timer String GOOD: ${x}`);
  });

  await test(`Duration`, (t) => {
    const x = TimeService.Duration(new Date(1986, 01, 02), new Date(2086, 01, 02));
    t.equal(x, `36525 days, 00:000:000`, `Duration GOOD: ${x}`);
  });

  await test(`Return Date`, (t) => {
    const x = TimeService.ReturnDate(new Date(1986, 01, 02));
    t.equal(x, `Sun Feb 16 1986 00:06:40 GMT-0800 (Pacific Standard Time)`, `Return Date GOOD: ${x}`);
  });

  await test(`Remaining Time`, (t) => {
    const x = TimeService.RemainingTime(new Date(2086, 01, 02));
    t.notThrow(() => x, `Remaining Time SHOULD NOT throw error: ${x}`);
  });

  await test(`Days to Millis`, (t) => {
    const x = TimeService.DaysToMillis(100);
    t.equal(x, 8640000000, `Days to Millis GOOD: ${x}`);
  });
  
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Shopify API with GasT
 */
const _gasTShopifyTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  const shopify = new ShopifyAPI();

  await test(`Get Last Shopify Order`, async(t) => {
    const x = await shopify.GetLastOrder();
    console.info(x);
    t.notEqual(x, undefined || null, `Get Last Shopify Order should not return undefined or null.`);
  });
  
  await test(`Get Shopify Orders List`, async(t) => {
    const x = await shopify.GetOrdersList();
    t.notEqual(x, undefined || null, `Get Shopify Orders List should not return undefined or null.`);
  });

  await test(`Shopify _GetStoreProductID`, (t) => {
    const x = shopify._GetStoreProductID(`Fortus Red ABS-M30`);
    t.notEqual(x, undefined || null, `Shopify Lookup Product ID for Fortus Red ABS-M30 should not return undefined or null: ${x}`);
  });

  await test(`Shopify GetProductByID`, async (t) => {
    const x = await shopify.GetProductByID(3940700420);
    t.notEqual(x, undefined || null, `Shopify Lookup Product ID for Fortus Red ABS-M30 should not return undefined or null: ${JSON.stringify(x)}`);
  });

  await test(`Shopify GetCustomerByEmail`, async (t) => {
    const x = await shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    t.notEqual(x, undefined || null, `GetCustomerByEmail for eli_lee@berkeley.edu should not return undefined or null: ${JSON.stringify(x)}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Ticket with GasT
 */
const _gasTTicketTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
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
const _gasTEmailTesting = async () => {
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  if ((typeof GasTap) === 'undefined') {
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  const test = new GasTap();

  await test(`Emailer`, async(t) => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const id = new IDService().id;
    const projectname = `Some Kinda Project`;
    const message = new CreateMessage({
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
 * Test All with GasT
 */
const _gasTTestAll = async () => {
  Promise.all([
    await _gasTMainTesting(),
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
// const _testAllMessages = async () => {

//     Promise.all([
//         await _testOnEditMessages(),
//         await _testOnformSubmitMessages(),
//     ])
//     .then(console.info('Test Success'))
//     .catch(Error => {
//         console.error(Error + 'Failure');
//     }); 
// }




