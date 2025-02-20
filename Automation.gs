
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
      return 1;
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
        "headers" : { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
        "muteHttpExceptions" : true,
      };

      const response = await UrlFetchApp.fetch(url, param);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
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
      console.error(`${err} : Couldn't fetch price.`);
      return 1;
    }
  }

  /**
   * AUTOMATION : Get Price From Shopify
   * Used in "Update_Unit_Costs_Per_Sheet()" function
   * @param {string} none
   * @return {float} none
   */
  static async Update_All_Unit_Costs_With_ShopifyAPI() {
    Object.values(STORESHEETS).forEach(sheet => {
      console.info(`Updating (${sheet.getSheetName()}) Unit Costs`);
      HackyStoreAutomation.Update_Unit_Costs_Per_Sheet(sheet);
      Utilities.sleep(1000);
    });
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
      return 1;
    }

  }


  /**
   * AUTOMATION : Parses html to find the Product ID. (NOT USING SHOPIFY API)
   */
  async Get_Product_ID_From_URL(sheet) {
    const start = `"product":{"id":`;
    const end = `,"gid":"gid:`;

    const headers = { "Content-Type" : "application/json", "Authorization": "Basic " };
    const params = { 
      method : "GET", 
      headers : headers, 
      contentType : "application/json", 
      followRedirects : true, 
      muteHttpExceptions : true,
    };
      
    try {
      [...SheetService.GetColumnDataByHeader(sheet, "Link")]
        .filter(Boolean)
        .forEach( async (url, index) => {
          const response = await UrlFetchApp.fetch(url, params);
          const responseCode = response.getResponseCode();
          if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
          const content = response.getContentText();

          const searchStart = content.search(start);
          const searchEnd = content.search(end);
          const id = content.slice(searchStart + start.length, searchEnd);
          sheet.getRange(2 + index, 4, 1, 1).setValue(id);
          
        });
      return 0;
    } catch(err) {
      console.error(`"Get_Product_ID_From_URL()" failed : ${err}`);
      return 1;
    }
  }

}

const RunHackySheetUpdater = () => HackyStoreAutomation.Update_All_Unit_Costs_With_ShopifyAPI();


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Looking up a material's URL
 */
class MaterialLookup {
  constructor({
    materialName : matertialName = `Canon Poster Printer: 36" wide (priced per foot)`,
  }){
    this.materialName = matertialName;
  }

  get URL(){
    console.warn(`Getting URL for ${this.materialName}....`);
    let url = ``;
    try {
      Object.values(STORESHEETS).forEach(sheet => {
        let finder = sheet.createTextFinder(this.materialName).findNext();
        if(finder) {
          let row = finder.getRow();
          url = SheetService.GetByHeader(sheet, `Link`, row);
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


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Updating the Semester Start and End Dates
 */
class HackySemesterDateLookup {
  constructor() {
    this.url = `https://jacobsinstitute.berkeley.edu/making-at-jacobs/`;
    this.startDate = ``;
    this.endDate = ``;
    this.nextDate = ``;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * DEFUNCT : Get Price From Shopify Store URL (NOT USING SHOPIFY API)
   * Used in "WritePrice()" function
   * @private
   * @param {string} url
   * @return {float} price
   */
  async _GetDates() {
    const param = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true,
    };

    try {
      const response = await UrlFetchApp.fetch(this.url, param);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode }---> ${RESPONSECODES[responseCode]}`);

      const content = response.getContentText();
      const index = content.search(`Key Dates`);
      if(index <= 0) throw new Error(`No content`);

      let chunk = content
        .substring(index, index + 1200)
        .replace(/<\/?[^>]+(>|$)/g, "");

      // Start Date
      let serviceStartIdx = chunk.search(`JPS Service`);
      if (serviceStartIdx >= 0) {
        this.startDate = chunk
          .substring(serviceStartIdx + 20, serviceStartIdx + 26) + `, ` + new Date().getFullYear();
        console.info(this.startDate);
      }

      // End Date
      let serviceEndIdx = chunk.search(`Last day to submit`);
      if (serviceEndIdx >= 0) {
        this.endDate = chunk
          .substring(serviceEndIdx + 28, serviceEndIdx + 33) + `, ` + new Date().getFullYear();
        console.info(this.endDate);
      }

      // Next
      let end = new Date(this.endDate);
      this.nextDate = new Date(end.getFullYear(), end.getMonth() + 3, end.getDay() + 20 ).toDateString();
      return { 
        start : this.startDate, 
        end : this.endDate, 
        next : this.nextDate, 
      };
    } catch(err){
      console.error(`"_GetDates()" failed : ${err}`);
      return 1;
    }
  }

  async PrintDates() {
    const { start, end, next } = await this._GetDates();
    console.info(start);
    OTHERSHEETS.Summary.getRange(1, 6, 1, 1).setValue(`Start of JPS Service:\n ${start}`);
    OTHERSHEETS.Summary.getRange(1, 8, 1, 1).setValue(`Last Day to Submit:\n ${end}`);
    OTHERSHEETS.Summary.getRange(1, 10, 1, 1).setValue(`JPS Service Resumes: \n ${next}`);
  }

}
const PrintServiceDates = () => {
  let m = new HackySemesterDateLookup({});
  m.PrintDates();
}

/**
 * <p><strong>Key Dates for Spring 2023:</strong></p>
  <ul>
    <li data-stringify-indent="1" data-stringify-border="0">Maker Pass &amp; JPS Registration opens: Jan 10</li>
    <li data-stringify-indent="1" data-stringify-border="0">JPS Service begins: Jan 17</li>
    <li data-stringify-indent="1" data-stringify-border="0">Makerspace access begins: Jan 17</li>
    <li data-stringify-indent="1" data-stringify-border="0">Hands-on trainings begin: Jan 23</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day of hands-on trainings: Mar 3</li>
    <li data-stringify-indent="1" data-stringify-border="0"><strong>Spring Recess (no makerspace access or JPS service):</strong> Mar 27-31</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to submit JPS project: May 5</li>
    <li data-stringify-indent="1" data-stringify-border="0">Makerspace early closure (at 7pm): May 8-12</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to pick up JPS projects: May 12</li>
    <li data-stringify-indent="1" data-stringify-border="0">Last day to access Makerspace: May 12</li>
  </ul>
*/






