/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Calculating Metrics
 */
class Calculate {
  constructor() {

  }

  /**
   * Calculate Average Turnaround Time
   * @param {sheet} sheet
   * @returns {string} formatted average time
   */
  static GetAverageTurnaround(sheet = SHEETS.Laser) {
    let totals = [];
    try {
      [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime)]
        .filter(Boolean)
        .forEach(time => {
          let t = Number(TimeService.TimeToMillis(time)) || 0;
          totals.push(t);
        });

      const average = totals && StatisticsService.GeometricMean(totals);  // Average the totals (a list of times in millis)
      const averageString = TimeService.MillisecondsToTimerString(average) || 0;
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
      let data = [
        [`Turnaround Times`, `Days`],
      ];
      Object.values(SHEETS).forEach(sheet => {
        let days = Calculate.GetAverageTurnaround(sheet).split(`,`)[0];
        data.push([`${sheet.getName()} Turnaround`, days]);
      });
      OTHERSHEETS.Data.getRange(1, 13, data.length, 2).setValues(data);
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
        let staff = SheetService.GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
        [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.name)]
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .filter(x => x != `Test`)
          .filter(x => x != `Testa Fiesta`)
          .filter(x => !staff.includes(x))
          .forEach(x => persons.push(x));
      });
      // console.info(persons)
      let unique = new Set(persons);
      let count = unique.size;
      console.info(`Active JPS Users : ${count}`);

      // Print
      const values = [ 
        [ `TOTAL STUDENTS CURRENTLY USING JPS` ], 
        [ count ], 
      ];
      OTHERSHEETS.Data.getRange(1, 2, 2, 1).setValues(values);

      return count;
    } catch(err) {
      console.error(`"CountActiveUsers()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count Each Submission
   * @returns {object} counts per sheet
   */
  static CountEachSubmission() {
    try {
      let data = [];
      let x = [...Calculate.CountStatuses()]
        .map(item => item[1])
        .reduce((a, b) => a + b)
      const total = x || 0;

      Object.values(SHEETS).forEach(sheet => {
        let range = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.timestamp)]
          .filter(Boolean);
        let count = range.length - 2 > 0 ? range.length - 2 : 0;
        const percentage = `${Number((count / total) * 100).toFixed(2)}%`;
        data.push([ sheet.getSheetName(), count, percentage ]);
      });

      // Print
      const values = [
        [ `Submission Area`, `Count`, `Percentage` ],
        ...data,
      ];
      OTHERSHEETS.Data.getRange(1, 9, values.length, 3).setValues(values);
      return data;
    } catch(err) {
      console.error(`"CountEachSubmission()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print All Submissions
   */
  static PrintTotalSubmissions() {
    let projects = [];
    Object.values(SHEETS).forEach(sheet => {
      const projectnames = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.projectName)]
        .filter(Boolean)
        .filter(name => name !== `FORMULA ROW`);
      projects.push(...projectnames);
    })
    const projectSet = new Set(projects);
    const size = projectSet.size;
    console.info(`Size of Set --> ${size}`);
    const values = [ 
      [ `TOTAL PROJECTS SUBMISSIONS` ], 
      [ size ], 
    ];
    OTHERSHEETS.Data.getRange(1, 3, 2, 1).setValues(values);
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
        email = SheetService.GetByHeader(sheet, HEADERNAMES.email, row);
      }
    })
    return email;
  }

  /**
   * Create Top Ten List of Users
   */
  static CreateTopTen() {
    try {
      const distribution = Calculate.GetUserDistribution();
      let values = [
        [ `Place`, `Top 10 Power Users - Most Submissions`, `Number of Submissions`, `Email`, ],
      ];
      
      distribution
        .slice(0, 11)
        .forEach(([ user, count ], idx) => {
          let email = Calculate._FindEmail(user) ? Calculate._FindEmail(user) : `Email not found`;
          const entry = [ idx + 1, user, count, email ];
          values.push(entry);
        });
      OTHERSHEETS.Data.getRange(1, 24, values.length, 4).setValues(values);
    } catch(err) {
      console.error(`"CreateTopTen()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Count User Types
   * @returns {[]} types, count
   */
  static CountTypes() {
    try {
      let typeList = [];
      Object.values(SHEETS).forEach(sheet => {
        [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.affiliation)]
          .filter(Boolean)
          .filter(x => x != `Test`)
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .forEach(x => typeList.push(x));
      });
      let distribution = StatisticsService.Distribution(typeList);
      const distSet = new Set(distribution.map(([key, _]) => key));

      // Add Back missing types with a 0
      let list = Object.values(TYPES);
      list.forEach(key => {
        if (!distSet.has(key)) {
          distribution.push([key, 0]);
        }
      });
      
      // Print
      let values = [
        [ `Student Type`, `Count` ],
        ...distribution,
      ];
      OTHERSHEETS.Data.getRange(1, 19, values.length, 2).setValues(values);
      return distribution;
    } catch(err) {
      console.error(`"CountTypes()" failed: ${err}`);
      return 1;
    }
  }


  /**
   * Calculate Distribution
   * @returns {[string, number]} sorted list of users
   */
  static GetUserDistribution() {
    try {
      let userList = [];
      let staff = SheetService.GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
      Object.values(SHEETS).forEach(sheet => {
        SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.name)
          .filter(Boolean)
          .filter(x => !x.includes(HEADERNAMES.name))
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .filter(x => x != `Rex Cramer`)
          .filter(x => x != `Test`)
          .filter(x => x != `test`)
          .filter(x => !staff.includes(x))
          .forEach(user => userList.push(user));
      });
      return StatisticsService.Distribution(userList);
    } catch(err) {
      console.error(`"GetUserDistribution()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Standard Deviation
   * @returns {number} Standard Deviation
   */
  static GetUserSubmissionStandardDeviation() {
    try {
      const distribution = Calculate.GetUserDistribution();
      const standardDeviation = StatisticsService.StandardDeviation(distribution);
      console.warn(`Standard Deviation for Mean number of Submissions : +/-${standardDeviation}`);
      return standardDeviation;
    } catch(err) {
      console.error(`"GetUserSubmissionStandardDeviation()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Arithmetic Mean
   * @returns {number} arithmetic mean
   */
  static GetUserSubmissionArithmeticMean() {
    try {
      const distribution = Calculate.GetUserDistribution();
      const mean = StatisticsService.ArithmeticMean(distribution);
      return mean;
    } catch(err) {
      console.error(`"GetUserSubmissionArithmeticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Print Statistics
   */
  static PrintStatistics() {
    const distribution = Calculate.GetUserDistribution();
    const am = Number(StatisticsService.ArithmeticMean(distribution)).toFixed(3) || 0;
    const gm = Number(StatisticsService.GeometricMean(distribution)).toFixed(3) || 0;
    const hm = Number(StatisticsService.HarmonicMean(distribution)).toFixed(3) || 0;
    const qm = Number(StatisticsService.QuadraticMean(distribution)).toFixed(3) || 0;
    const stdDev = StatisticsService.StandardDeviation(distribution);
    const kurtosis = Number(StatisticsService.Kurtosis(distribution, stdDev)).toFixed(3) || 0;
    const skewness = Number(StatisticsService.Skewness(distribution, stdDev)).toFixed(3) || 0;
    const values = [
      [ `Statistics`, `Count`, ],
      [ `Average # of Project Submissions Per User`, am ],
      [ `Geometric Mean of Submissions Per User`, gm ],
      [ `Harmonic Mean of Submissions Per User`, hm ],
      [ `Quadratic Mean of Submissions Per User`, qm ],
      [ `Std. Deviation for # of Project Submissions Per User: `, `+/- ${stdDev}` ],
      [ `Kurtosis (High kurtosis means more outliers in data)`, kurtosis, ],
      [ `Skewness (Measures the asymmetry of the data)`, skewness, ],
    ];
    OTHERSHEETS.Data.getRange(1, 29, values.length, 2).setValues(values);
  }

  /**
   * Count User Tiers
   * @returns {[]} tiers
   */
  static CountTiers() {
    let tiers = [...SheetService.GetColumnDataByHeader(OTHERSHEETS.Approved, `Tier`)]
      .filter(Boolean);
    const distribution = StatisticsService.Distribution(tiers);
    const distSet = new Set(distribution.map(([key, _]) => key));

    Object.values(PRIORITY).forEach(key => {
      if (!distSet.has(`${key}`)) {
        distribution.push([ `${key}`, 0 ]);
      }
    });
    console.info(distribution)
    return distribution;  
  }

  /**
   * Print User Tiers
   */
  static PrintTiers() {
    let tiers = [
      [ `Applicant Tier`, `Count`],
    ];
    [...Calculate.CountTiers()]
      .forEach(( [ tier, count ], idx) => {
        tiers.push([ `Tier ${tier} Users`, count ]);
      });
    OTHERSHEETS.Data.getRange(1, 16, tiers.length, 2,).setValues(tiers);
  }


  /**
   * Count Project Statuses
   * @returns {[]} statuses
   */
  static CountStatuses() {
    let statuses = [];
    Object.values(SHEETS).forEach(sheet => {
      SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.status)
        .filter(Boolean)
        .forEach(status => {
          let key = Object.keys(STATUS).find(x => STATUS[x] === status);
          statuses.push(key);
        });
    })
    const occurrences = StatisticsService.Distribution(statuses);
    return occurrences; 
  }

  /**
   * Print Statuses
   */
  static PrintStatusCounts() {
    let data = Calculate.CountStatuses();
    const total = data
      .map(x => x[1])
      .reduce((a, b) => a + b);

    let stats = data.map(tuple => {
      let percent = Number((Number(tuple[1]) / Number(total)) * 100).toFixed(2) || 0;
      let percentString = `${percent}%`;
      return [ TitleCase(tuple[0]), tuple[1], percentString ];
    });

    const values = [
      [ `STATUS`, `COUNT`, `RATIO`, ],
      ...stats,
    ];
    OTHERSHEETS.Data.getRange(1, 5, values.length, 3).setValues(values);
  }

  /**
   * Count Funding
   * @returns {number} funding
   */
  static CountFunding() {
    try {
      let subtotals = [];
      Object.values(SHEETS).forEach(sheet => {
        let sum = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.estimate)]
          .filter(x => x !== '#REF!')        
          .filter(Boolean)
          .filter(a => !a.isNaN)
          .reduce((a, b) => Number(a) || 0 + Number(b) || 0, 0);
        subtotals.push(sum);
        console.info(`SHEET: ${sheet.getSheetName()}, SUM: ${sum}`);
      })
      const sum = subtotals.reduce((a, b) => Number(a) + Number(b), 0);
      const fixed = Number(sum).toFixed(2);
      console.info(`Funding = $${fixed}`);

      const values = [
        [ `Funds Generated From JPS` ], 
        [ `$${fixed}` ],
      ];
      // Print
      OTHERSHEETS.Data.getRange(1, 22, 2, 1).setValues(values);
      return fixed;
    } catch(err) {
      console.error(`"CountFunding()" failed : ${err}`);
      return 1;
    }
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
    Calculate.CountActiveUsers();
    Calculate.PrintTotalSubmissions();
    Calculate.PrintTiers();
    Calculate.PrintStatusCounts();
    Calculate.PrintStatistics();
    Calculate.CountTypes();
    Calculate.CountEachSubmission();
    Calculate.PrintTurnaroundTimes();
    Calculate.CountFunding();
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
  // Calculate.GetUserDistribution();
  // Calculate.CountFunding();

  // let start = new Date().toDateString();
  // let end = new Date(3,10,2020,10,32,42);
  // Calculate.PrintStatistics();
  Calculate.CreateTopTen();

}







