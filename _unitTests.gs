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
  const test = new GasTap()

  // await test(`Checking...`, (t) => {    
  //     let i = 3 + 4
  //     t.equal(i, 7, `Calc : 3 + 4 = 7  : Correct`)
  // })


  await test(`Generate Barcode: `, (t) => {
      let jobnumber = `20210301140515`
      let x = GenerateBarCode(jobnumber)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Generate QRCode: `, (t) => {
      let jobnumber = `20210301140515`
      let x = GenerateQRCode(jobnumber)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Staff Functions`, (t) => {
      let x = new DesignSpecialist(`Testa`, `Testa Nama`, `some@thing.com`)
      StaffEmailAsString()
      InvokeDS(`Cody`,`email`)
      CreateDS()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Staff Functions`, (t) => {
      let x = MakeLink(`some@thing.com`)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Calc Average Turnaround`, (t) => {
      let x = CalculateAverageTurnaround(sheetDict.ultimaker)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Calc Duration`, (t) => {
      let x = CalculateDuration( new Date(1992,03,27), new Date() )
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Count Active Users`, (t) => {
      let x = CountActiveUsers()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Calc Distribution`, (t) => {
      let x = CalculateDistribution()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Calc Standard Deviation`, (t) => {
      let x = CalculateStandardDeviation()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Calc Metrics`, (t) => {
      let x = Metrics()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Get Last Shopify Order`, (t) => {
      let x = GetLastShopifyOrder()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Get Shopify Orders List`, (t) => {
      let x = GetShopifyOrdersList()
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Shopify Lookup Product ID`, (t) => {
      let x = LookupProductID(`Fortus Red ABS-M30`)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Shopify Functions`, (t) => {
      let x = GetShopifyCustomerByEmail(`eli_lee@berkeley.edu`)
      t.pass(`Good : ${JSON.stringify(x)}`)
      t.fail(`Bad`)
  })

  await test(`Shopify Functions`, (t) => {
      let p = LookupProductID(`Fortus Red ABS-M30`)
      let x = GetShopifyProductByID(p)
      t.pass(`Good : ${JSON.stringify(x)}`)
      t.fail(`Bad`)
  })

  await test(`Messages`, (t) => {
      let message = new CreateMessage('Cody', 'Test Project', '101293874098', 'url',
        'material1URL', 45, 'TestPLA',
        'material2URL', 15, 'TestBreakaway',
        'mat3URL', 23, 'Steel',
        'mat4URL', 24, 'Aluminum',
        'mat5URL', 75, 'Plastic',
        'designspecialist', 'cody@glen.com', 45.50)

      Logger.log('DEFAULT' + message.defaultMessage);
      Logger.log('RECEIVED' + message.receivedMessage);
      Logger.log('PENDING' + message.pendingMessage);
      Logger.log('IN-PROGRESS' + message.inProgressMessage);
      Logger.log('COMPLETED' + message.completedMessage);
      Logger.log('SHIPPING QUESTION' + message.shippingQuestion);
      Logger.log('SHIPPED' + message.shippedMessage);
      Logger.log('FAILED' + message.failedMessage);
      Logger.log('R1' + message.rejectedByStudentMessage);
      Logger.log('BILLED' + message.billedMessage);

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
      let goodEmailBadSID = GetPriorityWithEmailOrSID(`wkoch@berkeley.edu`, `12093487123`)
      let badEmailGoodSID = GetPriorityWithEmailOrSID(`nmaitra@berkeley.edu`, `3033953355` )
      let badEmailGoodSID2 = GetPriorityWithEmailOrSID(`some@thing.com`, `1029384712`)
      t.pass(`Good : ${goodEmailBadSID}, ${badEmailGoodSID}, ${badEmailGoodSID2}`)
      t.fail(`Bad`)
  })

  await test(`Priority From Email`, (t) => {
      let x = GetPriorityFromEmail(`saveritt@berkeley.edu`)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`Priority`, (t) => {
      let x = GetPriority(`3035249023`)
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  await test(`JobNumber`, (t) => {
      let x = CreateJobNumber(new Date())
      t.pass(`Good : ${x}`)
      t.fail(`Bad`)
  })

  test.finish()
}



// /**
//  * Unit Test for Shopify Functions
//  */
// const _testShopifyFunctions = async () => {
//       try {
//           let lastOrder = await GetLastShopifyOrder()
//           Logger.log(`Last Shopify Order : ${lastOrder}`)

//           let orderList = await GetShopifyOrdersList()
//           Logger.log(`Shopify Order List: ${orderList}`)

//           let productID = await LookupProductID(`Fortus Red ABS-M30`)
//           Logger.log(`Product ID : ${productID}`)

//           let getEmail = await GetShopifyCustomerByEmail(`eli_lee@berkeley.edu`)
//           Logger.log(`Get Shopify Customer by Email : ${JSON.stringify(getEmail)}`)

//           let shopifyProduct = await GetShopifyProductByID(productID)
//           Logger.log(`Get Shopify Product : ${JSON.stringify(shopifyProduct)}`)

//           let customer = await GetShopifyCustomerByEmail(`jacobsinstitutestore@gmail.com`)
//           let materialsList = [`Fortus Red ABS-M30`, 5, `Objet Polyjet VeroMagenta RGD851`, 10, null, 123, `Stratasys Dimension Soluble Support Material P400SR`, 15, null, 20]
//           let pack = await PackageMaterials(`Fortus Red ABS-M30`, 5, `Objet Polyjet VeroMagenta RGD851`, 10, null, 123, `Stratasys Dimension Soluble Support Material P400SR`, 15, null, 20)
//           let lines = await MakeLineItems(pack)
//           let order = await CreateShopifyOrder(customer, `1203948734998987`, materialsList, lines) 
//           Logger.log(`Order : ${JSON.stringify(order)}`)

//       } catch(err) {
//           Logger.log(`${err} : Whoops`)
//       }
// }




