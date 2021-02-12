//New Comment
//CP testing commits

/*      On open, create a custom menu

  function onOpen() {
  let spreadsheet = SpreadsheetApp.getActive();
  let menuItems = [
    {name: 'Generate Billing', functionName: 'customFunc'},
    {name: 'Some other function', functionName: 'otherFunc'}
  ];
  spreadsheet.addMenu('JPS', menuItems);
}
*/
    
    /*    
        onFormSubmit - Draft of new way to cast these variables - CP 2-8-21
        
        - All of the basic form questions (name, email, student ID, etc.) and columns have been made uniform on all sheets
    
        var data = {
            name: e.namedValues['Name'][0], 
            email: e.namedValues['Email Address'][0],
            sid: e.namedValues['Your Student ID Number?'][0],
            studentType: e.namedValues['What is your affiliation to the Jacobs Institute?'][0],
            projectname: e.namedValues['Project Name'][0],
            shipping: e.namedValues['Do you need your parts shipped to you?'][0],
            timestamp: e.namedValues['Timestamp'][0]
        };

        var {name, email, sid, studentType, projectname, shipping, timestamp} = data;
    */



  /*    
      onEdit - Draft of new way to cast these variables - CP 2-8-21 
      
      - All of the basic form questions (name, email, student ID, etc.) and columns have been made uniform on all sheets
          
          var status = getByHeader("(INTERNAL) Status", thisRow);   
          var designspecialist = getByHeader("(INTERNAL): DS Assigned", thisRow); 
          var priority = getByHeader("(INTERNAL): Priority", thisRow);
          var jobnumber = getByHeader("(INTERNAL AUTO) Job Number", thisRow);
          var studentApproval = getByHeader("Student Has Approved Job", thisRow);
          var submissiontime = getByHeader("Timestamp", thisRow);
          var email = getByHeader("Email Address", thisRow);
          var name = getByHeader("What is your name", thisRow); 
          var sid = getByHeader("Student ID Number", thisRow);
          var studentType = getByHeader("What is your affiliation to the Jacobs Institute?", thisRow);
          var projectname = getByHeader("Project Name", thisRow);
          var shippingQuestion = getByHeader("Do you need your parts shipped to you?", thisRow);
          var cost = getByHeader("Estimate", thisRow); 
      
      
  */



