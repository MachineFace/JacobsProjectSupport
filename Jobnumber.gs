/**
 * ----------------------------------------------------------------------------------------------------------------
 * Generate new Job number from a date
 * @param {time} date
 * @return {number} job number
 */
class CreateJobnumber
{
  constructor({
    date : date,
  }){
    this.date = date instanceof Date ? date : new Date(date);
  }

  get Jobnumber() {
    let jobnumber;
    try {
      if (!this._IsValidDate()) jobnumber = this._FormatDateAsJobnumber(new Date());
      else if (!this.date || !this._IsValidDate()) {
        jobnumber = this._FormatDateAsJobnumber(new Date());
        console.warn(`Set Jobnumber to a new time because timestamp was missing.`);
        return jobnumber;
      } else {
        jobnumber = this._FormatDateAsJobnumber(this.date);
        console.info(`Input time: ${this.date}, Set Jobnumber: ${jobnumber}`);
        return jobnumber;
      }
    } catch (err) {
      console.error(`${err} : Couldn't fix jobnumber.`);
    }
    console.info(`Returned Job Number : ${jobnumber}`);
    return jobnumber.toString();
  };

  _FormatDate() {
    return new Date(this.date.getYear(), this.date.getMonth(), this.date.getDate() -1);
  }

  _FormatDateAsJobnumber (date) {
    return +Utilities.formatDate(date, `PST`, `yyyyMMddHHmmss`)
  }

  _IsValidDate() {
    if (Object.prototype.toString.call(this.date) !== "[object Date]") return false;
    else return !isNaN(this.date.getTime());
  };
}

const _testJobNumberGen = () => {
  const jobnumbertypes = {
    GoodDate : new Date(2015, 10, 3),
    BadDate : `20220505`,
    AnotherBad : `5/3/2022 8:29:08`,
    AnotherBadString : `Thu, 27 Jan 2022 18:34:48 GMT`,
  }
  for(const [type, date] of Object.entries(jobnumbertypes)) {
    console.warn(`Testing : ${type}`);
    const num = new CreateJobnumber({ date : date }).Jobnumber;
    console.info(`${type} : ${num}`);
  }
}