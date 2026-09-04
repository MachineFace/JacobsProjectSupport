
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Updating Prices from Shopify and Updating ID's from StorePage.
 */
class HackyStoreAutomation {
  constructor() {

  }


  /**
   * Write the price to sheet
   * Used in "UpdatePriced()" function
   * @private
   */
  static _Write_Unit_Cost(sheet) {
    try {
      [...SheetService.GetColumnDataByHeader(sheet, "Link")]
        .filter(Boolean)
        .forEach( async (link, index) => {
          const price = await this.GetPriceFromStore(link);
          sheet.getRange(index + 2, 6, 1, 1).setValue(price);
        });
      return 0;
    } catch(err) {
      console.error(`"_Write_Unit_Cost()" failed : ${err}`);
      return null;
    }

  }


  /**
   * Get Price From Shopify Store URL (NOT USING SHOPIFY API)
   * Used in "WritePrice()" function
   * @private
   * @param {string} url
   * @return {float} price
   */
  static async _Get_Unit_Cost_From_Store(url = ``) {
    try {
      let price;
      // let meta = '<meta property="og:price:amount" content="0.17">';
      const urlFixed = `${url.toString()}&exportFormat=html`;
      const param = {
        "method" : "GET",
        "headers" : { 
          'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() 
        },
        "muteHttpExceptions" : true,
      }

      const response = await UrlFetchApp.fetch(url, param);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }
      const content = response.getContentText();

      const searchstring = 'og:price:amount';
      const index = content.search(searchstring);
      if (index >= 0) {
        const pos = index + searchstring.length;
        const rate = content.substring(pos + 10, pos + 16);
        const stripped = +Number(rate.replace(/^"(.*)"$/, '$1'));
        price = +Number.parseFloat(stripped).toFixed(2);
      }
      console.info(`Price = $${price}`);
      return price;
    } catch(err){
      console.error(`${err}: Couldn't fetch price.`);
      return null;
    }
  }

  /**
   * AUTOMATION : Get Price From Shopify
   * Used in "Update_Unit_Costs_Per_Sheet()" function
   * @param {string} none
   * @return {float} none
   */
  static async Update_All_Unit_Costs_With_ShopifyAPI() {
    try {
      Object.values(STORESHEETS).forEach(sheet => {
        console.info(`Updating (${sheet.getSheetName()}) Unit Costs`);
        HackyStoreAutomation.Update_Unit_Costs_Per_Sheet(sheet);
        Utilities.sleep(1000);
      });
    } catch(err) {
      console.error(`"Update_All_Unit_Costs_With_ShopifyAPI()" failed: ${err}`);
      return null;
    }
  }

  /**
   * AUTOMATION : Update Price Per Sheet
   * @param {sheet} sheet
   * @return {bool} true
   */
  static Update_Unit_Costs_Per_Sheet(sheet) {
    const shopify = new ShopifyAPI();
    const ids = [...SheetService.GetColumnDataByHeader(sheet, "Product ID (Shopify)")]
      .filter(Boolean);
    console.info(ids.toString());
    ids.forEach( async (id, index) => {
      let info = await shopify.GetProductByID(id);
      console.info(info);
      let price = info?.variants[0]?.price;
      console.info(`Price : $${price}`);
      SheetService.SetByHeader(sheet, "Price", index + 2, price);
    })
    return true;
  }

  /**
   * AUTOMATION : Update Each Sheet with Product IDs : Uses Get_Product_ID_From_URL()
   */
  static Update_Product_IDs() {    
    try {
      Object.values(STORESHEETS).forEach(sheet => {
        HackyStoreAutomation.Get_Product_ID_From_URL(sheet);
      });
      console.info('Product IDs have been updated and written to each Store Sheet');
      return 0;
    } catch(err) {
      console.error(`"Update_Product_IDs()" failed ${err}`);
      return null;
    }

  }


  /**
   * AUTOMATION : Parses html to find the Product ID. (NOT USING SHOPIFY API)
   */
  async Get_Product_ID_From_URL(sheet) {
    const start = `"product":{"id":`;
    const end = `,"gid":"gid:`;

    const params = { 
      'method' : "GET", 
      'headers' : { 
        "Content-Type" : "application/json", "Authorization": "Basic "
      }, 
      'contentType' : "application/json", 
      'followRedirects' : true, 
      'muteHttpExceptions' : true,
    }
      
    try {
      [...SheetService.GetColumnDataByHeader(sheet, "Link")]
        .filter(Boolean)
        .forEach( async (url, index) => {
          const response = await UrlFetchApp.fetch(url, params);
          const responseCode = response.getResponseCode();
          if(![200, 201].includes(responseCode)) {
            throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
          }
          const content = response.getContentText();

          const searchStart = content.search(start);
          const searchEnd = content.search(end);
          const id = content.slice(searchStart + start.length, searchEnd);
          sheet.getRange(2 + index, 4, 1, 1).setValue(id);
          
        });
      return 0;
    } catch(err) {
      console.error(`"Get_Product_ID_From_URL()" failed : ${err}`);
      return null;
    }
  }

}

const RunHackySheetUpdater = () => HackyStoreAutomation.Update_All_Unit_Costs_With_ShopifyAPI();


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Look up a material's URL
 * @private
 * @param {string} material name
 * @returns {string} url
 */
const MaterialLookup = (materialName) => {
  try {
    if (!materialName || materialName === null || materialName === undefined) {
      return null;
    }

    if (typeof value !== `string`) {
      throw new Error(`Invalid Inputs: ${materialName}`);
    }

    console.warn(`Getting URL for ${materialName}....`);
    let url = ``;

    Object.values(STORESHEETS).forEach(sheet => {
      let finder = sheet.createTextFinder(materialName).findNext();
      if(finder) {
        let row = finder.getRow();
        url = SheetService.GetByHeader(sheet, `Link`, row);
        console.info(`Name: ${materialName}, URL: ${url}`);
      }
    })
    return url;
  } catch(err) {
    console.error(`"MaterialLookup()" failed: ${err}`);
    return null;
  }

}

const _testURL = () => {
  let m = MaterialLookup();
  console.info(`Result: ${m}`)
}



const _testHacky = () => {

  HackyStoreAutomation.Update_All_Unit_Costs_With_ShopifyAPI();

}