var CreateShopifyOrderBackup2 = function (customer, jobnumber, materialsList) {
    //Access Tokens
    var root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    var api_key = '1e70652225e070b078def8bf6e154e98';
    var api_pass = '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';
    var productsList = materialsList;
    let ordersLoc = root + 'orders.json/';


    //var lineitems = [];

    //Loop through productsList array
    /*
    for (var row = 0; row < productsList.length; row++) {
      var sub = productsList[row];
      var product = sub[0];     //Shopify product object, adding to array product
      Logg("CreateShopifyOrder: product " + row + sub[0]);
      //Logg("var product title " + product.title);
      //Logger.log("row " + row + " name = " + name);
      var quant = sub[1];
      var price = product.variants[0].price;

    }*/

    //let price1 = product1.variants[0].price;
    //let totalprice1 = price1 * material1Quantity;

    //let price2 = product2.variants[0].price;
    //let totalprice2 = price2 * material2Quantity;

    let title1 = productsList[0][0].title;
    let price1 = productsList[0][0].variants[0].price;
    let id1 = productsList[0][0].id;
    let quantity1 = productsList[0][1];
    let totalprice1 = price1 * quantity1;

    var title2;
    var price2;
    var id2;
    var quantity2;
    var totalprice2;

    var title3;
    var price3;
    var id3;
    var quantity3;
    var totalprice3;

    Logg("productsList length " + productsList.length);

    if (productsList[1][0] !="") {
      Logg("Product2 is not empty");
      title2 = productsList[1][0].title;

      price2 = productsList[1][0].variants[0].price;
      Logg("price2 "+price2);
      id2 = productsList[1][0].id;

      quantity2 = productsList[1][1];

      totalprice2 = price2 * quantity2;

    } else {
      Logg("Product2 is empty");
      title2 = "";
      price2 = 0;
      id2= 0;
      quantity2 = 0;
      totalprice2 = 0;
    }

    if (productsList[2][0] !="") {
      Logg("Product3 is not empty");
      title3 = productsList[2][0].title;
      Logg("title3 " + title3);
      price3 = productsList[2][0].variants[0].price;
      Logg("price3 " + price3);
      id3 = productsList[2][0].id;
      Logg("id3 "+id3);
      quantity3 = productsList[2][1];
      Logg("quantity3 " + quantity3);
      totalprice3 = price3 * quantity3;
      Logg("totalprice3 "+totalprice3);
    } else {
      Logg("Product3 is empty");
      title3 = "";
      price3 = 0;
      id3= 0;
      quantity3 = 0;
      totalprice3 = 0;
    }
    Logg("Done sorting product variables. Title3 is " + title3);

    //Logg("TEST TTIITLE" + productsList[1][0].title);
    //Logg("TEST IDDD" + productsList[1][0].id);
    //Logg("Test PRICE " + productsList[1][0].variants[0].price);
    //Logg("TEST Qyuant " + productsList[1][1]);


    //Encode Header
    var headers = { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(api_key + ":" + api_pass) };



    //Order

    var order = {
      "order": {
        "line_items": [
          {
            "name": title1,
            "title" : title1,
            "id": id1,
            "price" : price1,
            "quantity": quantity1,
            "discount_allocations": [
              {
                "amount": "0.00",
                "discount_application_index": 0,
                "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
              },
            ],
          },
          {
            "name": title2,
            "title" : title2,
            "id": id2,
            "price" : price2,
            "quantity": quantity2,
            "discount_allocations": [
              {
                "amount": "0.00",
                "discount_application_index": 0,
                "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
              },
            ],
          },
        ],
        "customer": {
          "id": customer.id
        },
        "total_price": totalprice1 + totalprice2,
        //"financial_status": "pending",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + jobnumber + ",  THIS IS A TEST ORDER FROM JPS and will be deleted"
      }
    };
    Logg("line items created");
    //Stuff payload into postParams
    var postParams = {
        "method" : "post",
        "headers" : headers,
        "contentType" : "application/json",
        "payload" : JSON.stringify(order),
        followRedirects : true,
        muteHttpExceptions : true
    };
    Logg("params created");
    //Fetch Orders
    var html = UrlFetchApp.fetch(ordersLoc, postParams);
    Logger.log(html);
    Logg(html);
    var content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    Logg("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200 || html.getResponseCode() == 201) {
        Logger.log('Posted Order! : ');
        Logg("posted order!");
        Logger.log(content.toString());
    }
    else {
      Logger.log('Failed to POST to Shopify');
      Logg("Failed to post to Shopify");
      }

}

