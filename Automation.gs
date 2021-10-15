

/**
 * ----------------------------------------------------------------------------------------------------------------
 * AUTOMATION : Update Prices
 * This function reaches out to Jacobs Store (NOT USING SHOPIFY API), fetches product prices and writes them to each 'StoreItem' sheet.
 */
const UpdatePrices = () => {
  try {
    for(const [key, sheet] of Object.entries(STORESHEETS)) {
      sheet.forEach(sheet => WritePrice(sheet));
    }
    Logger.log('Unit Prices have been updated and written to each Store Sheet');
  }
  catch(err) {
    Logger.log(err + 'Could not update prices to sheets for some reason.');
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * AUTOMATION : Write the price to sheet
 * Used in "UpdatePriced()" function
 */
const WritePrice = (sheet) => {
  let prices = [];
  let range = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  range.forEach(link => prices.push(GetPriceFromShopify(link)));
  Logger.log(prices);

  prices.forEach( (price, index) => {
    sheet.getRange(index + 2, 6, 1, 1).setValue(price);
  });
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * AUTOMATION : Get Price From Shopify Store URL (NOT USING SHOPIFY API)
 * Used in "WritePrice()" function
 * @param {string} url
 * @return {float} price
 */
const GetPriceFromShopify = (url) => {
  var price;
  try
  {
    // let meta = '<meta property="og:price:amount" content="0.17">';
    var urlFixed = url.toString() + '&exportFormat=html';
    var param = {
      method: 'get',
      headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true,
    };
    var html = UrlFetchApp.fetch(url, param).getContentText();

    var searchstring = 'og:price:amount';
    var index = html.search(searchstring);
    if (index >= 0) {
      var pos = index + searchstring.length
      var rate = html.substring(pos + 10, pos + 16);
      var stripped = rate.replace(/^"(.*)"$/, '$1');
      price = parseFloat(stripped);
    }

  }
  catch(err){
    Logger.log(`${err} : Couldn't fetch price.`);
  }
  //Logger.log('Price = ' + price);
  return price;
}


/**
 * AUTOMATION : Update Each Sheet with Product IDs : Uses FetchProductIDInProductURL()
 */
const UpdateProductID = () => {    
  try {
    for(const [key, sheet] of Object.entries(STORESHEETS)) {
      FetchProductIDInProductURL(sheet);
    }
    Logger.log('Product IDs have been updated and written to each Store Sheet');
  }
  catch(err) {
    Logger.log(err + 'Could not update Product IDs to sheets for some reason.');
  }

}


/**
 * AUTOMATION : Parses html to find the Product ID. (NOT USING SHOPIFY API)
 */
const FetchProductIDInProductURL = (sheet) => {
  let ids = [];

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

  // Loop through sheet and extract id, write to list
  let urls = sheet.getRange(2, 2, sheet.getLastRow() -1, 1).getValues();
  Logger.log(urls);
  try {
    for(let i = 0; i < urls.length - 2; i++) {
      let url = urls[i][0];
      let html = UrlFetchApp.fetch(url, params).getContentText();
      let searchStart = html.search(start);
      let searchEnd = html.search(end);
      let id = html.slice(searchStart + start.length, searchEnd);
      ids.push(id);
    }
  }
  catch(err) {
    Logger.log(`${err} : Sheet Oops`);
  }
  // Write to Sheet
  ids.forEach( (id, index) => {
    sheet.getRange(2 + index, 4, 1, 1).setValue(id);
  })


}


