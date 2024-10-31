/**
 * --------------------------------------------------------------------------------------------------------------
 * Statistics Class for Boiler Plate Functions
 */
class StatisticsService {
  constructor() {

  }

  /**
   * Approximate Equality.
   *
   * @param {number} actual The value to be tested.
   * @param {number} expected The reference value.
   * @param {number} tolerance The acceptable relative difference.
   * @return {boolean} Whether numbers are within tolerance.
   */
  static ApproxEqual(actual = 3.0, expected = 5.0, tolerance = 0.0001) {
    return StatisticsService.RelativeError(actual, expected) <= tolerance;
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
   * The [Bernoulli distribution](http://en.wikipedia.org/wiki/Bernoulli_distribution)
   * is the probability discrete distribution of a random variable which takes value 1 with success
   * probability `p` and value 0 with failure probability `q` = 1 - `p`. It can be used, for example, to represent the
   * toss of a coin, where "1" is defined to mean "heads" and "0" is defined
   * to mean "tails" (or vice versa). It is a special case of a Binomial Distribution where `n` = 1.
   *
   * @param {number} p input value, between 0 and 1 inclusive
   * @returns {number[]} values of bernoulli distribution at this point
   * @throws {Error} if p is outside 0 and 1
   * @example
   * bernoulliDistribution(0.3); // => [0.7, 0.3]
   */
  static BernoulliDistribution(p = 0.0) {
    try {
      if (p < 0 || p > 1) throw new Error("Probability must be between 0 and 1 inclusive");
      return [1 - p, p];
    } catch(err) {
      console.error(`"BernoulliDistribution()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * The [Binomial Distribution](http://en.wikipedia.org/wiki/Binomial_distribution) is the discrete probability
   * distribution of the number of successes in a sequence of n independent yes/no experiments, each of which yields
   * success with probability `probability`. Such a success/failure experiment is also called a Bernoulli experiment or
   * Bernoulli trial; when trials = 1, the Binomial Distribution is a Bernoulli Distribution.
   * @param {number} trials number of trials to simulate
   * @param {number} probability
   * @returns {number[]} output
   */
  static BinomialDistribution(trials = 10, probability = 0.500) {
    try {
      // Check that `p` is a valid probability (0 ≤ p ≤ 1), that `n` is an integer, strictly positive.
      if (probability < 0 || probability > 1) throw new Error("(0 ≤ p ≤ 1) Probability must be between 0 and 1 inclusive");
      if(trials <= 0 || trials % 1 !== 0) throw new Error("Trials nust be an integer, strictly positive");

      // cumulativeProbability is the object we'll return with the `probability_of_x` and the `cumulativeProbability_of_x`, as well as the calculated mean &
      // variance. We iterate until the `cumulativeProbability_of_x` is within `epsilon` of 1.0.
      let x = 0;  // the random variable,
      let cumulativeProbability = 0;  // an accumulator for the cumulative distribution function to 0. `distribution_functions`
      const cells = [];
      let binomialCoefficient = 1;

      // This algorithm iterates through each potential outcome, until the `cumulativeProbability` is very close to 1, at which point we've defined the vast majority of outcomes
      while (cumulativeProbability < 1 - 0.00001) {
        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        cells[x] = binomialCoefficient * Math.pow(probability, x) * Math.pow(1 - probability, trials - x);
        cumulativeProbability += cells[x];
        x++;
        binomialCoefficient = (binomialCoefficient * (trials - x + 1)) / x;  // when the cumulativeProbability is nearly 1, we've calculated the useful range of this distribution
      }
      return cells;
    } catch(err) {
      console.error(`"BinomialDistribution()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * [Bisection method](https://en.wikipedia.org/wiki/Bisection_method) is a root-finding method that repeatedly bisects an interval to find the root.
   * This function returns a numerical approximation to the exact value.
   * @param {Function} func input function
   * @param {number} start - start of interval
   * @param {number} end - end of interval
   * @param {number} maxIterations - the maximum number of iterations
   * @param {number} errorTolerance - the error tolerance
   * @returns {number} estimated root value
   * @example
   * bisect(Math.cos,0,4,100,0.003); // => 1.572265625
   */
  static Bisect(func, start = 0, end = 99, maxIterations = 10, errorTolerance = 0.0001) {
    try {
      if (typeof func !== "function") throw new TypeError("func must be a function");
      for(let i = 0; i < maxIterations; i++) {
        const output = (start + end) / 2;
        if (func(output) === 0 || Math.abs((end - start) / 2) < errorTolerance) return output;
        if (sign(func(output)) === sign(func(start))) start = output;
        else end = output;
      }
      throw new Error("maximum number of iterations exceeded");
    } catch(err) {
      console.error(`"Bisect()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * The [χ2 (Chi-Squared) Goodness-of-Fit Test](http://en.wikipedia.org/wiki/Goodness_of_fit#Pearson.27s_chi-squared_test)
   * uses a measure of goodness of fit which is the sum of differences between observed and expected outcome frequencies
   * (that is, counts of observations), each squared and divided by the number of observations expected given the
   * hypothesized distribution. The resulting χ2 statistic, `chiSquared`, can be compared to the chi-squared distribution
   * to determine the goodness of fit. In order to determine the degrees of freedom of the chi-squared distribution, one
   * takes the total number of observed frequencies and subtracts the number of estimated parameters. The test statistic
   * follows, approximately, a chi-square distribution with (k − c) degrees of freedom where `k` is the number of non-empty
   * cells and `c` is the number of estimated parameters for the distribution.
   *
   * @param {Array<number>} data
   * @param {Function} distributionType a function that returns a point in a distribution:
   * for instance, binomial, bernoulli, or poisson
   * @param {number} significance
   * @returns {number} chi squared goodness of fit
   * @example
   * // Data from Poisson goodness-of-fit example 10-19 in William W. Hines & Douglas C. Montgomery,
   * // "Probability and Statistics in Engineering and Management Science", Wiley (1980).
   * var data1019 = [
   *     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   *     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
   *     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
   *     2, 2, 2, 2, 2, 2, 2, 2, 2,
   *     3, 3, 3, 3
   * ];
   * ss.chiSquaredGoodnessOfFit(data1019, ss.poissonDistribution, 0.05); //= false
   */
  static ChiSquaredGoodnessOfFit(data = [], distributionType, significance = 0.05) {
    const inputMean = StatisticsService.ArithmeticMean(data);  // Estimate from the sample data, a weighted mean.
    let chiSquared = 0;  // Calculated value of the χ2 statistic.
    // Number of hypothesized distribution parameters estimated, expected to be supplied in the distribution test.
    // Lose one degree of freedom for estimating `lambda` from the sample data.
    const c = 1;

    // Generate the hypothesized distribution.
    const hypothesizedDistribution = distributionType(inputMean);
    const observedFrequencies = [];
    const expectedFrequencies = [];

    // Create an array holding a histogram from the sample data, of the form `{ value: numberOfOcurrences }`
    for(let i = 0; i < data.length; i++) {
      if(observedFrequencies[data[i]] === undefined) observedFrequencies[data[i]] = 0;
      observedFrequencies[data[i]]++;
    }

    // The histogram we created might be sparse - there might be gaps between values. 
    // Iterate through the histogram, making sure that instead of undefined, gaps have 0 values.
    for(let i = 0; i < observedFrequencies.length; i++) {
      if(observedFrequencies[i] === undefined) observedFrequencies[i] = 0;
    }

    // Create an array holding a histogram of expected data given the sample size and hypothesized distribution.
    for(const k in hypothesizedDistribution) {
      if(k in observedFrequencies) expectedFrequencies[+k] = hypothesizedDistribution[k] * data.length;
    }

    // Working backward through the expected frequencies, collapse classes if less than three observations are expected for a class.
    // This transformation is applied to the observed frequencies as well.
    for(let k = expectedFrequencies.length - 1; k >= 0; k--) {
      if(expectedFrequencies[k] < 3) {
        expectedFrequencies[k - 1] += expectedFrequencies[k];
        expectedFrequencies.pop();
        observedFrequencies[k - 1] += observedFrequencies[k];
        observedFrequencies.pop();
      }
    }

    // Iterate through the squared differences between observed & expected frequencies, accumulating the `chiSquared` statistic.
    for (let k = 0; k < observedFrequencies.length; k++) {
      chiSquared += Math.pow(observedFrequencies[k] - expectedFrequencies[k], 2) / expectedFrequencies[k];
    }

    // Calculate degrees of freedom for this test and look it up in the `chiSquaredDistributionTable` in order to
    // accept or reject the goodness-of-fit of the hypothesized distribution.
    // Degrees of freedom, calculated as (number of class intervals -
    // number of hypothesized distribution parameters estimated - 1)
    const degreesOfFreedom = observedFrequencies.length - c - 1;
    return ( ChiSquaredDistributionTable[degreesOfFreedom][significance] < chiSquared );
  }

  /**
   * Split an array into chunks of a specified size. This function
   * has the same behavior as [PHP's array_chunk](http://php.net/manual/en/function.array-chunk.php)
   * function, and thus will insert smaller-sized chunks at the end if
   * the input size is not divisible by the chunk size.
   *
   * @param {Array} array a sample
   * @param {number} chunkSize size of each output array. must be a positive integer
   * @returns {Array<Array>} a chunked array
   * @throws {Error} if chunk size is less than 1 or not an integer
   * @example
   * chunk([1, 2, 3, 4, 5, 6], 2);
   * // => [[1, 2], [3, 4], [5, 6]]
   */
  static Chunk(array = [], chunkSize = 2) {
    if (Math.floor(chunkSize) !== chunkSize) throw new Error("chunk size must be an integer");
    chunkSize = chunkSize >= 2 ? chunkSize : 2;

    const output = [];
    for(let start = 0; start < array.length; start += chunkSize) {
      output.push(array.slice(start, start + chunkSize));
    }
    return output;
  }

  /**
   * The [Coefficient of Variation](https://en.wikipedia.org/wiki/Coefficient_of_variation)
   * is the ratio of the standard deviation to the mean.
   * 
   * @param {Array} x input
   * @returns {number} coefficient of variation
   * @example
   * coefficientOfVariation([1, 2, 3, 4]).toFixed(3); // => 0.516
   * coefficientOfVariation([1, 2, 3, 4, 5]).toFixed(3); // => 0.527
   * coefficientOfVariation([-1, 0, 1, 2, 3, 4]).toFixed(3); // => 1.247
   */
  static CoefficientOfVariation(array = []) {
    return StatisticsService.StandardDeviation(array) / StatisticsService.ArithmeticMean(array);
  }

  /**
   * Combinations are unique subsets of a collection
   * partition size of x from a collection at a time.
   * https://en.wikipedia.org/wiki/Combination
   * @param {Array} x any type of data
   * @param {int} k the number of objects in each group (without replacement)
   * @returns {Array<Array>} array of permutations
   * @example
   * combinations([1, 2, 3], 2); // => [[1,2], [1,3], [2,3]]
   */
  static Combinations(numbers = [], partitionSize = 2) {
    try {
      const combinationList = [];
      for(let i = 0; i < numbers.length; i++) {
        if(partitionSize === 1) combinationList.push([numbers[i]]);
        else {
          let subsetCombinations = combinations(numbers.slice(i + 1, numbers.length), partitionSize - 1);
          for(let subI = 0; subI < subsetCombinations.length; subI++) {
            let next = subsetCombinations[subI];
            next.unshift(numbers[i]);
            combinationList.push(next);
          }
        }
      }
      return combinationList;
    } catch(err) {
      console.error(`"Combinations()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Count Unique Entries
   * @param {array} array of any
   * @returns {object} map of counts
   */
  static CountUnique(array = []) {
    try {
      const frequencyMap = array.reduce((map, item) => {
        map[item] = (map[item] || 0) + 1;
        return map;
      }, {});
      return frequencyMap;
    } catch(err) {
      console.error(`"CountUnique()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Logistic Cumulative Distribution Function](https://en.wikipedia.org/wiki/Logistic_distribution)
   * @param {number} x
   * @returns {number} cumulative standard logistic probability
   */
  static CumulativeStdLogisticProbability(x = 2.0) {
    return 1 / (Math.exp(-x) + 1);
  }

  /**
   * [Cumulative Standard Normal Probability](http://en.wikipedia.org/wiki/Standard_normal_table)
   *
   * Since probability tables cannot be
   * printed for every normal distribution, as there are an infinite variety
   * of normal distributions, it is common practice to convert a normal to a
   * standard normal and then use the standard normal table to find probabilities.
   *
   * You can use `.5 + .5 * errorFunction(x / Math.sqrt(2))` to calculate the probability
   * instead of looking it up in a table.
   *
   * @param {number} z
   * @returns {number} cumulative standard normal probability
   */
  static CumulativeStdNormalProbability(z) {
    const standardNormalTable = StatisticsService.StandardNormalTable();
    const absZ = Math.abs(z);  // Calculate the position of this value.
    // Each row begins with a different significant digit: 0.5, 0.6, 0.7, and so on. 
    // Each value in the table corresponds to a range of 0.01 in the input values, so the value is
    // multiplied by 100.
    const index = StatisticsService.Min( Math.round(absZ * 100), standardNormalTable.length - 1 );

    // The index we calculate must be in the table as a positive value,
    // but we still pay attention to whether the input is positive
    // or negative, and flip the output value as a last step.
    if (z >= 0) return standardNormalTable[index];

    // due to floating-point arithmetic, values in the table with
    // 4 significant figures can nevertheless end up as repeating
    // fractions when they're computed here.
    return Math.round((1 - standardNormalTable[index]) * 1e4) / 1e4;
  }

  /**
   * Distribution
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
      const mean = StatisticsService.GeometricMean(distribution);

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
   * Given an array of x, this will find the extent of the x and return an array of breaks that can be used
   * to categorize the x into a number of classes. The returned array will always be 1 longer than the number of
   * classes because it includes the minimum value.
   * @param {Array<number>} x an array of number values
   * @param {number} nClasses number of desired classes
   * @returns {Array<number>} array of class break positions
   * @example
   * equalIntervalBreaks([1, 2, 3, 4, 5, 6], 4); // => [1, 2.25, 3.5, 4.75, 6]
   */
  static EqualIntervalBreaks(numbers = [], nClasses = 4) {
    try {
      if (numbers.length < 2) return numbers;

      const min = StatisticsService.Min(numbers);
      const max = StatisticsService.Max(numbers);
      const breaks = [min]; // the first break will always be the minimum value in the xset

      const breakSize = (max - min) / nClasses;  // The size of each break is the full range of the x divided by the number of classes requested

      // In the case of nClasses = 1, this loop won't run and the returned breaks will be [min, max]
      for (let i = 1; i < nClasses; i++) {
        breaks.push(breaks[0] + breakSize * i);
      }
      breaks.push(max); // the last break will always be the maximum.
      return breaks;
    } catch(err) {
      console.error(`"EqualIntervalBreaks()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * **[Gaussian error function](http://en.wikipedia.org/wiki/Error_function)**
   *
   * The `errorFunction(x/(sd * Math.sqrt(2)))` is the probability that a value in a
   * normal distribution with standard deviation sd is within x of the mean.
   *
   * This function returns a numerical approximation to the exact value.
   * It uses Horner's method to evaluate the polynomial of τ (tau).
   *
   * @param {number} x input
   * @return {number} error estimation
   * @example
   * errorFunction(1).toFixed(2); // => '0.84'
   */
  static ErrorFunction(x = 2.500) {
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau = t * Math.exp(
        -x * x + ((((((((0.17087277 * t - 0.82215223) * t + 1.48851587) * t - 1.13520398) * t + 0.27886807) * t - 0.18628806) * t + 0.09678418) * t + 0.37409196) * t + 1.00002368) * t - 1.26551223
    );
    if (x >= 0) return 1 - tau;
    else return tau - 1;
  }

  /**
   * The Inverse [Gaussian error function](http://en.wikipedia.org/wiki/Error_function)
   * returns a numerical approximation to the value that would have caused `ErrorFunction()` to return x.
   *
   * @param {number} x value of error function
   * @returns {number} estimated inverted value
   */
  static InverseErrorFunction(x = 5.0) {
    try {
      const a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));

      const inv = Math.sqrt(
          Math.sqrt(Math.pow(2 / (Math.PI * a) + Math.log(1 - x * x) / 2, 2) - Math.log(1 - x * x) / a ) - (2 / (Math.PI * a) + Math.log(1 - x * x) / 2)
      );

      if (x >= 0) return inv;
      else return -inv;
    } catch(err) {
      console.error(`"InverseErrorFunction()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Calculate Euclidean distance between two points.
   * @param {Array<number>} left First N-dimensional point.
   * @param {Array<number>} right Second N-dimensional point.
   * @returns {number} Distance.
   */
  static EuclideanDistance(left = [], right = []) {
    let sum = 0;
    for(let i = 0; i < left.length; i++) {
      const diff = left[i] - right[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * This computes the minimum & maximum number in an array.
   *
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   *
   * @param {Array<number>} x sample of one or more data points
   * @returns {Array<number>} minimum & maximum value
   * @throws {Error} if the length of x is less than one
   * @example
   * extent([1, 2, 3, 4]); // => [1, 4]
   */
  static Extent(array = []) {
    if (array.length === 0) throw new Error("extent requires at least one data point");

    let min = array[0];
    let max = array[0];
    array.forEach(value => {
      if (value > max) max = value;
      if (value < min) min = value;
    });
    return [ min, max, ];
  }

  /**
   * A [Factorial](https://en.wikipedia.org/wiki/Factorial), usually written n!, is the product of all positive
   * integers less than or equal to n. Often factorial is implemented
   * recursively, but this iterative approach is significantly faster and simpler.
   *
   * @param {number} n input, must be an integer number 1 or greater
   * @returns {number} factorial: n!
   * @throws {Error} if n is less than 0 or not an integer
   * @example
   * factorial(5); // => 120
   */
  static Factorial(n = 3) {
    try {
      if (n < 0) throw new Error("factorial requires a non-negative value");
      if (Math.floor(n) !== n) throw new Error("factorial requires an integer input");

      // Factorial function is normally expanded going down, like 5! = 5 * 4 * 3 * 2 * 1. 
      // This is going in the opposite direction, counting from 2 up to `n` b/c 1 * n = n;
      let acc = 1;
      for (let i = 2; i <= n; i++) {
        acc *= i;
      }
      return acc;
    } catch(err) {
      console.error(`"Factorial()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Compute the [gamma function](https://en.wikipedia.org/wiki/Gamma_function) of a value using Nemes' approximation.
   * The gamma of n is equivalent to (n-1)!, but unlike the factorial function, gamma is defined for all real n except zero
   * and negative integers (where NaN is returned). Note, the gamma function is also well-defined for complex numbers,
   * though this implementation currently does not handle complex numbers as input values.
   * Nemes' approximation is defined [here](https://arxiv.org/abs/1003.6020) as Theorem 2.2.
   * Negative values use [Euler's reflection formula](https://en.wikipedia.org/wiki/Gamma_function#Properties) for computation.
   *
   * @param {number} n Any real number except for zero and negative integers.
   * @returns {number} The gamma of the input value.
   *
   * @example
   * gamma(11.5); // 11899423.084037038
   * gamma(-11.5); // 2.29575810481609e-8
   * gamma(5); // 24
   */
  static Gamma(n = 5.0) {
    try {
      if (Number.isInteger(n)) {
        if (n <= 0) return Number.NaN;  // gamma not defined for zero or negative integers
        else return StatisticsService.Factorial(n - 1); // use factorial for integer inputs
      }

      n--;  // Decrement n, because approximation is defined for n - 1
      if (n < 0) {
          // Use Euler's reflection formula for negative inputs
          // see:  https://en.wikipedia.org/wiki/Gamma_function#Properties
          return Math.PI / (Math.sin(Math.PI * -n) * StatisticsService.Gamma(-n));
      } 
      // Nemes' expansion approximation
      const seriesCoefficient = Math.pow(n / Math.E, n) * Math.sqrt(2 * Math.PI * (n + 1 / 6));

      const seriesDenom = n + 1 / 4;
      const seriesExpansion =
          1 +
          1 / 144 / Math.pow(seriesDenom, 2) -
          1 / 12960 / Math.pow(seriesDenom, 3) -
          257 / 207360 / Math.pow(seriesDenom, 4) -
          52 / 2612736 / Math.pow(seriesDenom, 5) +
          5741173 / 9405849600 / Math.pow(seriesDenom, 6) +
          37529 / 18811699200 / Math.pow(seriesDenom, 7);

      return seriesCoefficient * seriesExpansion;
    } catch(err) {
      console.error(`"Gamma()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Logarithm (ln) of the [Gamma Function](https://en.wikipedia.org/wiki/Gamma_function) of a value using Lanczos' approximation.
   * This function takes as input any real-value n greater than 0.
   * This function is useful for values of n too large for the normal gamma function (n > 165).
   * The code is based on Lanczo's Gamma approximation, defined [here](http://my.fit.edu/~gabdo/gamma.txt).
   *
   * @param {number} n Any real number greater than zero.
   * @returns {number} The logarithm of gamma of the input value.
   *
   * @example
   * gammaln(500); // 2605.1158503617335
   * gammaln(2.4); // 0.21685932244884043
   */
  static Gamma_ln(n = 500) {
    if (n <= 0) return Number.POSITIVE_INFINITY;  // Return infinity if value not in domain
    const COEFFICIENTS = [
      0.99999999999999709182, 57.156235665862923517, -59.597960355475491248,
      14.136097974741747174, -0.49191381609762019978, 0.33994649984811888699e-4,
      0.46523628927048575665e-4, -0.98374475304879564677e-4,
      0.15808870322491248884e-3, -0.21026444172410488319e-3,
      0.2174396181152126432e-3, -0.16431810653676389022e-3,
      0.84418223983852743293e-4, -0.2619083840158140867e-4,
      0.36899182659531622704e-5,
    ];

    n--;  // Decrement n, because approximation is defined for n - 1

    let a = COEFFICIENTS[0];
    for (let i = 1; i < 15; i++) {
      a += COEFFICIENTS[i] / (n + i);
    }

    const g = 607 / 128;
    const tmp = g + 0.5 + n;

    // Return natural logarithm of gamma(n)
    const LOGSQRT2PI = Math.log(Math.sqrt(2 * Math.PI));
    return LOGSQRT2PI + Math.log(a) - tmp + (n + 0.5) * Math.log(tmp);
  }

  /**
   * Geometric Mean
   * (https://en.wikipedia.org/wiki/Geometric_mean)
   * This is the nth root of the input numbers multiplied by each other.
   *
   * The geometric mean is often useful for
   * **[proportional growth](https://en.wikipedia.org/wiki/Geometric_mean#Proportional_growth)**: given
   * growth rates for multiple years, like _80%, 16.66% and 42.85%_, a simple
   * mean will incorrectly estimate an average growth rate, whereas a geometric
   * mean will correctly estimate a growth rate that, over those years,
   * will yield the same end value.
   *
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   *
   * @param {Array<number>} x sample of one or more data points
   * @returns {number} geometric mean
   * @throws {Error} if x is empty
   * @throws {Error} if x contains a negative number
   */
  static GeometricMean(numbers = []) {
    try {
      if(numbers.length < 1) throw new Error(`Distribution is empty: ${numbers.length}`);

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
   * [Harmonic Mean](https://en.wikipedia.org/wiki/Harmonic_mean) is a mean function typically used to find the average of rates.
   * This mean is calculated by taking the reciprocal of the arithmetic mean of the reciprocals of the input numbers.
   *
   * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
   * a method of finding a typical or central value of a set of numbers.
   *
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   *
   * @param {Array} numbers
   * @returns {number} Harmonic Mean
   * @example
   * harmonicMean([2, 3]).toFixed(2) // => '2.40'
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
   * The [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range) is
   * a measure of statistical dispersion, or how scattered, spread, or
   * concentrated a distribution is. It's computed as the difference between
   * the third quartile and first quartile.
   *
   * @param {Array<number>} x sample of one or more numbers
   * @returns {number} interquartile range: the span between lower and upper quartile,
   * 0.25 and 0.75
   * @example
   * interquartileRange([0, 1, 2, 3]); // => 2
   */
  // static InterquartileRange(numbers = []) {
  //   // Interquartile range is the span between the upper quartile, at `0.75`, and lower quartile, `0.25`
  //   const q1 = quantile(numbers, 0.75);
  //   const q2 = quantile(numbers, 0.25);

  //   if (typeof q1 === "number" && typeof q2 === "number") return q1 - q2;
  // }

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

      const mean = StatisticsService.GeometricMean(distribution);

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
   * [Linear Regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
   * Finds a fitted line between a set of coordinates. This algorithm finds the slope and y-intercept of a regression line
   * using the least sum of squares.
   *
   * @param {Array<Array<number>>} data an array of two-element of arrays, like `[[0, 1], [2, 3]]`
   * @returns {Object} object containing slope and intersect of regression line
   * @example
   * linearRegression([[0, 0], [1, 1]]); // => { m: 1, b: 0 }
   */
  static LinearRegression(data = []) {
    let m;
    let b;

    // Store data length in a local variable to reduce repeated object property lookups
    const dataLength = data.length;

    // If there's only one point, arbitrarily choose a slope of 0 and a y-intercept of whatever the y of the initial point is
    if (dataLength === 1) {
        m = 0;
        b = data[0][1];
    } else {
      // Initialize our sums and scope the `m` and `b` variables that define the line.
      let sumX = 0;
      let sumY = 0;
      let sumXX = 0;
      let sumXY = 0;

      // Gather the sum of all x values, the sum of all y values, and the sum of x^2 and (x*y) for each value.
      // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
      for (let i = 0; i < dataLength; i++) {
        let point = data[i];
        let x = point[0];
        let y = point[1];

        sumX += x;
        sumY += y;
        sumXX += x * x;
        sumXY += x * y;
      }

      // `m` is the slope of the regression line
      m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);

      // `b` is the y-intercept of the line.
      b = sumY / dataLength - (m * sumX) / dataLength;
    }

    // Return both values as an object.
    return {
      m: m,
      b: b
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

  /**
   * Min is the lowest number in the array.
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   * @param {Array<number>} x sample of one or more data points
   * @throws {Error} if the length of x is less than one
   * @returns {number} minimum value
   * @example
   * min([1, 5, -10, 100, 2]); // => -10
   */
  static Min(numbers = []) {
    try {
      if (numbers.length === 0) throw new Error("min requires at least one data point");
      let value = numbers[0];
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < value) value = numbers[i];
      }
      return value;
    } catch(err) {
      console.error(`"Min()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Maximum number in an array.
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   * @param {Array<number>} x sample of one or more data points
   * @returns {number} maximum value
   * @throws {Error} if the length of x is less than one
   * @example
   * max([1, 2, 3, 4]); // => 4
   */
  static Max(numbers = []) {
    try {
      if (numbers.length === 0) throw new Error("max requires at least one data point");
      let value = numbers[0];
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > value) value = numbers[i];
      }
      return value;
    } catch(err) {
      console.error(`"Max()" failed: ${err}`);
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
   * Quartiles
   * The list is divided into two halves for computing the lower (Q1) and upper (Q3) quartiles.
   * The median of the whole distribution is computed as Q2.
   * @param {Array} distribution [[key, value], [key, value]...]
   * @returns {Object} quartiles { q1 : value, q2 : value, q3 : value, }
   */
  static Quartiles(distribution = []) {
    try {
      const sorted = distribution
        .map(([key, value]) => value)
        .slice()
        .sort((a, b) => a - b);
      const len = sorted.length;

      // Split the sorted data into two halves
      const lowerHalf = sorted.slice(0, Math.floor(len * 0.5));
      const upperHalf = sorted.slice(Math.ceil(len * 0.5));

      // Calculate Q1, Q2 (median), and Q3
      const q1 = StatisticsService.Median(lowerHalf);
      const q2 = StatisticsService.Median(sorted);
      const q3 = StatisticsService.Median(upperHalf);

      return { 
        Q1 : q1, 
        Q2 : q2, 
        Q3 : q3, 
      }
    } catch(err) {
      console.error(`"Quartiles()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Relative error.
   * This is more difficult to calculate than it first appears [1,2].  The usual
   * formula for the relative error between an actual value A and an expected
   * value E is `|(A-E)/E|`, but:
   *
   * 1. If the expected value is 0, any other value has infinite relative error,
   *    which is counter-intuitive: if the expected voltage is 0, getting 1/10th
   *    of a volt doesn't feel like an infinitely large error.
   *
   * 2. This formula does not satisfy the mathematical definition of a metric [3].
   *    [4] solved this problem by defining the relative error as `|ln(|A/E|)|`,
   *    but that formula only works if all values are positive: for example, it
   *    reports the relative error of -10 and 10 as 0.
   *
   * Our implementation sticks with convention and returns:
   *
   * - 0 if the actual and expected values are both zero
   * - Infinity if the actual value is non-zero and the expected value is zero
   * - `|(A-E)/E|` in all other cases
   *
   * [1] https://math.stackexchange.com/questions/677852/how-to-calculate-relative-error-when-true-value-is-zero
   * [2] https://en.wikipedia.org/wiki/Relative_change_and_difference
   * [3] https://en.wikipedia.org/wiki/Metric_(mathematics)#Definition
   * [4] F.W.J. Olver: "A New Approach to Error Arithmetic." SIAM Journal on
   *     Numerical Analysis, 15(2), 1978, 10.1137/0715024.
   *
   * @param {number} actual The actual value.
   * @param {number} expected The expected value.
   * @return {number} The relative error.
   */
  static RelativeError(actual = 3.0, expected = 5.0) {
    if (actual === 0 && expected === 0) return 0;
    return Math.abs((actual - expected) / expected);
  }

  /**
   * [Sign](https://en.wikipedia.org/wiki/Sign_function) is a function
   * that extracts the sign of a real number
   *
   * @param {number} x input value
   * @returns {number} sign value either 1, 0 or -1
   * @throws {TypeError} if the input argument x is not a number
   * @private
   *
   * @example
   * sign(2); // => 1
   */
  static SignFunction(x = 2) {
    try {
      if (typeof x !== "number") throw new TypeError("not a number");
      if (x < 0) return -1;
      else if (x === 0) return 0;
      else return 1;
    } catch(err) {
      console.error(`"SignFunction()" failed : ${err}`);
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
      const mean = StatisticsService.GeometricMean(distribution);

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
   * Standard Deviation
   * @param {Array} array of keys and values: "[[key, value],[]...]"
   * @returns {number} Standard Deviation
   */
  static StandardDeviation(numbers = []) {
    try {
      if(numbers.length < 2) throw new Error(`List is empty: ${numbers.length}`);

      let values = [];
      if (Array.isArray(numbers[0])) values = numbers.map(item => item[1]);
      else values = numbers;

      const mean = StatisticsService.GeometricMean(values);
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
   * Standard Normal Table, also called the unit normal table or Z table,
   * is a mathematical table for the values of Φ (phi), which are the values of
   * the [cumulative distribution function](https://en.wikipedia.org/wiki/Normal_distribution#Cumulative_distribution_function)
   * of the normal distribution. It is used to find the probability that a
   * statistic is observed below, above, or between values on the standard
   * normal distribution, and by extension, any normal distribution.
   */
  static StandardNormalTable() {
    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const cumulativeDistribution = (z) => {
      let sum = z;
      let tmp = z;

      // 15 iterations are enough for 4-digit precision
      for (let i = 1; i < 15; i++) {
          tmp *= (z * z) / (2 * i + 1);
          sum += tmp;
      }
      return ( Math.round((0.5 + (sum / SQRT_2PI) * Math.exp((-z * z) / 2)) * 1e4) / 1e4 );
    }
    const standardNormalTable = [];
    for (let z = 0; z <= 3.09; z += 0.01) {
        standardNormalTable.push(cumulativeDistribution(z));
    }
    return standardNormalTable;
  }





  /**
   * The Wilcoxon rank sum test is a non-parametric alternative to the t-test which is equivalent to the
   * [Mann-Whitney U test](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test).
   * The statistic is calculated by pooling all the observations together, ranking them, and then summing the ranks associated with one of the samples. If this rank sum is
   * sufficiently large or small we reject the hypothesis that the two samples come from the same distribution in favor of the alternative that one is shifted with
   * respect to the other.
   *
   * @param {Array<number>} sampleX a sample as an array of numbers
   * @param {Array<number>} sampleY a sample as an array of numbers
   * @returns {number} rank sum for sampleX
   *
   * @example
   * wilcoxonRankSum([1, 4, 8], [9, 12, 15]); // => 6
   */
  static WilcoxonRankSum(sampleX = [], sampleY = []) {
    try {
      if (!sampleX.length || !sampleY.length) throw new Error("Neither sample can be empty");

      const ReplaceRanksInPlace = (pooledSamples = [], tiedRanks = []) => {
        const average = (tiedRanks[0] + tiedRanks[tiedRanks.length - 1]) / 2;
        for (let i = 0; i < tiedRanks.length; i++) {
          pooledSamples[tiedRanks[i]].rank = average;
        }
      }

      const pooledSamples = sampleX
        .map((x) => ({ label: "x", value: x }))
        .concat(sampleY.map((y) => ({ label: "y", value: y })))
        .sort((a, b) => a.value - b.value);

      for (let rank = 0; rank < pooledSamples.length; rank++) {
        pooledSamples[rank].rank = rank;
      }

      let tiedRanks = [pooledSamples[0].rank];
      for (let i = 1; i < pooledSamples.length; i++) {
        if (pooledSamples[i].value === pooledSamples[i - 1].value) {
          tiedRanks.push(pooledSamples[i].rank);
          if (i === pooledSamples.length - 1) {
            ReplaceRanksInPlace(pooledSamples, tiedRanks);
          }
        } else if (tiedRanks.length > 1) {
          ReplaceRanksInPlace(pooledSamples, tiedRanks);
        } else {
          tiedRanks = [pooledSamples[i].rank];
        }
      }

      let rankSum = 0;
      for (let i = 0; i < pooledSamples.length; i++) {
        const sample = pooledSamples[i];
        if (sample.label === "x") {
          rankSum += sample.rank + 1;
        }
      }
      return rankSum;
    } catch(err) {
      console.error(`"WilcoxonRankSum()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Z-Score, or Standard Score](http://en.wikipedia.org/wiki/Standard_score) for Each Distribution Entry
   * 
   * The standard score is the number of standard deviations an observation
   * or datum is above or below the mean. Thus, a positive standard score
   * represents a datum above the mean, while a negative standard score
   * represents a datum below the mean. It is a dimensionless quantity
   * obtained by subtracting the population mean from an individual raw
   * score and then dividing the difference by the population standard
   * deviation.
   *
   * The z-score is only defined if one knows the population parameters;
   * if one only has a sample set, then the analogous computation with
   * sample mean and sample standard deviation yields the
   * Student's t-statistic.
   * 
   * @param {Array} distribution [[key, value], [key, value], ... ]
   * @param {number} standard deviation
   * @returns {Array} ZScored Entries [[key, value, score], [key, value, score], ... ]
   */
  static ZScore(distribution = [], stdDev = 0) {
    try {
      if(distribution.length < 2) throw new Error(`Distribution Empty: ${distribution.length}`);
      const mean = StatisticsService.GeometricMean(distribution);

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

}




// ----------------------------------------------------------------------------------------------------------------------------------------

/**
 * ** Percentage Points of the χ2 (Chi-Squared) Distribution **
 *
 * The [χ2 (Chi-Squared) Distribution](http://en.wikipedia.org/wiki/Chi-squared_distribution) is used in the common
 * chi-squared tests for goodness of fit of an observed distribution to a theoretical one, the independence of two
 * criteria of classification of qualitative data, and in confidence interval estimation for a population standard
 * deviation of a normal distribution from a sample standard deviation.
 *
 * Values from Appendix 1, Table III of William W. Hines & Douglas C. Montgomery, "Probability and Statistics in
 * Engineering and Management Science", Wiley (1980).
 */
const ChiSquaredDistributionTable = {
  1: {
    0.995: 0,
    0.99: 0,
    0.975: 0,
    0.95: 0,
    0.9: 0.02,
    0.5: 0.45,
    0.1: 2.71,
    0.05: 3.84,
    0.025: 5.02,
    0.01: 6.63,
    0.005: 7.88
  },
  2: {
    0.995: 0.01,
    0.99: 0.02,
    0.975: 0.05,
    0.95: 0.1,
    0.9: 0.21,
    0.5: 1.39,
    0.1: 4.61,
    0.05: 5.99,
    0.025: 7.38,
    0.01: 9.21,
    0.005: 10.6
  },
  3: {
    0.995: 0.07,
    0.99: 0.11,
    0.975: 0.22,
    0.95: 0.35,
    0.9: 0.58,
    0.5: 2.37,
    0.1: 6.25,
    0.05: 7.81,
    0.025: 9.35,
    0.01: 11.34,
    0.005: 12.84
  },
  4: {
    0.995: 0.21,
    0.99: 0.3,
    0.975: 0.48,
    0.95: 0.71,
    0.9: 1.06,
    0.5: 3.36,
    0.1: 7.78,
    0.05: 9.49,
    0.025: 11.14,
    0.01: 13.28,
    0.005: 14.86
  },
  5: {
    0.995: 0.41,
    0.99: 0.55,
    0.975: 0.83,
    0.95: 1.15,
    0.9: 1.61,
    0.5: 4.35,
    0.1: 9.24,
    0.05: 11.07,
    0.025: 12.83,
    0.01: 15.09,
    0.005: 16.75
  },
  6: {
    0.995: 0.68,
    0.99: 0.87,
    0.975: 1.24,
    0.95: 1.64,
    0.9: 2.2,
    0.5: 5.35,
    0.1: 10.65,
    0.05: 12.59,
    0.025: 14.45,
    0.01: 16.81,
    0.005: 18.55
  },
  7: {
    0.995: 0.99,
    0.99: 1.25,
    0.975: 1.69,
    0.95: 2.17,
    0.9: 2.83,
    0.5: 6.35,
    0.1: 12.02,
    0.05: 14.07,
    0.025: 16.01,
    0.01: 18.48,
    0.005: 20.28
  },
  8: {
    0.995: 1.34,
    0.99: 1.65,
    0.975: 2.18,
    0.95: 2.73,
    0.9: 3.49,
    0.5: 7.34,
    0.1: 13.36,
    0.05: 15.51,
    0.025: 17.53,
    0.01: 20.09,
    0.005: 21.96
  },
  9: {
    0.995: 1.73,
    0.99: 2.09,
    0.975: 2.7,
    0.95: 3.33,
    0.9: 4.17,
    0.5: 8.34,
    0.1: 14.68,
    0.05: 16.92,
    0.025: 19.02,
    0.01: 21.67,
    0.005: 23.59
  },
  10: {
    0.995: 2.16,
    0.99: 2.56,
    0.975: 3.25,
    0.95: 3.94,
    0.9: 4.87,
    0.5: 9.34,
    0.1: 15.99,
    0.05: 18.31,
    0.025: 20.48,
    0.01: 23.21,
    0.005: 25.19
  },
  11: {
    0.995: 2.6,
    0.99: 3.05,
    0.975: 3.82,
    0.95: 4.57,
    0.9: 5.58,
    0.5: 10.34,
    0.1: 17.28,
    0.05: 19.68,
    0.025: 21.92,
    0.01: 24.72,
    0.005: 26.76
  },
  12: {
    0.995: 3.07,
    0.99: 3.57,
    0.975: 4.4,
    0.95: 5.23,
    0.9: 6.3,
    0.5: 11.34,
    0.1: 18.55,
    0.05: 21.03,
    0.025: 23.34,
    0.01: 26.22,
    0.005: 28.3
  },
  13: {
    0.995: 3.57,
    0.99: 4.11,
    0.975: 5.01,
    0.95: 5.89,
    0.9: 7.04,
    0.5: 12.34,
    0.1: 19.81,
    0.05: 22.36,
    0.025: 24.74,
    0.01: 27.69,
    0.005: 29.82
  },
  14: {
    0.995: 4.07,
    0.99: 4.66,
    0.975: 5.63,
    0.95: 6.57,
    0.9: 7.79,
    0.5: 13.34,
    0.1: 21.06,
    0.05: 23.68,
    0.025: 26.12,
    0.01: 29.14,
    0.005: 31.32
  },
  15: {
    0.995: 4.6,
    0.99: 5.23,
    0.975: 6.27,
    0.95: 7.26,
    0.9: 8.55,
    0.5: 14.34,
    0.1: 22.31,
    0.05: 25,
    0.025: 27.49,
    0.01: 30.58,
    0.005: 32.8
  },
  16: {
    0.995: 5.14,
    0.99: 5.81,
    0.975: 6.91,
    0.95: 7.96,
    0.9: 9.31,
    0.5: 15.34,
    0.1: 23.54,
    0.05: 26.3,
    0.025: 28.85,
    0.01: 32,
    0.005: 34.27
  },
  17: {
    0.995: 5.7,
    0.99: 6.41,
    0.975: 7.56,
    0.95: 8.67,
    0.9: 10.09,
    0.5: 16.34,
    0.1: 24.77,
    0.05: 27.59,
    0.025: 30.19,
    0.01: 33.41,
    0.005: 35.72
  },
  18: {
    0.995: 6.26,
    0.99: 7.01,
    0.975: 8.23,
    0.95: 9.39,
    0.9: 10.87,
    0.5: 17.34,
    0.1: 25.99,
    0.05: 28.87,
    0.025: 31.53,
    0.01: 34.81,
    0.005: 37.16
  },
  19: {
    0.995: 6.84,
    0.99: 7.63,
    0.975: 8.91,
    0.95: 10.12,
    0.9: 11.65,
    0.5: 18.34,
    0.1: 27.2,
    0.05: 30.14,
    0.025: 32.85,
    0.01: 36.19,
    0.005: 38.58
  },
  20: {
    0.995: 7.43,
    0.99: 8.26,
    0.975: 9.59,
    0.95: 10.85,
    0.9: 12.44,
    0.5: 19.34,
    0.1: 28.41,
    0.05: 31.41,
    0.025: 34.17,
    0.01: 37.57,
    0.005: 40
  },
  21: {
    0.995: 8.03,
    0.99: 8.9,
    0.975: 10.28,
    0.95: 11.59,
    0.9: 13.24,
    0.5: 20.34,
    0.1: 29.62,
    0.05: 32.67,
    0.025: 35.48,
    0.01: 38.93,
    0.005: 41.4
  },
  22: {
    0.995: 8.64,
    0.99: 9.54,
    0.975: 10.98,
    0.95: 12.34,
    0.9: 14.04,
    0.5: 21.34,
    0.1: 30.81,
    0.05: 33.92,
    0.025: 36.78,
    0.01: 40.29,
    0.005: 42.8
  },
  23: {
    0.995: 9.26,
    0.99: 10.2,
    0.975: 11.69,
    0.95: 13.09,
    0.9: 14.85,
    0.5: 22.34,
    0.1: 32.01,
    0.05: 35.17,
    0.025: 38.08,
    0.01: 41.64,
    0.005: 44.18
  },
  24: {
    0.995: 9.89,
    0.99: 10.86,
    0.975: 12.4,
    0.95: 13.85,
    0.9: 15.66,
    0.5: 23.34,
    0.1: 33.2,
    0.05: 36.42,
    0.025: 39.36,
    0.01: 42.98,
    0.005: 45.56
  },
  25: {
    0.995: 10.52,
    0.99: 11.52,
    0.975: 13.12,
    0.95: 14.61,
    0.9: 16.47,
    0.5: 24.34,
    0.1: 34.28,
    0.05: 37.65,
    0.025: 40.65,
    0.01: 44.31,
    0.005: 46.93
  },
  26: {
    0.995: 11.16,
    0.99: 12.2,
    0.975: 13.84,
    0.95: 15.38,
    0.9: 17.29,
    0.5: 25.34,
    0.1: 35.56,
    0.05: 38.89,
    0.025: 41.92,
    0.01: 45.64,
    0.005: 48.29
  },
  27: {
    0.995: 11.81,
    0.99: 12.88,
    0.975: 14.57,
    0.95: 16.15,
    0.9: 18.11,
    0.5: 26.34,
    0.1: 36.74,
    0.05: 40.11,
    0.025: 43.19,
    0.01: 46.96,
    0.005: 49.65
  },
  28: {
    0.995: 12.46,
    0.99: 13.57,
    0.975: 15.31,
    0.95: 16.93,
    0.9: 18.94,
    0.5: 27.34,
    0.1: 37.92,
    0.05: 41.34,
    0.025: 44.46,
    0.01: 48.28,
    0.005: 50.99
  },
  29: {
    0.995: 13.12,
    0.99: 14.26,
    0.975: 16.05,
    0.95: 17.71,
    0.9: 19.77,
    0.5: 28.34,
    0.1: 39.09,
    0.05: 42.56,
    0.025: 45.72,
    0.01: 49.59,
    0.005: 52.34
  },
  30: {
    0.995: 13.79,
    0.99: 14.95,
    0.975: 16.79,
    0.95: 18.49,
    0.9: 20.6,
    0.5: 29.34,
    0.1: 40.26,
    0.05: 43.77,
    0.025: 46.98,
    0.01: 50.89,
    0.005: 53.67
  },
  40: {
    0.995: 20.71,
    0.99: 22.16,
    0.975: 24.43,
    0.95: 26.51,
    0.9: 29.05,
    0.5: 39.34,
    0.1: 51.81,
    0.05: 55.76,
    0.025: 59.34,
    0.01: 63.69,
    0.005: 66.77
  },
  50: {
    0.995: 27.99,
    0.99: 29.71,
    0.975: 32.36,
    0.95: 34.76,
    0.9: 37.69,
    0.5: 49.33,
    0.1: 63.17,
    0.05: 67.5,
    0.025: 71.42,
    0.01: 76.15,
    0.005: 79.49
  },
  60: {
    0.995: 35.53,
    0.99: 37.48,
    0.975: 40.48,
    0.95: 43.19,
    0.9: 46.46,
    0.5: 59.33,
    0.1: 74.4,
    0.05: 79.08,
    0.025: 83.3,
    0.01: 88.38,
    0.005: 91.95
  },
  70: {
    0.995: 43.28,
    0.99: 45.44,
    0.975: 48.76,
    0.95: 51.74,
    0.9: 55.33,
    0.5: 69.33,
    0.1: 85.53,
    0.05: 90.53,
    0.025: 95.02,
    0.01: 100.42,
    0.005: 104.22
  },
  80: {
    0.995: 51.17,
    0.99: 53.54,
    0.975: 57.15,
    0.95: 60.39,
    0.9: 64.28,
    0.5: 79.33,
    0.1: 96.58,
    0.05: 101.88,
    0.025: 106.63,
    0.01: 112.33,
    0.005: 116.32
  },
  90: {
    0.995: 59.2,
    0.99: 61.75,
    0.975: 65.65,
    0.95: 69.13,
    0.9: 73.29,
    0.5: 89.33,
    0.1: 107.57,
    0.05: 113.14,
    0.025: 118.14,
    0.01: 124.12,
    0.005: 128.3
  },
  100: {
    0.995: 67.33,
    0.99: 70.06,
    0.975: 74.22,
    0.95: 77.93,
    0.9: 82.36,
    0.5: 99.33,
    0.1: 118.5,
    0.05: 124.34,
    0.025: 129.56,
    0.01: 135.81,
    0.005: 140.17
  }
}


/**
 * [Bayesian Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
 * This is a naïve bayesian classifier that takes singly-nested objects.
 * @example
 * var bayes = new BayesianClassifier();
 * bayes.train({
 *   species: 'Cat'
 * }, 'animal');
 * var result = bayes.score({
 *   species: 'Cat'
 * })
 * // result
 * // {
 * //   animal: 1
 * // }
 */
class BayesianClassifier {
  /*:: totalCount: number */
  /*:: data: Object */
  constructor() {
    // The number of items that are currently
    // classified in the model
    this.totalCount = 0;
    // Every item classified in the model
    this.data = {};
  }

  /**
   * Train the classifier with a new item, which has a single dimension of Javascript literal keys and values.
   * @param {Object} item an object with singly-deep properties
   * @param {string} category the category this item belongs to
   * @return {undefined} adds the item to the classifier
   */
  Train(item, category) {
    if (!this.data[category]) this.data[category] = {};  // If the data object doesn't have any values for this category, create a new object for it.

    // Iterate through each key in the item.
    for(const k in item) {
      const v = item[k];
      // Initialize the nested object `data[category][k][item[k]]` with an object of keys that equal 0.
      if (this.data[category][k] === undefined) this.data[category][k] = {};
      if (this.data[category][k][v] === undefined) this.data[category][k][v] = 0;

      // And increment the key for this key/value combination.
      this.data[category][k][v]++;
    }

    // Increment the number of items classified
    this.totalCount++;
  }

  /**
   * Generate a score of how well this item matches all possible categories based on its attributes
   * @param {Object} item an item in the same format as with train
   * @returns {Object} of probabilities that this item belongs to a given category.
   */
  Score(item) {
    const odds = {};
    let category;
    for(const k in item) {
      const v = item[k];
      for (category in this.data) {
        odds[category] = {}   // Create an empty object for storing key - value combinations for this category.

        // If this item doesn't even have a property, it counts for nothing, but if it does have the property that we're looking for from
        // the item to categorize, it counts based on how popular it is versus the whole population.
        if (this.data[category][k]) {
          odds[category][k + "_" + v] = (this.data[category][k][v] || 0) / this.totalCount;
        } else {
          odds[category][k + "_" + v] = 0;
        }
      }
    }

    // Tally all of the odds for each category-combination pair - the non-existence of a category does not add anything to the score.
    const oddsSums = {};
    for(category in odds) {
      oddsSums[category] = 0;
      for (const combination in odds[category]) {
        oddsSums[category] += odds[category][combination];
      }
    }
    return oddsSums;
  }
  
}


