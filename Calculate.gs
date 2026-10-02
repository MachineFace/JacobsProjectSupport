/**
 * ----------------------------------------------------------------------------------------------------------------
 * ### Class for Calculating Metrics
 */
class Calculate {
  constructor() {

  }

  /**
   * ### Calculate Average Turnaround Time
   * @param {sheet} sheet
   * @returns {string} formatted average time
   */
  static GetAverageTurnaround(sheet = SHEETS.Laser) {
    try {
      let totals = [];
      let times = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime)]
        .filter(Boolean)
        .filter(x => x !== `NaN days, NaN:NaN:NaN`)
        .filter(x => x !== undefined)
        .filter(x => x !== `undefined`)
        .filter(x => x !== null)
        .forEach(time => {
          if(time !== undefined || time !== null || time !== ``) {
            let t = Number(TimeService.TimerStringToMilliseconds(time));
            // console.info(t);
            totals.push(t);
          }

        });
      // console.info(totals);
      const average = totals && StatisticsService.Mean(totals);  // Average the totals (a list of times in millis)
      const averageString = TimeService.MillisecondsToTimerString(average) || 0;
      console.info(`Sheet: ${sheet.getSheetName()}, AVG: ${averageString}`);
      return averageString;
    } catch (err) {
      console.error(`"GetAverageTurnaround()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Print Turnaround Times
   */
  static PrintTurnaroundTimes() {
    try {
      let data = [
        [`Turnaround Times`, `Days`],
      ];
      Object.values(SHEETS).forEach(sheet => {
        const time = Calculate.GetAverageTurnaround(sheet);
        data.push([`${sheet.getName()} Turnaround`, time]);
      });
      // console.info(`Total Turnaround: ${data}`);
      OTHERSHEETS.Data.getRange(1, 13, data.length, 2).setValues(data);
    } catch (err) {
      console.error(`"PrintTurnaroundTimes()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Count Active Users
   * @returns {number} unique users
   */
  static CountActiveUsers() {
    try {
      const staff = SheetService.GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);

      let persons = [];
      Object.values(SHEETS).forEach(sheet => {
        [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.name)]
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .filter(x => x != `Test`)
          .filter(x => x != `Testa Fiesta`)
          .filter(x => !staff.includes(x))
          .forEach(x => persons.push(x));
      });
      // console.info(persons)
      const unique = new Set(persons);
      const count = unique.size;

      // Print
      const values = [ 
        [ `TOTAL STUDENTS CURRENTLY USING JPS` ], 
        [ count ], 
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 2, 2, 1).setValues(values);

      return count;
    } catch(err) {
      console.error(`"CountActiveUsers()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Count Each Submission
   * @returns {object} counts per sheet
   */
  static CountEachSubmission() {
    try {
      const statuses = Calculate.CountStatuses();
      const status_list = Object.entries(statuses).map((_, [status, count]) => [status, count]);
      let x = status_list
        .map(item => item[1])
        .reduce((a, b) => a + b)
      const total = x || 0;

      let data = [];
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
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 9, values.length, 3).setValues(values);
      return data;
    } catch(err) {
      console.error(`"CountEachSubmission()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Print All Submissions
   */
  static PrintTotalSubmissions() {
    try {
      let projects = [];
      Object.values(SHEETS).forEach(sheet => {
        const projectnames = [...SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.projectName)]
          .filter(Boolean)
          .filter(name => name !== `FORMULA ROW`);
        projects.push(...projectnames);
      })
      const projectSet = new Set(projects);
      const size = projectSet.size;

      const values = [ 
        [ `TOTAL PROJECTS SUBMISSIONS` ], 
        [ size ], 
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 3, 2, 1).setValues(values);
    } catch(err) {
      console.error(`"PrintTotalSubmissions()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Create Top Ten List of Users
   */
  static CreateTopTen() {
    try {
      let values = [
        [ `Place`, `Top 10 Power Users - Most Submissions`, `Number of Submissions`, `Email`, ],
      ];
      
      const distribution = Calculate.UserDistribution();
      let  arr = Object.entries(distribution).map(([key, value]) => [key, value]);

      arr
        .slice(0, 11)
        .forEach(([ user, count ], idx) => {
          const user_mail = EmailService.FindEmail(user);
          const email = user_mail ? user_mail : `Email not found`;
          const entry = [ idx + 1, user, count, email ];
          values.push(entry);
        });
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 24, values.length, 4).setValues(values);
    } catch(err) {
      console.error(`"CreateTopTen()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Count User Types
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

      // Add Back missing types with a 0
      let list = Object.values(TYPES);
      list.forEach(key => {
        if (!distribution.hasOwnProperty(key)) {
          distribution[key] = 0;
        }
      });
      
      // Print
      let values = [
        [ `User Type`, `Count` ],
        ...Object.entries(distribution).map(([key, value]) => [key, value]),
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 19, values.length, 2).setValues(values);
      return distribution;
    } catch(err) {
      console.error(`"CountTypes()" failed: ${err}`);
      return null;
    }
  }

  // static UserStatistics() {
  //   const staff = SheetService.GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);

  //   let userList = [];
  //   Object.values(SHEETS).forEach(sheet => {
  //     SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.name)
  //       .filter(Boolean)
  //       .filter(x => !x.includes(HEADERNAMES.name))
  //       .filter(x => x != `FORMULA ROW`)
  //       .filter(x => x != `Formula Row`)
  //       .filter(x => x != `Rex Cramer`)
  //       .filter(x => x != `Test`)
  //       .filter(x => x != `test`)
  //       .filter(x => !staff.includes(x))
  //       .forEach(user => userList.push(user));
  //   });

  //   const distribution = StatisticsService.Distribution(userList);
  //   console.info(`Distribution: 
  //     ${distribution}
  //   `);
  //   const raw = Object.values(distribution).map(entry => entry[1]);
  //   const extent = StatisticsService.Extent(raw)

  //   const mean = StatisticsService.Mean(raw);
  //   const median = StatisticsService.Median(raw);
  //   const mode = StatisticsService.Mode(raw);
  //   const gm = StatisticsService.GeometricMean(raw);
  //   const qm = StatisticsService.QuadraticMean(raw);
  //   console.info(`Central Tendencies:
  //     Extents: ${extent},
  //     Mean: ${mean},
  //     Median: ${median},
  //     Mode: ${mode},
  //     Geometric Mean: ${gm},
  //     Quadratic Mean: ${qm},`
  //   );
    
  //   const standardDeviation = StatisticsService.StandardDeviation(raw);
  //   const medianDeviation = StatisticsService.Median_Deviation(raw);
  //   const dev = StatisticsService.Deviation(raw).map(x => Number(x).toFixed(4));
  //   console.info(`Deviates:
  //     Standard Deviaiton: ${standardDeviation},
  //     Median Deviation: ${medianDeviation},
  //     Deviation: ${dev}`
  //   );

  //   const histogram = StatisticsService.Histogram(raw, 4);
  //   const intervals = StatisticsService.EqualIntervalBreaks(raw, 4);
  //   const kurtosis = StatisticsService.Sample_Kurtosis(raw, standardDeviation);
  //   const skew = StatisticsService.Sample_Skewness(raw);
  //   console.info(`Endpoints:
  //     Histogram: ${histogram},
  //     Equal Intervals: ${intervals}
  //     Kurtosis: ${kurtosis}
  //     Skewness: ${skew}
  //     `
  //   );
  
  //   const kolmogorov = StatisticsService.Kolmogorov_Smirnov(raw);
  //   console.info(`Kolmogorov: 
  //     ${JSON.stringify(kolmogorov, null, 2)}
  //   `)

  //   const zscores = StatisticsService.ZScore(distribution, `arithmetic`, standardDeviation, true);
  //   console.info(`Z Scores:
  //     ${JSON.stringify(zscores, null, 2)}
  //   `);
  // }


  /**
   * ### Calculate Distribution
   * @returns {[string, number]} sorted list of users
   */
  static UserDistribution() {
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
      
      const distribution = StatisticsService.Distribution(userList);
      // console.info(JSON.stringify(distribution, null, 2));

      return distribution;
    } catch(err) {
      console.error(`"UserDistribution()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Calculate Standard Deviation
   * NOT IMPLEMENTED
   * @returns {number} Standard Deviation
   */
  static GetUserSubmissionStandardDeviation() {
    try {

      const distribution = Calculate.UserDistribution();
      
      const dist_list = [...Object.entries(distribution)];
      console.info(dist_list)

      const standardDeviation = StatisticsService.StandardDeviation(dist_list);
      console.info(`Standard Deviation: +/-${dist_list}`);
      // return standardDeviation;
    } catch(err) {
      console.error(`"GetUserSubmissionStandardDeviation()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Calculate Arithmetic Mean
   * NOT IMPLEMENTED
   * @returns {number} arithmetic mean
   */
  static GetUserSubmissionArithmeticMean() {
    try {
      const mean = StatisticsService.Mean(Calculate.UserDistribution());
      return mean;
    } catch(err) {
      console.error(`"GetUserSubmissionArithmeticMean()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Print Statistics
   */
  static PrintStatistics() {
    try {
      const distribution = Calculate.UserDistribution();
      const dist_list = Object.entries(distribution).map(([key, value]) => value);
      const am = Number(StatisticsService.Mean(dist_list)).toFixed(4) || 0;
      const gm = Number(StatisticsService.GeometricMean(dist_list)).toFixed(4) || 0;
      const hm = Number(StatisticsService.HarmonicMean(dist_list)).toFixed(4) || 0;
      const qm = Number(StatisticsService.QuadraticMean(dist_list)).toFixed(4) || 0;

      const stdDev = Number(StatisticsService.StandardDeviation(dist_list)).toFixed(4) || 0;
      const kurtosis = Number(StatisticsService.Sample_Kurtosis(dist_list, stdDev)).toFixed(4) || 0;
      const skewness = Number(StatisticsService.Sample_Skewness(dist_list, stdDev)).toFixed(4) || 0;

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
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 29, values.length, 2).setValues(values);
    } catch(err) {
      console.error(`"PrintStatistics()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### User Submissions Z Scores
   * @return {number} standard deviation
   */
  static UserSubmissionsZScores() {
    try {
      const distribution = Calculate.UserDistribution();
      const dist_numbers = [...Object.values(distribution)];
      const dist_list = [...Object.entries(distribution)];

      const standardDeviation = StatisticsService.StandardDeviation(dist_numbers);
      const zScore = StatisticsService.ZScore(dist_list, `arithmetic`, standardDeviation, true);

      const values = [
        [ `User`, `Submission Count`, `Z-Score`  ], 
        ...zScore,
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 32, values.length, 3).setValues(values);
      return zScore;
    } catch(err) {
      console.error(`"UserSubmissionsZScores()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### User Submissions Quartiles
   * @return {number} quartiles
   */
  static UserSubmissionsQuartiles() {
    try {
      const distribution = Calculate.UserDistribution();
      const dist_list = [...Object.entries(distribution)];
      const quartiles = StatisticsService.Quartiles(dist_list);

      const values = [
        [ `Quartile`, `Value`, ], 
        ...Object.entries(quartiles),
      ];

      console.info(values);
      OTHERSHEETS.Data.getRange(1, 42, values.length, 2).setValues(values);
      return quartiles;
    } catch(err) {
      console.error(`"UserSubmissionsQuartiles()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### User Submissions Cumulative Std Normal Probability
   */
  static UserSubmissionsCumulativeStdNormalProbability() {
    try {
      const distribution = Calculate.UserDistribution();

      let cspList = [];
      Object.entries(distribution).forEach(([name, submissionCount], idx) => {
        const csp = StatisticsService.CumulativeStdNormalProbability(submissionCount);
        cspList.push([csp]);
      });

      const values = [
        [ `Cumulative Standard Normal Probability`  ], 
        ...cspList,
      ];

      console.info(values);
      OTHERSHEETS.Data.getRange(1, 35, values.length, 1).setValues(values);
      return cspList;
    } catch(err) {
      console.error(`"UserSubmissionsCumulativeStdNormalProbability()" failed: ${err}`);
      return null;
    }
  }

  

  /**
   * ### Count User Tiers
   * @returns {[]} tiers
   */
  static CountTiers() {
    try {
      let tiers = [...SheetService.GetColumnDataByHeader(OTHERSHEETS.Approved, `Tier`)]
        .filter(Boolean);

      let distribution = StatisticsService.Distribution(tiers);

      Object.values(PRIORITY).forEach(key => {
        if (!distribution.hasOwnProperty(key)) {
          distribution[key] = 0;
        }
      });
      console.info(distribution)
      return distribution;
    } catch(err) {
      console.error(`"CountTiers()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Print User Tiers
   */
  static PrintTiers() {
    try {
      const tiers = Calculate.CountTiers();
      const tier_list = Object.entries(tiers)
        .map(([tier, count]) => [ `Tier ${tier} Users`, count ]);
      
      let values = [
        [ `Applicant Tier`, `Count`],
        ...tier_list,
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 16, values.length, 2,).setValues(values);

    } catch(err) {
      console.error(`"PrintTiers()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Count Project Statuses
   * @returns {[]} statuses
   */
  static CountStatuses() {
    try {
      let statuses = [];
      Object.values(SHEETS).forEach(sheet => {
        const stats = SheetService.GetColumnDataByHeader(sheet, HEADERNAMES.status)
          .filter(Boolean);
        statuses.push(...stats);
      });

      const distribution = StatisticsService.Distribution(statuses);

      // Add Back missing types with a 0
      let list = Object.values(STATUS);
      list.forEach(key => {
        if (!distribution.hasOwnProperty(key)) {
          distribution[key] = 0;
        }
      });

      // console.info(distribution);
      return distribution; 
    } catch(err) {
      console.error(`"CountStatuses()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Print Statuses
   */
  static PrintStatusCounts() {
    try {
      let statuses = Calculate.CountStatuses();
      const total = Object.values(statuses).reduce((a, b) => a + b);

      const stats = Object.entries(statuses).map(([status, count]) => {
        let percent = Number((Number(count) / Number(total)) * 100).toFixed(2) || 0;
        let percentString = `${percent}%`;
        return [ TitleCase(status), count, percentString ];
      });

      const values = [
        [ `STATUS`, `COUNT`, `RATIO`, ],
        ...stats,
      ];
      console.info(values);
      OTHERSHEETS.Data.getRange(1, 5, values.length, 3).setValues(values);
    } catch(err) {
      console.error(`"PrintStatusCounts()" failed: ${err}`);
      return null;
    }
  }

  /**
   * ### Count Funding
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
      console.error(`"CountFunding()" failed: ${err}`);
      return null;
    }
  }


  

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * ### Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
  try {
    console.time(`Metrics Timer `)
    console.info(`Calculating Metrics .....`);

    Calculate.CountActiveUsers();
    Calculate.PrintTotalSubmissions();
    Calculate.PrintTiers();
    Calculate.PrintStatusCounts();
    Calculate.PrintStatistics();
    Calculate.UserSubmissionsZScores();
    Calculate.UserSubmissionsCumulativeStdNormalProbability();
    Calculate.UserSubmissionsQuartiles();
    Calculate.CountTypes();
    Calculate.CountEachSubmission();
    Calculate.PrintTurnaroundTimes();
    Calculate.CountFunding();
    Calculate.CreateTopTen();

    console.info(`Recalculated Metrics`);
    console.timeEnd(`Metrics Timer `);
    
  } catch (err) {
    console.error(`"Metrics()" failed: ${err}`);
    return null;
  }
}


const _testDist = () => {
  // Calculate.CountTypes();
  // Calculate.GetAverageTurnaround(SHEETS.Advancedlab);
  // Calculate.PrintTurnaroundTimes();
  // Calculate.CountActiveUsers();
  // Calculate.CountEachSubmission();
  // Calculate.PrintTotalSubmissions();
  // Calculate.CreateTopTen();
  // Calculate.CountTypes();
  // Calculate.GetUserSubmissionStandardDeviation();
  // Calculate.PrintStatistics();

  // Calculate.UserDistribution();
  // Calculate.UserSubmissionsZScores();
  Calculate.UserSubmissionsQuartiles();
  // Calculate.UserSubmissionsCumulativeStdNormalProbability();

  // Calculate.PrintTiers();
  // Calculate.PrintStatusCounts();
  // Calculate.CountFunding();
  // Calculate.PrintTurnaroundTimes();

  // let start = new Date().toDateString();
  // let end = new Date(3,10,2020,10,32,42);
  // Calculate.PrintStatistics();
  // const id = PropertiesService.getScriptProperties().getProperty(`SPREADSHEET_ID`);
  // const y = SpreadsheetApp.openById(id).getSheetByName(`Laser Cutter`);
  // console.info(`SHEET: ${y.getSheetName()}`);

  // Calculate.UserStatistics();

}







