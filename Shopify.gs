
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Interfacing with Shopify API
 */
class ShopifyAPI {
  constructor({
    jobnumber : jobnumber = 202010011925,
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
  }){
    /** @private */
    this.root = `https://jacobs-student-store.myshopify.com/admin/api/2023-04/`;
    /** @private */
    this.api_key = PropertiesService.getScriptProperties().getProperty(`shopify_api_key`);
    /** @private */
    this.api_pass = PropertiesService.getScriptProperties().getProperty(`shopify_api_pass`);

    this.jobnumber = jobnumber;
    this.email = email;
    this.material1Name = material1Name;
    this.material1Quantity = material1Quantity;
    this.material2Name = material2Name;
    this.material2Quantity = material2Quantity;
    this.material3Name = material3Name;
    this.material3Quantity = material3Quantity;
    this.material4Name = material4Name;
    this.material4Quantity = material4Quantity;
    this.material5Name = material5Name;
    this.material5Quantity = material5Quantity;
    this.customer;
    this.customerID;
    this.pack = this._PackageMaterials();
    this.totalprice;
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Get Info from sheet by looking up Jobnumber
   * @private
   */
  _SetInfo() {
    for(const [key, sheet] of Object.entries(SHEETS)) {
      const finder = sheet.createTextFinder(this.jobnumber).findNext();
      if (finder != null) {
        this.row = finder.getRow();
        this.sheet = sheet;
        this.sheetName = sheet.getName();
      }
    }
    this.designspecialist = GetByHeader(this.sheet, HEADERNAMES.ds, this.row);
    this.email = GetByHeader(this.sheet, HEADERNAMES.email, this.row);
    this.name = GetByHeader(this.sheet, HEADERNAMES.name, this.row);
    this.projectname = GetByHeader(this.sheet, HEADERNAMES.projectName, this.row);
    this.material1Name = GetByHeader(this.sheet, HEADERNAMES.mat1, this.row);
    this.material1Quantity = GetByHeader(this.sheet, HEADERNAMES.mat1quantity, this.row);
    this.material2Name = GetByHeader(this.sheet, HEADERNAMES.mat2, this.row);
    this.material2Quantity = GetByHeader(this.sheet, HEADERNAMES.mat2quantity, this.row);
    this.material3Name = GetByHeader(this.sheet, HEADERNAMES.mat3, this.row);
    this.material3Quantity = GetByHeader(this.sheet, HEADERNAMES.mat3quantity, this.row);
    this.material4Name = GetByHeader(this.sheet, HEADERNAMES.mat4, this.row);
    this.material4Quantity = GetByHeader(this.sheet, HEADERNAMES.mat4quantity, this.row);
    this.material5Name = GetByHeader(this.sheet, HEADERNAMES.mat5, this.row);
    this.material5Quantity = GetByHeader(this.sheet, HEADERNAMES.mat5quantity, this.row);
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Better Lookup
   * @private
   * @param {string} material name
   * @returns {[string, string]} productID, link, price
   */
  _LookupStoreProductDetails(material) {
    material = material ? material : `Fortus Red ABS-M30`;
    let productID;
    try {
      Object.values(STORESHEETS).forEach(sheet => {
        const find = SearchSpecificSheet(sheet, material);
        if(find !== false) {
          let index = find;
          let link = sheet.getRange(index, 2, 1, 1).getValue();
          let price = sheet.getRange(index, 6, 1, 1).getValue();
          productID = sheet.getRange(index, 4, 1, 1).getValue();
        }
      })
      return productID.toString();
    } catch(err) {
      console.error(`"_LookupStoreProductDetails()" failed : ${err}`);
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Packages Materials in a way that can be used in MakeLineItems
   * @private
   * @returns {[{string}]} materials
   */
  async _PackageMaterials() {
    let pack = {};
    pack["material1"] = { name : this.material1Name, ammount : this.material1Quantity, id : "" };
    pack["material2"] = { name : this.material2Name, ammount : this.material2Quantity, id : "" };
    pack["material3"] = { name : this.material3Name, ammount : this.material3Quantity, id : "" };
    pack["material4"] = { name : this.material4Name, ammount : this.material4Quantity, id : "" };
    pack["material5"] = { name : this.material5Name, ammount : this.material5Quantity, id : "" };

    // Remove when Those are empty / null / undefined
    for(const [key, values] of Object.entries(pack)) {
      if(!values.name || !values.ammount) {
        delete pack[key];
      } else values.id = this._LookupStoreProductDetails(values.name);
    }
    // console.info(`PACK --> ${JSON.stringify(pack)}`);

    // Fetch Shopify Info
    let sum = 0.0;
    let shopifyPack = [];
    for(const [key, values] of Object.entries(pack)) {
      console.info(values.id);
      let info = await this.GetProductByID(values.id);
      console.info(info)
      let price = info?.variants[0]?.price * pack[key].ammount ? info?.variants[0]?.price * pack[key].ammount : info?.price * pack[key].ammount;
      let subtotal = +Number.parseFloat(price).toFixed(2);
      sum += subtotal;
      shopifyPack.push({ 
        name : key,
        title : info?.title,
        id : info?.id,
        price : info?.variants[0]?.price,
        quantity : pack[key].ammount,
        subtotal : subtotal,
        discount_allocations : [{
          amount: "0.00",
          discount_application_index : 0,
          amount_set : { shop_money : { amount : 0.00, currency_code : "USD" }, }
        }],  
      });
    }
    const total = +Number.parseFloat(sum).toFixed(2);
    this.totalprice = total;

    // console.info(`Total Price = ${total}`);
    // console.info(`PACKED ----> ${JSON.stringify(shopifyPack)}`);
    return shopifyPack;
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Shopify Order
   */
  async CreateOrder() {
    this.customer = await this.GetCustomerByEmail(this.email);
    if(!this.customer) this.customer = await this.GetCustomerByEmail("jacobsinstitutestore@gmail.com");
    let repo = 'orders.json/';

    let order = {
      "order": {
        "line_items": await this.pack,
        "customer": { "id": await this.customerID },
        "total_price": await this.totalprice,
        "financial_status": "paid",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + this.jobnumber,
      }
    };
    console.info(`ORDER SUMMARY ----> ${JSON.stringify(order)}`);

    let params = {
      "method" : "POST",
      "headers" : { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "payload" : JSON.stringify(order),
      "followRedirects" : true,
      "muteHttpExceptions" : true
    };

    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    // console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = JSON.parse(html.getContentText());
      console.info(`Posted Order! : ${content}`);
      return content;
    } else {
      this.writer.Error('Failed to POST to Shopify');
      return false;
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

    let fields = `&fields=id,first_name,last_name,total_spent`;
    let scope = `customers/search.json?query=email:${email}`;
    let repo = scope + fields;

    //Stuff into Params
    let params = {
      "method" : "GET",
      "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    //Fetch Customer
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    // console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (html.getResponseCode() == 200) {
      let user = JSON.parse(html.getContentText())['customers'][0];
      if(!user) {
        this.writer.Error('User Shopify Account Does Not Exist. Please make a User Account on Shopify.');
        this.writer.Error(`Trying as internal sale.....`)
        return this.GetCustomerByEmail("jacobsinstitutestore@gmail.com");
        
      } else {
        console.info(`ID : ${user['id']}, Name : ${user['first_name']} ${user['last_name']}, Total Spent : ${user['total_spent']}`);
        this.customerID = user['id'];
        return user;
      }

      // this.first_name = user['first_name'];
      // this.last_name = user['last_name'];
      // this.total_spent = user['total_spent'];
      
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
    // productID = 7751141320; //Test ID
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
      let response = await UrlFetchApp.fetch(this.root + repo, params);
      let responseCode = response.getResponseCode();
      if(responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      let parsed = JSON.parse(response.getContentText())['product'];

      if(!parsed) throw new Error(`Couldn't find Product!`);

      this.productTitle = parsed.title;
      if(parsed.title == undefined || parsed.title == null) this.productTitle = parsed.variants[0].title;
      this.id = productID;
      if(parsed.id == undefined || parsed.id == null) this.id = parsed.variants[0].id;
      this.price = parsed.price;
      if(parsed.price == undefined) this.price = parsed.variants[0].price;

      // console.info(`Title : ${this.productTitle}, ID : ${this.id}, Price : ${this.price}`);
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
  const jobnumber = new CreateJobnumber({ date : new Date() }).Jobnumber;
  // const shopify = new ShopifyAPI({jobnumber : jobnumber, email : "jacobsinstitutestore@gmail.com"});
  const shopify = new ShopifyAPI({
    jobnumber : jobnumber,
    email : `pico@pico.com`,
    material1Name : 'Fortus Red ABS-M30',
    material1Quantity : 5,
    material2Name : 'Objet Polyjet VeroMagenta RGD851',
    material2Quantity : 10,
    material3Name : null,
    material3Quantity : 123234,
    material4Name : 'Stratasys Dimension Soluble Support Material P400SR',
    material4Quantity : 15,
    material5Name : null,
    material5Quantity : 20,
  });
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

  // const order = await shopify.CreateOrder();
  // console.info(JSON.stringify(order))

  const order = await shopify.GetLastOrder();
  console.info(JSON.stringify(order))
}




