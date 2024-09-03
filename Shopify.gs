
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Interfacing with Shopify API
 */
class ShopifyAPI {
  constructor(){
    /** @private */
    this.root = `https://jacobs-student-store.myshopify.com/admin/api/2023-07/`;
    /** @private */
    this.api_key = PropertiesService.getScriptProperties().getProperty(`SHOPIFY_KEY`);
    /** @private */
    this.api_pass = PropertiesService.getScriptProperties().getProperty(`SHOPIFY_PASS`);
    /** @private */
    this.api_email = PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`);
    /** @private */
    this.id;
    /** @private */
    this.email;
    /** @private */
    this.customer;
    /** @private */
    this.customerID;
    /** @private */
    this.totalprice;

    /** @private */
    this.getParams = {
      method : `GET`,
      headers : { "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Better Lookup
   * @param {string} material name
   * @returns {[string, string]} productID, link, price
   * @private
   */
  _GetStoreProductID(material) {
    let productID;
    try {
      if(!material) throw new Error(`No material supplied`);
      Object.values(STORESHEETS).forEach(sheet => {
        const idx = SearchSpecificSheet(sheet, material);
        if(idx) {
          // let link = sheet.getRange(idx, 2, 1, 1).getValue();
          // let price = sheet.getRange(idx, 6, 1, 1).getValue();
          productID = sheet.getRange(idx, 4, 1, 1).getValue().toString();
        }
      });
      return productID;
    } catch(err) {
      console.error(`"_GetStoreProductID()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Packages Materials in a way that can be used in MakeLineItems
   * @param {object} list of material names and quantities
   * @returns {[{string}]} materials
   * @private
   */
  async _PackageMaterials({
      material1Name = ``, material1Quantity = 0,
      material2Name = ``, material2Quantity = 0,
      material3Name = ``, material3Quantity = 0,
      material4Name = ``, material4Quantity = 0,
      material5Name = ``, material5Quantity = 0,
  }) {

    let pack = {
      material1 : { 
        name : material1Name, 
        amount : material1Quantity, 
        id : 0, 
      },
      material2 : { 
        name : material2Name, 
        amount : material2Quantity, 
        id : 0,
      },
      material3 : { 
        name : material3Name, 
        amount : material3Quantity, 
        id : 0,
      },
      material4 : { 
        name : material4Name, 
        amount : material4Quantity, 
        id : 0,
      },
      material5 : { 
        name : material5Name, 
        amount : material5Quantity, 
        id : 0,
      },
    };

    for(const [key, values] of Object.entries(pack)) {
      if(!values.name || !values.amount) {
        delete pack[key];
      } else values.id = this._GetStoreProductID(values.name);
    }
    for(const [key, values] of Object.entries(pack)) {
      if(!values.id) delete pack[key];
    }

    let sum = 0.0;
    let shopifyPack = [];
    for(const [key, values] of Object.entries(pack)) {
      console.info(values.id);
      let info = await this.GetProductByID(values.id);

      let calcultedPrice = Number(info?.variants[0]?.price * pack[key].amount).toFixed(2);
      let fallbackPrice = Number(info?.price * pack[key].amount).toFixed(2);
      let price = calcultedPrice ? calcultedPrice : fallbackPrice;
      let subtotal = +Number(price).toFixed(2);

      sum += subtotal;
      shopifyPack.push({ 
        name : key,
        title : info?.title,
        id : Number(info?.id),
        price : info?.variants[0]?.price,
        quantity : pack[key].amount,
        subtotal : subtotal,
        // discount_allocations : [{
        //   amount: "0.00",
        //   discount_application_index : 0,
        //   amount_set : { 
        //     shop_money : { 
        //       amount : 0.00, 
        //       currency_code : "USD" 
        //     },
        //   },
        // }], 
      });
    }
    const total = Number(sum).toFixed(2);
    this.totalprice = total;

    // console.info(`Total Price = ${total}`);
    console.info(`PACKED ----> ${JSON.stringify(shopifyPack, null, 4)}`);
    return shopifyPack;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Shopify Order
   * @param {object} inputs
   * @returns {object} order
   */
  async CreateOrder({
    id : id = new IDService().id,
    email : email = this.api_email,
    material1Name : material1Name = `None`,
    material1Quantity : material1Quantity = 0,
    material2Name : material2Name = `None`,
    material2Quantity : material2Quantity = 0,
    material3Name : material3Name = `None`,
    material3Quantity : material3Quantity = 0,
    material4Name : material4Name = `None`,
    material4Quantity : material4Quantity = 0,
    material5Name : material5Name = `None`,
    material5Quantity : material5Quantity = 0,
  }) {
    const url = `${this.root}orders.json/`;
    const customer = await this.GetCustomerByEmail(email) ? await this.GetCustomerByEmail(email) : await this.GetCustomerByEmail(this.api_email);
    this.customerID = customer.id;
    const pack = await this._PackageMaterials({
      material1Name, material1Quantity,
      material2Name, material2Quantity,
      material3Name, material3Quantity,
      material4Name, material4Quantity,
      material5Name, material5Quantity,
    });

    const order = {
      order: {
        line_items : pack,
        customer : { id : customer.id },
        total_price : this.totalprice,
        financial_status : `paid`,
        fulfillment_status : `fulfilled`,
        inventory_behaviour : `decrement_ignoring_policy`,
        note : `(JPS) Billing:\n${id}`,
      }
    };
    // console.info(`ORDER SUMMARY ----> ${JSON.stringify(order, null, 3)}`);

    const params = {
      "method" : "POST",
      "headers" : { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "payload" : JSON.stringify(order),
      "followRedirects" : true,
      "muteHttpExceptions" : true,
    };

    try {
      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = JSON.parse(response.getContentText());
      console.info(`Posted Order! : ${JSON.stringify(content, null, 3)}`);
      return content;
    } catch(err) {
      console.error(`"CreateOrder()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up a Shopify Customer by Email
   * @param {string} email
   * @return {JSON} all customer data
   * Access individual properties by invoking GetShopifyCustomerByEmail(email).id or GetShopifyCustomerByEmail(email).name
   */
  async GetCustomerByEmail(email) {

    const scope = `customers/search.json?query=email:${email}`;
    const fields = `&fields=id,first_name,last_name,total_spent`;
    const url = `${this.root}${scope}${fields}`;

    try {
      const response = await UrlFetchApp.fetch(url, this.getParams);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const user = JSON.parse(response.getContentText())[`customers`][0];
      if(!user) {
        console.warn(`User Shopify Account Does Not Exist.\nTrying as internal sale.....`);
        return await this.GetCustomerByEmail(this.api_email);
      }

      this.customerID = user.id;
      // console.info(`USER ---> ${JSON.stringify(user, null, 4)}`);
      return user;
    } catch(err) {
      console.error(`"GetCustomerByEmail()" failed: ${err}`);
      return 1;
    } 
      
  
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up a Shopify Product by Name
   * Fetch Product - GET /admin/api/2020-04/products.json?title=<searchString>&limit=250&fields=id,title
   * @param {string} productID
   * @return {JSON} all product data
   * Access individual properties by invoking GetShopifyProductByID(productID).productTitle or GetShopifyProductByID(productID).id or GetShopifyProductByID(productID).price
   */
  async GetProductByID(productID) {
    const status = `&status=active`;
    const fields = `&fields=id,title,price,variants`;

    const url = `${this.root}products/${productID}.json?${status}${fields}`;

    try {
      if(!productID) throw new Error(`No product ID supplied....`);

      let response = await UrlFetchApp.fetch(url, this.getParams);
      let responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      let parsed = JSON.parse(response.getContentText())[`product`];
      if(!parsed) throw new Error(`Couldn't find Product!`);

      parsed.title = parsed.title ? parsed.title : parsed.variants[0].title;
      parsed.id = parsed.id ? parsed.id : parsed.variants[0].id;
      parsed.price = parsed.price ? parsed.price : parsed.variants[0].price;

      // console.info(`Title : ${parsed.title}, ID : ${parsed.id}, Price : ${price}`);
      return parsed; 
    } catch(err) {
      console.error(`"GetProductByID()" failed: ${err}`);
      return 1;
    }
      
      
      
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up the last order
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetLastOrder() {
    const status = `&status=any`;
    const limit = `&limit=1`
    const fields = `&fields=created_at,id,name,last_name,first_name,email,total-price`;
    const url = `${this.root}orders.json?${status}${limit}${fields}`;

    try {
      const response = await UrlFetchApp.fetch(url, this.getParams);
      const responseCode = response.getResponseCode();
      console.info(response.getContentText());
      if (responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const parsed = JSON.parse(response.getContentText());
      const orders = parsed[`orders`][0];
      console.info(`ORDER PLACED ---->\n${JSON.stringify(orders, null, 3)}`);
      return orders;  
    } catch(err) {
      console.error(`"GetLastOrder()" failed: ${err}`);
      return 1;
    }
    
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up a specific order
   * @return {string} order data
   */
  async GetSpecificOrder(order) {
    const repo = `orders/${order}.json?`;
    
    try {
      const response = await UrlFetchApp.fetch(this.root + repo, this.getParams);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = JSON.parse(response.getContentText());
      const order = content ? content[`order`] : ``;
      return order;  
    } catch(err) {
      console.error(`"GetSpecificOrder(${order})" failed: ${err}`);
      return 1;
    }
    
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Retrieve list of orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetOrdersList() {
    const status = `status=any`;
    const limit = `&limit=250`
    const fields = `&fields=name,total_price`;
    const url = `${this.root}orders.json?${status}${limit}${fields}`;

    try {
      const response = await UrlFetchApp.fetch(url, this.getParams);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const parsed = JSON.parse(response.getContentText())[`orders`];

      let orderNums = [];
      let spent = [];
      parsed.forEach(item => {
        orderNums.push(item.name);
        spent.push(parseFloat(item.total_price));
      });

      const storeSpent = spent.reduce((a, b) => a + b, 0);
      this.total = storeSpent ? storeSpent : 0.0;
      console.info(`Total Store Expenditure: $${storeSpent}`);
      return orderNums;  
    } catch(err) {
      console.error(`"GetOrdersList()" failed: ${err}`);
      return 1;
    }



  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Retrieve list of open orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetUnfulfilledOrders() {
    let orders = [];
    const status = `status=any`;
    const limit = `&limit=250`;
    const additionalFields = `&financial_status=pending`;
    const fulfillment = `&fulfillment_status=fulfilled`;
    const fields = `&fields=id,email,name,total_price,fulfillment_status,financial_status`;

    const url = `${this.root}orders.json?${status}${limit}${additionalFields}${fulfillment}${fields}`;

    try {
      const response = await UrlFetchApp.fetch(url, this.getParams);
      let responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      let parsed = JSON.parse(response.getContentText())[`orders`];
      parsed.forEach(item => {
        if(item.fulfillment_status == `fulfilled`) {
          orders.push(item);
          // let id = Number.parseFloat(item.id);
          // console.info(`${id} : ${JSON.stringify(item)}`);  
        }
      }); 
      return orders;
    } catch(err) {
      console.error(`"GetUnfulfilledOrders()" failed: ${err}`);
      return 1;
    }

  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Retrieve list of open orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   * @private
   *
  async CloseUnfulfilledOrders() {
    let order = 4244891041958;

    const url = `${this.root}orders/${order}.json?`;
    console.info(`Putting to this Repo -----> ${url}`);

    const payload = {  
      "order" : {
        "id" : order.toString(),
        "financial_status" : "paid",
        "fulfillment_status" : "fulfilled",
        "note" : "Order closed by Jacobs Billing Support.",
        "closed_at" : new Date().toISOString(),
        "confirmed": true,
      },
    }
    const params = {
      "method" : "PUT",
      "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "body" : JSON.stringify(payload),
      followRedirects : true,
      muteHttpExceptions : true
    };

    try {
      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = response.getContentText();
      return content;
    } catch(err) {
      console.error(`"CloseUnfulfilledOrders()" failed: ${err}`);
      return 1;
    }
  }
  */

}


const _testAPI = async () => {
  const id = new IDService().id;
  const shopify = new ShopifyAPI();

  // let productID = await shopify._GetStoreProductID(`Fortus Red ABS-M30`);
  // console.info(`PRODUCT_ID for Fortus Red ABS-M30: ${JSON.stringify(productID, null, 3)}`);

  // let lastOrder = await shopify.GetLastOrder();
  // console.info(`LAST_ORDER: ${JSON.stringify(lastOrder, null, 3)}`);

  // let orderList = await shopify.GetOrdersList();
  // console.info(`ORDERLIST: ${orderList}`);

  // let unfulfilled = await shopify.GetUnfulfilledOrders();
  // console.info(`UNFULFILLED: ${unfulfilled}`);

  // let product = await shopify.GetProductByID(7751141320);
  // console.info(`PRODUCT: ${JSON.stringify(product, null, 3)}`);

  // let customer = await shopify.GetCustomerByEmail(PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`));
  // console.info(`CUSTOMER: ${JSON.stringify(customer, null, 3)}`);
  

  // let pack = await shopify._PackageMaterials({
  //     material1Name : `Fortus Red ABS-M30`, 
  //     material1Quantity : 5,
  //     material2Name : `Objet Polyjet VeroMagenta RGD851`, 
  //     material2Quantity : 10,
  //     material3Name : null, 
  //     material3Quantity : 12345,
  //     material4Name : `Stratasys Dimension Soluble Support Material P400SR`, 
  //     material4Quantity : 15,
  //     material5Name : null, 
  //     material5Quantity : 20,
  // });
  // console.info(`PACK: ${JSON.stringify(pack, null, 3)}`);

  // let lineItems = await shopify.MakeLineItems(pack);
  // let order = await shopify.CreateShopifyOrder(customer, 1293847123, pack, lineItems);
  // let lookup = shopify.LookupShopifyProductFromSheet2();
  // let customer = shopify.SetCustomer(PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`));

  const order = await shopify.CreateOrder({
    id : id,
    email : `pico@pico.com`,
    material1Name : `Fortus Red ABS-M30`,
    material1Quantity : 5,
    material2Name : `Objet Polyjet VeroMagenta RGD851`,
    material2Quantity : 10,
    material3Name : null,
    material3Quantity : 123234,
    material4Name : `Stainless Steel - 0.125" - priced per square inch`,
    material4Quantity : 15,
    material5Name : null,
    material5Quantity : 20,
  });
  console.info(JSON.stringify(order, null, 4));

}


/**
 * Configure the service
 * @private
@NOTIMPLEMENTED
 *
const CreateService = () => {
  const service = OAuth2.createService(`Shopify`)
    .setAuthorizationBaseUrl(`https://jacobs-student-store.myshopify.com/admin/api/2023-04/`)
    .setTokenUrl(`https://jacobs-student-store.myshopify.com/admin/api/2023-04/token`)
    .setClientId(PropertiesService.getScriptProperties().getProperty(`shopify_api_key`))
    .setClientSecret(PropertiesService.getScriptProperties().getProperty(`shopify_api_pass`))
    .setCallbackFunction((request) => {
      const service = CreateService();
      const isAuthorized = service.handleCallback(request);
      if (isAuthorized) { 
        return HtmlService
          .createTemplateFromFile("auth_success")
          .evaluate();
      } else {
        return HtmlService
          .createTemplateFromFile("auth_error")
          .evaluate();
      }
    })
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setLock(LockService.getUserLock())
    // .setScope(`user-library-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private`);
  // if (!service.hasAccess()) {
  //   throw new Error(`Error: Missing Shopify authorization.`);
  // }
  console.info(`Service Access: ${service.hasAccess()}`);
  console.info(service)
  return service;
}
*/



