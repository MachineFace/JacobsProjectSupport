/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */


/**
 * Test with GasT
 */
const _gastTestRunner = async () => {
  if ((typeof GasTap)==='undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();
  const calc = new Calculate();
  const shopify = new ShopifyAPI({jobnumber : 1129384729384});

  // await test(`Checking...`, (t) => {    
  //     let i = 3 + 4
  //     t.equal(i, 7, `Calc : 3 + 4 = 7  : Correct`)
  // })


  await test(`Generate Barcode: `, async(t) => {
    let jobnumber = `20210301140515`;
    let qgen = new QRCodeAndBarcodeGenerator({jobnumber : jobnumber});
    let x = await qgen.GenerateBarCode();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Generate QRCode: `, async(t) => {
    let jobnumber = `20210301140515`;
    let url = `http://www.codyglen.com/`;
    let qgen = new QRCodeAndBarcodeGenerator({url : url, jobnumber : jobnumber});
    let x = await qgen.GenerateQRCode();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Staff Functions`, (t) => {
    let x = new DesignSpecialist(`Testa`, `Testa Nama`, `some@thing.com`);
    StaffEmailAsString();
    InvokeDS(`Cody`,`email`);
    CreateDS();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Staff Functions`, (t) => {
    let x = MakeLink(`some@thing.com`);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Average Turnaround`, (t) => {
    let x = calc.CalculateAverageTurnaround(SHEETS.ultimaker);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Duration`, (t) => {
    let x = calc.CalculateDuration( new Date(1992,03,27), new Date() );
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Count Active Users`, (t) => {
    let x = calc.CountActiveUsers();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Distribution`, (t) => {
    let x = calc.CalculateDistribution();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Standard Deviation`, (t) => {
    let x = calc.CalculateStandardDeviation();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Metrics`, (t) => {
    let x = Metrics();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Get Last Shopify Order`, (t) => {
    let x = shopify.GetLastOrder();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Get Shopify Orders List`, (t) => {
    let x = shopify.GetOrdersList();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Lookup Product ID`, (t) => {
    let x = shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Functions`, (t) => {
    let x = shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    t.pass(`Good : ${JSON.stringify(x)}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Functions`, (t) => {
    let p = shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
    let x = shopify.GetProductByID(p);
    t.pass(`Good : ${JSON.stringify(x)}`);
    t.fail(`Bad`);
  })

  await test(`Messages`, (t) => {
      let message = new CreateMessage('Cody', 'Test Project', '101293874098', 'url',
        'material1URL', 45, 'TestPLA',
        'material2URL', 15, 'TestBreakaway',
        'mat3URL', 23, 'Steel',
        'mat4URL', 24, 'Aluminum',
        'mat5URL', 75, 'Plastic',
        'designspecialist', 'cody@glen.com', 45.50)

      Logger.log(`DEFAULT ${message.defaultMessage}`);
      Logger.log(`RECEIVED ${message.receivedMessage}`);
      Logger.log(`PENDING ${message.pendingMessage}`);
      Logger.log(`IN-PROGRESS ${message.inProgressMessage}`);
      Logger.log(`COMPLETED ${message.completedMessage}`);
      Logger.log(`SHIPPING QUESTION ${message.shippingQuestion}`);
      Logger.log(`SHIPPED ${message.shippedMessage}`);
      Logger.log(`FAILED ${message.failedMessage}`);
      Logger.log(`REJECTED BY STUDENT ${message.rejectedByStudentMessage}`);
      Logger.log(`REJECTED BY STAFF ${message.rejectedByStaffMessage}`);
      Logger.log(`BILLED ${message.billedMessage}`);
      Logger.log(`PICKED UP ${message.pickedUpMessage}`);

      t.pass(`Good : ${JSON.stringify(message)}`)
      t.fail(`Bad`)
  })

  await test(`Messages`, (t) => {
      let message = new CreateSubmissionMessage('Cody', 'SomeProject', 102938471431 );
      Logger.log('DS MESSAGE' + message.dsMessage);
      Logger.log('CREAFORM MESSAGE' + message.creaformMessage);
      Logger.log('MISSING ACCESS' + message.missingAccessMessage);
      Logger.log('SHIPPING MESSAGE' + message.shippingMessage);
      t.pass(`Good : ${JSON.stringify(message)}`)
      t.fail(`Bad`)
  })

  await test(`Priority With Email or SID`, (t) => {
      let goodEmailBadSID = GetPriorityFromEmailOrSID(`wkoch@berkeley.edu`, `12093487123`)
      let badEmailGoodSID = GetPriorityFromEmailOrSID(`nmaitra@berkeley.edu`, `3033953355` )
      let badEmailGoodSID2 = GetPriorityFromEmailOrSID(`some@thing.com`, `1029384712`)
      t.pass(`Good : ${goodEmailBadSID}, ${badEmailGoodSID}, ${badEmailGoodSID2}`)
      t.fail(`Bad`)
  })

  await test(`Priority From Email`, (t) => {
      let x = GetPriorityFromEmailOrSID(`saveritt@berkeley.edu`, 3035249023);
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`JobNumber`, (t) => {
      let x = new JobNumberGenerator(new Date()).Create();
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })
  await test.finish();
}



// /**
//  * Unit Test for Running Both 'OnEdit' & 'OnFormSubmit' Messages asynchronously. 
//  */
// const _testAllMessages = async () => {

//     Promise.all([
//         await _testOnEditMessages(),
//         await _testOnformSubmitMessages(),
//     ])
//     .then(Logger.log('Test Success'))
//     .catch(Error => {
//         Logger.log(Error + 'Failure');
//     }); 
// }




