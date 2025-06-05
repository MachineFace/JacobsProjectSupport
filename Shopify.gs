
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Interfacing with Shopify API
 */
class ShopifyAPI {
  constructor(){
    /** @private */
    this.root = `https://jacobs-student-store.myshopify.com/admin/api/2023-07`;
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
  }


  /**
   * Get Store Product ID
   * @param {string} material name
   * @returns {[string, string]} productID, link, price
   * @private
   */
  _GetStoreProductID(material = ``) {
    try {
      let productID = ``;
      if(!material) throw new Error(`No material supplied`);
      Object.values(STORESHEETS).forEach(sheet => {
        const idx = SheetService.SearchSpecificSheet(sheet, material);
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
   * Packages Materials
   * @param {[{name: string, quantity: number}]} materials - list of material objects
   * @returns {[{string}]} materials
   * @private
   */
  async _PackageMaterials(materials = []) {
    let validMaterials = [];

    for (let { name, quantity } of materials) {
      if (!name || !quantity) continue;
      quantity = Number(quantity) >= 0 && Number.isInteger(Number(quantity)) ? Number(quantity) : Math.abs(Number(quantity)) | 1;

      const id = this._GetStoreProductID(name);
      if (!id) continue;

      validMaterials.push({ name, quantity, id });
    }

    const shopifyPack = [];
    let subTotals = [];

    for(const mat of validMaterials) {
      let info = await this.GetProductByID(mat.id);
      let variantPrice = Number(info?.variants?.[0]?.price ?? info?.price ?? 0);
      let subtotal = Math.abs(Number(variantPrice * mat.quantity).toFixed(2));
      subTotals.push(subtotal);
      // console.info(`Variant: $${variantPrice}, Subtotal: $${subtotal}`);

      shopifyPack.push({ 
        name : mat.name,
        title : info?.title,
        variant_id : Number(info?.id),
        price : variantPrice,
        quantity : mat.quantity,
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
    let total = Math.abs(Number(subTotals.reduce((a,b) => Number(a) + Number(b))).toFixed(2));
    this.totalprice = total;
    console.info(`Total: $${this.totalprice}`);
    // console.info(`Total: $${this.totalprice},\nPACKED:\n${JSON.stringify(shopifyPack, null, 3)}`);
    return shopifyPack;
  }

  /**
   * Create Shopify Order
   * @param {string} id
   * @param {string} email
   * @param {[{name: string, quantity: number}]} materials - list of material objects
   * @returns {object} order
   */
  async CreateOrder({
      id : id = IDService.createId(),
      email : email = this.api_email,
      materials : materials = [ 
        { name : `None`, quantity : 0 },
        { name : `None`, quantity : 0 },
        { name : `None`, quantity : 0 },
        { name : `None`, quantity : 0 },
        { name : `None`, quantity : 0 },
        { name : `None`, quantity : 0 },
      ],
    }) {
    try {
      const url = `${this.root}/orders.json/`;
      const customer = await this.GetCustomerByEmail(email || this.api_email);
      this.customerID = customer.id;
      const pack = await this._PackageMaterials(materials);

      const order = {
        order: {
          line_items : pack,
          customer : { 
            id : customer.id, 
          },
          financial_status : `paid`,
          fulfillment_status : `fulfilled`,
          inventory_behaviour : `decrement_ignoring_policy`,
          note : `(JPS) Billing:\n${id}`,
        }
      }

      const params = {
        "method" : "POST",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) 
        },
        "contentType" : "application/json",
        "payload" : JSON.stringify(order),
        "followRedirects" : true,
        "muteHttpExceptions" : false,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}, ${response}`);
      }

      const content = JSON.parse(response.getContentText());
      console.info(`Posted Order!\nTo:${email}\nID: ${id}`);
      // console.info(`Posted Order! : ${JSON.stringify(content, null, 3)}`);
      return content;
    } catch(err) {
      console.error(`"CreateOrder()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Look up a Shopify Customer by Email
   * @param {string} email
   * @return {JSON} all customer data
   * Access individual properties by invoking GetShopifyCustomerByEmail(email).id or GetShopifyCustomerByEmail(email).name
   */
  async GetCustomerByEmail(email = ``) {
    try {
      const scope = `customers/search.json?query=email:${email}`;
      const fields = `&fields=id,first_name,last_name,total_spent`;
      const url = `${this.root}/${scope}${fields}`;

      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

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
   * Look up a Shopify Product by Name
   * Fetch Product - GET /admin/api/2020-04/products.json?title=<searchString>&limit=250&fields=id,title
   * @param {string} productID
   * @return {JSON} all product data
   * Access individual properties by invoking GetShopifyProductByID(productID).productTitle or GetShopifyProductByID(productID).id or GetShopifyProductByID(productID).price
   */
  async GetProductByID(productID = ``) {
    try {
      if(!productID) throw new Error(`No product ID supplied....`);
      const status = `&status=active`;
      const fields = `&fields=id,title,price,variants`;
      const url = `${this.root}/products/${productID}.json?${status}${fields}`;

      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      let response = await UrlFetchApp.fetch(url, params);
      let responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}, ${response}`);
      }
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
    try {
      const status = `&status=any`;
      const limit = `&limit=1`
      const fields = `&fields=created_at,id,name,last_name,first_name,email,total-price`;
      const url = `${this.root}/orders.json?${status}${limit}${fields}`;

      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      // console.info(response.getContentText());
      if (![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

      const parsed = JSON.parse(response.getContentText());
      const orders = parsed[`orders`][0];
      console.info(`LAST ORDER:\n${JSON.stringify(orders, null, 3)}`);
      return orders;  
    } catch(err) {
      console.error(`"GetLastOrder()" failed: ${err}`);
      return 1;
    }
    
  }

  /**
   * Look up a specific order
   * @return {string} order data
   */
  async GetSpecificOrder(order = ``) {
    try {
      const url = `${this.root}/orders/${order}.json?`;
      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

      const content = JSON.parse(response.getContentText());
      const order = content ? content[`order`] : ``;
      return order;  
    } catch(err) {
      console.error(`"GetSpecificOrder(${order})" failed: ${err}`);
      return 1;
    }
    
  }

  /**
   * Retrieve list of orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetOrdersList() {
    try {
      const status = `status=any`;
      const limit = `&limit=250`
      const fields = `&fields=name,total_price`;
      const url = `${this.root}/orders.json?${status}${limit}${fields}`;

      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

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
   * Retrieve list of open orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetUnfulfilledOrders() {
    try {
      let orders = [];
      const status = `status=any`;
      const limit = `&limit=250`;
      const additionalFields = `&financial_status=pending`;
      const fulfillment = `&fulfillment_status=fulfilled`;
      const fields = `&fields=id,email,name,total_price,fulfillment_status,financial_status`;

      const url = `${this.root}/orders.json?${status}${limit}${additionalFields}${fulfillment}${fields}`;

      const params = {
        "method" : `GET`,
        "contentType" : "application/json",
        "headers" : { 
          "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        "followRedirects" : true,
        "muteHttpExceptions" : true,
        "timeout": 10000, // 10 seconds max wait
      }

      const response = await UrlFetchApp.fetch(url, params);
      let responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

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
   * Close Unfulfilled Order
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   * @private
   *
  async CloseUnfulfilledOrder(order_number = ``) {
    try {
      order_number = 5935868248230;

      const url = `${this.root}/orders/${order_number}.json?`;
      console.info(`Putting to this Repo -----> ${url}`);

      const payload = {  
        'order' : {
          'id' : order_number.toString(),
          'financial_status' : "paid",
          'fulfillment_status' : "fulfilled",
          'note' : "Order closed by Jacobs Billing Support.",
          'closed_at' : new Date().toISOString(),
          'confirmed': true,
        },
      }
      const params = {
        'method' : "PUT",
        'headers' : { 
          'Authorization': "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) 
        },
        'contentType' : "application/json",
        'body' : JSON.stringify(payload),
        'followRedirects' : true,
        'muteHttpExceptions' : true,
        'timeout': 10000, // 10 seconds max wait
      }
    
      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }

      const content = response.getContentText();
      return content;
    } catch(err) {
      console.error(`"CloseUnfulfilledOrder()" failed: ${err}`);
      return 1;
    }
  }
  */
  

}


const _testAPI = async () => {
  const id = IDService.createId();
  const shopify = new ShopifyAPI();

  // let productID = await shopify._GetStoreProductID(`Fortus Red ABS-M30`);
  // console.info(`PRODUCT_ID for Fortus Red ABS-M30: ${JSON.stringify(productID, null, 3)}`);

  // let lastOrder = await shopify.GetLastOrder();
  // console.info(`LAST_ORDER: ${JSON.stringify(lastOrder, null, 3)}`);

  // let orderList = await shopify.GetOrdersList();
  // console.info(`ORDERLIST: ${orderList}`);

  // let unfulfilled = await shopify.GetUnfulfilledOrders();
  // console.info(`UNFULFILLED:`);
  // unfulfilled.forEach(openOrder => console.info(`${JSON.stringify(openOrder, null, 2)}`));

  // shopify.CloseUnfulfilledOrder();

  // let product = await shopify.GetProductByID(7751141320);
  // console.info(`PRODUCT: ${JSON.stringify(product, null, 3)}`);

  // let customer = await shopify.GetCustomerByEmail(PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`));
  // console.info(`CUSTOMER: ${JSON.stringify(customer, null, 3)}`);
  
  let materials = [
    { name : `Fortus Red ABS-M30`,  quantity : 5, },                                    // good
    { name : `Objet Polyjet VeroMagenta RGD851`,  quantity : 10, },                     // good
    { name : null,  quantity : 0.5, },                                                  // bad skip
    { name : `Stratasys Dimension Soluble Support Material P400SR`,  quantity : 15, },
    { name : undefined,  quantity : 15, },                                              // bad skip
    { name : `Fortus Red ABS-M30`,  quantity : -30.5, },                                // good kinda
    { name : `Fortus Red ABS-M30`,  quantity : undefined, },                            // bad skip
    { name : `Fortus Red ABS-M30`,  quantity : null, },                                 // bad skip
  ];
  // let pack = await shopify._PackageMaterials(materials);

  // let order = await shopify.CreateShopifyOrder(customer, 1293847123, pack, lineItems);
  // let lookup = shopify.LookupShopifyProductFromSheet2();
  // let customer = shopify.SetCustomer(PropertiesService.getScriptProperties().getProperty(`SHOPIFY_EMAIL`));

  const order = await shopify.CreateOrder({
    id : id,
    email : `pico@pico.com`,
    materials : materials,
  });
  console.info(`ORDER:\n${JSON.stringify(order, null, 2)}`);

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



