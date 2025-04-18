/**
 * ----------------------------------------------------------------------------------------------------------------
 * Code Enumerations
 */

const SERVICE_EMAIL = `jacobs-project-support@berkeley.edu`;
const SERVICE_NAME = `Jacobs Project Support`;

/** @private */
const THIS_SPREADSHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty(`SPREADSHEET_ID`));

const DaysRetentionNumber = 15; //How many days to hold a file
const RETENTION_PERIOD = DaysRetentionNumber * 24 * 60 * 60 * 1000; //Number of milliseconds in the retention period.
const PICKUP_HOURS = `Monday - Friday: 11am - 1pm.`  //`Monday - Friday: 11am - 1pm & 4pm - 6pm.`

/**
 * Colors
 */
const COLORS = Object.freeze({
  green_light : `#d9ead3`,
  green : `74d975`, 
  green_dark : `#93c47d`, 
  green_dark_2 : `#38761d`,
  yellow_light : `#fff2cc`,
  yellow : `#f1c232`,
  yellow_dark : `#f1c232`,
  yellow_dark_2 : `#bf9000`,
  orange_light : `#fce5cd`,
  orange_bright : `#ff9900`,
  orange : `#f6b26b`,
  orange_dark : `#e69138`, 
  orange_dark_2 : `#b45f06`,
  red_light : `#f4cccc`, 
  red : `	#ff0000`,  
  red_dark : `#cc0000`,
  red_dark_2 : `#990000`,
  red_dark_berry_2 : `#85200c`,
  purle_light : `	#d9d2e9`,
  purple : `#b4a7d6`,
  purple_dark : `#20124d`,
  purple_dark_2 : `#351c75`,
  grey_light : `#efefef`,
  grey : `#cccccc`, 
  grey_dark : `#999999`,
  black : `#000000`,
});

/**
 * All Colors
 */
const ALLCOLORS = Object.freeze({
  black : `#000000`,
  dark_gray_4 : `#434343`,
  dark_gray_3 : `#666666`,
  dark_gray_2 : `#999999`,
  dark_gray_1 : `#b7b7b7`,
  gray : `#cccccc`,
  light_gray_1 : `#d9d9d9`,
  light_gray_2 : `#efefef`,
  light_gray_3 : `#f3f3f3`,
  white : `#ffffff`,
  red_berry : `#980000`,
  red : `#ff0000`,
  orange : `#ff9900`,
  yellow : `#ffff00`,
  green : `#00ff00`,
  cyan : `#00ffff`,
  cornflower_blue : `#4a86e8`,
  blue : `#0000ff`,
  purple : `#9900ff`,
  magenta : `#ff00ff`,
  light_red_berry_3 : `#e6b8af`,
  light_red_3 : `#f4cccc`,
  light_orange_3 : `#fce5cd`,
  light_yellow_3 : `#fff2cc`,
  light_green_3 : `#d9ead3`,
  light_cyan_3 : `#d0e0e3`,
  light_cornflower_blue_3 : `#c9daf8`,
  light_blue_3 : `#cfe2f3`,
  light_purple_3 : `#d9d2e9`,
  light_magenta_3 : `#ead1dc`,
  light_red_berry_2 : `#dd7e6b`,
  light_red_2 : `#ea9999`,
  light_orange_2 : `#f9cb9c`,
  light_yellow_2 : `#ffe599`,
  light_green_2 : `#b6d7a8`,
  light_cyan_2 : `#a2c4c9`,
  light_cornflower_blue_2 : `#a4c2f4`,
  light_blue_2 : `#9fc5e8`,
  light_purple_2 : `#b4a7d6`,
  light_magenta_2 : `#d5a6bd`,
  light_red_berry_1 : `#cc4125`,
  light_red_1 : `#e06666`,
  light_orange_1 : `#f6b26b`,
  light_yellow_1 : `#ffd966`,
  light_green_1 : `#93c47d`,
  light_cyan_1 : `#76a5af`,
  light_cornflower_blue_1 : `#6d9eeb`,
  light_blue_1 : `#6fa8dc`,
  light_purple_1 : `#8e7cc3`,
  light_magenta_1 : `#c27ba0`,
  dark_red_berry_1 : `#a61c00`,
  dark_red_1 : `#cc0000`,
  dark_orange_1 : `#e69138`,
  dark_yellow_1 : `#f1c232`,
  dark_green_1 : `#6aa84f`,
  dark_cyan_1 : `#45818e`,
  dark_cornflower_blue_1 : `#3c78d8`,
  dark_blue_1 : `#3d85c6`,
  dark_purple_1 : `#674ea7`,
  dark_magenta_1 : `#a64d79`,
  dark_red_berry_2 : `#85200c`,
  dark_red_2 : `#990000`,
  dark_orange_2 : `#b45f06`,
  dark_yellow_2 : `#bf9000`,
  dark_green_2 : `#38761d`,
  dark_cyan_2 : `#134f5c`,
  dark_cornflower_blue_2 : `#1155cc`,
  dark_blue_2 : `#0b5394`,
  dark_purple_2 : `#351c75`,
  dark_magenta_2 : `#741b47`,
  dark_red_berry_3 : `#5b0f00`,
  dark_red_3 : `#660000`,
  dark_orange_3 : `#783f04`,
  dark_yellow_3 : `#7f6000`,
  dark_green_3 : `#274e13`,
  dark_cyan_3 : `#0c343d`,
  dark_cornflower_blue_3 : `#1c4587`,
  dark_blue_3 : `#073763`,
  dark_purple_3 : `#20124d`,
  dark_magenta_3 : `#4c1130`,
});

