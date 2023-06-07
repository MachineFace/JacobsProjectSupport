/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Calculating Metrics
 */
class Calculate {
  constructor() {
  }

  /**
   * Calculate Average Turnaround Time
   * Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format.
   * @param {sheet} sheet
   * @returns {string} formatted average time
   */
  static CalculateAverageTurnaround(sheet) {
    try {
      if(typeof(sheet) != typeof(SHEETS.Advancedlab)) throw new Error(`Bad sheet supplied...`)
      let totals = [];
      GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime)
        .filter(Boolean)
        .forEach(time => {
          if(time === typeof(String)) console.error(`Not a number: ${time}`) 
          else {
            let days = +Number(time[0]) * 24 * 60; // days to hours to minutes
            let hours = +Number(time[1]) * 60; // hours to minutes
            let minutes = +Number(time[2]); // minutes     
            let seconds = +Number(time[3]); // seconds, forget about seconds
            let total = days + hours + minutes;
            totals.push(total);
          }
        });

      // Sum all the totals
      let sum = 0;
      totals.forEach( (item, index) => sum += item);

      // Average the totals (a list of times in minutes)
      let average = sum / totals.length;

      let mins = parseInt((average % 60), 10); // Calc mins
      average = Math.floor(average / 60); // Difference mins to hrs
      let minutesAsString = mins < 10 ? `0${mins}` : mins + ""; // Pad with a zero

      let hrs = average % 24; // Calc hrs
      average = Math.floor(average / 24); // Difference hrs to days
      let dys = average;

      //Format into readable time and return (if data is still missing, set it to zero)
      if (isNaN(dys)) dys = 0;
      if (isNaN(hrs)) hrs = 0;
      if (isNaN(minutesAsString)) minutesAsString = 0;

      let formatted = `${dys}d ${hrs}h ${minutesAsString}m`;
      console.info(formatted);
      return formatted;
    }
    catch (err) {
      console.error(`"CalculateAverageTurnaround()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Turnaround Times
   */
  static PrintTurnaroundTimes() {
    try {
      let data = [];
      Object.values(SHEETS).forEach(sheet => {
        data.push([`${sheet.getName()} Turnaround`, this.CalculateAverageTurnaround(sheet)]);
      })
      data.forEach( (entry, index) => {
        OTHERSHEETS.Data.getRange(26 + index, 2, 1, 1 ).setValue(entry[0]);
        OTHERSHEETS.Data.getRange(26 + index, 4, 1, 1 ).setValue(entry[1]);
      });
      return 0;
    } catch (err) {
      console.error(`"PrintTurnaroundTimes()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Duration from start to finish
   * @param {Date} start
   * @param {Date} end
   * @returns {string} formatted duration
   */ 
  static CalculateDuration(start, end) {
    try {
      end = end instanceof Date ? new Date(end) : new Date();  // if supplied with nothing, set end time to now
      start = start instanceof Date ? new Date(start) : new Date(end - 87000000);  // if supplied with nothing, set start time to now minus 24 hours.

      let timeDiff = +Number(Math.abs((end - start) / 1000)); // Abs Value Milliseconds to sec
      let secs = Math.floor(timeDiff % 60); // Calc seconds
      timeDiff = Math.floor(timeDiff / 60); // Difference seconds to minutes
      let secondsAsString = secs < 10 ? `0${secs}` : secs + ""; // Pad with a zero

      let mins = timeDiff % 60; //Calc mins 
      timeDiff = Math.floor(timeDiff / 60); //Difference mins to hrs
      let minutesAsString = mins < 10 ? `0${mins}` : mins + ""; //Pad with a zero

      let hrs = timeDiff % 24; //Calc hrs
      timeDiff = Math.floor(timeDiff / 24); //Difference hrs to days
      let days = timeDiff.toString();

      let formatted = `days : ${days.toString()}, hrs : ${hrs.toString()}, mins : ${minutesAsString}, secs : ${secondsAsString}`;
      let out = `${days} ${hrs}:${minutesAsString}:${secondsAsString}`;
      console.info(`Duration = ${out}`);
      return out;  // Return Completed time
    }
    catch (err) {
      console.error(`"CalculateDuration()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count Active Users
   * @returns {number} unique users
   */
  static CountActiveUsers() {
    let persons = [];
    try {
      Object.values(SHEETS).forEach(sheet => {
        let staff = GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
        GetColumnDataByHeader(sheet, HEADERNAMES.name)
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .filter(x => x != `Test`)
          .filter(x => !staff.includes(x))
          .forEach(x => persons.push(x));
      });
      // console.info(persons)
      let unique = new Set(persons);
      let count = unique.size;
      console.info(`Active JPS Users : ${count}`);
      return count;
    } catch(err) {
      console.error(`"CountActiveUsers()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Active Users
   */
  static PrintActiveUsers() {
    const count = this.CountActiveUsers();
    OTHERSHEETS.Data.getRange(`B4`).setValue(`TOTAL STUDENTS CURRENTLY USING JPS`);
    OTHERSHEETS.Data.getRange(`C4`).setValue(count);
  }

  /**
   * Count Each Submission
   * @returns {object} counts per sheet
   */
  static CountEachSubmission() {
    let data = [];
    try {
      Object.values(SHEETS).forEach(sheet => {
        let range = GetColumnDataByHeader(sheet, HEADERNAMES.timestamp).filter(Boolean);
        let count = range ? range.length - 2 : 0;
        if(count < 0) count = 0;
        data.push([sheet.getSheetName(), count]);
      })
      console.warn(data);
      return data;
    } catch(err) {
      console.error(`"CountEachSubmission()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Submissions
   */
  static PrintSubmissionData() {
    let data = this.CountEachSubmission();
    data.forEach( (entry, index) => {
      OTHERSHEETS.Data.getRange(13 + index , 2, 1, 1).setValue(entry[0]);
      OTHERSHEETS.Data.getRange(13 + index , 3, 1, 1).setValue(entry[1]);
    })
  }

  /**
   * Print All Submissions
   */
  static PrintTotalSubmissions() {
    let projects = [];
    Object.values(SHEETS).forEach(sheet => {
      const projectnames = GetColumnDataByHeader(sheet, HEADERNAMES.projectName)
        .filter(Boolean)
        .filter(name => name !== `FORMULA ROW`);
      projects.push(...projectnames);
    })
    const projectSet = new Set(projects);
    const size = projectSet.size;
    console.info(`Size of Set --> ${size}`);
    OTHERSHEETS.Data.getRange(6, 2, 1, 1).setValue(`TOTAL PROJECTS SUBMISSION:`);
    OTHERSHEETS.Data.getRange(6, 3, 1, 1).setValue(size);
  }

  /**
   * Find Email
   * @private
   * @param {string} name
   * @returns {string} email
   */
  static _FindEmail(name) {
    if (name) name.toString().replace(/\s+/g, "");
    let email = ``;
    Object.values(SHEETS).forEach(sheet => {
      const finder = sheet.createTextFinder(name).findNext();
      if (finder != null) {
        let row = finder.getRow();
        email = GetByHeader(sheet, HEADERNAMES.email, row);
      }
    })
    return email;
  }

  /**
   * Create Top Ten List of Users
   */
  static CreateTopTen() {
    try {
      const distribution = this.CalculateDistribution();
      if(distribution == 0) throw new Error(`Distribution is empty: ${distribution}`);

      return distribution
        .slice(0, 11)
        .forEach((pair, index) => {
          let email = this._FindEmail(pair[0]);
          // console.warn(email);
          // console.warn(`${pair[0]} -----> ${pair[1]}`);
          OTHERSHEETS.Data.getRange(106 + index, 1, 1, 1).setValue(index + 1)
          OTHERSHEETS.Data.getRange(106 + index, 2, 1, 1).setValue(pair[0])
          OTHERSHEETS.Data.getRange(106 + index, 3, 1, 1).setValue(pair[1])
          OTHERSHEETS.Data.getRange(106 + index, 5, 1, 1).setValue(email ? email : `Email not found`);
        });
    } catch(err) {
      console.error(`"CreateTopTen()" failed : ${err}`);
      return 1;
    }
  }

  

  /**
   * Calculate Distribution
   * @returns {[string, number]} sorted list of users
   */
  static CalculateDistribution() {
    let userList = [];
    let staff = GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
    Object.values(SHEETS).forEach(sheet => {
      GetColumnDataByHeader(sheet, HEADERNAMES.name)
        .filter(Boolean)
        .filter(x => !x.includes(HEADERNAMES.name))
        .filter(x => x != `FORMULA ROW`)
        .filter(x => x != `Formula Row`)
        .filter(x => x != `Test`)
        .filter(x => x != `test`)
        .filter(x => !staff.includes(x))
        .forEach(user => userList.push(user));
    });
    let occurrences = userList.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    let items = Object.keys(occurrences).map((key) => {
      if (key != "" || key != undefined || key != null || key != " ") {
        return [key, occurrences[key]];
      }
    });

    items.sort((first, second) => {
      return second[1] - first[1];
    });
    console.warn(items);
    return items;  
  }
  
  /**
   * Defunct
   * @private
   */
  static PrintDistributionNumbers() {
    let userList = [];
    let staff = GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
    Object.values(SHEETS).forEach(sheet => {
      GetColumnDataByHeader(sheet, HEADERNAMES.name)
        .filter(Boolean)
        .filter(x => !staff.includes(x))
        .forEach(x => userList.push(x));
    })
    let occurrences = userList.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences).map((key) => occurrences[key])
      .sort( (first, second) => second - first)
      .forEach( (item, index) => OTHERSHEETS.Backgrounddata.getRange(2 + index, 22, 1, 1).setValue(item));
    console.warn(items);
  }

  /**
   * Count User Types
   * @returns {[]} types, count
   */
  static CountTypes() {
    let typeTuple = new Map(Object.keys(TYPES).map(key => [TYPES[key], 0]));

    let typeList = [];
    Object.values(SHEETS).forEach(sheet => {
      GetColumnDataByHeader(sheet, HEADERNAMES.affiliation)
        .filter(Boolean)
        .filter(x => x != `Test`)
        .filter(x => x != `FORMULA ROW`)
        .filter(x => x != `Formula Row`)
        .forEach(x => typeList.push(x));
    });

    let occurrences = typeList.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    let items = Object.keys(occurrences).map((key) => [key, occurrences[key]]);
    // console.warn(items);

    for( const [idx, [key, val]] of Object.entries(items)) {
      if(TYPES.includes(key)) {
        typeTuple.set(key, val);
      } else console.warn(`Wrong type: ${key}, skipping....`);
      
    }
    console.info([...typeTuple]);

    return [...typeTuple];  
  }

  /**
   * Print User Types
   */
  static PrintTypesCount() {
    let types = this.CountTypes();
    OTHERSHEETS.Data.getRange(44, 2, 1, 1).setValue(`Student Type`);
    OTHERSHEETS.Data.getRange(44, 3, 1, 1).setValue(`Count`);
    types.forEach( (item, index) => {
      OTHERSHEETS.Data.getRange(45 + index, 2, 1, 1).setValue(item[0]);
      OTHERSHEETS.Data.getRange(45 + index, 3, 1, 1).setValue(item[1]);
    })
    return types;
  }

  /**
   * Calculate Standard Deviation
   * @returns {number} Standard Deviation
   */
  static CalculateStandardDeviation() {
    try {
      const distribution = this.CalculateDistribution();
      const n = distribution.length;
      if(n == 0) throw new Error(`Distribution is empty: ${n}`);

      let values = [];
      distribution.forEach(x => values.push(x[1]))

      const mean = values.reduce((a, b) => a + b) / n;
      console.warn(`Mean = ${mean}`);

      const s = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
      const standardDeviation = s - mean;
      console.warn(`Standard Deviation for Mean number of Submissions : +/-${standardDeviation}`);
      return Number(standardDeviation).toFixed(2);
    } catch(err) {
      console.error(`"CalculateStandardDeviation()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Arithmetic Mean
   * @returns {number} arithmetic mean
   */
  static CalculateArithmeticMean() {
    try {
      const distribution = this.CalculateDistribution();
      const n = distribution.length;
      if(n == 0) throw new Error(`Distribution is empty: ${n}`);

      let values = [];
      distribution.forEach(person => values.push(person[1]))
      const mean = values.reduce((a, b) => a + b) / n;
      console.warn(`Mean = ${mean}`);
      return mean.toFixed(3);
    } catch(err) {
      console.error(`"CalculateArithmeticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Statistics
   */
  static PrintStatistics() {
    const mean = this.CalculateArithmeticMean();
    OTHERSHEETS.Data.getRange(102, 2, 1, 1).setValue(`Arithmetic Mean for Number of Project Submissions : `)
    OTHERSHEETS.Data.getRange(102, 3, 1, 1).setValue(mean);
    const stand = this.CalculateStandardDeviation();
    OTHERSHEETS.Data.getRange(103, 2, 1, 1).setValue(`Standard Deviation for Number of Project Submissions : `);
    OTHERSHEETS.Data.getRange(103, 3, 1, 1).setValue(`+/- ${stand}`);
  }

  /**
   * Count User Tiers
   * @returns {[]} tiers
   */
  static CountTiers() {
    let tiers = GetColumnDataByHeader(OTHERSHEETS.Approved, `Tier`)
      .filter(Boolean);
    tiers = [].concat(...tiers);
    tiers.push(...[`1`, `2`, `3`, `4`]);

    let occurrences = tiers.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    let items = Object.keys(occurrences).map((key) => {
      if (key !== "" || key !== undefined || key !== null || key !== " ") {
        return [key, occurrences[key]];
      }
    });
    console.info(items);
    return items;  
  }

  /**
   * Print User Tiers
   */
  static PrintTiers () {
    const tiers = this.CountTiers();
    tiers.forEach( (tier, index) => {
      OTHERSHEETS.Data.getRange(39 + index, 2, 1, 1).setValue(`Tier ${tier[0]} Applicants`);
      OTHERSHEETS.Data.getRange(39 + index, 3, 1, 1).setValue(tier[1]);
      console.warn(tier.toString())
    });
  }


  /**
   * Count Project Statuses
   * @returns {[]} statuses
   */
  static CountStatuses () {
    let statuses = [];
    Object.values(SHEETS).forEach(sheet => {
      GetColumnDataByHeader(sheet, HEADERNAMES.status)
        .filter(Boolean)
        .forEach( status => statuses.push( Object.keys(STATUS).find(key => STATUS[key] === status)))
    })

    let occurrences = statuses.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    return occurrences; 
  }

  /**
   * Print Statuses
   */
  static PrintStatusCounts () {
    let data = this.CountStatuses();
    for(const [status, count] of Object.entries(data)) {
      if(status == STATUS.completed || status == STATUS.billed || status == STATUS.closed || status == STATUS.pickedUp || status == STATUS.abandoned) {
        data.completed += count;
      }
    }
    delete data[`billed`]; delete data[`closed`]; delete data[`pickedUp`]; delete data[`abandoned`];
    console.warn(data);
    OTHERSHEETS.Data.getRange(7, 2, 1, 1).setValue(`COMPLETED JOBS`);
    OTHERSHEETS.Data.getRange(7, 3, 1, 1).setValue(data.completed);

    OTHERSHEETS.Data.getRange(8, 2, 1, 1).setValue(`CANCELLED JOBS`);
    OTHERSHEETS.Data.getRange(8, 3, 1, 1).setValue(data.cancelled);

    OTHERSHEETS.Data.getRange(9, 2, 1, 1).setValue(`IN-PROGRESS JOBS`)
    OTHERSHEETS.Data.getRange(9, 3, 1, 1).setValue(data.inProgress);

    OTHERSHEETS.Data.getRange(10, 2, 1, 1).setValue(`FAILED JOBS`);
    OTHERSHEETS.Data.getRange(10, 3, 1, 1).setValue(data.failed);
  }

  /**
   * Count Funding
   * @returns {number} funding
   */
  static CountFunding() {
    try {
      let subtotals = [];
      Object.values(SHEETS).forEach(sheet => {
        let estimates = GetColumnDataByHeader(sheet, HEADERNAMES.estimate)
          .filter(x => !x.includes(`Estimate`))
          .filter(Boolean)
          .reduce((a, b) => a + b, 0);
        subtotals.push(estimates);
      })
      const sum = subtotals.reduce((a, b) => a + b, 0);
      const fixed = Number(sum).toFixed(2);
      console.info(`Subtotals ---> ${subtotals}`);
      console.info(`Funding = $${fixed}`);
      return fixed;
    } catch(err) {
      console.error(`"CountFunding()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Funding
   */
  static PrintFundingSum () {
    let sum = this.CountFunding();
    OTHERSHEETS.Data.getRange(99, 2, 1, 1).setValue(`Total Funds`);
    OTHERSHEETS.Data.getRange(99, 3, 1, 1).setValue(`$${sum}`);
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
  console.time(`Metrics Timer `)
  try {
    console.info(`Calculating Metrics .....`);
    Calculate.PrintActiveUsers();
    Calculate.PrintTotalSubmissions();
    Calculate.PrintTiers();
    Calculate.PrintStatusCounts();
    Calculate.PrintStatistics();
    Calculate.PrintTypesCount();
    Calculate.PrintSubmissionData();
    Calculate.PrintTurnaroundTimes();
    Calculate.PrintFundingSum();
    Calculate.CreateTopTen();
    console.info(`Recalculated Metrics`);
  } catch (err) {
    console.error(`${err} : Couldn't generate Metrics for some dumb reason...`);
  }
  console.timeEnd(`Metrics Timer `)
}

const _testDist = () => {
  // c.CalculateAverageTurnaround(SHEETS.Advancedlab);
  // c.CalculateDuration();
  // c.CountActiveUsers();
  // Calculate.CalculateDistribution();
  Calculate.CountFunding();

  // let start = new Date().toDateString();
  // let end = new Date(3,10,2020,10,32,42);
  // c.CountFunding();

}







