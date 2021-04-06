
/**
 * Generate a barcode png image from a jobnumber.
 * Documentation at "https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API"
 */
const GenerateBarCode = (jobnumber) => {

    //jobnumber = "20210301140515";   //Test JobNumber
    //jobnumber = 20210224175306;

    //Access Tokens
    let root = 'http://bwipjs-api.metafloor.com/';
    let rootsec = 'https://bwipjs-api.metafloor.com/';
    let type = '?bcid=code128';
    let ts = '&text=';
    let scale = '&scale=0.75'
    let postfx = '&includetext';

    //let barcodeLoc = 'http://bwipjs-api.metafloor.com/?bcid=code128&text=1234567890&includetext';  //KNOWN WORKING LOCATION

    let barcodeLoc = root + type + ts + jobnumber + scale +postfx;

    //Params
    let params = {
        "method" : "GET",
        "headers" : { "Authorization": "Basic ", "Content-Type" : "image/png" },
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };
    
    let barcode;

    //Fetch Barcode
    let res = UrlFetchApp.fetch(barcodeLoc, params);
    Logger.log("Response Code : " + res.getResponseCode());
    if (res.getResponseCode() == 200) {

        barcode = DriveApp.createFile( Utilities.newBlob(res.getContent()).setName('Barcode' + jobnumber ) );
        barcode.setTrashed(true);

        // var meta = Drive.Files.get(file.getId()).imageMediaMetadata;
        // let embed = Drive.Files.get(file.getId()).embedLink; 

        // GmailApp.sendEmail('codyglen@berkeley.edu', 'JPSY : Barcode', '', {
        //     htmlBody: embed,
        //     'from': 'jacobsprojectsupport@berkeley.edu',
        //     'name': 'JPSY'
        // });

    } 
    else Logger.log('Failed to GET Barcode');

    Logger.log(barcode);
    return barcode;

}




/**
 * Generate a QR code from some data. Feed it a url.
 * @param {string} url
 * @return
 */
const GenerateQRCode = (url, jobnumber) => {

    if(url === null || url === undefined) {
         url = 'jps.jacobshall.org/';
    }
    if(jobnumber == null || jobnumber == undefined) {
         jobnumber = Math.floor(Math.random() * 100000).toFixed();
    }
    Logger.log(`URL : ${url}, Jobnumber || RNDNumber : ${jobnumber}`);

    let loc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`;  //API call
    
    //Encode Header
    let headers = { "Authorization" : "Basic" };

    //Stuff payload into postParams
    let postParams = {
        "method" : "GET",
        "headers" : headers,
        "contentType" : "application/json",
        followRedirects : true,
        muteHttpExceptions : true
    };

    //Fetch QR Code
    let qrCode;
    let res = UrlFetchApp.fetch(loc, postParams);
    Logger.log(`Response Code : ${res.getResponseCode()}`);
    if (res.getResponseCode() == 200) {
        qrCode = DriveApp.createFile( Utilities.newBlob(res.getContent()).setName('QRCode' + jobnumber ) );
        qrCode.setTrashed(true);
    }
    else Logger.log('Failed to GET QRCode');

    Logger.log(qrCode);
    return qrCode;

}



const _BarcodeQRCodeUnitTest = async () => {
    // try {
    //     jobnumber = "20210301140515";   //Known working Test JobNumber
    //     if( await GenerateBarCode(jobnumber) !== null) {
    //         Logger.log('PASSED'); //Should PASS
    //     }
    //     if( await GenerateBarCode('123kjnb345kjb3') !== null) {
    //         Logger.log('PASSED'); //Should PASS
    //     }
    //     if( await GenerateBarCode('#@$%%$^*^&R@#$G') !== null) {
    //         Logger.log('PASSED'); //Should FAIL
    //     }
    // }
    // catch(err) {
    //     Logger.log(err + ' : Failed Test')
    // }
    try {
        jobnumber = "20210301140515";   //Known working Test JobNumber
        if( await GenerateQRCode(jobnumber) !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateQRCode('123kjnb345kjb3') !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if( await GenerateQRCode('#@$%%$^*^&R@#$G') !== null) {
            Logger.log('PASSED'); //Should FAIL
        }
    }
    catch(err) {
        Logger.log(`${err} : Failed Test`)
    }
}



