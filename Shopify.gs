
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Interfacing with Shopify API
 */
class ShopifyAPI {
  constructor(){
    /** @private */
    this.root = `https://jacobs-student-store.myshopify.com/admin/api/2023-04/`;
    /** @private */
    this.api_key = PropertiesService.getScriptProperties().getProperty(`shopify_api_key`);
    /** @private */
    this.api_pass = PropertiesService.getScriptProperties().getProperty(`shopify_api_pass`);
    /** @private */
    this.jobnumber;
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
   * ----------------------------------------------------------------------------------------------------------------
   * Better Lookup
   * @private
   * @param {string} material name
   * @returns {[string, string]} productID, link, price
   */
  _LookupStoreProductDetails(material) {
    if(!material) throw new Error(`No material supplied`);
    let productID;
    try {
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
      console.error(`"_LookupStoreProductDetails()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Packages Materials in a way that can be used in MakeLineItems
   * @private
   * @param {object} list of material names and quantities
   * @returns {[{string}]} materials
   */
  async _PackageMaterials({
      material1Name, material1Quantity,
      material2Name, material2Quantity,
      material3Name, material3Quantity,
      material4Name, material4Quantity,
      material5Name, material5Quantity,
  }) {
    let pack = {
      material1 : { 
        name : material1Name, 
        ammount : material1Quantity, 
        id : 0, 
      },
      material2 : { 
        name : material2Name, 
        ammount : material2Quantity, 
        id : 0,
      },
      material3 : { 
        name : material3Name, 
        ammount : material3Quantity, 
        id : 0,
      },
      material4 : { 
        name : material4Name, 
        ammount : material4Quantity, 
        id : 0,
      },
      material5 : { 
        name : material5Name, 
        ammount : material5Quantity, 
        id : 0,
      },
    };

    for(const [key, values] of Object.entries(pack)) {
      if(!values.name || !values.ammount) {
        delete pack[key];
      } else values.id = this._LookupStoreProductDetails(values.name);
    }
    for(const [key, values] of Object.entries(pack)) {
      if(!values.id) delete pack[key];
    }

    let sum = 0.0;
    let shopifyPack = [];
    for(const [key, values] of Object.entries(pack)) {
      console.info(values.id);
      let info = await this.GetProductByID(values.id);
      let price = info?.variants[0]?.price * pack[key].ammount ? info?.variants[0]?.price * pack[key].ammount : info?.price * pack[key].ammount;
      let subtotal = +Number.parseFloat(price).toFixed(2);
      sum += subtotal;
      shopifyPack.push({ 
        name : key,
        title : info?.title,
        id : +Number(info?.id),
        price : info?.variants[0]?.price,
        quantity : pack[key].ammount,
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
    const total = +Number.parseFloat(sum).toFixed(2);
    this.totalprice = total;

    // console.info(`Total Price = ${total}`);
    // console.info(`PACKED ----> ${JSON.stringify(shopifyPack, null, 4)}`);
    return shopifyPack;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Shopify Order
   * @param {object} inputs
   * @returns {object} order
   */
  async CreateOrder({
    jobnumber : jobnumber = new JobnumberService().jobnumber,
    email : email = `jacobsinstitutestore@gmail.com`,
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
    const repo = 'orders.json/';
    const customer = await this.GetCustomerByEmail(email);
    if(!customer) customer = await this.GetCustomerByEmail("jacobsinstitutestore@gmail.com");
    this.customerID = customer.id;
    const pack = await this._PackageMaterials({
      material1Name, material1Quantity,
      material2Name, material2Quantity,
      material3Name, material3Quantity,
      material4Name, material4Quantity,
      material5Name, material5Quantity,
    });

    const order = {
      "order": {
        "line_items": pack,
        "customer": { "id": customer.id },
        "total_price": this.totalprice,
        "financial_status": "paid",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + jobnumber,
      }
    };
    console.info(`ORDER SUMMARY ----> ${JSON.stringify(order, null, 4)}`);

    const params = {
      "method" : "POST",
      "headers" : { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "payload" : JSON.stringify(order),
      "followRedirects" : true,
      "muteHttpExceptions" : true,
    };

    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = JSON.parse(response.getContentText());
      // console.info(`Posted Order! : ${JSON.stringify(content, null, 4)}`);
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

    const fields = `&fields=id,first_name,last_name,total_spent`;
    const scope = `customers/search.json?query=email:${email}`;
    const repo = scope + fields;

    const params = {
      method : "GET",
      headers : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };

    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const user = JSON.parse(response.getContentText())['customers'][0];
      if(!user) {
        console.warn('User Shopify Account Does Not Exist.\nTrying as internal sale.....');
        return await this.GetCustomerByEmail("jacobsinstitutestore@gmail.com");
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
    let status = '&status=active';
    let fields = '&fields=id,title,price,variants';

    const repo = 'products/' + productID + '.json?' + status + fields;

    let params = {
      method : "GET",
      headers : { Authorization : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : false,
    };

    // Fetch Products
    try {
      if(!productID) throw new Error(`No product ID supplied....`);

      let response = await UrlFetchApp.fetch(this.root + repo, params);
      let responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      let parsed = JSON.parse(response.getContentText())['product'];

      if(!parsed) throw new Error(`Couldn't find Product!`);
      if(parsed.title == undefined) parsed.title = parsed.variants[0].title;
      if(parsed.id == undefined) parsed.id = parsed.variants[0].id;
      if(parsed.price == undefined) parsed.price = parsed.variants[0].price;

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
   * @return {string} order data
   */
  async GetLastOrder() {
    const status = '&status=any';
    const limit = '&limit=1'
    const fields = '&fields=created_at,id,name,last_name,first_name,email,total-price';

    // Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
    const repo = 'orders.json?' + status + limit + fields;

    const params = {
      method : "GET",
      headers : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };

    try {
      // Fetch Products
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const parsed = JSON.parse(response.getContentText());
      if(!parsed) throw new Error(`No orders...`);
      const createdAt = parsed ? parsed['orders'][0]?.created_at : [];
      const name = parsed ? parsed['orders'][0]?.name : [];
      const email = parsed ? parsed['orders'][0]?.email : [];
      const total_price = parsed ? parsed['orders'][0]?.total_price : [];
      console.info(`ORDER PLACED ----> TIME : ${createdAt}\\n ORDER NUMBER : ${name}\\n TO : ${email}\\n FOR : $${total_price}`);
      return parsed['orders'][0];  
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

    const params = {
      method : "GET",
      headers : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };
    
    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = JSON.parse(response.getContentText())["order"];
      return content;  
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
    const status = 'status=any';
    const limit = '&limit=250'
    const fields = '&fields=name,total_price';

    const repo = 'orders.json?' + status + limit + fields;

    const params = {
      method : "GET",
      headers : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };
    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const parsed = JSON.parse(response.getContentText())['orders'];

      let orderNums = [];
      let spent = [];
      parsed.forEach(item => {
        orderNums.push(item.name);
        spent.push(parseFloat(item.total_price));
      });

      const storeSpent = spent.reduce((a, b) => a + b, 0);
      this.total = storeSpent;
      console.info(`${orderNums} : ${storeSpent}`);
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

    const repo = 'orders.json?' + status + limit + additionalFields + fulfillment + fields;

    const params = {
      method : "GET",
      headers : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };
    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      let responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      let parsed = JSON.parse(response.getContentText())['orders'];

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
   */
  async CloseUnfulfilledOrders() {
    console.info(`Putting to this Repo -----> ${this.root + repo}`);
    let order = 4244891041958;

    const repo = `orders/${order}.json?`;

    const payload = {  
      "order" : {
        "id" : order.toString(),
        "financial_status": "paid",
        "fulfillment_status": "fulfilled",
        "note" : "Order closed by Jacobs Billing Support.",
        "closed_at": new Date().toISOString(),
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
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = response.getContentText();
      console.info(`Content -----> ${content}`);
      return content;
    } catch(err) {
      console.error(`"CloseUnfulfilledOrders()" failed: ${err}`);
      return 1;
    }
  }

}


const _testAPI = async () => {
  const jobnumber = new JobnumberService().jobnumber;
  // const shopify = new ShopifyAPI({jobnumber : jobnumber, email : "jacobsinstitutestore@gmail.com"});
  const shopify = new ShopifyAPI();
  // let product = await shopify._LookupStoreProductDetails(`Fortus Red ABS-M30`);
  // let lastOrder = await shopify.GetLastOrder();
  // let orders = await shopify.GetOrdersList();
  // let product = await shopify.GetProductByID(7751141320);
  // let customer = await shopify.GetCustomerByEmail('jacobsinstitutestore@gmail.com');
  // let pack = await shopify.PackageMaterials('Fortus Red ABS-M30', 5,'Objet Polyjet VeroMagenta RGD851',10,null,123234,'Stratasys Dimension Soluble Support Material P400SR',15,null,20);
  // let lineItems = await shopify.MakeLineItems(pack);
  // let order = await shopify.CreateShopifyOrder(customer, 1293847123, pack, lineItems);
  // let lookup = shopify.LookupShopifyProductFromSheet2();
  // let customer = shopify.SetCustomer("jacobsinstitutestore@gmail.com");

  const order = await shopify.CreateOrder({
    jobnumber : jobnumber,
    email : `pico@pico.com`,
    material1Name : 'Fortus Red ABS-M30',
    material1Quantity : 5,
    material2Name : 'Objet Polyjet VeroMagenta RGD851',
    material2Quantity : 10,
    material3Name : null,
    material3Quantity : 123234,
    material4Name : 'Stainless Steel - 0.125" - priced per square inch',
    material4Quantity : 15,
    material5Name : null,
    material5Quantity : 20,
  });
  console.info(JSON.stringify(order, null, 4));

  // const order = await shopify.GetLastOrder();
  // console.info(JSON.stringify(order))
}




