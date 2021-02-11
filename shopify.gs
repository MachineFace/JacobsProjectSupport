

/**
 * ----------------------------------------------------------------------------------------------------------------
 * For a given material, look up corresponding ProductID
 * @param {string} material name
 * @returns {string} productID
 */
var LookupProductID = function(material) {
    //material = 'Fortus Red ABS-M30'; // Test Material
    //var materialSheet;
    var link;
    var price;
    var productID;

    let namePool = {
        'UltimakerStoreItems' : materialDict.ultimaker.getRange(2, 1, materialDict.ultimaker.getLastRow() -1, 1).getValues(),
        'LaserStoreItems' : materialDict.laser.getRange(2, 1, materialDict.laser.getLastRow() -1, 1).getValues(),
        'FablightStoreItems' : materialDict.fablight.getRange(2, 1, materialDict.fablight.getLastRow() -1, 1).getValues(),
        'WaterjetStoreItems' : materialDict.waterjet.getRange(2, 1, materialDict.waterjet.getLastRow() -1, 1).getValues(),
        'AdvLabStoreItems' : materialDict.advlab.getRange(2, 1, materialDict.advlab.getLastRow() -1, 1).getValues(),
        'ShopbotStoreItems' : materialDict.shopbot.getRange(2, 1, materialDict.shopbot.getLastRow() -1, 1).getValues(),
        'HaasTormachStoreItems' : materialDict.haas.getRange(2, 1, materialDict.haas.getLastRow() -1, 1).getValues(),
        'VinylCutterStoreItems' : materialDict.vinyl.getRange(2, 1, materialDict.vinyl.getLastRow() -1, 1).getValues(),
        'OthermillStoreItems' : materialDict.othermill.getRange(2, 1, materialDict.othermill.getLastRow() -1, 1).getValues(),
    }

    var index = 0;
    var sheetName;
    for (let [page, values] of Object.entries(namePool)) {
        for(let i = 0; i < values.length; i++) {
            if(values[i] == material) {
                index = i + 2;
                sheetName = page;
                link = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(index, 2, 1, 1).getValue();
                price = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(index, 6, 1, 1).getValue();
                productID = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page).getRange(index, 4, 1, 1).getValue();
                break;
            }
        }
    }
    
    this.link = link;
    this.price = price;
    this.productID = productID;


    //Logger.log('Material Found in Material Sheets: ' + material + ', Product ID : ' + this.productID.toString() + ', Index : ' + index + ', Price : $' + this.price);
    //Logger.log(productID);
    return productID;
    
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Packages Materials in a way that can be used in MakeLineItems
 * @returns {[{string}]} materials
 */
