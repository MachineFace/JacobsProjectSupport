
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
      // console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
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
      console.error(`${err} : Couldn't fetch price.`);
    }
    console.info(`Price = $${price}`);
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
    Object.values(STORESHEETS).forEach(sheet => {
      // console.info(sheet)
      this.UpdatePricePerSheet(sheet);
      Utilities.sleep(1000);
    });
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
    console.info(ids.toString())
    ids.forEach( async (id, index) => {
      let info = await shopify.GetProductByID(id);
      let price = info?.variants[0]?.price;
      console.info(`Price : $${price}`);
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
      console.info('Product IDs have been updated and written to each Store Sheet');
    }
    catch(err) {
      console.error(err + 'Could not update Product IDs to sheets for some reason.');
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
        // console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
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
      console.error(`${err} : Whoops`);
    }

  }
}

const RunHackySheetUpdater = () => new HackyStoreAutomation();



class MaterialLookup
{
  constructor({
    materialName : matertialName = `Canon Poster Printer: 36" wide (priced per foot)`,
  }){
    this.materialName = matertialName;
  }

  get URL(){
    let url = ``;
    try {
      console.warn(`Getting URL for ${this.materialName}....`);
      Object.values(STORESHEETS).forEach(sheet => {
        let finder = sheet.createTextFinder(this.materialName).findNext();
        if(finder) {
          let row = finder.getRow();
          url = GetByHeader(sheet, `Link`, row);
          console.info(`Name: ${this.materialName}, URL: ${url}`);
        }
      })
      return url;
    } catch(err) {
      console.error(`${err} : Whoops, failed....`);
    }
  }
}

const _testURL = () => {
  let m = new MaterialLookup({}).URL;
  console.info(`Result ${m}`)
}