var CreateShopifyOrderBackup = function (customer, jobnumber, materialsList) {
    //Access Tokens
    var root = 'https://jacobs-student-store.myshopify.com/admin/api/2021-01/';
    var api_key = '1e70652225e070b078def8bf6e154e98';
    var api_pass = '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';
    var productsList = materialsList;
    let ordersLoc = root + 'orders.json/';


    //var lineitems = [];

    //Loop through productsList array
    for (var row = 0; row < productsList.length; row++) {
      var sub = productsList[row];
      var product = sub[0];     //Shopify product object, adding to array product
      Logg("CreateShopifyOrder: product " + row + sub[0]);
      //Logg("var product title " + product.title);
      //Logger.log("row " + row + " name = " + name);
      var quant = sub[1];
      var price = product.variants[0].price;

      /*
      lineitems += {
        "name": product.title,
        "title" : product.title,
        "id": product.id,
        "price" : price,
        "quantity": quant,
        "discount_allocations": [
          {
            "amount": "0.00",
            "discount_application_index": 0,
            "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
          },
        ]
      };
      */

    }

    //let price1 = product1.variants[0].price;
    //let totalprice1 = price1 * material1Quantity;

    //let price2 = product2.variants[0].price;
    //let totalprice2 = price2 * material2Quantity;

    let title1 = productsList[0][0].title;
    let price1 = productsList[0][0].variants[0].price;
    let id1 = productsList[0][0].id;
    let quantity1 = productsList[0][1];
    let totalprice1 = price1 * quantity1;

    var title2;
    var price2;
    var id2;
    var quantity2;
    var totalprice2;

    var title3;
    var price3;
    var id3;
    var quantity3;
    var totalprice3;

    if (productsList[1][0] !="") {
      Logg("Product2 is not empty");
      title2 = productsList[1][0].title;

      price2 = productsList[1][0].variants[0].price;
      Logg("price2 "+price2);
      id2 = productsList[1][0].id;

      quantity2 = productsList[1][1];

      totalprice2 = price2 * quantity2;

    } else {
      Logg("Product2 is empty");
      title2 = "";
      price2 = 0;
      id2= 0;
      quantity2 = 0;
      totalprice2 = 0;
    }

    if (productsList[2][0] !="") {
      Logg("Product3 is not empty");
      title3 = productsList[2][0].title;
      Logg("title3 " + title3);
      price3 = productsList[2][0].variants[0].price;
      Logg("price3 " + price3);
      id3 = productsList[2][0].id;
      Logg("id3 "+id3);
      quantity3 = productsList[2][1];
      Logg("quantity3 " + quantity3);
      totalprice3 = price3 * quantity3;
      Logg("totalprice3 "+totalprice3);
    } else {
      Logg("Product3 is empty");
      let title3 = "";
      let price3 = 0;
      let id3= 0;
      let quantity3 = 0;
      let totalprice3 = 0;
    }
    Logg("Done sorting product variables. Title3 is " + title3);

    //Logg("TEST TTIITLE" + productsList[1][0].title);
    //Logg("TEST IDDD" + productsList[1][0].id);
    //Logg("Test PRICE " + productsList[1][0].variants[0].price);
    //Logg("TEST Qyuant " + productsList[1][1]);


    //Encode Header
    var headers = { "Authorization": "Basic " + Utilities.base64EncodeWebSafe(api_key + ":" + api_pass) };



    //Order

    var order = {
      "order": {
        "line_items": [
          {
            "name": title1,
            "title" : title1,
            "id": id1,
            "price" : price1,
            "quantity": quantity1,
            "discount_allocations": [
              {
                "amount": "0.00",
                "discount_application_index": 0,
                "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
              },
            ],
          },
          {
            "name": title2,
            "title" : title2,
            "id": id2,
            "price" : price2,
            "quantity": quantity2,
            "discount_allocations": [
              {
                "amount": "0.00",
                "discount_application_index": 0,
                "amount_set": { "shop_money": { "amount": "0.00", "currency_code": "USD" }, }
              },
            ],
          },
        ],
        "customer": {
          "id": customer.id
        },
        "total_price": totalprice1 + totalprice2,
        //"financial_status": "pending",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + jobnumber + ",  THIS IS A TEST ORDER FROM JPS and will be deleted"
      }
    };


    //Order - Procedural for ProductsList array
    /*
    var order = {
      "order": {
        "line_items": [
          lineitems
        ],
        "customer": {
          "id": customer.id
        },
        "total_price": totalprice1 + totalprice2,
        //"financial_status": "pending",
        "fulfillment_status": "fulfilled",
        "inventory_behaviour" : "decrement_ignoring_policy",
        "note": "Job Number : " + jobnumber + ",  THIS IS A TEST ORDER FROM JPS and will be deleted"
      }
    };
    */

    //Stuff payload into postParams
    var postParams = {
        "method" : "post",
        "headers" : headers,
        "contentType" : "application/json",
        "payload" : JSON.stringify(order),
        followRedirects : true,
        muteHttpExceptions : true
    };

    //Fetch Orders
    var html = UrlFetchApp.fetch(ordersLoc, postParams);
    Logger.log(html);
    var content = html.getContentText();
    Logger.log("Response Code : " + html.getResponseCode());
    if (html.getResponseCode() == 200) {
        Logger.log('Posted Order! : ');
        Logg("posted order!");
        Logger.log(content.toString());
    }
    else {
      Logger.log('Failed to POST to Shopify');
      Logg("Failed to post to Shopify");
      }

}

