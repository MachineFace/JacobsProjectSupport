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
      GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime)
        .filter(Boolean)
        .forEach(time => {
          let t = Number(TimeService.TimeToMillis(time)) || 0;
          totals.push(t);
        });

      const average = Calculate.GeometricMean(totals);  // Average the totals (a list of times in millis)
      const averageString = TimeService.MillisecondsToTimerString(average);
      console.info(`AVERAGE: ${averageString}`);
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
        data.push([`${sheet.getName()} Turnaround`, Calculate.GetAverageTurnaround(sheet)]);
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
        [...GetColumnDataByHeader(sheet, HEADERNAMES.name)]
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
        let range = [...GetColumnDataByHeader(sheet, HEADERNAMES.timestamp)]
          .filter(Boolean);
        let count = range.length - 2 > 0 ? range.length - 2 : 0;
        const percentage = `${Number((count / total) * 100).toFixed(2)}%`;
        data.push([ sheet.getSheetName(), count, percentage ]);
      });

      // Print
      console.info(data);
      OTHERSHEETS.Data.getRange(12, 2, 1, 3).setValues([[ `SUBMISSION BREAKDOWN`, `Count`, `Percentage` ]]);
      OTHERSHEETS.Data.getRange(13, 2, data.length, 3).setValues(data);
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
      const projectnames = [...GetColumnDataByHeader(sheet, HEADERNAMES.projectName)]
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
      const distribution = Calculate.GetUserDistribution();
      if(distribution.length == 0) throw new Error(`Distribution is empty: ${distribution}`);

      return distribution
        .slice(0, 11)
        .forEach((pair, index) => {
          let email = Calculate._FindEmail(pair[0]) ? Calculate._FindEmail(pair[0]) : `Email not found`;
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
   * Count User Types
   * @returns {[]} types, count
   */
  static CountTypes() {
    try {
      let typeList = [];
      Object.values(SHEETS).forEach(sheet => {
        [...GetColumnDataByHeader(sheet, HEADERNAMES.affiliation)]
          .filter(Boolean)
          .filter(x => x != `Test`)
          .filter(x => x != `FORMULA ROW`)
          .filter(x => x != `Formula Row`)
          .forEach(x => typeList.push(x));
      });
      let distribution = Calculate.Distribution(typeList);
      const distSet = new Set(distribution.map(([key, _]) => key));

      // Add Back missing types with a 0
      let list = Object.values(TYPES);
      list.forEach(key => {
        if (!distSet.has(key)) {
          distribution.push([key, 0]);
        }
      });
      
      // Print
      console.info(distribution);
      OTHERSHEETS.Data.getRange(44, 2, 1, 2).setValues([ [`Student Type`, `Count`], ]);
      OTHERSHEETS.Data.getRange(45, 2, types.length, 2).setValues(types);

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
      let staff = GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
      Object.values(SHEETS).forEach(sheet => {
        GetColumnDataByHeader(sheet, HEADERNAMES.name)
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
      return Calculate.Distribution(userList);
    } catch(err) {
      console.error(`"GetUserDistribution()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Defunct
   * @private
   *
  static PrintDistributionNumbers() {
    let userList = [];
    let staff = GetColumnDataByHeader(OTHERSHEETS.Staff, `FIRST LAST NAME`);
    Object.values(SHEETS).forEach(sheet => {
      [...GetColumnDataByHeader(sheet, HEADERNAMES.name)]
        .filter(Boolean)
        .filter(x => !staff.includes(x))
        .forEach(x => userList.push(x));
    })
    let occurrences = Calculate.Distribution(userList);
    let items = Object.keys(occurrences).map((key) => occurrences[key])
      .sort((first, second) => second - first)
      .forEach((item, index) => OTHERSHEETS.Backgrounddata.getRange(2 + index, 22, 1, 1).setValue(item));
    console.warn(items);
  }
  */

  /**
   * Calculate Standard Deviation
   * @returns {number} Standard Deviation
   */
  static GetUserSubmissionStandardDeviation() {
    try {
      const distribution = Calculate.GetUserDistribution();
      const standardDeviation = Calculate.StandardDeviation(distribution);
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
      const mean = Calculate.ArithmeticMean(distribution);
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
    const mean = Calculate.GetUserSubmissionArithmeticMean();
    const stand = Calculate.GetUserSubmissionStandardDeviation();
    const values = [
      [`Arithmetic Mean for Number of Project Submissions: `, mean],
      [`Standard Deviation for Number of Project Submissions: `, `+/- ${stand}`],
    ];
    OTHERSHEETS.Data.getRange(102, 2, 2, 2).setValues(values);
  }

  /**
   * Count User Tiers
   * @returns {[]} tiers
   */
  static CountTiers() {
    let tiers = [...GetColumnDataByHeader(OTHERSHEETS.Approved, `Tier`)]
      .filter(Boolean);
    const distribution = Calculate.Distribution(tiers);
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
    const tiers = Calculate.CountTiers();
    tiers.forEach( (tier, index) => {
      OTHERSHEETS.Data.getRange(39 + index, 2, 1, 2).setValues([[ `Tier ${tier[0]} Users`, tier[1] ]]);
    });
  }


  /**
   * Count Project Statuses
   * @returns {[]} statuses
   */
  static CountStatuses() {
    let statuses = [];
    Object.values(SHEETS).forEach(sheet => {
      GetColumnDataByHeader(sheet, HEADERNAMES.status)
        .filter(Boolean)
        .forEach(status => {
          let key = Object.keys(STATUS).find(x => STATUS[x] === status);
          statuses.push(key);
        });
    })
    const occurrences = Calculate.Distribution(statuses);
    return occurrences; 
  }

  /**
   * Print Statuses
   */
  static PrintStatusCounts() {
    let data = Calculate.CountStatuses();
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
      [ `STATUS`, `COUNT`, `RATIO`, ],
      [ `COMPLETED`, completed, completedRatio, ],
      [ `CANCELLED`, cancelled, cancelledRatio, ],
      [ `IN-PROGRESS`, inProgress, inProgressRatio, ],
      [ `FAILED`, failed, failedRatio, ],
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
        let sum = [...GetColumnDataByHeader(sheet, HEADERNAMES.estimate)]
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

      // Print
      OTHERSHEETS.Data.getRange(99, 2, 1, 2).setValues([[`Total Funds`, `$${fixed}`],]);
      return fixed;
    } catch(err) {
      console.error(`"CountFunding()" failed : ${err}`);
      return 1;
    }
  }


  /**
   * --------------------------------------------------------------------------------------------------------------
   */

  /**
   * Calculate Distribution
   * @param {Array} input array to calculate Distribution
   * @returns {[string, number]} sorted list of users
   */
  static Distribution(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`List is empty: ${numbers.length}`);
      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;
      const occurrences = values.reduce( (acc, curr) => {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});

      let items = Object.keys(occurrences).map((key) => {
        if (key != "" || key != undefined || key != null || key != " ") {
          return [key, occurrences[key]];
        }
      });

      items.sort((first, second) => second[1] - first[1]);
      console.warn(items);
      return items;  
    } catch(err) {
      console.error(`"Distribution()" failed: ${err}`);
      return 1;
    }
  }


  /**
   * Calculate Standard Deviation
   * @param {Array} array of keys and values: "[[key, value],[]...]"
   * @returns {number} Standard Deviation
   */
  static StandardDeviation(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`List is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const mean = Calculate.GeometricMean(values);
      console.warn(`Mean = ${mean}`);

      const s = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
      const standardDeviation = Math.abs(Number(s - mean).toFixed(3)) || 0;
      console.warn(`Standard Deviation: +/-${standardDeviation}`);
      return standardDeviation;
    } catch(err) {
      console.error(`"StandardDeviation()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Z Scores for Each Distribution Entry
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {Array} ZScored Entries [[key, value, score], [key, value, score], ... ]
   */
  static ZScore(distribution = [], stdDev = 0) {
    try {
      if(distribution.length < 2) throw new Error(`Distribution Empty: ${distribution.length}`);
      const mean = Calculate.GeometricMean(distribution);

      // Compute the Z-Score for each entry
      const zScore = distribution.map(([key, value]) => {
        const zScore = (value - mean) / stdDev;
        return [key, value, zScore];
      });
      return zScore;
    } catch(err) {
      console.error(`"ZScore()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Kurtosis
   * Measures the "tailedness" of the data distribution.
   * High kurtosis means more outliers; Low kurtosis means fewer outliers.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {number} Kurtosis Number
   */
  static Kurtosis(distribution = [], stdDev = 0) {
    try {
      if(distribution.length < 2) throw new Error(`Distribution Empty: ${distribution.length}`);

      const mean = Calculate.GeometricMean(distribution);

      // Calculate the fourth moment
      const fourthMoment = distribution.reduce((acc, curr) => {
        return acc + Math.pow(curr[1] - mean, 4);
      }, 0) / distribution.length;

      // Calculate variance (standard deviation squared)
      const variance = Math.pow(stdDev, 2);

      // Compute kurtosis
      const kurtosis = fourthMoment / Math.pow(variance, 2);

      // Excess kurtosis (subtract 3 to make kurtosis of a normal distribution zero)
      const excessKurtosis = kurtosis - 3;

      return excessKurtosis;
    } catch(err) {
      console.error(`"Kurtosis()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Skewness
   * Measures the asymmetry of the data distribution.
   * Positive skew means a long right tail; Negative skew means a long left tail.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {number} Skewness Number
   */
  static Skewness(distribution = [], stdDev = 0) {
    try {
      // Calculate the mean of the distribution
      const mean = Calculate.GeometricMean(distribution);

      // Calculate the third moment
      const thirdMoment = distribution.reduce((acc, curr) => {
        return acc + Math.pow(curr[1] - mean, 3);
      }, 0) / distribution.length;

      // Calculate the skewness
      const skewness = thirdMoment / Math.pow(stdDev, 3);

      return skewness;
    } catch(err) {
      console.error(`"Skewness()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Detect Outliers
   * Outlier detection typically involves identifying data points that are far from the mean of a distribution, 
   * often using a threshold based on the standard deviation. 
   * A common method for detecting outliers is to flag values that are more than a certain number of standard deviations away from the mean. 
   * For example, values beyond 2 or 3 standard deviations can be considered outliers.
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @param {number} threshold
   * @returns {Array} Outliers
   */
  static DetectOutliers(distribution = [], stdDev = 0, threshold = 3) {
    try {
      // Calculate the mean of the distribution
      const mean = Calculate.GeometricMean(distribution);

      // Find outliers
      const outliers = distribution.filter(x => {
        const diff = Math.abs(x[1] - mean);
        return diff > threshold * stdDev;
      });

      // Return the outliers as an array of [key, value] pairs
      return outliers;
    } catch(err) {
      console.error(`"DetectOutliers()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Arithmetic Mean
   * @returns {number} arithmetic mean
   */
  static ArithmeticMean(distribution = []) {
    try {
      const n = distribution.length;
      if(n == 0) throw new Error(`Distribution is empty: ${n}`);

      let values = [];
      if (Array.isArray(distribution[0])) values = distribution.map(item => item[1]);
      else values = distribution;

      const mean = values.reduce((a, b) => a + b) / n;
      console.warn(`ARITHMETIC MEAN: ${mean}`);
      return mean.toFixed(3);
    } catch(err) {
      console.error(`"ArithmeticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Geometric Mean
   * @param {Array} numbers
   * @returns {number} Geometric Mean
   */
  static GeometricMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => Number(item[1]));
      else values = numbers.map(x => Number(x));

      const product = values.reduce((product, num) => product * num, 1);
      const geometricMean = Math.pow(product, 1 / values.length);
      console.warn(`GEOMETRIC MEAN: ${geometricMean}`);
      return geometricMean;
    } catch(err) {
      console.error(`"GeometricMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Harmonic Mean
   * @param {Array} numbers
   * @returns {number} Harmonic Mean
   */
  static HarmonicMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);
      
      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const harmonicMean = values.length / values.reduce((a, b) => a + 1 / b, 0);
      console.warn(`HERMONIC MEAN: ${harmonicMean}`);
      return harmonicMean;
    } catch(err) {
      console.error(`"HarmonicMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Quadratic Mean
   * @param {Array} numbers
   * @returns {number} Quadratic Mean
   */
  static QuadraticMean(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Distribution is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const quadraticMean = Math.sqrt(values.reduce((a, b) => a + b * b, 0) / values.length);
      console.warn(`QUADRATIC MEAN: ${quadraticMean}`);
      return quadraticMean;
    } catch(err) {
      console.error(`"QuadraticMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Median Mean
   * @param {Array} numbers
   * @returns {number} Median
   */
  static Median(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`Input less than 2: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const sortedNumbers = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sortedNumbers.length / 2);
      const median = sortedNumbers.length % 2 === 0 ?
          (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2 :
          sortedNumbers[middle];

      console.warn(`MEDIAN: ${median}`);
      return median;
    } catch(err) {
      console.error(`"Median()" failed : ${err}`);
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
  Calculate.PrintStatusCounts();

}