/**
 * Response Codes
 */
const RESPONSECODES = Object.freeze({
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
});

/**
 * Status
 */
const STATUS = Object.freeze({
  received : `Received`,
  inProgress : `In-Progress`,
  completed : `Completed`,
  pickedUp : `Picked Up`,
  failed : `FAILED`,
  billed : `Billed`,
  waitlist : `Waitlist`,
  cancelled : `Cancelled`,
  missingAccess : `Missing Access`,
  closed : `CLOSED`,
  abandoned : `Abandoned`,
});

/**
 * Priority
 */
const PRIORITY = Object.freeze({
  None : `STUDENT NOT FOUND!`,
  Tier1 : 1,
  Tier2 : 2,
  Tier3 : 3,
  Tier4 : 4,
});

/**
 * Collection of Sheets : Dictionary of key / value pair.
 * Example: Calling 'SHEETS.laser' returns value sheet.
 */
const SHEETS = Object.freeze({
  Laser :       THIS_SPREADSHEET.getSheetByName(`Laser Cutter`), // Laser Sheet
  Fablight :    THIS_SPREADSHEET.getSheetByName(`Fablight`), // Fablight Sheet
  Waterjet :    THIS_SPREADSHEET.getSheetByName(`Waterjet`), // Waterjet Sheet
  Advancedlab : THIS_SPREADSHEET.getSheetByName(`Advanced Lab`), // Advanced Lab Sheet
  Shopbot :     THIS_SPREADSHEET.getSheetByName(`Shopbot`), // Shopbot Sheet
  Vinyl :       THIS_SPREADSHEET.getSheetByName(`Vinyl Cutter`), // Vinyl Sheet
  Othertools :  THIS_SPREADSHEET.getSheetByName(`Other Tools`), // Other Sheet
  Plotter :     THIS_SPREADSHEET.getSheetByName(`Canon Plotter`), // Plotter Sheet
  GSI_Plotter : THIS_SPREADSHEET.getSheetByName(`GSI - Canon Plotter`), // GSI Submission Form
});

/**
 * Collection of Sheet : NOT TO BE ITERATED THROUGH
 */
const OTHERSHEETS = Object.freeze({
  Summary :   THIS_SPREADSHEET.getSheetByName(`Summary`),
  Staff :     THIS_SPREADSHEET.getSheetByName(`Staff List`),
  Logger :    THIS_SPREADSHEET.getSheetByName(`Logger`),
  Approved :  THIS_SPREADSHEET.getSheetByName(`Student List DONOTDELETE`),
  Data :      THIS_SPREADSHEET.getSheetByName(`Data Metrics`),
});


