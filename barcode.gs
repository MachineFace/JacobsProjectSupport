
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

const _BarcodeUnitTest = () => {
    try {
        jobnumber = "20210301140515";   //Known working Test JobNumber
        if(GenerateBarCode(jobnumber) !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if(GenerateBarCode('123kjnb345kjb3') !== null) {
            Logger.log('PASSED'); //Should PASS
        }
        if(GenerateBarCode('#@$%%$^*^&R@#$G') !== null) {
            Logger.log('PASSED'); //Should FAIL
        }
    }
    catch(err) {
        Logger.log(err + ' : Failed Test')
    }
}


