/**
 * ----------------------------------------------------------------------------------------------------------------
 * Code Enumerations
 */
const RESPONSECODES = {
	200 : `OK`,
	201 : `Created`,
	202 : `Accepted`,
	203 : `Non-Authoritative Information`,
	204 : `No Content`,
	205 : `Reset Content`,
	206 : `Partial Content`,
	207 : `Multi-Status (WebDAV)`,
	208 : `Already Reported (WebDAV)`,
	226 : `IM Used`,
	300 : `Multiple Choices`,
	301 : `Moved Permanently`,
	302 : `Found`,
	303 : `See Other`,
	304 : `Not Modified`,
	305 : `Use Proxy`,
	306 : `(Unused)`,
	307 : `Temporary Redirect`,
	308 : `Permanent Redirect (experimental)`,
 	400 : `Bad Request`,
	401 : `Unauthorized`,
	402 : `Payment Required`,
	403 : `Forbidden`,
	404 : `Not Found`,
	405 : `Method Not Allowed`,
	406 : `Not Acceptable`,
	407 : `Proxy Authentication Required`,
	408 : `Request Timeout`,
	409 : `Conflict`,
	410 : `Gone`,
	411 : `Length Required`,
	412 : `Precondition Failed`,
	413 : `Request Entity Too Large`,
	414 : `Request-URI Too Long`,
	415 : `Unsupported Media Type`,
	416 : `Requested Range Not Satisfiable`,
	417 : `Expectation Failed`,
	418 : `I'm a teapot (RFC 2324)`,
	420 : `Enhance Your Calm (Twitter)`,
	422 : `Unprocessable Entity (WebDAV)`,
	423 : `Locked (WebDAV)`,
	424 : `Failed Dependency (WebDAV)`,
	425 : `Reserved for WebDAV`,
	426 : `Upgrade Required`,
	428 : `Precondition Required`,
	429 : `Too Many Requests`,
	431 : `Request Header Fields Too Large`,
	444 : `No Response (Nginx)`,
	449 : `Retry With (Microsoft)`,
	450 : `Blocked by Windows Parental Controls (Microsoft)`,
	451 : `Unavailable For Legal Reasons`,
	499 : `Client Closed Request (Nginx)`,
	500 : `Internal Server Error`,
	501 : `Not Implemented`,
	502 : `Bad Gateway`,
	503 : `Service Unavailable`,
	504 : `Gateway Timeout`,
	505 : `HTTP Version Not Supported`,
	506 : `Variant Also Negotiates (Experimental)`,
	507 : `Insufficient Storage (WebDAV)`,
	508 : `Loop Detected (WebDAV)`,
	509 : `Bandwidth Limit Exceeded (Apache)`,
	510 : `Not Extended`,
	511 : `Network Authentication Required`,
	598 : `Network read timeout error`,
	599 : `Network connect timeout error`,
}

