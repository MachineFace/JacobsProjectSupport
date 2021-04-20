
/**
 * Barcode UnitTests
 */
const _testGenerateBarcodeQRCode = async () => {
    try {
        jobnumber = "20210301140515";   //Known working Test JobNumber
        if( await GenerateBarCode(jobnumber) !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateBarCode('123kjnb345kjb3') !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateBarCode('#@$%%$^*^&R@#$G') !== null) {
            Logger.log('PASSED'); //Should FAIL
        }
    }
    catch(err) {
        Logger.log(err + ' : Failed Test')
    }
    try {
        jobnumber = "20210301140515";   //Known working Test JobNumber
        if( await GenerateQRCode(jobnumber) !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateQRCode('123kjnb345kjb3') !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateQRCode('#@$%%$^*^&R@#$G') !== null) {
            Logger.log('PASSED'); //Should FAIL
        }
    }
    catch(err) {
        Logger.log(`${err} : Failed Test`)
    }
}



/**
 * Unit Test
 */
const _testStaffFunctions = async () => {
  try {
      Promise.all([
          await DesignSpecialist('Testa', 'Testa Nama', 'test@test.com'),
          await MakeLink('test@test.com'),
          await StaffEmailAsString(),
          await InvokeDS('Cody', 'email'),
          await CreateDS(),
      ])
      .then(`PASSED`)
      .catch(err => Logger.log(`FAILED : ${err}`))
  } catch(err) {
      Logger.log(`FAILED : ${err}`)
  } 
}


/**
 * Unit Test for Shopify Functions
 */
const _testShopifyFunctions = async () => {
      try {
          let lastOrder = await GetLastShopifyOrder()
          Logger.log(`Last Shopify Order : ${lastOrder}`)

          let orderList = await GetShopifyOrdersList()
          Logger.log(`Shopify Order List: ${orderList}`)

          let productID = await LookupProductID(`Fortus Red ABS-M30`)
          Logger.log(`Product ID : ${productID}`)

          let getEmail = await GetShopifyCustomerByEmail(`eli_lee@berkeley.edu`)
          Logger.log(`Get Shopify Customer by Email : ${JSON.stringify(getEmail)}`)

          let shopifyProduct = await GetShopifyProductByID(productID)
          Logger.log(`Get Shopify Product : ${JSON.stringify(shopifyProduct)}`)

          let customer = await GetShopifyCustomerByEmail(`jacobsinstitutestore@gmail.com`)
          let materialsList = [`Fortus Red ABS-M30`, 5, `Objet Polyjet VeroMagenta RGD851`, 10, null, 123, `Stratasys Dimension Soluble Support Material P400SR`, 15, null, 20]
          let pack = await PackageMaterials(`Fortus Red ABS-M30`, 5, `Objet Polyjet VeroMagenta RGD851`, 10, null, 123, `Stratasys Dimension Soluble Support Material P400SR`, 15, null, 20)
          let lines = await MakeLineItems(pack)
          let order = await CreateShopifyOrder(customer, `1203948734998987`, materialsList, lines) 
          Logger.log(`Order : ${JSON.stringify(order)}`)

      } catch(err) {
          Logger.log(`${err} : Whoops`)
      }
}




