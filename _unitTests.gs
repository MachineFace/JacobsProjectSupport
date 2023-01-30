/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */


/**
 * Test with GasT
 */
const _gasTMainTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  // await test(`Checking...`, (t) => {    
  //     let i = 3 + 4
  //     t.equal(i, 7, `Calc : 3 + 4 = 7  : Correct`)
  // })
  
  await test(`Priority Test`, (t) => {
    let types = {
      staff : {
        email : `codyglen@berkeley.edu`,
        sid : 91283741923,
      },
      goodEgoodS : {
        email : `cassidypowers@berkeley.edu`,
        sid : 3034682275
      },
      goodEbadS : {
        email : `cassidypowers@berkeley.edu`,
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
    t.equal(st, 1, `DEFAULT priority for staff : Expected 1, Actual ${st}`);
    const gg = new CheckPriority({email : types.goodEgoodS.email, sid : types.goodEgoodS.sid}).Priority;
    t.equal(gg, 3, `Expected 3, Actual ${gg}`);
    const gb = new CheckPriority({email : types.goodEbadS.email, sid : types.goodEbadS.sid}).Priority;
    t.equal(gb, 3, `Expected 3, Actual ${gb}`);
    const bg = new CheckPriority({email : types.badEgoodS.email, sid : types.badEgoodS.sid}).Priority;
    t.equal(bg, 3, `Expected 3, Actual ${bg}`);
    const bb = new CheckPriority({email : types.badEbadS.email, sid : types.badEbadS.sid}).Priority;
    t.equal(bb, `STUDENT NOT FOUND!`, `Expected "STUDENT NOT FOUND!", Actual ${bb}`);

  });
  
  await test(`FormBuilder Test`, (t) => {
    const x = new ApprovalFormBuilder({
      name : "Dingus",
      jobnumber : 19238712398,
      cost : 50.00,
    });
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  });

  await test(`Generate Barcode: `, (t) => {
    const x = new BarcodeGenerator({ jobnumber : 20230119105523 }).GenerateBarCodeForTicketHeader();
    t.notEqual(x, undefined || null, `Barcode SHOULD NOT be undefined or null : ${x}`);
    const y = new BarcodeGenerator({ jobnumber : `alskdfjalsdkfj` }).GenerateBarCodeForTicketHeader();
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
  
  await test(`JobNumber`, (t) => {
    const x = new CreateJobnumber({ date : new Date(1986, 01, 02) }).Jobnumber;
    t.equal(x, 19860202000000, `Standard Job Number for 01, 02, 1986 should equal 19860202000000.`);
    const y = new CreateJobnumber({}).Jobnumber;
    t.notEqual(y, undefined || null, `DEFAULT / EMPTY jobnumber should not return undefined or null, ${y}`);

    const jtypes = {
      GoodDate : new Date(2015, 10, 3),
      BadDate : `20220505`,
      AnotherBad : `5/3/2022 8:29:08`,
      AnotherBadString : `Thu, 27 Jan 2022 18:34:48 GMT`,
    }

    const goodDate = new CreateJobnumber({ date : jtypes.GoodDate }).Jobnumber;
    t.equal(goodDate, 20151103000000, `Job Number for ${jtypes.GoodDate} should return 20151103000000`);
    const badDate = new CreateJobnumber({ date : jtypes.BadDate }).Jobnumber;
    t.notEqual(badDate, undefined || null, `Bad date should still return good jobnumber, ${badDate}`);
    const anotherBad = new CreateJobnumber({ date : jtypes.AnotherBad }).Jobnumber;
    t.notEqual(anotherBad, undefined || null, `Bad string date should still return good jobnumber, ${anotherBad}`);
    const anotherBadString = new CreateJobnumber({ date : jtypes.AnotherBadString }).Jobnumber;
    t.notEqual(anotherBadString, undefined || null, `Bad string date should still return good jobnumber, ${anotherBadString}`);
  
  });
  
  await test(`Sheet Permitted Check`, (t) => {
    const val = CheckSheetIsForbidden(OTHERSHEETS.Logger);
    t.equal(true, val, `Logger Should be true-forbidden : ${val}`);

    const val2 = CheckSheetIsForbidden(SHEETS.Fablight);
    t.equal(false, val2, `Fablight Should be false-not_forbidden: ${val2}`);

    const val3 = CheckSheetIsForbidden(STORESHEETS.FablightStoreItems);
    t.equal(true, val3, `Store Should be true-forbidden: ${val3}`);
  });
  
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Logger and Message with GasT
 */
const _gasTLoggerAndMessagingTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  // ------------------------------------------------------------------------------------------------------------------------------
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
    const message = new CreateMessage({
      name : 'Cody', 
      projectname : 'Test Project',
      jobnumber : '101293874098', 
      material1URL : 'material1URL', material1Quantity : 45, material1Name : 'TestPLA',
      material2URL : 'material2URL', material2Quantity : 15, material2Name : 'TestBreakaway',
      material3URL : 'mat3URL', material3Quantity : 23, material3Name : 'Steel',
      material4URL : 'mat4URL', material4Quantity : 24, material4Name : 'Aluminum',
      material5URL : 'mat5URL', material5Quantity : 75, material5Name : 'Plastic',
      designspecialist : 'designspecialist', designspecialistemaillink : 'cody@glen.com', cost : 45.50,
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
    const x = `CREAFORM MESSAGE : ${message.creaformMessage}`;
    t.notThrow(() => x, `CREAFORM MESSAGE SHOULD NOT throw error.`);
    const y = `MISSING ACCESS : ${message.missingAccessMessage}`;
    t.notThrow(() => y, `MISSING MESSAGE SHOULD NOT throw error.`);
  });

  await test(`Submission Messages`, (t) => {
    const message = new CreateSubmissionMessage({ 
      name : 'Cody', 
      projectname : 'SomeProject', 
      jobnumber : 102938471431,
    } );
    const w = `DS MESSAGE : ${message.dsMessage}`;
    t.notEqual(w, undefined || null, `DS MESSAGE message should not return undefined or null. \n${w}`);
    const x = `CREAFORM MESSAGE : ${message.creaformMessage}`;
    t.notEqual(x, undefined || null, `CREAFORM MESSAGE message should not return undefined or null. \n${x}`);
    const y = `MISSING ACCESS : ${message.missingAccessMessage}`;
    t.notEqual(y, undefined || null, `MISSING ACCESS message should not return undefined or null. \n${y}`);
  });

  await test(`WriteLogger`, (t) => {
    const write = new WriteLogger();
    const x = write.Warning(`Warning Test ----> Message`);
    const y = write.Info(`Info Test ----> Message`);
    const z = write.Error(`ERROR Test ----> Message`);
    const w = write.Debug(`Debugging Test ----> Message`);
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
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  // ------------------------------------------------------------------------------------------------------------------------------
  await test(`Search`, (t) => {
    const x = Search(`Cody`);
    t.notEqual(x, undefined || null, `Search should not return undefined or null. ${JSON.stringify(x)}`);
  });

  await test(`Search Specific Sheet`, (t) => {
    const x = SearchSpecificSheet(SHEETS.Fablight,`Cody`);
    t.notEqual(x, undefined || null, `SearchSpecificSheet should not return undefined or null. ${JSON.stringify(x)}`);
  });

  await test(`FindByJobNumber`, (t) => {
    const x = FindByJobNumber(20211025144607);
    t.notEqual(x, undefined || null, `FindByJobNumber should not return undefined or null. ${JSON.stringify(x)}`);
  });

  await test(`GetByHeader`, (t) => {
    const x = GetByHeader(SHEETS.Fablight, HEADERNAMES.email, 2);
    t.equal(x, `codyglen@berkeley.edu`, `Should fetch my email from that sheet.`);

    const y = GetByHeader(SHEETS.Laser, `BAD COLUMN NAME`, 2);
    t.equal(y, undefined || null, `GetByHeader SHOULD return undefined or null: ${y}`);

    const z = GetByHeader(`BAD SHEET`, HEADERNAMES.email, 2);
    t.equal(y, undefined || null, `GetByHeader SHOULD return undefined or null: ${y}`);

    const a = GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.equal(a, undefined || null, `GetByHeader SHOULD return undefined or null: ${a}`);

  });

  await test(`GetColumnDataByHeader`, (t) => {
    const x = GetColumnDataByHeader(SHEETS.Fablight, HEADERNAMES.email);
    t.notEqual(x, undefined || null, `GetColumnDataByHeader SHOULD NOT return undefined or null: ${x}`);

    const y = GetColumnDataByHeader(SHEETS.Laser, `BAD COLUMN NAME`);
    t.equal(y, undefined || null, `GetByHeader SHOULD return undefined or null: ${y}`);

    const z = GetColumnDataByHeader(`BAD SHEET`, `BAD COLUMN NAME`);
    t.equal(z, undefined || null, `GetByHeader SHOULD return undefined or null: ${z}`);

  });

  await test(`GetRowData`, (t) => {
    const x = GetRowData(SHEETS.Fablight, 2);
    t.notEqual(x, undefined || null, `GetRowData SHOULD NOT return undefined or null: ${JSON.stringify(x)}`);

    const y = GetRowData(SHEETS.Laser, `BAD COLUMN NAME`);
    t.equal(y, undefined || null, `GetRowData SHOULD return undefined or null: ${y}`);

    const z = GetRowData(`BAD SHEET`, `BAD COLUMN NAME`);
    t.equal(z, undefined || null, `GetRowData SHOULD return undefined or null: ${z}`);

  });

  await test(`FindOne`, (t) => {
    const x = FindOne(`cparsell@berkeley.edu`);
    t.notEqual(x, undefined || null, `FindOne should not return undefined or null. ${JSON.stringify(x)}`);

    const y = FindOne(`BAD NAME`);
    t.equal(0, Object.entries(y).length, `FindOne SHOULD return empty object: ${JSON.stringify(y)}`);
  });

  await test(`ValidateEmail`, (t) => {
    const x = ValidateEmail(`cparsell@berkeley.edu`);
    t.equal(x, true, `ValidateEmail SHOULD return true: ${x}`);

    const y = ValidateEmail(`BAD NAME`);
    t.equal(y, false, `ValidateEmail SHOULD return false: ${y}`);

    const z = ValidateEmail(`!#$%^%$123@berkeley.edu`);
    t.equal(z, false, `ValidateEmail SHOULD return false: ${z}`);

    const a = ValidateEmail(`normalname@!#&^*^&*$%^)$!#$#!`);
    t.equal(a, false, `ValidateEmail SHOULD return false: ${a}`);

    const b = ValidateEmail(`12345675645634599293487529384752938745923845293485729348572934875@berkeley.edu`);
    t.equal(b, true, `ValidateEmail SHOULD return true: ${b}`);

  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Calculations with GasT
 */
const _gasTCalculationTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();
  const calc = new Calculate();

  // ------------------------------------------------------------------------------------------------------------------------------
  await test(`Calc Average Turnaround`, (t) => {
    const x = calc.CalculateAverageTurnaround(SHEETS.Laser);
    t.ok(x, `Time string is ok.`);
  });
  
  await test(`Calc Duration`, (t) => {
    const x = calc.CalculateDuration( new Date(1992,03,27), new Date(2022,01,01) );
    t.equal(x.toString(), `10872 1:00:00`, `Good calc`);
    t.notEqual(x, new Date(), `Not Equal to a new date.`);
  });
  
  await test(`Count Active Users`, (t) => {
    const x = calc.CountActiveUsers();
    t.notEqual(x, undefined, `Count of active users should not return undefined.`);
  });
  
  await test(`Count Each Submission`, (t) => {
    const x = calc.CountEachSubmission();
    t.notEqual(x, undefined, `Count Each Submission should not return undefined.`);
  });
  
  await test(`Create Top Ten`, async(t) => {
    const x = await calc.CreateTopTen();
    t.notEqual(x, undefined || null, `Top Ten should not return undefined or null.`);
  });
  
  await test(`Find an Email.`, (t) => {
    const x = calc.FindEmail(`Cody`);
    t.equal(x, `codyglen@berkeley.edu`, `Function should find my email: ${x}.`);
    t.notEqual(x, undefined || null, `Find an Email should not return undefined or null.`);
  });

  await test(`Calc Distribution`, (t) => {
    const x = calc.CalculateDistribution();
    t.notEqual(x, undefined, `Distribution should not return undefined.`);
  });

  await test(`Count Types`, (t) => {
    const x = calc.CountTypes();
    t.notEqual(x, undefined, `Count Types should not return undefined.`);
  });
  
  await test(`Calc Standard Deviation`, (t) => {
    const x = calc.CalculateStandardDeviation();
    t.notEqual(x, undefined || null, `Standard Deviation should not return undefined or null.`);
  });

  await test(`Calculate Arithmetic Mean`, (t) => {
    const x = calc.CalculateArithmeticMean();
    t.notEqual(x, undefined || null, `Arithmetic Mean should not return undefined or null.`);
  });
  
  await test(`Count Tiers`, (t) => {
    const x = calc.CountTiers();
    t.notEqual(x, undefined || null, `Count Tiers should not return undefined or null.`);
  });
  
  await test(`Count Statuses`, (t) => {
    const x = calc.CountStatuses();
    t.notEqual(x, undefined || null, `Count Statuses should not return undefined or null.`);
  });
  
  await test(`Count Funding`, (t) => {
    const x = calc.CountFunding();
    console.warn(x);
    t.notEqual(x, undefined || null, `Count Funding should not return undefined or null.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Shopify API with GasT
 */
const _gasTShopifyTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();
  const shopify = new ShopifyAPI({jobnumber : 1129384729384});


  // ------------------------------------------------------------------------------------------------------------------------------
  await test(`Get Last Shopify Order`, async(t) => {
    const x = await shopify.GetLastOrder();
    console.info(x);
    t.notEqual(x, undefined || null, `Get Last Shopify Order should not return undefined or null.`);
  });
  
  await test(`Get Shopify Orders List`, async(t) => {
    const x = await shopify.GetOrdersList();
    t.notEqual(x, undefined || null, `Get Shopify Orders List should not return undefined or null.`);
  });

  await test(`Shopify _LookupStoreProductDetails`, (t) => {
    const x = shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
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
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  await test(`Ticket`, t => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const jobnumber = new CreateJobnumber({ date : new Date()}).Jobnumber;
    const projectname = `Some Kinda Project`;
    const partCount = [`Part Count: `, `35`];

    let tick = new Ticket({
      name : name, 
      email : email, 
      jobnumber : jobnumber,
      projectname : projectname,
      partCount : partCount, 
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
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  await test(`Emailer`, async(t) => {
    const name = `Dingus`; 
    const email = "codyglen@berkeley.edu";
    const jobnumber = new JobNumberGenerator({ date : new Date()}).jobnumber;
    const projectname = `Some Kinda Project`;
    const message = new CreateMessage({
      name : name,
      jobnumber : jobnumber,
      projectname : projectname,
    });
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

  

  /** 
  const __thing__ = () => {
    const message = new CreateMessage({
      name : `Cingus`,
      jobnumber : 192384712938,
      projectname : `P Funk`,
    });
    if(message instanceof CreateMessage) console.warn(`Message is instance of Message Class...`);
    else console.warn(`message is NOT instance of Message class.`)
  }
  */
  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test All with GasT
 */
const _gasTTestAll = async () => {
  _gasTMainTesting();
  _gasTLoggerAndMessagingTesting();
  _gasTMiscTesting();
  _gasTCalculationTesting();
  _gasTShopifyTesting();
  _gasTTicketTesting();
  _gasTEmailTesting();
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




