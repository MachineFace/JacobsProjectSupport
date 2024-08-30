/**
 * QR Code Generator
 * @required {string} url
 */
class QRCodeGenerator {
  constructor({ url : url, }) {
    this.url = url ? url : `jps.jacobshall.org/`;
    /** @private */
    this.filename = `QRCode-${new IDService().id}`;
    this.GenerateQRCode();
  }

  /**
   * Generate QR Code
   */
  async GenerateQRCode(){
    const loc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${this.url}`;  //API call
    const params = {
      method : "GET",
      headers : { "Authorization" : "Basic" },
      contentType : "application/json",
      followRedirects : true,
      muteHttpExceptions : true,
    };

    try {
      const response = await UrlFetchApp.fetch(loc, params);
      const responseCode = response.getResponseCode();
      if(responseCode != 200 && responseCode != 201) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      
      const blob = await Utilities.newBlob(response.getContent()).setName(this.filename);
      let qrCode = await DriveApp.getFolderById(DRIVEFOLDERS.tickets).createFile(blob);
      console.info(`QR CODE ---> ${qrCode.getUrl()} for ${this.url}`);
      return qrCode.getUrl();
    } catch(err) {
      console.error(`Failed to generate QRCode ---> ${err}`);
      return 1;
    }
  }
  
}
