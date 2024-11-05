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
    const st = new PriorityService({email : types.staff.email, sid : types.staff.sid }).Priority;
    t.equal(st, PRIORITY.Tier1, `DEFAULT priority for staff : Expected 1, Actual ${st}`);
    const gg = new PriorityService({email : types.goodEgoodS.email, sid : types.goodEgoodS.sid}).Priority;
    t.equal(gg, PRIORITY.Tier4, `Expected 4, Actual ${gg}`);
    const gb = new PriorityService({email : types.goodEbadS.email, sid : types.goodEbadS.sid}).Priority;
    t.equal(gb, PRIORITY.Tier4, `Expected 4, Actual ${gb}`);
    const bg = new PriorityService({email : types.badEgoodS.email, sid : types.badEgoodS.sid}).Priority;
    t.equal(bg, PRIORITY.None, `Expected ${PRIORITY.None}, Actual ${bg}`);
    const bb = new PriorityService({email : types.badEbadS.email, sid : types.badEbadS.sid}).Priority;
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

  await test(`Generate Barcode: `, async (t) => {
    const x = await BarcodeGenerator.GenerateBarCodeForTicketHeader(20230119105523);
    t.notEqual(x, undefined || null, `Barcode SHOULD NOT be undefined or null : ${x}`);
    const y = await BarcodeGenerator.GenerateBarCodeForTicketHeader(`alskdfjalsdkfj`);
    t.notEqual(y, undefined || null, `Barcode SHOULD NOT be undefined or null : ${y}`);
    const z = await BarcodeGenerator.GenerateBarCodeForTicketHeader({});
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
    const rowData = GetRowData(SHEETS.Fablight, 2);
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
    t.equal(y, 1, `GetByHeader SHOULD return "1": Actual: ${y}`);

    const z = SheetService.GetByHeader(`BAD SHEET`, HEADERNAMES.email, 2);
    t.throws(z, `GetByHeader SHOULD throw an error on bad sheet name: ${z}`);

    const a = SheetService.GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.throws(a, `GetByHeader SHOULD throw an error on bad sheet name: ${a}`);

  });

  await test(`GetColumnDataByHeader`, (t) => {
    const x = SheetService.GetColumnDataByHeader(SHEETS.Fablight, HEADERNAMES.email);
    t.notEqual(x, undefined || null, `GetColumnDataByHeader SHOULD NOT return undefined or null: ${x}`);

    const y = SheetService.GetColumnDataByHeader(SHEETS.Laser, `BAD COLUMN NAME`);
    t.equal(y, 1, `GetColumnDataByHeader SHOULD return "1": Actual: ${y}`);

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
 */
const _gasT_Statistics_Testing = async () => {
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

  await test(`Approximate Strict Equality`, (t) => {
    const x = StatisticsService.ApproxEqual(14.5, 14.5);
    t.notThrow(() => x, `Approximate Strict Equality SHOULD NOT throw error`);
    t.equal(x, true, `X SHOULD Equal: true, Actual: ${x}`);

    const y = StatisticsService.ApproxEqual(1, 1 + (StatisticsService.Epsilon / 2));
    t.equal(y, true, `Y SHOULD Equal: true, Actual: ${y} (separated by less than epsilon)`);

    const z = StatisticsService.ApproxEqual(1, 1 + (StatisticsService.Epsilon * 2));
    t.equal(z, false, `Z SHOULD Equal: false, Actual: ${z} (separated by more than epsilon)`);

    const a = StatisticsService.ApproxEqual(100, 100 + (99 * StatisticsService.Epsilon));
    t.equal(a, true, `A SHOULD Equal: true, Actual: ${a} (separated by relatively less than epsilon)`);

    const b = StatisticsService.ApproxEqual(100, 100 + (101 * StatisticsService.Epsilon));
    t.equal(b, false, `A SHOULD Equal: false, Actual: ${b} (separated by relatively more than epsilon)`);

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
    const x = StatisticsService.BernoulliDistribution(0.3);
    t.equal(x[0], 0.7, `Expected: ${0.7}, Actual: ${x[0]} or < ${StatisticsService.Epsilon}`);
    t.equal(x[1], 0.3, `Expected: ${0.3}, Actual: ${x[1]} or < ${StatisticsService.Epsilon}`);
    t.throws(StatisticsService.BernoulliDistribution(-0.01), `SHOULD throw error when p is not valid probability: (0 < x < 1)`);
    t.throws(StatisticsService.BernoulliDistribution(1.5), `SHOULD throw error when p is not valid probability: (0 < x < 1)`);
  });

  await test(`Binomial Distribution`, (t) => {
    const rnd = (n) => Number.parseFloat(n.toFixed(4));

    const a = StatisticsService.BinomialDistribution(6, 0.3);
    t.equal(typeof a, "object", `SHOULD return object: Actual: ${typeof a}`);

    t.equal(rnd(a[0]), 0.1176, `Expected: ${0.1176}, Actual: ${rnd(a[0])}`);
    t.equal(rnd(a[1]), 0.3025, `Expected: ${0.3025}, Actual: ${rnd(a[1])}`);
    t.equal(rnd(a[2]), 0.3241, `Expected: ${0.3241}, Actual: ${rnd(a[2])}`);
    t.equal(rnd(a[3]), 0.1852, `Expected: ${0.1852}, Actual: ${rnd(a[3])}`);
    t.equal(rnd(a[4]), 0.0595, `Expected: ${0.0595}, Actual: ${rnd(a[4])}`);
    t.equal(rnd(a[5]), 0.0102, `Expected: ${0.0102}, Actual: ${rnd(a[5])}`);
    t.equal(rnd(a[6]), 0.0007, `Expected: ${0.0007}, Actual: ${rnd(a[6])}`);

    const b = StatisticsService.BinomialDistribution(0, 0.5);
    t.throws(b, `n should be strictly positive`);

    const c = StatisticsService.BinomialDistribution(1.5, 0.5);
    t.throws(c, `n should be an integer`);

    const d = StatisticsService.BinomialDistribution(2, -0.01);
    t.throws(d, `p should be greater than 0.0`);

    const e = StatisticsService.BinomialDistribution(2, 1.5);
    t.throws(d, `p should be less than 1.0`);
  });

  await test(`Bisect`, (t) => {
    const a = Number(StatisticsService.Bisect(Math.sin, 1, 4, 100, 0.003)).toFixed(4);
    t.equal(a, 3.1416, `Expected: ${3.1416}, Actual: ${a}`);

    const b = Number(StatisticsService.Bisect(Math.cos, 0, 4, 100, 0.003)).toFixed(4);
    t.equal(b, 1.5723, `Expected: ${1.5723}, Actual: ${b}`);

    const c = Number(StatisticsService.Bisect(Math.cos, 0, 4, 1, 0.003)).toFixed(4);
    t.throws(t.equal(c, 1.0), `Throws if it exceeds the number of iterations allowed`);

    const d = StatisticsService.Bisect(0);
    t.throws(d, `Throws with syntax error f must be a function`);
  });

  await test(`Chi Squared Goodness Of Fit`, (t) => {
    const data1019 = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 3, 3, 3, 3
    ];

    const a = StatisticsService.ChiSquaredGoodnessOfFit(data1019, StatisticsService.PoissonDistribution, 0.5);
    t.equal(a, true, `Can reject the null hypothesis with level of confidence specified at 0.05, Actual: ${a}`);

    const b = StatisticsService.ChiSquaredGoodnessOfFit(data1019, StatisticsService.PoissonDistribution, 0.1);
    t.equal(b, true, `Can reject the null hypothesis with level of confidence specified at 0.01, Actual: ${b}`);

    const c = StatisticsService.ChiSquaredGoodnessOfFit([0, 2, 3, 7, 7, 7, 7, 7, 7, 9, 10], StatisticsService.PoissonDistribution, 0.1);
    t.equal(c, true, `Can tolerate gaps in distribution, Actual: ${c}`);

    // t.equal(a, 3.1416, `Expected: ${3.1416}, Actual: ${a}`);

    // const b = Number(StatisticsService.Bisect(Math.cos, 0, 4, 100, 0.003)).toFixed(4);
    // t.equal(b, 1.5723, `Expected: ${1.5723}, Actual: ${b}`);

    // const c = Number(StatisticsService.Bisect(Math.cos, 0, 4, 1, 0.003)).toFixed(4);
    // t.throws(t.equal(c, 1.0), `Throws if it exceeds the number of iterations allowed`);

    // const d = StatisticsService.Bisect(0);
    // t.throws(d, `Throws with syntax error f must be a function`);
  });
  
  await test(`Chunk`, (t) => {
    // TODO: Fix this shit.
    const a = StatisticsService.Chunk([`a`, `b`, `c`], 1);
    t.equal(a.toString(), [[`a`], [`b`], [`c`]].toString(), `Expected: ${[[`a`], [`b`], [`c`]]}, Actual: ${a}`);

    const b = StatisticsService.Chunk([1, 2, 3], 2);
    t.equal(b.toString(), [[1, 2], [3]].toString(), `Expected: ${[[1, 2], [3]]}, Actual: ${b}`);

    const c = StatisticsService.Chunk([1, 2, 3, 4], 4);
    t.equal(c.toString(), [[1, 2, 3, 4]].toString(), `Expected: ${[[1, 2, 3, 4]]}, Actual: ${c}`);

    const d = StatisticsService.Chunk([1, 2, 3, 4], 2);
    t.equal(d.toString(), [[1, 2], [3, 4]].toString(), `Expected: ${[[1, 2], [3, 4]]}, Actual: ${d}`);

    const e = StatisticsService.Chunk([1, 2, 3, 4], 3);
    t.equal(e.toString(), [[1, 2, 3], [4]].toString(), `Expected: ${[[1, 2, 3], [4]]}, Actual: ${e}`);

    const f = StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 2);
    t.equal(f.toString(), [[1, 2], [3, 4], [5, 6], [7]].toString(), `Expected: ${[[1, 2], [3, 4], [5, 6], [7]]}, Actual: ${f}`);

    const g = StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 0);
    t.throws(g, `Throws with zero chunk size`);

    const h = StatisticsService.Chunk([1, 2, 3, 4, 5, 6, 7], 1.5);
    t.throws(h, `Throws with non-integer chunk size`);
  });
  
  await test(`CK_Means`, (t) => {
    t.ok(StatisticsService.CK_Means, "Exports fn");
    t.throws(StatisticsService.CK_Means([], 10), `Cannot generate more values than input`);

    const a = StatisticsService.CK_Means([1], 1);
    t.equal(a, 1, `(Single-value case) Expected: ${[1]}, Actual: ${a}`);

    const b = StatisticsService.CK_Means([1, 1, 1, 1], 1);
    t.equal(b.toString(), [1, 1, 1, 1].toString(), `(Same-value case) Expected: ${[1, 1, 1, 1]}, Actual: ${b}`);

    const c = StatisticsService.CK_Means([-1, 2, -1, 2, 4, 5, 6, -1, 2, -1], 3);
    t.equal(c.toString(), [ [-1, -1, -1, -1], [2, 2, 2], [4, 5, 6] ].toString(), `Expected: ${[ [-1, -1, -1, -1], [2, 2, 2], [4, 5, 6] ]}, Actual: ${c}`);

    const d = StatisticsService.CK_Means([64.64249127327881, 64.64249127328245, 57.79216426169771], 2);
    t.equal(
      d.toString(), 
      [ [57.79216426169771], [64.64249127327881, 64.64249127328245] ].toString(), 
      `(Floating point case) Expected: ${[ [57.79216426169771], [64.64249127327881, 64.64249127328245] ]}, Actual: ${d}`
    );
  });

  await test(`Coefficient of Variation`, (t) => {
    const rnd = (n) => Number.parseFloat(n.toFixed(4));
    t.ok(StatisticsService.CoefficientOfVariation, "Exports fn");

    const x = StatisticsService.CoefficientOfVariation([1, 2, 3, 4]);
    t.equal(rnd(x), 0.4236, `Expected: ${0.4236}, Actual: ${rnd(x)}`);

  });

  await test(`Combinations`, (t) => {
    t.ok(StatisticsService.Combinations, "Exports fn");

    const x = StatisticsService.Combinations([1], 1);
    t.equal(x, [[1]].toString(), `Expected: ${[[1]]}, Actual: ${x}`);

    const y = StatisticsService.Combinations([1, 2, 3], 2);
    t.equal(y, [[1,2], [1,3], [2,3]].toString(), `Expected: ${[[1,2], [1,3], [2,3]]}, Actual: ${y}`);

    const z = StatisticsService.Combinations([`a`, `b`, `c`], 2);
    t.equal(z, [[`a`,`b`], [`a`,`c`], [`b`,`c`]].toString(), `Expected: ${[[`a`,`b`], [`a`,`c`], [`b`,`c`]]}, Actual: ${z}`);
  });

  await test(`Combinations With Replacement`, (t) => {
    t.ok(StatisticsService.CombinationsWithReplacement, "Exports fn");

    const x = StatisticsService.CombinationsWithReplacement([1], 1);
    t.equal(
      x, 
      [[1]].toString(), 
      `Expected: ${[[1]]}, Actual: ${x}`
    );

    const y = StatisticsService.CombinationsWithReplacement([1, 2, 3], 2);
    t.equal(
      y, 
      [[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]].toString(), 
      `Input: ${[1,2,3]}, Expected: ${[[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]]}, Actual: ${y}`
    );

    const z = StatisticsService.CombinationsWithReplacement([`a`, `b`, `c`], 2);
    t.equal(
      z, 
      [[`a`,`a`], [`a`,`b`], [`a`,`c`], [`b`,`b`], [`b`,`c`], [`c`,`c`]].toString(), 
      `Input: ${[`a`, `b`, `c`]}, Expected: ${[[`a`,`a`], [`a`,`b`], [`a`,`c`], [`b`,`b`], [`b`,`c`], [`c`,`c`]]}, Actual: ${z}`
    );
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

    const expected = 21 * StatisticsService.Epsilon;
    for (let i = 0; i <= 1 + StatisticsService.Epsilon; i += 0.01) {
      const probit = StatisticsService.Probit(i);
      const x = Math.abs(StatisticsService.CumulativeStdNormalProbability(probit) - i);
      t.equal(x < expected, true, `(Inverse Test) Expected: ${expected}, Actual: ${x} `);
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

    const a = StatisticsService.EqualIntervalBreaks([1], 4);
    t.equal(a, [1].toString(), `1-length case. Expected ${[1]}, Actual: ${a}`);

    const b = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 4);
    const b_expected = [1, 2.25, 3.5, 4.75, 6];
    t.equal(b, b_expected.toString(), `3 Breaks Case. Expected ${b_expected}, Actual: ${b}`);

    const c = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 2);
    const c_expected = [1, 3.5, 6];
    t.equal(c, c_expected.toString(), `2 Breaks Case. Expected ${c_expected}, Actual: ${c}`);

    const d = StatisticsService.EqualIntervalBreaks([1, 2, 3, 4, 5, 6], 1);
    const d_expected = [1, 6];
    t.equal(d, d_expected.toString(), `1 Breaks Case. Expected ${d_expected}, Actual: ${d}`);

  });
  
  await test(`Error Function`, (t) => {
    t.ok(StatisticsService.ErrorFunction, "Exports fn");

    const a = StatisticsService.ErrorFunction(-1);
    const b = StatisticsService.ErrorFunction(1);
    t.equal(Math.abs(a), Math.abs(b), `Expected ${true}, Actual A: ${a}, Actual B: ${b}`);

    for (let i = -1; i <= 1; i += 0.01) {
      const x = Math.abs(StatisticsService.ErrorFunction(StatisticsService.InverseErrorFunction(i) - i));
      const eps = 4 * StatisticsService.Epsilon;
      t.equal(x < eps, false, `Inverse Error: Expected: ${eps}, Actual: ${x}`);
    }

  });

  await test(`Factorial`, (t) => {
    t.ok(StatisticsService.Factorial, "Exports fn");

    const a = StatisticsService.Factorial(-1);
    t.throws(a, `Less than zero check, Actual: ${a}`);

    const b = StatisticsService.Factorial(0.5);
    t.throws(b, `Floating point check, Actual: ${b}`);

    const c = StatisticsService.Factorial(0);
    t.equal(c, 1, `Zero check, Actual: ${c}`);

    const d = StatisticsService.Factorial(1);
    t.equal(d, 1, `Zero check, Actual: ${d}`);

    const e = StatisticsService.Factorial(100);
    t.equal(e, 9.33262154439441e157, `Expected: ${9.33262154439441e157}, Actual: ${e}`);

  });
  
  await test(`Gamma`, (t) => {
    t.ok(StatisticsService.Gamma, "Exports fn");

    const a = StatisticsService.Gamma(5);
    t.equal(a, 24, `Gamma for integer SHOULD return whole number, Expected: ${24}, Actual: ${a}`);

    const b = Math.abs(StatisticsService.Gamma(11.54) - 13098426.039156161) < StatisticsService.Epsilon;
    t.ok(b, `Gamma for positive real float should be correct, Expected: ?, Actual: ${b}`);

    const c = Math.abs(StatisticsService.Gamma(-42.5) - -3.419793520724856e-52) < StatisticsService.Epsilon;
    t.ok(c, `Gamma for negative real float should be correct`);

    const d = Number.isNaN(StatisticsService.Gamma(-2));
    t.ok(d, `Gamma for negative integer should return NaN`);

    const e = Number.isNaN(StatisticsService.Gamma(0));
    t.ok(e, `Gamma for zero should return NaN`);

  });

  await test(`Gamma LN`, (t) => {
    t.ok(StatisticsService.Gamma_ln, "Exports fn");

    const a = StatisticsService.Gamma_ln(11.54);
    t.equal(a, 16.388002631263966, `Gamma_ln for positive real float SHOULD return Expected: ${16.388002631263966}, Actual: ${a}`);

    const b = Math.round(StatisticsService.Gamma(8.2));
    const b_exp = Math.round(Math.exp(StatisticsService.Gamma_ln(8.2)));
    t.equal(b, b_exp, `exp(Gamma_ln(n)) for n should equal gamma(n), Expected: ${b_exp}, Actual: ${b}` );

    const c = StatisticsService.Gamma_ln(-42.5);
    const c_exp = Number.POSITIVE_INFINITY;
    t.equal(c, c_exp, `Gamma_ln for negative n should be Infinity, Expected: ${c_exp}, Actual: ${c}`);
    
    const d = StatisticsService.Gamma_ln(0);
    const d_exp = Number.POSITIVE_INFINITY;
    t.equal(d, d_exp, `Gamma_ln for n === 0 should return NaN, Expected: ${d_exp}, Actual: ${d}`);

  });

  await test(`Geometric Mean`, (t) => {
    t.ok(StatisticsService.GeometricMean, "Exports fn");
    t.throws(StatisticsService.GeometricMean([]), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.GeometricMean([-1]), `Cannot calculate for lists with negative numbers`);
    t.notOk(StatisticsService.GeometricMean([0, 1, 2]) !== 0, `Geometric mean of array containing zero is not zero`);

    const a = StatisticsService.GeometricMean([2, 8]);
    t.equal(a, 4, `Can get the mean of two numbers, Expected: ${4}, Actual: ${a}`);

    const b = StatisticsService.GeometricMean([4, 1, 1 / 32]);
    t.equal(b, 0.5, `Can get the mean of two numbers, Expected: ${0.5}, Actual: ${b}`);

    const c = Math.round(StatisticsService.GeometricMean([2, 32, 1]));
    t.equal(c, 4, `Can get the mean of two numbers, Expected: ${4}, Actual: ${c}`);

  });
  
  await test(`Harmonic Mean`, (t) => {
    t.ok(StatisticsService.HarmonicMean, "Exports fn");
    t.throws(StatisticsService.HarmonicMean([]), `Cannot calculate for empty lists`);
    t.throws(StatisticsService.HarmonicMean([-1]), `Cannot calculate for lists with negative numbers`);
    t.notOk(StatisticsService.HarmonicMean([0, 1, 2]) !== 0, `Harmonic mean of array containing zero is not zero`);

    const a = Number(StatisticsService.HarmonicMean([2, 3])).toFixed(1);
    t.equal(a, 2.4, `Can get the mean of two numbers, Expected: ${2.4}, Actual: ${a}`);

    const b = StatisticsService.HarmonicMean([1, 1]);
    t.equal(b, 1, `Can get the mean of two numbers, Expected: ${1}, Actual: ${b}`);

    const c = StatisticsService.HarmonicMean([1, 2, 4]);
    t.equal(c, 12 / 7, `Can get the mean of two numbers, Expected: ${12 / 7}, Actual: ${c}`);

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

    const a = StatisticsService.Jenks([1, 2], 3);
    t.equal(a, null, `Will not try to assign more classes than datapoints, Expected: ${null}, Actual: ${a}`);

    const b = StatisticsService.Jenks([1, 2, 4, 5, 7, 9, 10, 20], 3);
    const b_exp = [1, 7, 20, 20];
    t.equal(b.toString(), b_exp.toString(), `Assigns correct breaks (small gaps between classes), Expected: ${b_exp}, Actual: ${b}`);

    const c = StatisticsService.Jenks([2, 32, 33, 34, 100], 3);
    const c_exp = [2, 32, 100, 100];
    t.equal(c.toString(), c_exp.toString(), `Assigns correct breaks (large gaps between classes), Expected: ${c_exp}, Actual: ${c}`);

    const d = StatisticsService.Jenks([9, 10, 11, 12, 13], 5);
    const d_exp = [9, 10, 11, 12, 13, 13];
    t.equal(d.toString(), d_exp.toString(), `Assigns correct breaks (breaking N points into N classes), Expected: ${d_exp}, Actual: ${d}`);

  });

  await test(`K Means Cluster`, (t) => {
    const nonRNG = () => 1.0 - StatisticsService.Epsilon;

    t.ok(StatisticsService.K_Means_Cluster, "Exports fn");
    t.throws(StatisticsService.K_Means_Cluster([1], 2, nonRNG), `Base case of one value`);
    
    let points = [[0.5]];
    const a = StatisticsService.K_Means_Cluster(points, 1, nonRNG);
    t.equal(a.labels.toString(), [0].toString(), `Single cluster of one point contains only that point`);
    t.equal(a.centroids.toString(), [[0.5]].toString(), `Single cluster of one point contains only that point`);

    const b = StatisticsService.K_Means_Cluster(points, 1);
    t.equal(b.labels.length, 1, `Clustering with default Math.random`);
    t.equal(b.centroids.length, 1, `Clustering with default Math.random`);

    points = [[0.0], [1.0]];
    const c = StatisticsService.K_Means_Cluster(points, 1, nonRNG);
    t.equal(c.labels, [0, 0].toString(), `Single cluster of two points contains both points`);
    t.equal(c.centroids, [[0.5]].toString(), `Single cluster of two points contains both points`);

    points = [[0.0], [1.0]];
    const d = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
    t.equal(d.labels, [0, 1].toString(), `Two clusters of two points puts each point in its own cluster`);
    t.equal(d.centroids, [[0.0], [1.0]].toString(), `Two clusters of two points puts each point in its own cluster`);

    points = [[0.0], [1.0], [0.0], [1.0]];
    const e = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
    t.equal(e.labels, [0, 1, 0, 1].toString(), `Two clusters of four paired points puts each pair in a cluster`);
    t.equal(e.centroids, [[0.0], [1.0]].toString(), `Two clusters of four paired points puts each pair in a cluster`);

    points = [ [0.0, 0.5], [1.0, 0.5] ];
    const f = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
    t.equal(f.labels, [0, 1].toString(), `Two clusters of two 2D points puts each point in its own cluster`);
    t.equal(f.centroids, [ [0.0, 0.5], [1.0, 0.5] ].toString(), `Two clusters of two 2D points puts each point in its own cluster`);

    points = [ [0.0, 0.5], [1.0, 0.5], [0.1, 0.0] ];
    const g = StatisticsService.K_Means_Cluster(points, 2, nonRNG);
    t.equal(g.labels, [0, 1, 0].toString(), `Two clusters of three 2D points puts two points in one cluster and one in the other`);
    t.equal(g.centroids, [ [0.05, 0.25], [1.0, 0.5] ].toString(), `Two clusters of three 2D points puts two points in one cluster and one in the other`);

  });

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

    for (let i = 0; i < normallyDistributed.density.length; i++) {
      const x = normallyDistributed.density[i][0];
      const expected = normallyDistributed.density[i][1];
      const actual = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, x);
      const compare = Math.abs(actual - expected) / expected < 0.1;
      t.ok(compare, `density(${x}) = ${actual} != ${expected}`, `default kernel and bandwidth`);
    }

    const a = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample);
    const a_exp = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, "gaussian", "nrd");
    t.equal(a, a_exp, `Gaussian Default Kernel, Expected: ${a_exp}, Actual: ${a}`);

    const b = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample);
    const b_exp = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, (u) => Math.exp(-0.5 * u * u) / SQRT_2PI)
    t.equal(b, b_exp, `Gaussian Default Kernel, Expected: ${b_exp}, Actual: ${b}`);

    const c = StatisticsService.Kernel_Density_Estimation(normallyDistributed.sample, "gaussian", 1);
    const c_exp = 0.2806999313061038;
    t.equal(c, c_exp, `Custom Kernel Value, Expected: ${c_exp}, Actual: ${c}`);

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




