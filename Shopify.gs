

class ShopifyAPI 
{
  constructor({
    jobnumber = 202010011925,
    email = "jacobsinstitutestore@gmail.com",
    material1Name = "None",
    material1Quantity = 0,
    material2Name = "None",
    material2Quantity = 0,
    material3Name = "None",
    material3Quantity = 0,
    material4Name = "None",
    material4Quantity = 0,
    material5Name = "None",
    material5Quantity = 0,
  }){
    this.jobnumber = jobnumber;
    this.root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    this.api_key = '1e70652225e070b078def8bf6e154e98';
    this.api_pass = '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';
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
    // this.GetInfo();
    this.customer = this.GetCustomerByEmail(this.email);
    this.customerID;
    this.pack = this._PackageMaterials();
    this.totalprice;
  }

  GetInfo() {
    for(const [key, sheet] of Object.entries(SHEETS)) {
      const finder = sheet.createTextFinder(this.jobnumber).findNext();
      if (finder != null) {
        this.row = finder.getRow();
        this.sheet = sheet;
        this.sheetName = sheet.getName();
      }
    }
    this.designspecialist = this.GetByHeader(this.sheet, "(INTERNAL): DS Assigned", this.row);
    this.email = this.GetByHeader(this.sheet, "Email Address", this.row);
    this.name = this.GetByHeader(this.sheet, "What is your name?", this.row);
    this.projectname = this.GetByHeader(this.sheet, "Project Name", this.row);
    this.material1Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 1", this.row);
    this.material1Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 1 Quantity", this.row);
    this.material2Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 2", this.row);
    this.material2Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 2 Quantity", this.row);
    this.material3Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 3", this.row);
    this.material3Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 3 Quantity", this.row);
    this.material4Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 4", this.row);
    this.material4Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 4 Quantity", this.row);
    this.material5Name = this.GetByHeader(this.sheet, "(INTERNAL) Item 5", this.row);
    this.material5Quantity = this.GetByHeader(this.sheet, "(INTERNAL) Material 5 Quantity", this.row);
  }

