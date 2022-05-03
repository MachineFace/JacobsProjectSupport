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

  await test(`Priority Test`, async(t) => {
    const x = await new CheckPriority({email : `codyglen@berkeley.edu`, sid : 91283741923}).Priority;
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`FormBuilder Test`, async(t) => {
    const x = new ApprovalFormBuilder({
      name : "Dingus",
      jobnumber : 19238712398,
      cost : 50.00,
    });
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Generate Barcode: `, async(t) => {
    const jobnumber = `20210301140515`;
    const qgen = new BarcodeGenerator({jobnumber : jobnumber});
    const x = await qgen.GenerateBarCode();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Generate QRCode: `, async(t) => {
    const url = `http://www.codyglen.com/`;
    const qgen = new QRCodeGenerator({url : url,});
    const x = await qgen;
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Staff Functions`, (t) => {
    const x = new DesignSpecialist(`Testa`, `Testa Nama`, `some@thing.com`);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Staff Functions`, (t) => {
    const x = BuildStaff();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Average Turnaround`, (t) => {
    const x = calc.CalculateAverageTurnaround(SHEETS.Ultimaker);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Duration`, (t) => {
    const x = calc.CalculateDuration( new Date(1992,03,27), new Date() );
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Count Active Users`, (t) => {
    const x = calc.CountActiveUsers();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Distribution`, (t) => {
    const x = calc.CalculateDistribution();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Standard Deviation`, (t) => {
    const x = calc.CalculateStandardDeviation();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Calc Metrics`, (t) => {
    const x = Metrics();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Get Last Shopify Order`, (t) => {
    const x = shopify.GetLastOrder();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Get Shopify Orders List`, (t) => {
    const x = shopify.GetOrdersList();
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Lookup Product ID`, (t) => {
    const x = shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Functions`, (t) => {
    const x = shopify.GetCustomerByEmail(`eli_lee@berkeley.edu`);
    t.pass(`Good : ${JSON.stringify(x)}`);
    t.fail(`Bad`);
  })

  await test(`Shopify Functions`, (t) => {
    const p = shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
    const x = shopify.GetProductByID(p);
    t.pass(`Good : ${JSON.stringify(x)}`);
    t.fail(`Bad`);
  })

  await test(`OnChange Messages`, (t) => {
    const message = new CreateMessage({
      name : 'Cody', 
      projectname : 'Test Project',
      jobnumber : '101293874098', 
      approvalURL : 'url',
      material1URL : 'material1URL', material1Quantity : 45, material1Name : 'TestPLA',
      material2URL : 'material2URL', material2Quantity : 15, material2Name : 'TestBreakaway',
      material3URL : 'mat3URL', material3Quantity : 23, material3Name : 'Steel',
      material4URL : 'mat4URL', material4Quantity : 24, material4Name : 'Aluminum',
      material5URL : 'mat5URL', material5Quantity : 75, material5Name : 'Plastic',
      designspecialist : 'designspecialist', designspecialistemaillink : 'cody@glen.com', cost : 45.50,
    });

    const a = `DEFAULT ${message.defaultMessage}`;
    const b = `RECEIVED ${message.receivedMessage}`;
    const c = `PENDING ${message.pendingMessage}`;
    const d = `IN-PROGRESS ${message.inProgressMessage}`;
    const e = `COMPLETED ${message.completedMessage}`;
    const f = `SHIPPING QUESTION ${message.shippingQuestion}`;
    const g = `SHIPPED ${message.shippedMessage}`;
    const h = `FAILED ${message.failedMessage}`;
    const i = `REJECTED BY STUDENT ${message.rejectedByStudentMessage}`;
    const j = `REJECTED BY STAFF ${message.rejectedByStaffMessage}`;
    const k = `BILLED ${message.billedMessage}`;
    const l = `PICKED UP ${message.pickedUpMessage}`;

    t.pass(`Good : ${a,b,c,d,e,f,g,h,i,j,k,l}`);
    t.fail(`Bad`);
  })

  await test(`Submission Messages`, (t) => {
    const message = new CreateSubmissionMessage({ 
      name : 'Cody', 
      projectname : 'SomeProject', 
      jobnumber : 102938471431,
    } );
    const w = `DS MESSAGE : ${message.dsMessage}`;
    const x = `CREAFORM MESSAGE : ${message.creaformMessage}`;
    const y = `MISSING ACCESS : ${message.missingAccessMessage}`;
    const z = `SHIPPING MESSAGE : ${message.shippingMessage}`;
    t.pass(`Good : ${w,x,y,z}`);
    t.fail(`Bad`)
  })

  await test(`JobNumber`, (t) => {
    const x = new JobNumberGenerator({ date : new Date() }).jobnumber;
    t.pass(`Good : ${x}`);
    t.fail(`Bad`);
  })

  await test(`Logger Test`, (t) => {

    const write = new WriteLogger();
    const x = write.Warning(`Warning Test ----> Message`);
    const y = write.Info(`Info Test ----> Message`);
    const z = write.Error(`ERROR Test ----> Message`);
    const w = write.Debug(`Debugging Test ----> Message`);
    t.pass(`Good : ${x,y,z,w}`);
    t.fail(`Bad`);
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
//     .then(console.info('Test Success'))
//     .catch(Error => {
//         console.error(Error + 'Failure');
//     }); 
// }




