
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Updating Prices from Shopify and Updating ID's from StorePage.
 */
class HackyStoreAutomation
{
  constructor() {
    // this.UpdateProductID();
    this.UpdatePriceUsingShopifyAPI();
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * DEFUNCT : Write the price to sheet
   * Used in "UpdatePriced()" function
   */
  _WritePrice (sheet) {
    let links = GetColumnDataByHeader(sheet, "Link");
    let cleaned = links.filter(Boolean);
    cleaned.forEach( async (link,index) => {
      const price = await this.GetPriceFromStore(link);
      sheet.getRange(index + 2, 6, 1, 1).setValue(price);
    });

  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * DEFUNCT : Get Price From Shopify Store URL (NOT USING SHOPIFY API)
   * Used in "WritePrice()" function
   * @param {string} url
   * @return {float} price
   */
  async _GetPriceFromStore (url) {
    let price;
    try
    {
      // let meta = '<meta property="og:price:amount" content="0.17">';
      const urlFixed = `${url.toString()}&exportFormat=html`;
      const param = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
        muteHttpExceptions: true,
      };

      const html = await UrlFetchApp.fetch(url, param);

      const responseCode = html.getResponseCode();
      // Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      if(responseCode == 200 || responseCode == 201) {
        const content = html.getContentText();
        const searchstring = 'og:price:amount';
        const index = content.search(searchstring);
        if (index >= 0) {
          const pos = index + searchstring.length
          const rate = content.substring(pos + 10, pos + 16);
          const stripped = +Number(rate.replace(/^"(.*)"$/, '$1'));
          price = +Number.parseFloat(stripped).toFixed(2);
        }
      }
    }
    catch(err){
      Logger.log(`${err} : Couldn't fetch price.`);
    }
    Logger.log(`Price = $${price}`);
    return price;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * AUTOMATION : Get Price From Shopify
   * Used in "UpdatePricePerSheet()" function
   * @param {string} none
   * @return {float} none
   */
  async UpdatePriceUsingShopifyAPI () {
    for(const [key, sheet] of Object.entries(STORESHEETS)) {
      this.UpdatePricePerSheet(sheet);
      Utilities.sleep(1000);
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * AUTOMATION : Update Price Per Sheet
   * @param {sheet} sheet
   * @return {bool} true
   */
  UpdatePricePerSheet (sheet) {
    const shopify = new ShopifyAPI({jobnumber : 0});
    const data = GetColumnDataByHeader(sheet, "Product ID (Shopify)");
    const ids = data.filter(Boolean);
    Logger.log(ids.toString())
    ids.forEach( async (id, index) => {
      let info = await shopify.GetProductByID(id);
      let price = info?.variants[0]?.price;
      Logger.log(`Price : $${price}`);
      SetByHeader(sheet, "Price", index + 2, price);
    })
    return true;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * AUTOMATION : Update Each Sheet with Product IDs : Uses FetchProductIDInProductURL()
   */
  UpdateProductID () {    
    try {
      for(const [key, sheet] of Object.entries(STORESHEETS)) {
        this.FetchProductIDInProductURL(sheet);
      }
      Logger.log('Product IDs have been updated and written to each Store Sheet');
    }
    catch(err) {
      Logger.log(err + 'Could not update Product IDs to sheets for some reason.');
    }

  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * AUTOMATION : Parses html to find the Product ID. (NOT USING SHOPIFY API)
   */
  async FetchProductIDInProductURL (sheet) {

    const start = '"product":{"id":';
    const end = ',"gid":"gid:';

    const headers = { "Content-Type" : "application/json", "Authorization": "Basic " };
    const params = { 
      "method" : "GET", 
      "headers" : headers, 
      "contentType" : "application/json", 
      followRedirects : true, 
      muteHttpExceptions : true,
    };
    
    let links = GetColumnDataByHeader(sheet, "Link");
    let urls = links.filter(Boolean);
    try {
      urls.forEach( async (url, index) => {
        const html = await UrlFetchApp.fetch(url, params);

        const responseCode = html.getResponseCode();
        // Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
        if(responseCode == 200 || responseCode == 201) {
          let content = html.getContentText();
          let searchStart = content.search(start);
          let searchEnd = content.search(end);
          let id = content.slice(searchStart + start.length, searchEnd);
          sheet.getRange(2 + index, 4, 1, 1).setValue(id);
        }
      })
    } 
    catch(err) {
      Logger.log(`${err} : Whoops`);
    }

  }
}

const RunHackySheetUpdater = () => new HackyStoreAutomation();