  GetByHeader (sheet, colName, row) {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row - 1][col];
    }
  };

  /**
   * Better Lookup
   * @param {string} material name
   * @returns {[string, string]} productID, link, price
   */
  _LookupStoreProductDetails(material) {
    // material = 'Fortus Red ABS-M30'; // Test Material
    // let out = {}
    let productID;
    for (const [key, sheet] of Object.entries(STORESHEETS)) {
      const find = SearchSpecificSheet(sheet, material);
      if(find !== false) {
        let index = find;
        // let sheetName = sheet.getName();
        // let link = sheet.getRange(index, 2, 1, 1).getValue();
        // let price = sheet.getRange(index, 6, 1, 1).getValue();
        productID = sheet.getRange(index, 4, 1, 1).getValue();
        // out["productID"] = productID;
        // out["link"] = link;
        // out["price"] = price;
      }
    } 
    // Logger.log(JSON.stringify(out));
    return productID.toString();
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Packages Materials in a way that can be used in MakeLineItems
   * @returns {[{string}]} materials
   */
  async _PackageMaterials() {

    // Pack
    let pack = {};
    pack["material1"] = { name : this.material1Name, ammount : this.material1Quantity, id : "" };
    pack["material2"] = { name : this.material2Name, ammount : this.material2Quantity, id : "" };
    pack["material3"] = { name : this.material3Name, ammount : this.material3Quantity, id : "" };
    pack["material4"] = { name : this.material4Name, ammount : this.material4Quantity, id : "" };
    pack["material5"] = { name : this.material5Name, ammount : this.material5Quantity, id : "" };

    // Remove when Those are empty / null / undefined
    for(const [key, values] of Object.entries(pack)) {
      if(values.name == null || values.ammount == null) {
        delete pack[key];
      } else values.id = this._LookupStoreProductDetails(values.name);
    }

    // Fetch Shopify Info
    let sum = 0.0;
    let shopifyPack = [];
    for(const [key, values] of Object.entries(pack)) {
      Logger.log(values.id);
      let info = await this.GetProductByID(values.id);
      let subtotal = +Number.parseFloat(info.variants[0].price * pack[key].ammount).toFixed(2);
      sum += subtotal;
      shopifyPack.push({ 
        name : key,
        title : info.title,
        id : info.id,
        price : info.variants[0].price,
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
    Logger.log(`Total Price = ${total}`);

    // Logger.log(`PACKED ----> ${JSON.stringify(shopifyPack)}`);
    return shopifyPack;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Shopify Order
   */
  async CreateOrder () {
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
    Logger.log(`ORDER SUMMARY ----> ${JSON.stringify(order)}`);

    let params = {
      "method" : "POST",
      "headers" : { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "payload" : JSON.stringify(order),
      followRedirects : true,
      muteHttpExceptions : true
    };

    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = JSON.parse(html.getContentText());
      Logger.log(`Posted Order! : ${content}`);
      return content;
    } else {
      Logger.log('Failed to POST to Shopify');
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

    let fields = '&fields=id,first_name,last_name,total_spent';
    let scope = 'customers/search.json?query=email:' + email;
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
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (html.getResponseCode() == 200) {
      let user = JSON.parse(html.getContentText())['customers'][0];
      if(!user) {
        Logger.log('User Shopify Account Does Not Exist. Please make a User Account on Shopify.');
        Logger.log(`Trying as internal sale.....`)
        return this.GetCustomerByEmail("jacobsinstitutestore@gmail.com");
        
      } else {
        Logger.log(`ID : ${user['id']}, Name : ${user['first_name']} ${user['last_name']}, Total Spent : ${user['total_spent']}`);
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
        "method" : "GET",
        "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
      };
      
      // Fetch Products
      let html = await UrlFetchApp.fetch(this.root + repo, params);
      let responseCode = html.getResponseCode();
      Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      if (responseCode == 200 || responseCode == 201) {
        let parsed = JSON.parse(html.getContentText())['product'];

        if(!parsed) {
          Logger.log(`Couldn't find Product!`);
          return false;
        } else {
          this.productTitle = parsed.title;
          if(parsed.title == undefined || parsed.title == null) this.productTitle = parsed.variants[0].title;
          this.id = productID;
          if(parsed.id == undefined || parsed.id == null) this.id = parsed.variants[0].id;
          this.price = parsed.price;
          if(parsed.price == undefined) this.price = parsed.variants[0].price;

          Logger.log(`Title : ${this.productTitle}, ID : ${this.id}, Price : ${this.price}`);
          return parsed; 
        }
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

    // Stuff into Params
    const params = {
      "method" : "GET",
      "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    
    // Fetch Products
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      var parsed = JSON.parse(html.getContentText())['orders'][0];
      Logger.log(`ORDER PLACED ----> TIME : ${parsed.created_at}\\n ORDER NUMBER : ${parsed.name}\\n TO : ${parsed.email}\\n FOR : $${parsed.total_price}`);
      return parsed;  
    }
    else return null;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Retrieve list of orders
   * Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
   * @return {string} order data
   */
  async GetOrdersList() {
    let total = 0;

    const status = 'status=any';
    const limit = '&limit=250'
    const fields = '&fields=name,total_price';

    const repo = 'orders.json?' + status + limit + fields;

    const params = {
      "method" : "GET",
      "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };
    
    // Fetch Products
    let html = await UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      var parsed = JSON.parse(html.getContentText())['orders'];

      let orderNums = [];
      let spent = [];

      parsed.forEach(item => {
        orderNums.push(item.name);
        spent.push(parseFloat(item.total_price));
      });
      let storeSpent = spent.reduce((a, b) => a + b, 0);
      this.total = storeSpent;
      Logger.log(orderNums);
      Logger.log(storeSpent);

      return orderNums;  
    }
    else return false;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create sales reports
   * @return {string} reports
   */
  async CreateSalesReport() {

    const ql = {
      "report": {
        "name": "Last 6 months of Sales",
        "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -6m UNTIL -1d ORDER BY total_sales",
      }
    }

    let params = {
      "method" : "POST",
      "headers" : { "Authorization" : "Basic " + Utilities.base64Encode(`${this.api_key} : ${this.api_pass}`) },
      "contentType" : "application/json",
      "payload" : ql,
      followRedirects : true,
      muteHttpExceptions : true,
    }
    
    // Fetch Reports
    let html = await UrlFetchApp.fetch(this.root, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ----> ${RESPONSECODES[responseCode]}`);

    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText()
      Logger.log(`Report -----> ${content}`)

      return content 
    }
    else return false;
  }



  /**
   * ----------------------------------------------------------------------------------------------------------------
   * GET sales reports
   * @return {string} reports
   */
  async GetSalesReport() {
   
    let params = {
      "method" : "GET",
      "headers" : { "Authorization" : "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };
    
    // Fetch Reports
    let html = await UrlFetchApp.fetch(this.root, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

    if (responseCode == 200 || responseCode == 201) {
      let content = html.getContentText();
      Logger.log(`Reports : ${content.toString()}`)

      return content;  
    }
    else return false;
  }


}

const _testAPI = async () => {
  const jobnumber = new JobNumberGenerator().Create();
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


  // Logger.log(customer)
  
  let order = await shopify.CreateOrder();
  Logger.log(JSON.stringify(order))
}