const STATUS = {
  received : "Received",
  pendingApproval : "Pending Approval",
  inProgress : "In-Progress",
  completed : "Completed",
  pickedUp : "Picked Up",
  shipped : "Shipped",
  failed : "FAILED",
  rejectedByStudent : "Rejected by Student",
  rejectedByStaff : "Rejected by Staff",
  billed : "Billed",
  waitlist : "Waitlist",
  cancelled : "Cancelled",
  missingAccess : "Missing Access",
  closed : "CLOSED",
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Sheets : Dictionary of key / value pair.
 * Example: Calling 'SHEETS.laser' returns value sheet.
 */
const SHEETS = {
  laser: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Laser Cutter"), //Laser Sheet
  ultimaker: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ultimaker"), //Ultimaker Sheet
  fablight: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fablight"), //Fablight Sheet
  waterjet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Waterjet"), //Waterjet Sheet
  advancedlab: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Advanced Lab"), //Advanced Lab Sheet
  shopbot: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shopbot"), //Shopbot Sheet
  haas: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Haas & Tormach"), //Haas Sheet
  vinyl: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vinyl Cutter"), //Vinyl Sheet
  othermill: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Othermill"), //Othermill Sheet
  creaform: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Creaform"), //Creaform Sheet
  othertools: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Other Tools"), //Other Sheet
  plotter: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Canon Plotter"), //Plotter Sheet
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Sheet : NOT TO BE ITERATED THROUGH
 */
const OTHERSHEETS = {
  summary: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary"),
  approved: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student List DONOTDELETE"),
  staff: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Staff List"),
  logger: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logger"),
  data: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Metrics"),
  backgrounddata: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Background Data Mgmt"),
  master : SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Intake Form Responses"),
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Sheet : NOT TO BE ITERATED THROUGH
 */
const STORESHEETS = {
  AdvLabStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AdvLabStoreItems'),
  UltimakerStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('UltimakerStoreItems'),
  FablightStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FablightStoreItems'),
  HaasTormachStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('HaasTormachStoreItems'),
  ShopbotStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ShopbotStoreItems'),
  WaterjetStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WaterjetStoreItems'),
  VinylCutterStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VinylCutterStoreItems'),
  LaserStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('LaserStoreItems'),
  OthermillStoreItems : SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OthermillStoreItems'),
};

const NONITERABLESHEETS = {...OTHERSHEETS, ...STORESHEETS};


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Forms : Dictionary of key / value pair.
 * Example: Calling 'formDict.laser' returns value string.
 */
const FORMS = {
    ultimaker: "1ASokut0lfjLidzpSmCCfD2mg-yVSa_HR0tTATVzFpI8",
    laser: "1xKiHg8_5U3iQH8EoD2-WbWXaRntP3QxzUNGU7QLfW0w",
    fablight: "1SAQRSMGKyFDrcVf8HGdpRoZ7DrWVVfl6cBAw0ZSyNHA",
    waterjet: "1dNLAlC8Wg0DLLkBboRMgztPqP-fMmUqyGt5xqtg8TKk",
    advancedlab: "1okWAdclqrleQ5ktyXbSIRoY6hrL_v2OYYAhaeb0f1jQ",
    shopbot: "1RFuhGCtQrcA9gbpEStaksK5eYeIAo0dzn5NIcxVngH4",
    haas: "1oS0UbirwjcRdTWzavZ11zO-xa7YiZNVfhMS2AxRwPEk",
    vinyl: "1WTh9nDQ4C_3HyQvCNMIxRFbJk1FH4dZeYeAkiXkItKw",
    othermill: "1YVmZ0H5Uy3AiBiDTUpKQONUyVRqAByju0zrm5s4vrwI",
    creaform: "1Ifg49JzunXI54NZxrfYcJg-p6-k2MkY5IqStISKMXqc",
    othertools: "1cVeRW9WtGa43xNmnwaegZcPK6-V01PIZFpvNcmrpM38",
    plotter: "1au_NsjuGNuucHeZIh-bgzEwkQN1w17igU9ha6i34Y34",
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Student Types
 */
const TYPES = [
  "Researcher",
  "DES INV Faculty",
  "Jacobs-affiliated Course Faculty",
  "MDES Student",
  "DES INV Student",
  "Jacobs Engineering Design Scholar",
  "Innovation Catalysts Grantee",
  "Jacobs Staff (Including Work-studies)",
  "Students in Jacobs-affiliated courses (NON-DES INV)",
  "Club and/or Team",
  "Other: Berkeley Faculty, Berkeley Staff, and Students",
];



const PAGESIZES = {
  /**
    * INPUTS
    * -argument-     :-inches-      :-mm-     :-points-
    * letter_size    :8.5"x11"      :216x279  :612.283x790.866
    * tabloid_size   :11"x17"       :279x432  :790.866x1224.57
    * legal_size     :8.5"x14"      :216x356  :612.283x1009.13
    * statement_size :5.5"x8.5"     :140x216  :396.85x612.283
    * executive_size :7.25"x10.5"   :184x267  :521.575x756.85
    * folio_size     :8.5"x13"      :216x330  :612.283x935.433
    * a3_size        :11.69"x16.54" :297x420  :841.89x1190.55
    * a4_size        :8.27"x11.69"  :210x297  :595.276x841.89
    * a5_size        :5.83"x8.27"   :148x210  :419.528x595.276
    * b4_size        :9.84"x13.9"   :250x353  :708.661x1000.63
    * b5_size        :6.93"x9.84"   :176x250  :498.898x708.661
  */
  letter: {width: 612.283, height: 790.866},
  tabloid: {width: 790.866,height: 1224.57},
  statement: {width: 396.85, height: 612.283},
  a3: {width: 841.89, height: 1190.55},
  a4: {width: 595.276, height: 841.89},
  a5: {width: 419.528, height: 595.276},
}




