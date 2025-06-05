/**
 * QR Code Generator
 * @required {string} url
 */
class QRCodeGenerator {
  constructor() {

  }

  /**
   * Generate QR Code
   */
  static async GenerateQRCode(url = `jps.jacobshall.org/`) {
    const filename = `QRCode-${IDService.createId()}`;
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${url}`;  //API call
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic" },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    }

    try {
      const response = await UrlFetchApp.fetch(loc, params);
      const responseCode = response.getResponseCode();
      if(![200, 201].includes(responseCode)) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      const content = await response.getContent();

      const blob = Utilities.newBlob(content).setName(filename);
      let qrCode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(blob);
      console.info(`QR CODE ---> ${qrCode.getUrl()} for ${url}`);
      return qrCode.getUrl();
    } catch(err) {
      console.error(`Failed to generate QRCode ---> ${err}`);
      return 1;
    }
  }
  
}
