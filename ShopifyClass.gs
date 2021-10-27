

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
    this.root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    this.api_key = '1e70652225e070b078def8bf6e154e98';
    this.api_pass = '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';
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
    this.customer = this.GetShopifyCustomerByEmail(this.email);
    this.pack = this._PackageMaterials();
  }


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

    let pack = {};
    // Pack
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

    // Logger.log(JSON.stringify(pack));

    // Fetch Shopify Info
    let shopifyPack = [];
    for(const [key, values] of Object.entries(pack)) {
      Logger.log(values.id);
      let info = this.GetShopifyProductByID(values.id);
      Logger.log(info);
      shopifyPack.push({ 
        // name : info.[index],
        title : shopifyInfo[index].title,
        id : shopifyInfo[index].id,
        price : shopifyInfo[index].variants[0].price,
        quantity : quantityList[index],
        subtotal : shopifyInfo[index].variants[0].price * quantityList[index]
      });
    }
    // let shopifyInfo = [];
    // productIDs.forEach(id => shopifyInfo.push(this.GetShopifyProductByID(id)));
    // productIDs.forEach( (id,index) => {
    //   let matDict = { 
    //     name : materialList[index],
    //     title : shopifyInfo[index].title,
    //     id : shopifyInfo[index].id,
    //     price : shopifyInfo[index].variants[0].price,
    //     quantity : quantityList[index],
    //     subtotal : shopifyInfo[index].variants[0].price * quantityList[index]
    //   };
    //   pack.push(matDict);
    // })

    // // Calculate Sum
    // let sum = [];
    // pack.forEach(mat => sum.push(mat.subtotal));
    // let total_price = sum.reduce((a, b) => a + b, 0);
    // Logger.log('Total Price = ' + total_price);

    // return pack;
  }


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Line Items for Orders
   * @returns {[{string}]} lineItems
   */
  async MakeLineItems (materials) {
    // Output List
    let lineItems = [];

    // Loop through list to write line items  
    materials.forEach( material => {
      let item = {
        "name": material.name,
        "title" : material.title,
        "id": material.id,
        "price" : material.price ,
        "quantity": material.quantity,
        "discount_allocations": [
          {
            "amount": "0.00",
            "discount_application_index": 0,
            "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
          }
        ]  
      };
      lineItems.push(item);
    });

    // Logger.log(lineItems);
    return lineItems;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create Shopify Order
   * @param {Dictionary} customer
   * @param {string} jobnumber
   * @param {[dicts]]} materialList
   * @param {[{dicts}]} formattedMats
   * INPROGRESS
   */
  async CreateShopifyOrder (customer, jobnumber, materialsList, formattedMats) {
    let repo = 'orders.json/';

    // Order
    let order = {
      "order": {
        "line_items": formattedMats,
        "customer": {
          "id": customer.id
        },
        "total_price": materialsList.total_price,
        "financial_status": "paid",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + jobnumber
      }
    };

    // Stuff payload into params
    let params = {
      "method" : "POST",
      "headers" : { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(this.api_key + ":" + this.api_pass) },
      "contentType" : "application/json",
      "payload" : JSON.stringify(order),
      followRedirects : true,
      muteHttpExceptions : true
    };

    // Fetch Orders
    let html = UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200 || responseCode == 201) {
      let content = JSON.parse(html.getContentText());
      Logger.log(`Posted Order! : ${content}`);
    } 
    else Logger.log('Failed to POST to Shopify');
      
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up a Shopify Customer by Email
   * @param {string} email
   * @return {JSON} all customer data
   * Access individual properties by invoking GetShopifyCustomerByEmail(email).id or GetShopifyCustomerByEmail(email).name
   */
  async GetShopifyCustomerByEmail(email) {

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
    let html = UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (html.getResponseCode() == 200) {
      //Logger.log('Customer Found! : ' + content);
      let user = JSON.parse(html.getContentText())['customers'][0];
      if(user == undefined || user == null) {
        Logger.log('User Shopify Account Does Not Exist. Please make a User Account on Shopify.');
        return user;
      }
      Logger.log('ID: ' + user['id'] + ', Name : ' + user['first_name'] + ' ' + user['last_name'] + ', Total Spent : ' + user['total_spent']);

      this.id = user['id'];
      this.first_name = user['first_name'];
      this.last_name = user['last_name'];
      this.total_spent = user['total_spent'];
      
      return user;
    }
  }



  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up a Shopify Product by Name
   * @param {string} productID
   * @return {JSON} all product data
   * Access individual properties by invoking GetShopifyProductByID(productID).productTitle or GetShopifyProductByID(productID).id or GetShopifyProductByID(productID).price
   */
  async GetShopifyProductByID(productID) {
      // productID = 7751141320; //Test ID

      let status = '&status=active';
      let fields = '&fields=id,title,price,variants';

      // Fetch Product - GET /admin/api/2020-04/products.json?title=<searchString>&limit=250&fields=id,title
      const repo = 'products/' + productID + '.json?' + status + fields;

      // Stuff into Params
      let params = {
        "method" : "GET",
        "headers" : { "Authorization": "Basic " + Utilities.base64Encode(this.api_key + ":" + this.api_pass) },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
      };
      
      // Fetch Products
      let html = UrlFetchApp.fetch(this.root + repo, params);
      let responseCode = html.getResponseCode();
      Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      if (responseCode == 200) {
        var parsed = JSON.parse(html.getContentText())['product'];

        if(parsed == undefined || parsed == null || parsed == '') {
          Logger.log(`Couldn't find Product!`);
          return;
        }

        
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




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Look up the last order
   * @return {string} order data
   */
  async GetLastShopifyOrder() {
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
    let html = UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200) {
      var parsed = JSON.parse(html.getContentText())['orders'][0];

      let orderInfo = 'ORDER PLACED \\n TIME: ' + parsed.created_at + '\\n' + 'ORDER NUMBER : ' + parsed.name + '\\n' + 'TO : ' + parsed.email + '\\n' + 'FOR : $' + parsed.total_price;
      Logger.log(orderInfo);
      return parsed;  
    }
    else return null;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Retrieve list of orders
   * @return {string} order data
   */
  async GetShopifyOrdersList() {
    let total = 0;

    const status = 'status=any';
    const limit = '&limit=250'
    const fields = '&fields=name,total_price';

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
    let html = UrlFetchApp.fetch(this.root + repo, params);
    let responseCode = html.getResponseCode();
    Logger.log(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode == 200) {
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
    else return null;
  }




  /**
   * ----------------------------------------------------------------------------------------------------------------
   * Create sales reports
   * @return {string} reports
   */
  async CreateShopifySalesReport() {

    const ql = {
      "report": {
        "name": "Last 6 months of Sales",
        "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -6m UNTIL -1d ORDER BY total_sales",
      }
    }

    // Params
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

    if (responseCode == 200) {
      let content = html.getContentText()
      Logger.log(`Reports : ${content}`)

      return content 
    }
    else return null;
  }



  /**
   * ----------------------------------------------------------------------------------------------------------------
   * GET sales reports
   * @return {string} reports
   */
  async GetShopifySalesReport() {
   
    // Params
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

    if (responseCode == 200) {
      let content = html.getContentText();
      Logger.log(`Reports : ${content.toString()}`)

      return content;  
    }
    else return null;
  }


}

const _testAPI = async () => {
  const jobnumber = new JobNumberGenerator().Create();
  const shopify = new ShopifyAPI({
    jobnumber : jobnumber,
    email : "jacobsinstitutestore@gmail.com",
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
  // let product = await shopify.LookupShopifyProductFromSheet();
  // let lastOrder = await shopify.GetLastShopifyOrder();
  // let orders = await shopify.GetShopifyOrdersList();
  // let product = await shopify.GetShopifyProductByID(7751141320);
  // let customer = await shopify.GetShopifyCustomerByEmail('jacobsinstitutestore@gmail.com');
  // let pack = await shopify.PackageMaterials('Fortus Red ABS-M30', 5,'Objet Polyjet VeroMagenta RGD851',10,null,123234,'Stratasys Dimension Soluble Support Material P400SR',15,null,20);
  // let lineItems = await shopify.MakeLineItems(pack);
  // let order = await shopify.CreateShopifyOrder(customer, 1293847123, pack, lineItems);
  // let lookup = shopify.LookupShopifyProductFromSheet2();
  // let customer = shopify.SetCustomer("jacobsinstitutestore@gmail.com");
  let pack = shopify._PackageMaterials();
  // Logger.log(JSON.stringify(pack))
}




