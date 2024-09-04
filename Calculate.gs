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
  static GetAverageTurnaround(sheet = SHEETS.Laser) {
    try {
      let totals = [];
      GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime)
        .filter(Boolean)
        .forEach(time => {
          totals.push(TimeService.TimeToMillis(time));
        });

      let sum = totals.reduce((a, b) => a + b);  // Sum all the totals
      let average = sum / totals.length;  // Average the totals (a list of times in millis)
      let averageString = TimeService.MillisecondsToTimerString(average);
      console.info(`VALS: ${totals}, SUM: ${sum}, AVERAGE: ${average} = ${averageString}`);
      return averageString;
    }
    catch (err) {
      console.error(`"GetAverageTurnaround()" failed : ${err}`);
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
        data.push([`${sheet.getName()} Turnaround`, this.GetAverageTurnaround(sheet)]);
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
    const values = [ [ `TOTAL STUDENTS CURRENTLY USING JPS`, count ], ];
    OTHERSHEETS.Data.getRange(3, 2, 1, 2).setValues(values);
  }

  /**
   * Count Each Submission
   * @returns {object} counts per sheet
   */
  static CountEachSubmission() {
    let data = [];
    const total = Object.values(this.CountStatuses()).reduce((a, b) => a + b);
    try {
      Object.values(SHEETS).forEach(sheet => {
        let range = GetColumnDataByHeader(sheet, HEADERNAMES.timestamp).filter(Boolean);
        let count = range ? range.length - 2 : 0;
        if(count < 0) count = 0;
        const percentage = `${Number((count / total) * 100).toFixed(2)}%`;
        data.push([sheet.getSheetName(), count, percentage]);
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
    OTHERSHEETS.Data.getRange(13, 2, data.length, 3).setValues(data);
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
    const values = [ [`TOTAL PROJECTS SUBMISSION:`, size ], ];
    OTHERSHEETS.Data.getRange(6, 2, 1, 2).setValues(values);
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
      const distribution = this.GetDistribution();
      if(distribution == 0) throw new Error(`Distribution is empty: ${distribution}`);

      return distribution
        .slice(0, 11)
        .forEach((pair, index) => {
          let email = this._FindEmail(pair[0]) ? this._FindEmail(pair[0]) : `Email not found`;
          const values = [
            [ index + 1, pair[0], pair[1], ``, email ],
          ];
          OTHERSHEETS.Data.getRange(106 + index, 1, 1, 5).setValues(values);
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
  static GetDistribution() {
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
    OTHERSHEETS.Data.getRange(44, 2, 1, 2).setValues([ [`Student Type`, `Count`], ]);
    OTHERSHEETS.Data.getRange(45, 2, types.length, 2).setValues(types);
  }

  /**
   * Calculate Standard Deviation
   * @returns {number} Standard Deviation
   */
  static GetStandardDeviation() {
    try {
      const distribution = this.GetDistribution();
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
      console.error(`"GetStandardDeviation()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Arithmetic Mean
   * @returns {number} arithmetic mean
   */
  static GetArithmeticMean() {
    try {
      const distribution = this.GetDistribution();
      const n = distribution.length;
      if(n == 0) throw new Error(`Distribution is empty: ${n}`);

      let values = [];
      distribution.forEach(person => values.push(person[1]))
      const mean = values.reduce((a, b) => a + b) / n;
      console.warn(`Mean = ${mean}`);
      return mean.toFixed(3);
    } catch(err) {
      console.error(`"GetArithmeticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Statistics
   */
  static PrintStatistics() {
    const mean = this.GetArithmeticMean();
    const stand = this.GetStandardDeviation();
    const values = [
      [`Arithmetic Mean for Number of Project Submissions : `, mean],
      [`Standard Deviation for Number of Project Submissions : `, `+/- ${stand}`],
    ];
    OTHERSHEETS.Data.getRange(102, 2, 2, 2).setValues(values);
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
    const total = Object.values(data).reduce((a, b) => a + b);

    const completed = data.completed ? data.completed : 0;
    const completedRatio = `${Number((completed / total) * 100).toFixed(2)}%`;

    const cancelled = data.cancelled ? data.cancelled : 0;
    const cancelledRatio = `${Number((cancelled / total) * 100).toFixed(2)}%`;

    const inProgress = data.inProgress ? data.inProgress : 0;
    const inProgressRatio = `${Number((inProgress / total) * 100).toFixed(2)}%`;

    const failed = data.failed ? data.failed : 0;
    const failedRatio = `${Number((failed / total) * 100).toFixed(2)}%`;

    const values = [
      [ `COMPLETED JOBS`, completed, completedRatio ],
      [ `CANCELLED JOBS`, cancelled, cancelledRatio ],
      [ `IN-PROGRESS JOBS`, inProgress, inProgressRatio ],
      [ `FAILED JOBS`, failed, failedRatio ],
    ];
    OTHERSHEETS.Data.getRange(7, 2, 4, 3).setValues(values);
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
          .filter(x => x !== '#REF!')        
          .filter(Boolean)
          .filter(a => !a.isNaN)
          .reduce((a, b) => a + b, 0);
        subtotals.push(estimates);
      })
      const sum = subtotals.reduce((a, b) => a + b, 0);
      console.info(`Subtotals ---> `);
      subtotals.forEach(sub => console.info(sub));
      
      const fixed = Number(sum).toFixed(2);
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
    OTHERSHEETS.Data.getRange(99, 2, 1, 2).setValues([[`Total Funds`, `$${sum}`],]);
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
  // c.GetAverageTurnaround(SHEETS.Advancedlab);
  // c.CountActiveUsers();
  // Calculate.GetDistribution();
  // Calculate.CountFunding();
  Calculate.GetAverageTurnaround(SHEETS.Advancedlab);

  // let start = new Date().toDateString();
  // let end = new Date(3,10,2020,10,32,42);
  // c.CountFunding();

}







