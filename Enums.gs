/**
 * ----------------------------------------------------------------------------------------------------------------
 * Code Enumerations
 */

const DaysRetentionNumber = 15; //How many days to hold a file
const RetentionPeriod = DaysRetentionNumber * 24 * 60 * 60 * 1000; //Number of milliseconds in the retention period.
const PickupHours = `Monday - Friday: 11am - 1pm & 4pm - 6pm.`

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
  Laser: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Laser Cutter"), // Laser Sheet
  Ultimaker: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ultimaker"), // Ultimaker Sheet
  Fablight: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fablight"), // Fablight Sheet
  Waterjet: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Waterjet"), // Waterjet Sheet
  Advancedlab: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Advanced Lab"), // Advanced Lab Sheet
  Shopbot: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shopbot"), // Shopbot Sheet
  Haas: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Haas & Tormach"), // Haas Sheet
  Vinyl: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vinyl Cutter"), // Vinyl Sheet
  Othermill: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Othermill"), // Othermill Sheet
  Creaform: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Creaform"), // Creaform Sheet
  Othertools: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Other Tools"), // Other Sheet
  Plotter: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Canon Plotter"), // Plotter Sheet
};

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Collection of Sheet : NOT TO BE ITERATED THROUGH
 */
const OTHERSHEETS = {
  Summary: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Summary`),
  Pickup : SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Pickup`),
  Approved: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Student List DONOTDELETE`),
  Staff: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Staff List`),
  Logger: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Logger`),
  Data: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Data Metrics`),
  Backgrounddata: SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Background Data Mgmt`),
  Master : SpreadsheetApp.getActiveSpreadsheet().getSheetByName(`Master Intake Form Responses`),
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
 * Drive Folder Locations
 */
const DRIVEFOLDERS = {
  tickets : `1OJj0dxsa2Sf_tIBUnKm_BDmY7vFNMXYC`,
  jobforms : `1G31sd5TZiAWCus4Gi_JSpFTSY1xVOV2o`,
}


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

const HEADERNAMES = {
  status : "(INTERNAL) Status",	
  ds : "(INTERNAL): DS Assigned",	
  staffNotes : "(INTERNAL) Staff Notes",
  priority : "(INTERNAL): Priority",	
  whichPrinter: "Which printer?",	
  files : "Files for fabrication", 	
  ticket : "Printable Ticket",	
  numberOfParts : "Total number of parts needed",	
  name : "What is your name?",	
  projectName : "Project Name",	
  email : "Email Address",	
  material : "Material",	
  materials : "Materials",
  fiberReinforcement : "Continuous Fiber Reinforcement?",	
  fiberPattern : "Continuous fiber pattern (if applicable)",	
  jobNumber : "(INTERNAL AUTO) Job Number",	
  studentApproved : "Student Has Approved Job",	
  timestamp : "Timestamp",	
  sid : "Your Student ID Number?",	
  mat1quantity : "(INTERNAL) Material 1 Quantity",	
  mat1 : "(INTERNAL) Item 1",	
  mat2quantity : "(INTERNAL) Material 2 Quantity",	
  mat2 : "(INTERNAL) Item 2",	
  mat3quantity : "(INTERNAL) Material 3 Quantity",	
  mat3 : "(INTERNAL) Item 3",	
  mat4quantity : "(INTERNAL) Material 4 Quantity",	
  mat4 : "(INTERNAL) Item 4",	
  mat5quantity : "(INTERNAL) Material 5 Quantity",	
  mat5 : "(INTERNAL) Item 5",	
  otherNotes : "Other Notes About This Job",	
  shipping : "Do you need your parts shipped to you?",	
  afiliation : "What is your affiliation to the Jacobs Institute?",	
  layerThickness : "Layer Thickness",	
  density : "Density",	
  fortusLayerThickness : "Fortus Layer Thickness", 	
  densityInfill : "Density of Infill",	
  finish : "Finish",
  roughDimensions : 'Rough dimensions of your part',	
  markforgedDensity : "Markforged part Density",	
  buildParameters : "Build Parameters [Row 1]",	
  otherJobNotes : "Other Notes About This Job",
  dateCompleted : "Date Completed",	
  elapsedTime : "Elapsed Time",	
  estimate : "Estimate",	
  price1 : "Price 1",	
  price2 : "Price 2",	
  price3 : "Price 3",	
  price4 : "Price 4",
};



const PAGESIZES = {
  letter: { width: 612.283, height: 790.866 },
  tabloid: { width: 790.866, height: 1224.57 },
  legal: { width: 612.283, height: 1009.13 },
  statement: { width: 396.85, height: 612.283 },
  executive: { width: 521.575, height: 756.85 },
  folio: { width: 612.283, height: 935.433 },
  a3: { width: 841.89, height: 1190.55 },
  a4: { width: 595.276, height: 841.89 },
  a5: { width: 419.528, height: 595.276 },
  b4: { width: 708.661, height: 1000.63 },
  b5: { width: 498.898, height: 708.661 },
  custom: { width: 204.000, height: 566.000 }
}