var PackageMaterials = function(material1Name, material1Quantity, material2Name, material2Quantity, material3Name, material3Quantity, material4Name, material4Quantity, material5Name, material5Quantity) {

    // //Test Variables
    // material1Name = 'Fortus Red ABS-M30'; 
    // material1Quantity = 5;
    // material2Name = 'Objet Polyjet VeroMagenta RGD851';
    // material2Quantity = 10;
    // material3Name = null;
    // material3Quantity = 123234;
    // material4Name = 'Stratasys Dimension Soluble Support Material P400SR';
    // material4Quantity = 15;
    // material5Name = null;
    // material5Quantity = 20;

    let package = [];

    //Lists (Pushing at the same time ensures the lists are the same size.)
    let materialList = [material1Name, material2Name, material3Name, material4Name, material5Name];
    let quantityList = [material1Quantity, material2Quantity, material3Quantity, material4Quantity, material5Quantity];

    //Remove when Those are empty / null / undefined
    for(let i = 0; i <= materialList.length + 1; i++) {
        if(materialList[i] == null || materialList[i] == undefined || materialList[i] == '' || materialList[i] == ' ') {
            materialList.splice(i);
            quantityList.splice(i);
        }
    }

    //Fetch IDS
    let productIDs = [];
    materialList.forEach(material => productIDs.push(LookupProductID(material)));
    for(let i = 0; i < productIDs.length; i++) {
        if(productIDs[i] == null || productIDs[i] == undefined || productIDs[i] == '') {
            productIDs.splice(i,1);
        }
    }
    Logger.log(productIDs);

    //Fetch Shopify Info
    let shopifyInfo = [];
    productIDs.forEach(id => shopifyInfo.push(new GetShopifyProductByID(id)));

    for(let i = 0; i < productIDs.length; i++) {
        let matDict = { 
            name : materialList[i],
            title : shopifyInfo[i].title,
            id : shopifyInfo[i].id,
            price : shopifyInfo[i].variants[0].price,
            quantity : quantityList[i],
            subtotal : shopifyInfo[i].variants[0].price * quantityList[i]
        };
        package.push(matDict);
    }

    //Calculate Sum
    let sum = [];
    package.forEach(mat => sum.push(mat.subtotal));
    let total_price = sum.reduce((a, b) => a + b, 0);
    Logger.log('Total Price = ' + total_price);

    return package;
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create Line Items for Orders
 * @returns {[{string}]} lineItems
 */
var MakeLineItems = function(materials) {
    //Output List
    var lineItems = [];

    //Logger.log('Number of Materials : ' + materials.length);

    //Loop through list to write line items
    for(let i = 0; i < materials.length; i++) {
        let item = {
            "name": materials[i].name,
            "title" : materials[i].title,
            "id": materials[i].id,
            "price" : materials[i].price ,
            "quantity": materials[i].quantity,
            "discount_allocations": [
              {
                "amount": "0.00",
                "discount_application_index": 0,
                "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
              }
            ]  
          };
        lineItems.push(item);

    }

    //Logger.log(lineItems);
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
var CreateShopifyOrder = function(customer, jobnumber, materialsList, formattedMats) {
    //Access Tokens
    let root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    let api_key = '1e70652225e070b078def8bf6e154e98';
    let api_pass = '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';

    //let ordersLoc = root + 'orders.json/';
    let ordersLoc = root + 'orders.json/';
    
    //Encode Header
    let headers = { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(api_key + ":" + api_pass) };

    //Order
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

    //Stuff payload into postParams
    let postParams = {
        "method" : "POST",
        "headers" : headers,
        "contentType" : "application/json",
        "payload" : JSON.stringify(order),
        followRedirects : true,
        muteHttpExceptions : true
    };

    //Fetch Orders
    let html = UrlFetchApp.fetch(ordersLoc, postParams);
    let content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        Logger.log('Posted Order! : ');
        //Logger.log(content.toString());
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
var GetShopifyCustomerByEmail = function(email){

    //var id;
    //var first_name;
    //var last_name;
    //var total_spent;

    //Access Tokens
    let root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    let api_key = '1e70652225e070b078def8bf6e154e98';
    let api_pass = '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';
    
    //email = 'eli_lee@berkeley.edu'; //Test Name

    let fields = '&fields=id,first_name,last_name,total_spent';
    let scope = 'customers/search.json?query=email:' + email;
    let search = root + scope + fields;

    //Encode Header
    let headers = { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) };

    //Stuff into Params
    let params = {
        "method" : "GET",
        "headers" : headers,
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };

    //Fetch Customer
    let html = UrlFetchApp.fetch(search, params);
    let content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        //Logger.log('Customer Found! : ' + content);
        let user = JSON.parse(content)['customers'][0];
        if(user == undefined || user == null) {
          Logger.log('User Shopify Account Does Not Exist. Please make a User Account on Shopify.');
          return user;
        }
        //Logger.log(user);
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
var GetShopifyProductByID = function(productID) {
    //productID = 7751141320; //Test ID
    var productTitle;
    var price;
    var name;

    //Access Tokens
    let root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    let api_key = '1e70652225e070b078def8bf6e154e98';
    let api_pass = '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';

    let status = '&status=active';
    let fields = '&fields=id,title,price,variants';

    //Fetch Product - GET /admin/api/2020-04/products.json?title=<searchString>&limit=250&fields=id,title
    let products = root + 'products/' + productID + '.json?' + status + fields;
    
    //Encode Header
    let headers = { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) };

    //Stuff into Params
    let params = {
        "method" : "GET",
        "headers" : headers,
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    //Fetch Products
    let html = UrlFetchApp.fetch(products, params);
    let content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        var parsed = JSON.parse(content)['product'];
        //Logger.log(parsed);
        if(parsed == undefined || parsed == null || parsed == '') {
            Logger.log('Could not find Product!');
            return;
        }
        //Logger.log(parsed[0]);
        
        this.productTitle = parsed.title;
        if(parsed.title == undefined || parsed.title == null) this.productTitle = parsed.variants[0].title;
        this.id = productID;
        if(parsed.id == undefined || parsed.id == null) this.id = parsed.variants[0].id;
        this.price = parsed.price;
        if(parsed.price == undefined) this.price = parsed.variants[0].price;

        Logger.log('Title : ' + this.productTitle + ', ID : ' + this.id + ', Price : ' + this.price);
        return parsed;  
    }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Look up the last order
 * @return {string} order data
 */
var GetLastShopifyOrder = function() {
    //Access Tokens
    let root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    let api_key = '1e70652225e070b078def8bf6e154e98';
    let api_pass = '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';

    let status = '&status=any';
    let limit = '&limit=1'
    let fields = '&fields=created_at,id,name,last_name,first_name,email,total-price';

    //Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
    let products = root + 'orders.json?' + status + limit + fields;

    //Encode Header
    let headers = { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) };

    //Stuff into Params
    let params = {
        "method" : "GET",
        "headers" : headers,
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    //Fetch Products
    let html = UrlFetchApp.fetch(products, params);
    let content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        var parsed = JSON.parse(content)['orders'][0];
        //Logger.log(parsed);

        let orderInfo = 'ORDER PLACED \\n TIME: ' + parsed.created_at + '\\n' + 'ORDER NUMBER : ' + parsed.name + '\\n' + 'TO : ' + parsed.email + '\\n' + 'FOR : $' + parsed.total_price;
        Logger.log(orderInfo);
        return orderInfo;  
    }
    else {
        return null;
    }
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Retrieve list of orders
 * @return {string} order data
 */
var GetShopifyOrdersList = function() {
    let total = 0;

    //Access Tokens
    let root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    let api_key = '1e70652225e070b078def8bf6e154e98';
    let api_pass = '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';

    let status = 'status=any';
    let limit = '&limit=250'
    let fields = '&fields=name,total_price';

    //Fetch Orders - GET /admin/api/2021-01/orders.json?status=any
    let products = root + 'orders.json?' + status + limit + fields;

    //Encode Header
    let headers = { "Authorization": "Basic " + Utilities.base64Encode(api_key + ":" + api_pass) };

    //Stuff into Params
    let params = {
        "method" : "GET",
        "headers" : headers,
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    //Fetch Products
    let html = UrlFetchApp.fetch(products, params);
    let content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        var parsed = JSON.parse(content)['orders'];

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
    else {
        return null;
    }
}