/**
 * Collection of Sheet : NOT TO BE ITERATED THROUGH
 */
const STORESHEETS = Object.freeze({
  AdvLabStoreItems :      THIS_SPREADSHEET.getSheetByName('AdvLabStoreItems'),
  UltimakerStoreItems :   THIS_SPREADSHEET.getSheetByName('UltimakerStoreItems'),
  FablightStoreItems :    THIS_SPREADSHEET.getSheetByName('FablightStoreItems'),
  ShopbotStoreItems :     THIS_SPREADSHEET.getSheetByName('ShopbotStoreItems'),
  WaterjetStoreItems :    THIS_SPREADSHEET.getSheetByName('WaterjetStoreItems'),
  VinylCutterStoreItems : THIS_SPREADSHEET.getSheetByName('VinylCutterStoreItems'),
  LaserStoreItems :       THIS_SPREADSHEET.getSheetByName('LaserStoreItems'),
  OthermillStoreItems :   THIS_SPREADSHEET.getSheetByName('OthermillStoreItems'),
});

/**
 * DEFUNCT SHEETS
 */
const DEFUNCT = Object.freeze({
  Ultimaker : `1ASokut0lfjLidzpSmCCfD2mg-yVSa_HR0tTATVzFpI8`, // Ultimaker Form
  Haas : `1oS0UbirwjcRdTWzavZ11zO-xa7YiZNVfhMS2AxRwPEk`,  // Haas Form
  Othermill : `1YVmZ0H5Uy3AiBiDTUpKQONUyVRqAByju0zrm5s4vrwI`, // Othermill Form
  Creaform : `1Ifg49JzunXI54NZxrfYcJg-p6-k2MkY5IqStISKMXqc`,  // Creaform Form
  Haas : THIS_SPREADSHEET.getSheetByName(`Haas & Tormach`), // Haas Sheet
  Othermill : THIS_SPREADSHEET.getSheetByName(`Othermill`), // Othermill Sheet
  Creaform : THIS_SPREADSHEET.getSheetByName(`Creaform`), // Creaform Sheet
  HaasTormachStoreItems : THIS_SPREADSHEET.getSheetByName('HaasTormachStoreItems'),
});

const NONITERABLESHEETS = Object.freeze({ ...OTHERSHEETS, ...STORESHEETS, });

/**
 * Collection of Forms : Dictionary of key / value pair.
 * Example: Calling 'formDict.laser' returns value string.
 */
const FORMS = Object.freeze({
  laser: `1xKiHg8_5U3iQH8EoD2-WbWXaRntP3QxzUNGU7QLfW0w`,
  fablight: `1SAQRSMGKyFDrcVf8HGdpRoZ7DrWVVfl6cBAw0ZSyNHA`,
  waterjet: `1dNLAlC8Wg0DLLkBboRMgztPqP-fMmUqyGt5xqtg8TKk`,
  advancedlab: `1okWAdclqrleQ5ktyXbSIRoY6hrL_v2OYYAhaeb0f1jQ`,
  shopbot: `1RFuhGCtQrcA9gbpEStaksK5eYeIAo0dzn5NIcxVngH4`,
  vinyl: `1WTh9nDQ4C_3HyQvCNMIxRFbJk1FH4dZeYeAkiXkItKw`,
  othertools: `1cVeRW9WtGa43xNmnwaegZcPK6-V01PIZFpvNcmrpM38`,
  plotter: `1au_NsjuGNuucHeZIh-bgzEwkQN1w17igU9ha6i34Y34`,
  gsi_plotter: `1F_lEMi0HoV6Ej4RPxn8FuWqsPWJdfjmwyJs7v2SkoCg`,
});

/**
 * Drive Folder Locations
 */
