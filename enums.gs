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
 * Example: Calling 'sheetDict.laser' returns value sheet.
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

const OTHERSHEETS = {
  summary: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary"),
  approved: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student List DONOTDELETE"),
  staff: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Staff List"),
  logger: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logger"),
  data: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Metrics"),
  backgrounddata: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Background Data Mgmt"),
  billing: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Billing"),
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of INTERNAL Sheets : Dictionary of key / value pair.
 * Example: Calling 'materialDict.laser' returns value materialSheet.
 */
const materialDict = {
    advlab:     SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AdvLabStoreItems"),
    ultimaker:  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("UltimakerStoreItems"),
    fablight:   SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FablightStoreItems"),
    haas:       SpreadsheetApp.getActiveSpreadsheet().getSheetByName("HaasTormachStoreItems"),
    shopbot:    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ShopbotStoreItems"),
    waterjet:   SpreadsheetApp.getActiveSpreadsheet().getSheetByName("WaterjetStoreItems"),
    vinyl:      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VinylCutterStoreItems"),
    laser:      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LaserStoreItems"),
    othermill:  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OthermillStoreItems"),
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Forms : Dictionary of key / value pair.
 * Example: Calling 'formDict.laser' returns value string.
 */
const formDict = {
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

