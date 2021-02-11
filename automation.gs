
//Pull test - Cody

/**
 * ----------------------------------------------------------------------------------------------------------------
 * AUTOMATION : Update Prices
 * This function reaches out to Jacobs Store (NOT USING SHOPIFY API), fetches product prices and writes them to each 'StoreItem' sheet.
 */
var UpdatePrices = function () {
    var sheets = [
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AdvLabStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UltimakerStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FablightStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('HaasTormachStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShopbotStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WaterjetStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VinylCutterStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LaserStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OthermillStoreItems')
    ];
    try {
        sheets.forEach(sheet => WritePrice(sheet));
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
var WritePrice = function (sheet) {
    let prices = [];
    let last = sheet.getLastRow() - 1;
    let sheetRange = sheet.getRange(2, 2, last, 1).getValues();
    sheetRange.forEach(link => prices.push(GetPriceFromShopify(link)));
    Logger.log(prices);

    for(var i = 0; i < prices.length; i++) {
        let row = i + 2;
        sheet.getRange(row, 6, 1, 1).setValue(prices[i]);
    }


}
/**
 * ----------------------------------------------------------------------------------------------------------------
 * AUTOMATION : Get Price From Shopify Store URL (NOT USING SHOPIFY API)
 * Used in "WritePrice()" function
 * @param {string} url
 * @return {float} price
 */
var GetPriceFromShopify = function (url) {
  var price;
  try
  {
      //let meta = '<meta property="og:price:amount" content="0.17">';
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
      Logger.log(err + 'Couldnt fetch price');
  }
  //Logger.log('Price = ' + price);
  return price;
}


/**
 * AUTOMATION : Update Each Sheet with Product IDs : Uses FetchProductIDInProductURL()
 */
var UpdateProductID = function () {
    var sheets = [
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AdvLabStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UltimakerStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FablightStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('HaasTormachStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShopbotStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WaterjetStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VinylCutterStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LaserStoreItems'),
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OthermillStoreItems')
    ];
    //FetchProductIDInProductURL(sheets[8]);
    /*
    try {
        sheets.forEach(sheet => FetchProductIDInProductURL(sheet));
        Logger.log('Product IDs have been updated and written to each Store Sheet');
    }
    catch(err) {
        Logger.log(err + 'Could not update Product IDs to sheets for some reason.');
    }
    */
}
/**
 * AUTOMATION : Parses html to find the Product ID. (NOT USING SHOPIFY API)
 */
var FetchProductIDInProductURL = function (sheet) {
    var ids = [];

    let start = '"product":{"id":';
    let end = ',"gid":"gid:';

    var headers = { "Content-Type" : "application/json", "Authorization": "Basic " };
    var params = { "method" : "GET", "headers" : headers, "contentType" : "application/json", followRedirects : true, muteHttpExceptions : true };

    //Loop through sheet and extract id, write to list
    let urls = sheet.getRange(2, 2, sheet.getLastRow() -1, 1).getValues();
    Logger.log(urls);
    try {
        for(var i = 0; i < urls.length - 2; i++) {
            let url = urls[i][0];
            let html = UrlFetchApp.fetch(url, params).getContentText();
            let searchStart = html.search(start);
            let searchEnd = html.search(end);
            let id = html.slice(searchStart + start.length, searchEnd);
            ids.push(id);
        }
    }
    catch(err) {
      Logger.log('Sheet Oops');
    }
    //Write to Sheet
    for(var i = 0; i < ids.length; i++) {
        sheet.getRange(2 + i, 4, 1, 1).setValue(ids[i]);
    }

}

//Change