const DRIVEFOLDERS = Object.freeze({
  tickets : `1xpjeqTju9ELRrQJ3GzFdv-nHYjoCfUjl`,
  jobforms : `1G31sd5TZiAWCus4Gi_JSpFTSY1xVOV2o`,
});

/**
 * Student Types
 */
const TYPES = Object.freeze({
  researcher : `Researcher`,
  des_inv_faculty : `DES INV Faculty`,
  jacobs_faculty : `Jacobs-affiliated Course Faculty`,
  mdes: `MDES Student`,
  des_inv_student : `DES INV Student`,
  design_scholar : `Jacobs Engineering Design Scholar`,
  innovation_catalyst : `Innovation Catalysts Grantee`,
  staff : `Jacobs Staff (Including Work-studies)`,
  jacobs_student : `Students in Jacobs-affiliated courses (NON-DES INV)`,
  club_team : `Club and/or Team`,
  other : `Other: Berkeley Faculty, Berkeley Staff`,
  student : `General Students`,
});

/**
 * Headernames
 */
const HEADERNAMES = Object.freeze({
  status : `(INTERNAL) Status`,	
  ds : `(INTERNAL): DS Assigned`,	
  staffNotes : `(INTERNAL) Staff Notes`,
  priority : `(INTERNAL): Priority`,	
  whichPrinter: `Which printer?`,	
  files : `Files for fabrication` || `Files for fabrication `,
  ticket : `Printable Ticket`,	
  numberOfParts : `Total number of parts needed`,	
  name : `What is your name?`,	
  projectName : `Project Name`,	
  email : `Email Address`,	
  material : `Material`,	
  materials : `Materials`,
  fablightMaterial : `Material?`,
  fiberReinforcement : `Continuous Fiber Reinforcement?`,	
  fiberPattern : `Continuous fiber pattern (if applicable)`,	
  id : `(INTERNAL AUTO) Job Number`,	
  studentApproved : `Student Has Approved Job`,	
  timestamp : `Timestamp`,	
  sid : `Your Student ID Number?`,	
  mat1quantity : `(INTERNAL) Material 1 Quantity`,	
  mat1 : `(INTERNAL) Item 1`,	
  mat2quantity : `(INTERNAL) Material 2 Quantity`,	
  mat2 : `(INTERNAL) Item 2`,	
  mat3quantity : `(INTERNAL) Material 3 Quantity`,	
  mat3 : `(INTERNAL) Item 3`,	
  mat4quantity : `(INTERNAL) Material 4 Quantity`,	
  mat4 : `(INTERNAL) Item 4`,	
  mat5quantity : `(INTERNAL) Material 5 Quantity`,	
  mat5 : `(INTERNAL) Item 5`,
  thickness : `How thick is the material you\'re cutting? (mm / in)` || `Thickness of the material?`,	
  otherNotes : `Other Notes About This Job`,	
  affiliation : `What is your affiliation to the Jacobs Institute?`,
  printColor : `Color or Black & White?`,	
  printSize : `Size of your print`,	
  printCount : `Total number of prints needed`,
  layerThickness : `Layer Thickness`,	
  density : `Density`,	
  fortusLayerThickness : `Fortus Layer Thickness`, 	
  densityInfill : `Density of Infill`,	
  finish : `Finish`,
  roughDimensions : 'Rough dimensions of your part' || `Rough dimensions of your part?`,
  partCountFablight : `How many parts do you need?`,
  markforgedDensity : `Markforged part Density`,	
  buildParameters : `Build Parameters [Row 1]`,
  notes: `Notes`,	
  otherJobNotes : `Other Notes About This Job`,
  dateCompleted : `Date Completed`,	
  elapsedTime : `Elapsed Time`,	
  estimate : `Estimate`,	
  unit_cost1 : `Unit Cost 1`,	
  unit_cost2 : `Unit Cost 2`,	
  unit_cost3 : `Unit Cost 3`,	
  unit_cost4 : `Unit Cost 4`,
  unit_cost5 : `Unit Cost 5`,
});

/**
 * Page Sizes
 */
const PAGESIZES = Object.freeze({
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
});





