/**
 * Class for dealing with time
 */
class TimeService {
  constructor() {

  }

  /**
   * Format Timer to String
   * @param {number} days
   * @param {number} hrs
   * @param {number} mins
   * @param {number} secs
   * @returns {string} formattedString
   */
  static FormatTimerToString(days = 0.0, hrs = 0.0, mins = 0.0, secs = 0.0) {
    try {
      hrs = hrs < 10 ? `0${hrs}` : hrs;
      mins = mins < 10 ? `0${mins}` : mins;
      secs = secs < 10 ? `0${secs}` : secs;
      const s = `${days} days, ${hrs}:${mins}:${secs}`;
      // console.info(`Date to String ---> ${s}`)
      return s;
    } catch(err) {
      console.error(`"FormatTimerToString()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Timer String to Milliseconds
   * @param {string} timerString Format = `0 days, 0:34:18`
   * @returns {number} millis
   */
  static TimerStringToMilliseconds(timerString = `0 days, 0:34:18`) {
    try {
      // timerString = GetByHeader(SHEETS.Main, HEADERNAMES.daysCheckedOut, 3);
      let m = timerString.split(`days`);
      let n = m[1].split(`,`);
      let q = n[1].split(`:`);
      q.unshift(m[0]);
      const vals = [];
      q.forEach(val => vals.push(parseInt(val)));
      let value = (vals[0] * 8.64e+7) + (vals[1] * 3.6e+6) + (vals[2] * 60000) + (vals[3] * 1000);
      // console.warn(`Timer String to Milliseconds ---> ${value}`);
      return value;
    } catch(err) {
      console.error(`"TimerStringToMilliseconds()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Time String to Millis
   * @param {string} time string without word "day", Format = `17 20:57:45`
   * @returns {number} millis
   */
  static TimeToMillis(time = ``) {
    let t = [];
    let x = time.split(` `);
    t.push(x[0]);
    t.push(...x[1].split(`:`));
    let total = 0;
    try {
      let days = Number(t[0]) * 24 * 60 * 60 * 1000; // days to millis
      let hours = Number(t[1]) * 60 * 60 * 1000; // hours to millis
      let minutes = Number(t[2]) * 60 * 1000; // minutes to millis     
      let seconds = Number(t[3]) * 1000; // seconds to millis
      total = days + hours + minutes + seconds;
      // console.info(`TOTAL: ${total}`);
      return total;
    } catch(err) {
      console.error(`"TimerStringToMilliseconds()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Date to Milliseconds
   * @param {date} date
   * @retruns {number} millis
   */
  static DateToMilliseconds(date = new Date()) {
    date = date instanceof Date ? date : new Date();
    try {
      const millis = date.getTime();
      // console.warn(`Date to Milliseconds ---> ${millis}`);
      return millis;
    } catch(err) {
      console.error(`"DateToMilliseconds()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Milliseconds to Timer String
   * @param {number} millis
   * @returns {string} timerString
   */
  static MillisecondsToTimerString(millis = 1000) {
    try {
      let timeDiff = Math.abs(millis / 1000); // Milliseconds to sec

      let secs = Math.floor(timeDiff % 60); // Calc seconds
      timeDiff = Math.floor(timeDiff / 60); // Difference seconds to minutes
      let secondsAsString = secs < 10 ? `0${secs}` : `${secs}`; // Pad with a zero

      let mins = timeDiff % 60; //Calc mins
      timeDiff = Math.floor(timeDiff / 60); // Difference mins to hrs
      let minutesAsString = mins < 10 ? `0${mins}` : mins; // Pad with a zero

      let hrs = timeDiff % 24; // Calc hrs
      timeDiff = Math.floor(timeDiff / 24); // Difference hrs to days
      let days = timeDiff;

      let formatted = TimeService.FormatTimerToString(days, hrs, minutesAsString, secondsAsString);
      // console.info(`Millis to Timer String ---> ${formatted}`);
      return formatted;
    } catch(err) {
      console.error(`"MillisecondsToTimerString()" failed : ${err}`);
      return 1;
    }
    
  }

  

  /**
   * Duration
   * @param {date} start
   * @param {date} end
   * @return {string} duration
   */
  static Duration(start = new Date(1986, 1, 2, 10, 34, 33), end = new Date()) {
    try {
      let timeDiff = Math.abs((end - start) / 1000); // Milliseconds to sec

      let secs = Math.floor(timeDiff % 60); // Calc seconds
      timeDiff = Math.floor(timeDiff / 60); // Difference seconds to minutes
      let secondsAsString = secs < 10 ? `0${secs}` : secs; // Pad with a zero

      let mins = timeDiff % 60; //Calc mins
      timeDiff = Math.floor(timeDiff / 60); // Difference mins to hrs
      let minutesAsString = mins < 10 ? `0${mins}` : mins; // Pad with a zero

      let hrs = timeDiff % 24; // Calc hrs
      timeDiff = Math.floor(timeDiff / 24); // Difference hrs to days
      let days = timeDiff;

      let formatted = TimeService.FormatTimerToString(days, hrs, minutesAsString, secondsAsString);
      // console.info(`Duration ---> ${formatted}`);
      return formatted;
    } catch (err) {
      console.error(`"Duration()" failed : ${err}`);
      return 1;
    }
  };

  /**
   * Calculate the Return Date
   * @param {date} date
   * @return {date} returndate
   */
  static ReturnDate(date = new Date()) {
    date = date instanceof Date ? date : new Date();
    const returndate = new Date(TimeService.DateToMilliseconds(date) + 1.21e+9);
    console.info(`Return Date ---> ${returndate}`);
    return returndate;
  }

  /**
   * Calculate the remaining time left before overdue
   * @param {date} checkedOutDate
   * @param {date} dueDate
   * @return {string} FormatTimerToString(days, hrs, minutesAsString, secondsAsString)
   */
  static RemainingTime(dueDate = new Date()) {
    try {
      dueDate = dueDate instanceof Date ? dueDate : new Date();
      let remaining = TimeService.Duration(new Date(), dueDate);
      console.info(`Remaining ---> ${remaining}`);
      return remaining;
    } catch(err) {
      console.error(`"RemainingTime()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Days to Milliseconds
   * @param {number} days (integer)
   * @returns {number} milliseconds
   */
  static DaysToMillis(days = 1) {
    return days * 24 * 60 * 60 * 1000;
  }

  /**
   * Parse a string to date
   * @param {string} date string
   * @returns {Date} actual date
   * DEFUNCT
   */
  ParseStringToDate(dateString) {
    let array = dateString.toString().split(" ");
    let months = [
      `Jan.`, `Jan`, `January`, `1`, 
      `Feb.`, `Feb`, `February`, `2`,
      `Mar.`, `Mar`, `March`, `3`,
      `Apr.`, `Apr`, `April`, `4`,
      `May`, `5`,	`June`, `6`, `July`, `7`,	
      `Aug.`, `Aug`, `August`, `8`,
      `Sept.`, `Sept`, `September`, `9`,
      `Oct.`, `Oct`, `October`, `10`,
      `Nov.`, `Nov`, `November`, `11`,
      `Dec.`, `Dec`, `December`, `12`,
    ];
    let month = array[4].toLowerCase();
    months.find(m => {
      if(m.toLowerCase() == month) {
        month = new Date(Date.parse(`${array[4]} 1, ${new Date().getFullYear()}`)).getMonth();
      }
    });
    let day =  !isNaN(Number(array[5])) ? Number(array[5]) : 1;
    let year = !isNaN(Number(array[6])) ? Number(array[6]) : new Date().getFullYear();
    console.info(`${new Date(year, month, day)}`);
    return new Date(year, month, day);
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Test if value is a date and return true or false
 * @param {date} d
 * @returns {boolean} b
 */
const isValidDate = (d) => {
  if (Object.prototype.toString.call(d) !== "[object Date]") return false;
  return !isNaN(d.getTime());
};

/**
 * Convert Datetime to Date
 * @param {date} d
 * @return {date} date
 */
const datetimeToDate = (d) => new Date(d.getYear(), d.getMonth(), d.getDate());





const _testT = () => {
  const s = TimeService.TimeToMillis(`17 20:57:45`);
  console.info(s);
}


