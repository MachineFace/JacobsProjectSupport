/**
 * --------------------------------------------------------------------------------------------------------------
 * Statistics Class for Boiler Plate Functions
 */
class StatisticsService {
  constructor() {

  }

  /**
   * -------------------------------------------------------------------------------------------------------------
   * Properties
   */

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
  static get ChiSquaredDistributionTable() {
    return {
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
  }

  /**
   * We use `ε`, epsilon, as a stopping criterion when we want to iterate until we're "close enough". 
   * Epsilon is a very small number: for simple statistics, that number is **0.0001**
   *
   * This is used in calculations like the binomialDistribution, in which the process of finding a value is 
   * [iterative](https://en.wikipedia.org/wiki/Iterative_method): it progresses until it is close enough.
   *
   * Example of using epsilon in [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent),
   * where we're trying to find a local minimum of a function's derivative,
   * given by the `fDerivative` method.
   *
   * @example
   * while (Math.abs(x_new - x_old) > ss.epsilon) {
   *   x_old = x_new;
   *   x_new = x_old - stepSize * fDerivative(x_old);
   * }
   *
   * console.log('Local minimum occurs at', x_new);
   */
  static get Epsilon() {
    return 0.0001;
  }

  /**
   * Standard Normal Table, also called the unit normal table or Z table,
   * is a mathematical table for the values of Φ (phi), which are the values of
   * the [cumulative distribution function](https://en.wikipedia.org/wiki/Normal_distribution#Cumulative_distribution_function)
   * of the normal distribution. It is used to find the probability that a
   * statistic is observed below, above, or between values on the standard
   * normal distribution, and by extension, any normal distribution.
   */
  static get StandardNormalTable() {
    const cumulativeDistribution = (z) => {
      // 15 iterations are enough for 4-digit precision
      let sum = z;
      for (let i = 1; i < 15; i++) {
        let tmp = z;
        tmp *= (z * z) / (2 * i + 1);
        sum += tmp;
      }
      const SQRT_2PI = Math.sqrt(2 * Math.PI);
      return ( Math.round((0.5 + (sum / SQRT_2PI) * Math.exp((-z * z) / 2)) * 1e4) / 1e4 );
    }
    const standardNormalTable = [];
    for (let z = 0; z <= 3.09; z += 0.01) {
      standardNormalTable.push(cumulativeDistribution(z));
    }
    standardNormalTable.sort((a,b) => a - b);
    return standardNormalTable;
  }

  /**
   * -------------------------------------------------------------------------------------------------------------
   * Static Methods
   */

  /**
   * When adding a new value to a list, one does not have to necessary recompute the mean of the list in linear time. 
   * Use this function to compute the new mean by providing the current mean, the number of elements 
   * in the list that produced it and the new value to add.
   *
   * @param {number} mean current mean
   * @param {number} n number of items in the list
   * @param {number} newValue the added value
   * @returns {number} the new mean
   *
   * @example
   * addToMean(14, 5, 53); // => 20.5
   */
  static AddToMean(mean = 0, n = 1, newValue = 0) {
    try {
      mean = mean ? Number(mean) : 0;
      n = n ? Number(n) : 1;
      newValue = newValue ? Number(newValue) : 0;
      const newMean = mean + (newValue - mean) / (n + 1);
      if(newMean == undefined) throw new Error(`Borked calc.`);
      return newMean;
    } catch(err) {
      console.error(`"AddToMean()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Approximate Equality.
   *
   * @param {number} actual The value to be tested.
   * @param {number} expected The reference value.
   * @param {number} tolerance The acceptable relative difference.
   * @return {boolean} Whether numbers are within tolerance.
   */
  static ApproxEqual(actual = 3.0, expected = 5.0, tolerance = StatisticsService.Epsilon) {
    return StatisticsService.RelativeError(actual, expected) <= tolerance;
  }

  /**
   * [Arithmetic Mean] (https://en.wikipedia.org/wiki/Central_tendency)
   * is the sum of all values over the number of values.
   * This is a measure of central tendency
   * a method of finding a typical or central value of a set of numbers.
   *
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   * @param {Array<number>} x sample of one or more data points
   * @returns {number} arithmetic mean
   */
  static ArithmeticMean(distribution = []) {
    try {
      const n = distribution.length;
      if(n == 0) return 0;

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
      let cells = [];
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
  static Bisect(func, start = 0, end = 99, maxIterations = 10, errorTolerance = StatisticsService.Epsilon) {
    try {
      if (typeof func !== "function") throw new TypeError("func must be a function");
      for(let i = 0; i < maxIterations; i++) {
        const output = (start + end) / 2;
        if (func(output) === 0 || Math.abs((end - start) / 2) < errorTolerance) return output;
        if (StatisticsService.SignFunction(func(output)) === StatisticsService.SignFunction(func(start))) start = output;
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
    return ( StatisticsService.ChiSquaredDistributionTable[degreesOfFreedom][significance] < chiSquared );
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
    try {
      if(array.length < 2) throw new Error(`Array must be n >= 2`)
      if (Math.floor(chunkSize) !== chunkSize && chunkSize < 1) throw new Error("Chunk size must be a positive integer");

      let output = new Array();
      for(let i = 0; i < array.length; i += chunkSize) {
        let chunk = array.slice(i, i + chunkSize);
        output.push(chunk);
      }
      return output;
    } catch(err) {
      console.error(`"Chunk()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Ckmeans Clustering](https://en.wikipedia.org/wiki/K-means_clustering) 
   * is an improvement on heuristic-based clustering approaches like Jenks. The algorithm was developed in
   * [Haizhou Wang and Mingzhou Song](http://journal.r-project.org/archive/2011-2/RJournal_2011-2_Wang+Song.pdf)
   * as a [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming) approach
   * to the problem of clustering numeric data into groups with the least
   * within-group sum-of-squared-deviations.
   *
   * Minimizing the difference within groups - what Wang & Song refer to as
   * `withinss`, or within sum-of-squares, means that groups are optimally
   * homogenous within and the data is split into representative groups.
   * This is very useful for visualization, where you may want to represent
   * a continuous variable in discrete color or style groups. This function
   * can provide groups that emphasize differences between data.
   *
   * Being a dynamic approach, this algorithm is based on two matrices that
   * store incrementally-computed values for squared deviations and backtracking
   * indexes.
   *
   * This implementation is based on Ckmeans 3.4.6, which introduced a new divide
   * and conquer approach that improved runtime from O(kn^2) to O(kn log(n)).
   *
   * Unlike the [original implementation](https://cran.r-project.org/web/packages/Ckmeans.1d.dp/index.html),
   * this implementation does not include any code to automatically determine
   * the optimal number of clusters: this information needs to be explicitly
   * provided.
   *
   * ### References
   * _Ckmeans.1d.dp: Optimal k-means Clustering in One Dimension by Dynamic
   * Programming_ Haizhou Wang and Mingzhou Song ISSN 2073-4859
   *
   * from The R Journal Vol. 3/2, December 2011
   * @param {Array<number>} x input data, as an array of number values
   * @param {number} nClusters number of desired classes. This cannot be
   * greater than the number of values in the data array.
   * @returns {Array<Array<number>>} clustered input
   * @throws {Error} if the number of requested clusters is higher than the size of the data
   * @example
   * ckmeans([-1, 2, -1, 2, 4, 5, 6, -1, 2, -1], 3);
   * // The input, clustered into groups of similar numbers.
   * //= [[-1, -1, -1, -1], [2, 2, 2], [4, 5, 6]]);
   */
  static CK_Means(numbers = [], nClusters = 2) {
    try {
      if (nClusters > numbers.length) throw new Error(`Cannot generate more classes than there are data values`);

      // Function that generates incrementally computed values based on the sums and sums of squares for the data array
      const ssq = (j, i, sums, sumsOfSquares) => {
        let sji; // s(j, i)
        if (j > 0) {
          const muji = (sums[i] - sums[j - 1]) / (i - j + 1); // mu(j, i)
          sji = sumsOfSquares[i] - sumsOfSquares[j - 1] - (i - j + 1) * muji * muji;
        } else {
          sji = sumsOfSquares[i] - (sums[i] * sums[i]) / (i + 1);
        }
        if (sji < 0) return 0;
        return sji;
      }
      // Function that recursively divides and conquers computations for cluster j
      const fillMatrixColumn = (iMin, iMax, cluster, matrix, backtrackMatrix, sums, sumsOfSquares) => {
        if (iMin > iMax) return;
        
        const i = Math.floor((iMin + iMax) / 2); // Start at midpoint between iMin and iMax

        matrix[cluster][i] = matrix[cluster - 1][i - 1];
        backtrackMatrix[cluster][i] = i;

        let jlow = cluster; // the lower end for j

        if (iMin > cluster) jlow = Math.max(jlow, backtrackMatrix[cluster][iMin - 1] || 0);
        jlow = Math.max(jlow, backtrackMatrix[cluster - 1][i] || 0);

        let jhigh = i - 1; // the upper end for j
        if (iMax < matrix[0].length - 1) jhigh = Math.min(jhigh, backtrackMatrix[cluster][iMax + 1] || 0);

        for (let j = jhigh; j >= jlow; --j) {
          let sji = ssq(j, i, sums, sumsOfSquares);
          if (sji + matrix[cluster - 1][jlow - 1] >= matrix[cluster][i]) break;

          // Examine the lower bound of the cluster border
          let sjlowi = ssq(jlow, i, sums, sumsOfSquares);
          let ssqjlow = sjlowi + matrix[cluster - 1][jlow - 1];

          if (ssqjlow < matrix[cluster][i]) {
            // Shrink the lower bound
            matrix[cluster][i] = ssqjlow;
            backtrackMatrix[cluster][i] = jlow;
          }
          jlow++;

          let ssqj = sji + matrix[cluster - 1][j - 1];
          if (ssqj < matrix[cluster][i]) {
            matrix[cluster][i] = ssqj;
            backtrackMatrix[cluster][i] = j;
          }
        }

        fillMatrixColumn(iMin, i - 1, cluster, matrix, backtrackMatrix, sums, sumsOfSquares );
        fillMatrixColumn(i + 1, iMax, cluster, matrix, backtrackMatrix, sums, sumsOfSquares );
      }
      // Initializes the main matrices used in Ckmeans and kicks off the divide and conquer cluster computation strategy
      const fillMatrices = (data, matrix, backtrackMatrix) => {
        const nValues = matrix[0].length;
        const shift = data[Math.floor(nValues / 2)];  // Shift values by the median to improve numeric stability


        const sums = [];
        const sumsOfSquares = [];

        // Initialize first column in matrix & backtrackMatrix
        for (let i = 0, shiftedValue; i < nValues; ++i) {
          shiftedValue = data[i] - shift;
          if (i === 0) {
            sums.push(shiftedValue);
            sumsOfSquares.push(shiftedValue * shiftedValue);
          } else {
            sums.push(sums[i - 1] + shiftedValue);
            sumsOfSquares.push(sumsOfSquares[i - 1] + shiftedValue * shiftedValue);
          }

          // Initialize for cluster = 0
          matrix[0][i] = ssq(0, i, sums, sumsOfSquares);
          backtrackMatrix[0][i] = 0;
        }

        // Initialize the rest of the columns
        let iMin;
        for (let cluster = 1; cluster < matrix.length; ++cluster) {
          if (cluster < matrix.length - 1) iMin = cluster;
          else iMin = nValues - 1;  // No need to compute matrix[K-1][0] ... matrix[K-1][N-2]

          fillMatrixColumn(
            iMin,
            nValues - 1,
            cluster,
            matrix,
            backtrackMatrix,
            sums,
            sumsOfSquares,
          );
        }
      }

      const sorted = StatisticsService.NumericSort(numbers);
      const uniqueCount = StatisticsService.CountUnique(sorted);
      if (uniqueCount === 1) return [sorted];  // if all of the input values are identical, there's one cluster with all of the input in it.

      const matrix = StatisticsService.Matrix(nClusters, sorted.length);
      const backtrackMatrix = StatisticsService.Matrix(nClusters, sorted.length);

      // This is a dynamic programming way to solve the problem of minimizing
      // within-cluster sum of squares. It's similar to linear regression
      // in this way, and this calculation incrementally computes the
      // sum of squares that are later read.
      fillMatrices(sorted, matrix, backtrackMatrix);

      // The real work of Ckmeans clustering happens in the matrix generation:
      // the generated matrices encode all possible clustering combinations, and
      // once they're generated we can solve for the best clustering groups
      // very quickly.
      let clusters = [];
      let clusterRight = backtrackMatrix[0].length - 1;

      // Backtrack the clusters from the dynamic programming matrix. This
      // starts at the bottom-right corner of the matrix (if the top-left is 0, 0),
      // and moves the cluster target with the loop.
      for (let cluster = backtrackMatrix.length - 1; cluster >= 0; cluster--) {
        const clusterLeft = backtrackMatrix[cluster][clusterRight];

        // fill the cluster from the sorted input by taking a slice of the
        // array. the backtrack matrix makes this easy - it stores the
        // indexes where the cluster should start and end.
        clusters[cluster] = sorted.slice(clusterLeft, clusterRight + 1);

        if (cluster > 0) clusterRight = clusterLeft - 1;
      }
      return clusters;
    } catch(err) {
      console.error(`"CK_Means()" failed: ${err}`);
      return 1;
    }
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
    try {
      const stdDev = StatisticsService.StandardDeviation(array);
      const mean = StatisticsService.ArithmeticMean(array);
      return stdDev / mean;
    } catch(err) {
      console.error(`"CoefficientOfVariation()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * When combining two lists of values with known means, you do not have to recompute the mean of the combined lists in linear time. 
   * Instead, use this function to compute the combined mean by providing the mean & number of values of the first list and the mean & number of values of the second list.
   *
   * @param {number} mean1 mean of the first list
   * @param {number} n1 number of items in the first list
   * @param {number} mean2 mean of the second list
   * @param {number} n2 number of items in the second list
   * @returns {number} the combined mean
   *
   * @example
   * combineMeans(5, 3, 4, 3); // => 4.5
   */
  static Combine_Means(mean1 = 1, n1 = 10, mean2 = 1, n2 = 10) {
    try {
      mean1 = mean1 ? Number(mean1) : 1;
      n1 = n1 ? Number(n1) : 10;
      mean2 = mean2 ? Number(mean2) : 1;
      n2 = n2 ? Number(n2) : 10;
      return (mean1 * n1 + mean2 * n2) / (n1 + n2);
    } catch(err) {
      console.error(`"Combine_Means()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * When combining two lists of values for which one already knows the variances,
   * one does not have to necessary recompute the variance of the combined lists
   * in linear time. They can instead use this function to compute the combined
   * variance by providing the variance, mean & number of values of the first list
   * and the variance, mean & number of values of the second list.
   *
   * @since 3.0.0
   * @param {number} variance1 variance of the first list
   * @param {number} mean1 mean of the first list
   * @param {number} n1 number of items in the first list
   * @param {number} variance2 variance of the second list
   * @param {number} mean2 mean of the second list
   * @param {number} n2 number of items in the second list
   * @returns {number} the combined mean
   *
   * @example
   * combineVariances(14 / 3, 5, 3, 8 / 3, 4, 3); // => 47 / 12
   */
  static Combine_Variances(variance1 = 1, mean1 = 1, n1 = 10, variance2 = 1, mean2 = 1, n2 = 10) {
    const newMean = StatisticsService.Combine_Means(mean1, n1, mean2, n2);
    return (
      (n1 * (variance1 + Math.pow(mean1 - newMean, 2)) +
       n2 * (variance2 + Math.pow(mean2 - newMean, 2))) /
      (n1 + n2)
    );
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
      const length = numbers.length;
      let combinationList = [];
      for(let i = 0; i < length; i++) {
        if(partitionSize === 1) combinationList.push([numbers[i]]);
        else {
          let subsetCombinations = StatisticsService.Combinations(numbers.slice(i + 1, length), partitionSize - 1);
          for(let j = 0; j < subsetCombinations.length; j++) {
            let next = subsetCombinations[j];
            next.unshift(numbers[i]);
            combinationList.push(next);
          }
        }
      }
      // console.info(`Combinations: ${combinationList}`);
      return combinationList;
    } catch(err) {
      console.error(`"Combinations()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Combinations with Replacement](https://en.wikipedia.org/wiki/Combination) with replacement
   * Combinations are unique subsets of a collection - in this case, k x from a collection at a time.
   * 'With replacement' means that a given element can be chosen multiple times.
   * Unlike permutation, order doesn't matter for combinations.
   *
   * @param {Array} x any type of data
   * @param {int} k the number of objects in each group (without replacement)
   * @returns {Array<Array>} array of permutations
   * @example
   * CombinationsWithReplacement([1, 2], 2); // => [[1, 1], [1, 2], [2, 2]]
   */
  static CombinationsWithReplacement(array = [], k = 1) {
    try {
      const combinationList = [];

      for (let i = 0; i < array.length; i++) {
        if (k === 1) {
            // If we're requested to find only one element, we don't need to recurse: just push `array[i]` onto the list of combinations.
            combinationList.push([array[i]]);
        } else {
            // Otherwise, recursively find combinations, given `k - 1`. Note that we request `k - 1`, so if you were looking for k = 3 combinations, we're
            // requesting k=2. This -1 gets reversed in the for loop right after this code, since we concatenate `array[i]` onto the selected combinations,
            // bringing `k` back up to your requested level.
            // This recursion may go many levels deep, since it only stops once k = 1.
            const chunk = array.slice(i, array.length);
            const subsetCombinations = StatisticsService.CombinationsWithReplacement(chunk, k - 1);

            for (let j = 0; j < subsetCombinations.length; j++) {
              combinationList.push([ array[i]].concat(subsetCombinations[j], ));
            }
        }
      }
      // console.info(`Combinations: ${combinationList}`);
      return combinationList;
    } catch(err) {
      console.error(`"CombinationsWithReplacement()" failed: ${err}`);
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
  static CumulativeStdNormalProbability(z = 0.5) {
    try {
      const standardNormalTable = [...StatisticsService.StandardNormalTable];
      const absZ = Math.abs(z);  // Calculate the position of this value.
      // Each row begins with a different significant digit: 0.5, 0.6, 0.7, and so on. 
      // Each value in the table corresponds to a range of 0.01 in the input values, so the value is multiplied by 100.
      const index = Math.min(Math.round(absZ * 100), standardNormalTable.length - 1);

      // The index we calculate must be in the table as a positive value, but we still pay attention to 
      // whether the input is positive or negative, and flip the output value as a last step.
      if (z >= 0) return standardNormalTable[index];

      // due to floating-point arithmetic, values in the table with 4 significant figures 
      // can nevertheless end up as repeating fractions when they're computed here.
      const cumulative = Math.round((1 - standardNormalTable[index]) * 1e4) / 1e4;
      console.info(`Cumulative Standard Normal Probability: ${cumulative}`);
      return cumulative;
    } catch(err) {
      console.error(`"CumulativeStdNormalProbability()" failed: ${err}`);
      return 1;
    }
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
        // Use Euler's reflection formula for negative inputs see:  https://en.wikipedia.org/wiki/Gamma_function#Properties
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
      if(numbers.length < 1) return 0;

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
   * [Simple Random Sample](http://en.wikipedia.org/wiki/Simple_random_sample)
   *
   * The sampled values will be in any order, not necessarily the order
   * they appear in the input. Shuffle the original array using a fisher-yates shuffle.
   *
   * @param {Array<any>} x input array. can contain any type
   * @param {number} n count of how many elements to take
   * @param {Function} [randomSource=Math.random] an optional entropy source that
   * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
   * @return {Array} subset of n elements in original array
   *
   * @example
   * var values = [1, 2, 4, 5, 6, 7, 8, 9];
   * sample(values, 3); // returns 3 random values, like [2, 5, 8];
   */
  static GetRandomSample(array = [], n = 1, randomSource = Math.random) {
    const shuffled = StatisticsService.Shuffle(array, randomSource);
    return shuffled.slice(0, n);
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
      if(numbers.length < 1) return 0;
      if(numbers.length == 1) return numbers[0];
      
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
  static InterquartileRange(numbers = []) {
    // Interquartile range is the span between the upper quartile, at `0.75`, and lower quartile, `0.25`
    const q1 = StatisticsService.Quantile(numbers, 0.75);
    const q2 = StatisticsService.Quantile(numbers, 0.25);
    if (typeof q1 === "number" && typeof q2 === "number") return q1 - q2;
  }

  /**
   * **[Jenks Natural Breaks Optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)**
   * is an algorithm commonly used in cartography and visualization to decide upon groupings of data values that 
   * minimize variance within themselves and maximize variation between themselves.
   *
   * For instance, cartographers often use jenks in order to choose which values are assigned to which colors 
   * in a [choropleth](https://en.wikipedia.org/wiki/Choropleth_map) map.
   *
   * @param {Array<number>} data input data, as an array of number values
   * @param {number} nClasses number of desired classes
   * @returns {Array<number>} array of class break positions
   * // split data into 3 break points
   * jenks([1, 2, 4, 5, 7, 9, 10, 20], 3) // = [1, 7, 20, 20]
   */
  static Jenks(data = [], nClasses = 2) {
    if (nClasses > data.length) return null;

    // Pull Breaks Values for Jenks. the second part of the jenks recipe: take the calculated matrices and derive an array of n breaks.
    const JenksBreaks = (data, lowerClassLimits, nClasses) => {
      let k = data.length;
      let kclass = [];
      let countNum = nClasses;

      // the calculation of classes will never include the upper bound, so we need to explicitly set it
      kclass[nClasses] = data[data.length - 1];

      // the lowerClassLimits matrix is used as indices into itself here: the `k` variable is reused in each iteration.
      while (countNum > 0) {
        kclass[countNum - 1] = data[lowerClassLimits[k][countNum] - 1];
        k = lowerClassLimits[k][countNum] - 1;
        countNum--;
      }
      return kclass;
    }

    // Compute the matrices required for Jenks breaks. These matrices can be used for any classing of data with `classes <= nClasses`
    const JenksMatrices = (data, nClasses) => {
      let lowerClassLimits = [];
      let varianceCombinations = [];

      let variance = 0;
      for (let i = 0; i < data.length + 1; i++) {
          let tmp1 = [];
          let tmp2 = [];
          for (let j = 0; j < nClasses + 1; j++) {
            tmp1.push(0);
            tmp2.push(0);
          }
          lowerClassLimits.push(tmp1);
          varianceCombinations.push(tmp2);
      }

      for (let i = 1; i < nClasses + 1; i++) {
          lowerClassLimits[1][i] = 1;
          varianceCombinations[1][i] = 0;
          // in the original implementation, 9999999 is used but since Javascript has `Infinity`, we use that.
          for (let j = 2; j < data.length + 1; j++) {
            varianceCombinations[j][i] = Number.POSITIVE_INFINITY;
          }
      }

      for (let i = 2; i < data.length + 1; i++) {
        let sum = 0;
        let sumSquares = 0;
        let w = 0;

        for (let m = 1; m < i + 1; m++) {
          const lowerClassLimit = i - m + 1;
          const val = data[lowerClassLimit - 1];

          // here we're estimating variance for each potential classing of the data, for each potential 
          // number of classes. `w` is the number of data points considered so far.
          w++;

          // increase the current sum and sum-of-squares
          sum += val;
          sumSquares += val * val;

          // the variance at this point in the sequence is the difference
          // between the sum of squares and the total x 2, over the number
          // of samples.
          variance = sumSquares - (sum * sum) / w;

          let i4 = lowerClassLimit - 1;

          if (i4 !== 0) {
            for (let j = 2; j < nClasses + 1; j++) {
              // if adding this element to an existing class will increase its variance beyond the limit, break
              // the class at this point, setting the `lowerClassLimit` at this point.
              if(varianceCombinations[i][j] >= variance + varianceCombinations[i4][j - 1]) {
                lowerClassLimits[i][j] = lowerClassLimit;
                varianceCombinations[i][j] = variance + varianceCombinations[i4][j - 1];
              }
            }
          }
        }

        lowerClassLimits[i][1] = 1;
        varianceCombinations[i][1] = variance;
      }

      // return the two matrices. for just providing breaks, only lowerClassLimits` is needed, 
      // but variances can be useful to evaluate goodness of fit.
      return {
        lowerClassLimits: lowerClassLimits,
        varianceCombinations: varianceCombinations
      }
    }

    // sort data in numerical order, since this is expected by the matrices function
    data = data
      .slice()
      .sort((a, b) => a - b);

    const matrices = JenksMatrices(data, nClasses);
    const lowerClassLimits = matrices.lowerClassLimits;

    // extract nClasses out of the computed matrices
    const breaks = JenksBreaks(data, lowerClassLimits, nClasses);
    return breaks;
  }

  /**
   * [K-Means Clustering](https://en.wikipedia.org/wiki/K-means_clustering)
   *
   * @param {Array<Array<number>>} points N-dimensional coordinates of points to be clustered.
   * @param {number} numCluster How many clusters to create.
   * @param {Function} randomSource An optional entropy source that generates uniform values in [0, 1).
   * @return {kMeansReturn} Labels (same length as data) and centroids (same length as numCluster).
   * @throws {Error} If any centroids wind up friendless (i.e., without associated points).
   *
   * @example
   * kMeansCluster([[0.0, 0.5], [1.0, 0.5]], 2); // => {labels: [0, 1], centroids: [[0.0, 0.5], [1.0 0.5]]}
   */
  static K_Means_Cluster(points, numCluster = 2, randomSource = Math.random) {
    // const nonRNG = () => 1.0 - StatisticsService.Epsilon;
    // Label each point according to which centroid it is closest to.
    const LabelPoints = (points, centroids) => {
      return points.map((p) => {
        let minDist = Number.MAX_VALUE;
        let label = -1;
        for (let i = 0; i < centroids.length; i++) {
          const dist = StatisticsService.EuclideanDistance(p, centroids[i]);
          if (dist < minDist) {
            minDist = dist;
            label = i;
          }
        }
        return label;
      });
    }

    // Calculate centroids for points given labels.
    const CalculateCentroids = (points, labels, numCluster) => {
      let dimension = points[0].length;
      let centroids = StatisticsService.Matrix(numCluster, dimension);
      let counts = Array(numCluster).fill(0);

      // Add points to centroids' accumulators and count points per centroid.
      let numPoints = points.length;
      for (let i = 0; i < numPoints; i++) {
        let point = points[i];
        let label = labels[i];
        let current = centroids[label];
        for (let j = 0; j < dimension; j++) {
          current[j] += point[j];
        }
        counts[label] += 1;
      }

      // Rescale centroids, checking for any that have no points.
      for (let i = 0; i < numCluster; i++) {
        if (counts[i] === 0) throw new Error(`Centroid ${i} has no friends`);
        let centroid = centroids[i];
        for (let j = 0; j < dimension; j++) {
          centroid[j] /= counts[i];
        }
      }
      return centroids;
    }

    // Calculate the difference between old centroids and new centroids.
    const CalculateChange = (left, right) => {
      let total = 0;
      for (let i = 0; i < left.length; i++) {
        total += StatisticsService.EuclideanDistance(left[i], right[i]);
      }
      return total;
    }
    
    try {
      let newCentroids = StatisticsService.Sample(points, numCluster, randomSource);
      let labels = null;
      let change = Number.MAX_VALUE;
      while (change !== 0) {
        labels = LabelPoints(points, newCentroids);
        let oldCentroids = newCentroids;
        newCentroids = CalculateCentroids(points, labels, numCluster);
        change = CalculateChange(newCentroids, oldCentroids);
      }
      return {
        labels : labels,
        centroids : newCentroids,
      }
    } catch(err) {
      console.error(`"K_Means_Cluster()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Kernel Density Estimation](https://en.wikipedia.org/wiki/Kernel_density_estimation)
   * is a useful tool for estimating the shape of the underlying probability distribution from a sample.
   * @param X sample values
   * @param kernel The kernel function to use. If a function is provided, it should return non-negative values and integrate to 1. Defaults to 'gaussian'.
   * @param bandwidthMethod The "bandwidth selection" method to use, or a fixed bandwidth value. Defaults to "nrd", 
   * ["Normal Reference Distribution" rule-of-thumb](https://stat.ethz.ch/R-manual/R-devel/library/MASS/html/bandwidth.nrd.html).
   * @returns {Function} An estimated [probability density function](https://en.wikipedia.org/wiki/Probability_density_function) for the given sample. The returned function runs in `O(X.length)`.
   * a commonly used version of [Silverman's rule-of-thumb](https://en.wikipedia.org/wiki/Kernel_density_estimation#A_rule-of-thumb_bandwidth_estimator).
   */
  static Kernel_Density_Estimation(array = [], estimate = 0) {

    // [Well-known kernels](https://en.wikipedia.org/wiki/Kernel_(statistics)#Kernel_functions_in_common_use)
    const gaussian_kernels = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    
    // Well known bandwidth selection methods
    const NormalReferenceDistribution = (numbers = []) => {
      let s = StatisticsService.StandardDeviation(numbers);
      const iqr = StatisticsService.InterquartileRange(numbers);
      if (typeof iqr === "number") {
        s = Math.min(s, iqr / 1.34);
      }
      return 1.06 * s * Math.pow(numbers.length, -0.2);
    }
    
    const bandwidth = NormalReferenceDistribution(array);
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += gaussian_kernels((estimate - array[i]) / bandwidth);
    }
    return sum / bandwidth / array.length;
  }

  /**
   * [Kurtosis](http://en.wikipedia.org/wiki/Kurtosis)
   * A measure of the heaviness of a distribution's tails relative to its variance. 
   * The kurtosis value can be positive or negative, or even undefined.
   * 
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
   * Given the output of `linearRegression`: an object with `m` and `b` values indicating slope and intercept,
   * respectively, generate a line function that translates x values into y values.
   *
   * @param {Object} mb object with `m` and `b` members, representing
   * slope and intersect of desired line
   * @returns {Function} method that computes y-value at any given
   * x-value on the line.
   * @example
   * var l = linearRegressionLine(linearRegression([[0, 0], [1, 1]]));
   * l(0) // = 0
   * l(2) // = 2
   * linearRegressionLine({ b: 0, m: 1 })(1); // => 1
   * linearRegressionLine({ b: 1, m: 1 })(1); // => 2
   */
  static LinearRegressionLine(mb /*: { b: number, m: number }*/) {
    // Return a function that computes a `y` value for each x value it is given, based on the values of `b` and `a` that we just computed.
    return function (x) {
      return mb.b + mb.m * x;
    }
  }

  /**
   * [Log average](https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/Geometric_mean#Relationship_with_logarithms)
   * is an equivalent way of computing the geometric mean of an array suitable for large or small products.
   *
   * It's found by calculating the average logarithm of the elements and exponentiating.
   *
   * @param {Array<number>} x sample of one or more data points
   * @returns {number} geometric mean
   * @throws {Error} if x is empty
   * @throws {Error} if x contains a negative number
   */
  static LogAverage(numbers = []) {
    if (numbers.length === 0) throw new Error("logAverage requires at least one data point");

    let value = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] < 0) throw new Error(`Requires only non-negative numbers as input`);
      value += Math.log(numbers[i]);
    }

    return Math.exp(value / numbers.length);
  }

  /**
   * The [Logit](https://en.wikipedia.org/wiki/Logit)
   * is the inverse of cumulativeStdLogisticProbability,
   * and is also known as the logistic quantile function.
   *
   * @param {number} p
   * @returns {number} logit
   */
  static Logit(p = 2.0) {
    if (p <= 0 || p >= 1) throw new Error("p must be strictly between zero and one");
    return Math.log(p / (1 - p));
  }

  /**
   * Create a new column x row matrix.
   * @private
   * @param {number} columns
   * @param {number} rows
   * @return {Array<Array<number>>} matrix
   * @example
   * makeMatrix(10, 10);
   */
  static Matrix(columns = 10, rows = 10) {
    let matrix = [];
    for (let i = 0; i < columns; i++) {
      let column = [];
      for (let j = 0; j < rows; j++) {
        column.push(0);
      }
      matrix.push(column);
    }
    return matrix;
  }

  /**
   * Median Mean
   * @param {Array} numbers
   * @returns {number} Median
   */
  static Median(numbers = []) {
    try {
      if(numbers.length < 1) return 0;
      if(numbers.length == 1) return numbers[0];

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
   * The [Median Absolute Deviation](http://en.wikipedia.org/wiki/Median_absolute_deviation) is
   * a robust measure of statistical
   * dispersion. It is more resilient to outliers than the standard deviation.
   *
   * @param {Array<number>} x input array
   * @returns {number} median absolute deviation
   * @example
   * medianAbsoluteDeviation([1, 1, 2, 2, 4, 6, 9]); // => 1
   */
  static MedianAbsoluteDeviation(numbers = []) {
    const medianValue = StatisticsService.ArithmeticMean(numbers);

    // Make a list of absolute deviations from the median
    const medianAbsoluteDeviations = [...numbers.map(x => Math.abs(x - medianValue))];

    // Find the median value of that list
    const median = StatisticsService.ArithmeticMean(medianAbsoluteDeviations);
    return median;
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
   * [Mode](https://en.wikipedia.org/wiki/Mode_%28statistics%29) is the number that appears in a list the highest number of times.
   * There can be multiple modes in a list: in the event of a tie, this algorithm will return the most recently seen mode.
   *
   * This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
   * a method of finding a typical or central value of a set of numbers.
   *
   * @param {Array<*>} x a sample of one or more data points
   * @returns {?*} mode
   * @throws {ReferenceError} if the JavaScript environment doesn't support Map
   * @throws {Error} if x is empty
   * @example
   * modeFast(['rabbits', 'rabbits', 'squirrels']); // => 'rabbits'
   */
  static Mode(array = []) {
    if (array.length === 0) throw new Error(`"Mode()" requires at last one data point`);
    const index = new Map();  // This index will reflect the incidence of different values, indexing them like { value: count }

    let mode;
    let modeCount = 0;
    for (let i = 0; i < array.length; i++) {
      let newCount = index.get(array[i]);
      if (newCount === undefined) newCount = 1;
      else newCount++;
      if (newCount > modeCount) {
        mode = array[i];
        modeCount = newCount;
      }
      index.set(array[i], newCount);
    }
    return mode;
  }

  /**
   * Sort an array of numbers by their numeric value
   *
   * This is necessary because the default behavior of .sort
   * in JavaScript is to sort arrays as string values
   *
   *     [1, 10, 12, 102, 20].sort()
   *     // output
   *     [1, 10, 102, 12, 20]
   *
   * @param {Array<number>} x input array
   * @return {Array<number>} sorted (ascending) array
   * @private
   * @example
   * numericSort([3, 2, 1]) // => [1, 2, 3]
   */
  static NumericSort(numbers = []) {
    return numbers
      .slice()
      .sort((a, b) => Number(a) - Number(b));
  }

  /**
   * The [Poisson Distribution](http://en.wikipedia.org/wiki/Poisson_distribution)
   * is a discrete probability distribution that expresses the probability
   * of a given number of events occurring in a fixed interval of time
   * and/or space if these events occur with a known average rate and
   * independently of the time since the last event.
   *
   * The Poisson Distribution is characterized by the strictly positive
   * mean arrival or occurrence rate, `λ`.
   *
   * @param {number} lambda location poisson distribution
   * @returns {number[]} values of poisson distribution at that point
   */
  static PoissonDistribution(lambda = 2.0) /*: ?number[] */ {  
    if (lambda <= 0) return undefined; // Check that lambda is strictly positive

    let x = 0;
    let cumulativeProbability = 0;  // and we keep track of the current cumulative probability, in order to know when to stop calculating chances.
    
    const cells = []; // the calculated cells to be returned
    let factorialX = 1;

    // This algorithm iterates through each potential outcome, until the `cumulativeProbability` is very close to 1, at
    // which point we've defined the vast majority of outcomes
    while (cumulativeProbability < 1 - StatisticsService.Epsilon) {
      cells[x] = (Math.exp(-lambda) * Math.pow(lambda, x)) / factorialX;  // [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
      cumulativeProbability += cells[x];
      x++;
      factorialX *= x;  // when the cumulativeProbability is nearly 1, we've calculated the useful range of this distribution
    }

    return cells;
  }

  /**
   * [Probit](http://en.wikipedia.org/wiki/Probit)
   * is the inverse of CumulativeStdNormalProbability(),
   * and is also known as the normal quantile function.
   *
   * It returns the number of standard deviations from the mean where the p'th quantile 
   * of values can be found in a normal distribution.
   * So, for example, probit(0.5 + 0.6827/2) ≈ 1 because 68.27% of values are
   * normally found within 1 standard deviation above or below the mean.
   *
   * @param {number} p
   * @returns {number} probit
   */
  static Probit(p = 1) {
    try {
      if (p <= 0) p = StatisticsService.Epsilon;
      else if (p >= 1) p = 1 - StatisticsService.Epsilon;
      return Math.sqrt(2) * StatisticsService.InverseErrorFunction(2 * p - 1);
    } catch(err) {
      console.error(`"Probit()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * [Product](https://en.wikipedia.org/wiki/Product_(mathematics)) of an array
   * is the result of multiplying all numbers together, starting using one as the multiplicative identity.
   *
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   *
   * @param {Array<number>} x input
   * @return {number} product of all input numbers
   * @example
   * product([1, 2, 3, 4]); // => 24
   */
  static Product(numbers = []) {
    try {
      let value = 1;
      numbers.forEach(x => value *= Number(x));
      return value;
    } catch(err) {
      console.error(`"Product()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * [Permutation](https://en.wikipedia.org/wiki/Resampling_(statistics)#Permutation_tests)
   * Determines if two data sets are *significantly* different from each other, using
   * the difference of means between the groups as the test statistic.
   * The function allows for the following hypotheses:
   * - two_tail = Null hypothesis: the two distributions are equal.
   * - greater = Null hypothesis: observations from sampleX tend to be smaller than those from sampleY.
   * - less = Null hypothesis: observations from sampleX tend to be greater than those from sampleY.
   * [Learn more about one-tail vs two-tail tests.](https://en.wikipedia.org/wiki/One-_and_two-tailed_tests)
   *
   * @param {Array<number>} sampleX first dataset (e.g. treatment data)
   * @param {Array<number>} sampleY second dataset (e.g. control data)
   * @param {string} alternative alternative hypothesis, either 'two_sided' (default), 'greater', or 'less'
   * @param {number} k number of values in permutation distribution.
   * @param {Function} [randomSource=Math.random] an optional entropy source
   * @returns {number} p-value The probability of observing the difference between groups (as or more extreme than what we did), assuming the null hypothesis.
   *
   * @example
   * var control = [2, 5, 3, 6, 7, 2, 5];
   * var treatment = [20, 5, 13, 12, 7, 2, 2];
   * permutationTest(control, treatment); // ~0.1324
   */
  static Permutation(sampleX = [], sampleY = [], alternative = `two_sided`, k = 10000, randomSource = Math.random()) {
    if(alternative !== "two_sided" && alternative !== "greater" && alternative !== "less") alternative = "two_sided"

    const meanX = StatisticsService.ArithmeticMean(sampleX);
    const meanY = StatisticsService.ArithmeticMean(sampleY);
    const testStatistic = meanX - meanY;

    // create test-statistic distribution
    const testStatDsn = new Array(k);

    // combine datsets so we can easily shuffle later
    const allData = sampleX.concat(sampleY);
    const midIndex = Math.floor(allData.length / 2);

    for (let i = 0; i < k; i++) {
      // 1. shuffle data assignments
      StatisticsService.Shuffle(allData, randomSource);
      const permLeft = allData.slice(0, midIndex);
      const permRight = allData.slice(midIndex, allData.length);

      // 2.re-calculate test statistic
      const permTestStatistic = StatisticsService.ArithmeticMean(permLeft) - StatisticsService.ArithmeticMean(permRight);

      // 3. store test statistic to build test statistic distribution
      testStatDsn[i] = permTestStatistic;
    }

    // Calculate p-value depending on alternative
    // For this test, we calculate the percentage of 'extreme' test statistics (subject to our hypothesis)
    // more info on permutation test p-value calculations: https://onlinecourses.science.psu.edu/stat464/node/35
    let numExtremeTStats = 0;
    if (alternative === "two_side") {
      for (let i = 0; i <= k; i++) {
        if (Math.abs(testStatDsn[i]) >= Math.abs(testStatistic)) {
          numExtremeTStats += 1;
        }
      }
    } else if (alternative === "greater") {
      for (let i = 0; i <= k; i++) {
        if (testStatDsn[i] >= testStatistic) {
          numExtremeTStats += 1;
        }
      }
    } else {
      // alternative === 'less'
      for (let i = 0; i <= k; i++) {
        /* c8 ignore start */
        if (testStatDsn[i] <= testStatistic) {
          numExtremeTStats += 1;
        }
      }
    }

    return numExtremeTStats / k;
  }

  /**
   * [Heap's Algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm)
   * for generating permutations.
   *
   * @param {Array} elements any type of data
   * @returns {Array<Array>} array of permutations
   */
  static Permutations_Heap(elements = []) {
    const indexes = new Array(elements.length);
    const permutations = [elements.slice()];

    for (let i = 0; i < elements.length; i++) {
      indexes[i] = 0;
    }

    for (let i = 0; i < elements.length; ) {
      if (indexes[i] < i) {
        let swapFrom = 0; // At odd indexes, swap from indexes[i] instead of from the beginning of the array
        if (i % 2 !== 0) swapFrom = indexes[i];

        // swap between swapFrom and i, using a temporary variable as storage.
        const temp = elements[swapFrom];
        elements[swapFrom] = elements[i];
        elements[i] = temp;
        permutations.push(elements.slice());
        indexes[i]++;
        i = 0;
      } else {
        indexes[i] = 0;
        i++;
      }
    }

    return permutations;
  }

  /**
   * Quadratic Mean
   * @param {Array} numbers
   * @returns {number} Quadratic Mean
   */
  static QuadraticMean(numbers = []) {
    try {
      if(numbers.length < 1) return 0;
      if(numbers.length == 1) return numbers[0];

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
   * [Quantile](https://en.wikipedia.org/wiki/Quantile):
   * this is a population quantile, since we assume to know the entire dataset in this library. 
   * This is an implementation of the [Quantiles of a Population](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
   * algorithm from wikipedia.
   *
   * Sample is a one-dimensional array of numbers, and p is either a decimal number from 0 to 1 or an array of decimal numbers from 0 to 1.
   * In terms of a k/q quantile, p = k/q - it's just dealing with fractions or dealing with decimal values.
   * When p is an array, the result of the function is also an array containing the appropriate quantiles in input order
   *
   * @param {Array<number>} x sample of one or more numbers
   * @param {Array<number> | number} p the desired quantile, as a number between 0 and 1
   * @returns {number} quantile
   * @example
   * quantile([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
   */
  static Quantile(numbers = [], p) {
    const copy = numbers.slice();

    const QuantileIndex = (len, p) => {
      const idx = len * p;
      if (p === 1) return len - 1;  // If p is 1, directly return the last index
      else if (p === 0) return 0;  // If p is 0, directly return the first index
      else if (idx % 1 !== 0) return Math.ceil(idx) - 1;  // If index is not integer, return the next index in array
      else if (len % 2 === 0) return idx - 0.5; // If the list has even-length, we'll return the middle of two indices around quantile to indicate that we need an average value of the two
      else return idx;  // Finally, in the simple case of an integer index with an odd-length list, return the index
    }

    const QuantileSelect = (arr, k, left, right) => {
      if (k % 1 === 0) StatisticsService.QuickSelect(arr, k, left, right);
      else {
        k = Math.floor(k);
        StatisticsService.QuickSelect(arr, k, left, right);
        StatisticsService.QuickSelect(arr, k + 1, k + 1, right);
      }
    }

    const MultiQuantileSelect = (arr, p) => {
      let indices = [0];
      for (let i = 0; i < p.length; i++) {
        indices.push(QuantileIndex(arr.length, p[i]));
      }
      indices.push(arr.length - 1);
      indices.sort((a, b) => a - b);

      let stack = [0, indices.length - 1];

      while (stack.length) {
        const r = Math.ceil(stack.pop());
        const l = Math.floor(stack.pop());
        if (r - l <= 1) continue;

        const m = Math.floor((l + r) / 2);
        QuantileSelect(arr, indices[m], Math.floor(indices[l]), Math.ceil(indices[r]));
        stack.push(l, m, m, r);
      }
      return stack;
    }

    if (Array.isArray(p)) {
      // rearrange elements so that each element corresponding to a requested quantile is on a place it would be if the array was fully sorted
      MultiQuantileSelect(copy, p);

      const results = [];
      for (let i = 0; i < p.length; i++) {
        results[i] = StatisticsService.QuantileSorted(copy, p[i]);
      }
      return results;
    } else {
      const idx = QuantileIndex(copy.length, p);
      QuantileSelect(copy, idx, 0, copy.length - 1);
      return StatisticsService.QuantileSorted(copy, p);
    }
  }

  /**
   * Quantiles Sorted
   * @param {Array<number>} x sample of one or more data points
   * @param {number} p desired quantile: a number between 0 to 1, inclusive
   * @returns {number} quantile value
   * @throws {Error} if p ix outside of the range from 0 to 1
   * @throws {Error} if x is empty
   * @example
   * quantileSorted([3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20], 0.5); // => 9
   */
  static QuantileSorted(numbers = [], p = 0.5) {
    const idx = numbers.length * p;
    if (numbers.length === 0) throw new Error("quantile requires at least one data point.");
    else if (p < 0 || p > 1) throw new Error("quantiles must be between 0 and 1");
    else if (p === 0) return numbers[0]; // If p is 0, directly return the first element
    else if (p === 1) return numbers[numbers.length - 1];  // If p is 1, directly return the last element
    else if (idx % 1 !== 0) return numbers[Math.ceil(idx) - 1];  // If p is not integer, return the next element in array
    else if (numbers.length % 2 === 0) return (numbers[idx - 1] + numbers[idx]) / 2;  // If the list has even-length, we'll take the average of this number and the next value, if there is one
    else return numbers[idx];  // Finally, in the simple case of an integer value with an odd-length list, return the x value at the index.
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
   * Rearrange items in `arr` so that all items in `[left, k]` range are the smallest.
   * The `k`-th element will have the `(k - left + 1)`-th smallest value in `[left, right]`.
   *
   * Implements Floyd-Rivest selection algorithm https://en.wikipedia.org/wiki/Floyd-Rivest_algorithm
   *
   * @param {Array<number>} arr input array
   * @param {number} k pivot index
   * @param {number} [left] left index
   * @param {number} [right] right index
   * @returns {void} mutates input array
   * @example
   * var arr = [65, 28, 59, 33, 21, 56, 22, 95, 50, 12, 90, 53, 28, 77, 39];
   * quickselect(arr, 8);
   * // = [39, 28, 28, 33, 21, 12, 22, 50, 53, 56, 59, 65, 90, 77, 95]
   */
  static QuickSelect(arr, k, left, right) {
    left = left ? left : 0;
    right = right ? right : arr.length - 1;

    // Swap Function
    const Swap = (arr, i, j) => {
      let tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }

    while (right > left) {
      // 600 and 0.5 are arbitrary constants chosen in the original paper to minimize execution time
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp((2 * z) / 3);
        let sd = 0.5 * Math.sqrt((z * s * (n - s)) / n);
        if (m - n / 2 < 0) sd *= -1;
        const newLeft = Math.max(left, Math.floor(k - (m * s) / n + sd));
        const newRight = Math.min(right, Math.floor(k + ((n - m) * s) / n + sd));
        StatisticsService.QuickSelect(arr, k, newLeft, newRight);
      }

      const t = arr[k];
      let i = left;
      let j = right;

      Swap(arr, left, k);
      if (arr[right] > t) Swap(arr, left, right);

      while (i < j) {
        Swap(arr, i, j);
        i++;
        j--;
        while (arr[i] < t) i++;
        while (arr[j] > t) j--;
      }

      if (arr[left] === t) Swap(arr, left, j);
      else {
        j++;
        Swap(arr, j, right);
      }

      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }
  }

  /**
   * [R Squared](http://en.wikipedia.org/wiki/Coefficient_of_determination)
   * value of data compared with a function `f`
   * is the sum of the squared differences between the prediction
   * and the actual value.
   *
   * @param {Array<Array<number>>} x input data: this should be doubly-nested
   * @param {Function} func function called on `[i][0]` values within the dataset
   * @returns {number} r-squared value
   * @example
   * var samples = [[0, 0], [1, 1]];
   * var regressionLine = linearRegressionLine(linearRegression(samples));
   * rSquared(samples, regressionLine); // = 1 this line is a perfect fit
   */
  static R_Squared(array = [], func = StatisticsService.LinearRegressionLine) {
    if (array.length < 2) return 1;

    // Compute the average y value for the actual data set in order to compute the
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i][1];
    }
    const average = sum / array.length;

    // Compute the total sum of squares - the squared difference between each point and the average of all points.
    let sumOfSquares = 0;
    for (let j = 0; j < array.length; j++) {
      sumOfSquares += Math.pow(average - array[j][1], 2);
    }

    // Finally estimate the error: the squared difference between the estimate and the actual data value at each point.
    let err = 0;
    for (let k = 0; k < array.length; k++) {
      err += Math.pow(array[k][1] - func(array[k][0]), 2);
    }

    // As the error grows larger, its ratio to the sum of squares increases and the r squared value grows lower.
    return 1 - err / sumOfSquares;
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
   * The Root Mean Square (RMS) is a mean function used as a measure of the magnitude of a set of numbers, regardless of their sign.
   * This is the square root of the mean of the squares of the input numbers.
   * This runs in `O(n)`, linear time, with respect to the length of the array.
   *
   * @param {Array<number>} x a sample of one or more data points
   * @returns {number} root mean square
   * @throws {Error} if x is empty
   * @example
   * rootMeanSquare([-1, 1, -1, 1]); // => 1
   */
  static RootMeanSquare(numbers = []) {
    if (numbers.length <= 0) throw new Error("rootMeanSquare requires at least one data point");
    let sumOfSquares = 0;
    for (let i = 0; i < numbers.length; i++) {
      sumOfSquares += Math.pow(numbers[i], 2);
    }
    return Math.sqrt(sumOfSquares / numbers.length);
  }

  /**
   * [Simple Random Sample](http://en.wikipedia.org/wiki/Simple_random_sample)
   *
   * The sampled values will be in any order, not necessarily the order they appear in the input.
   *
   * @param {Array<any>} x input array. can contain any type
   * @param {number} n count of how many elements to take
   * @param {Function} [randomSource=Math.random] an optional entropy source that
   * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
   * @return {Array} subset of n elements in original array
   *
   * @example
   * var values = [1, 2, 4, 5, 6, 7, 8, 9];
   * sample(values, 3); // returns 3 random values, like [2, 5, 8];
   */
  static Sample(array = [], n = 1, randomSource = Math.random) {
    const shuffled = StatisticsService.Shuffle(array, randomSource);
    return shuffled.slice(0, n);
  }

  /**
   * The [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence) is
   * a measure of how correlated two datasets are, between -1 and 1
   *
   * @param {Array<number>} x first input
   * @param {Array<number>} y second input
   * @returns {number} sample correlation
   * @example
   * sampleCorrelation([1, 2, 3, 4, 5, 6], [2, 2, 3, 4, 5, 60]).toFixed(2);
   * // => '0.69'
   */
  static Sample_Correlation(numbersA = [], numbersB = []) {
    const cov = StatisticsService.Sample_Covariance(numbersA, numbersB);
    const xstd = StatisticsService.StandardDeviation(numbersA);
    const ystd = StatisticsService.StandardDeviation(numbersB);
    return cov / xstd / ystd;
  }

  /**
   * [Sample Covariance](https://en.wikipedia.org/wiki/Sample_mean_and_covariance) of two datasets:
   * how much do the two datasets move together?
   * x and y are two datasets, represented as arrays of numbers.
   *
   * @param {Array<number>} x a sample of two or more data points
   * @param {Array<number>} y a sample of two or more data points
   * @throws {Error} if x and y do not have equal lengths
   * @throws {Error} if x or y have length of one or less
   * @returns {number} sample covariance
   * @example
   * sampleCovariance([1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1]); // => -3.5
   */
  static Sample_Covariance(numbersA = [], numbersB = []) {
    // The two datasets must have the same length which must be more than 1
    if(numbersA.length !== numbersB.length) throw new Error("sampleCovariance requires samples with equal lengths");
    if(numbersA.length < 2) throw new Error(`sampleCovariance requires at least two data points in each sample`);

    // Determine the mean of each dataset so that we can judge each value  as the difference from the mean. 
    // If one dataset is [1, 2, 3] and [2, 3, 4], their covariance does not suffer because of the difference 
    // in absolute values.
    const xmean = StatisticsService.ArithmeticMean(numbersA);
    const ymean = StatisticsService.ArithmeticMean(numbersB);

    // For each pair of values, the covariance increases when their difference from the mean is associated - 
    // if both are well above or if both are well below the mean, the covariance increases significantly.
    let sum = 0;
    for (let i = 0; i < numbersA.length; i++) {
      sum += (numbersA[i] - xmean) * (numbersB[i] - ymean);
    }

    // this is Bessels' Correction: an adjustment made to sample statistics that allows for the reduced 
    // degree of freedom entailed in calculating values from samples rather than complete populations.
    const besselsCorrection = numbersA.length - 1;

    // the covariance is weighted by the length of the datasets.
    return sum / besselsCorrection;
  }

  /**
   * [Kurtosis](http://en.wikipedia.org/wiki/Kurtosis)
   * A measure of the heaviness of a distribution's tails relative to its variance. 
   * The kurtosis value can be positive or negative, or even undefined.
   *
   * Implementation is based on Fisher's excess kurtosis definition and uses
   * unbiased moment estimators. This is the version found in Excel and available
   * in several statistical packages, including SAS and SciPy.
   *
   * @param {Array<number>} x a sample of 4 or more data points
   * @returns {number} sample kurtosis
   * @throws {Error} if x has length less than 4
   * @example
   * sampleKurtosis([1, 2, 2, 3, 5]); // => 1.4555765595463122
   */
  static Sample_Kurtosis(numbers = []) {
    const n = numbers.length;
    if (n < 4) throw new Error(`Requires at least four data points`);

    const meanValue = StatisticsService.ArithmeticMean(numbers);
    let secondCentralMoment = 0;
    let fourthCentralMoment = 0;

    for (let i = 0; i < n; i++) {
      let tempValue = numbers[i] - meanValue;
      secondCentralMoment += tempValue * tempValue;
      fourthCentralMoment += tempValue * tempValue * tempValue * tempValue;
    }

    return (
      ((n - 1) / ((n - 2) * (n - 3))) *
      ((n * (n + 1) * fourthCentralMoment) /
          (secondCentralMoment * secondCentralMoment) -
          3 * (n - 1))
    );
  }

  /**
   * [Rank Correlation](https://en.wikipedia.org/wiki/Rank_correlation)
   * a measure of the strength of monotonic relationship between two arrays
   *
   * @param {Array<number>} x first input
   * @param {Array<number>} y second input
   * @returns {number} sample rank correlation
   */
  static Sample_RankCorrelation(numbersA = [], numbersB = []) {
    const xIndexes = numbersA
      .map((value, index) => [value, index])
      .sort((a, b) => a[0] - b[0])
      .map((pair) => pair[1]);
    const yIndexes = numbersB
      .map((value, index) => [value, index])
      .sort((a, b) => a[0] - b[0])
      .map((pair) => pair[1]);

    // At this step, we have an array of indexes that map from sorted numbers to their original indexes. 
    // We reverse that so that it is an array of the sorted destination index.
    const xRanks = Array(xIndexes.length);
    const yRanks = Array(xIndexes.length);
    for (let i = 0; i < xIndexes.length; i++) {
      xRanks[xIndexes[i]] = i;
      yRanks[yIndexes[i]] = i;
    }

    return StatisticsService.Sample_Correlation(xRanks, yRanks);
  }

  /**
   * [Skewness](http://en.wikipedia.org/wiki/Skewness)
   * a measure of the extent to which a probability distribution of a real-valued random variable "leans" to one side of the mean.
   * The skewness value can be positive or negative, or even undefined.
   *
   * Implementation is based on the adjusted Fisher-Pearson standardized moment coefficient, 
   * which is the version found in Excel and several statistical packages including Minitab, SAS and SPSS.
   *
   * @param {Array<number>} x a sample of 3 or more data points
   * @returns {number} sample skewness
   * @example
   * sampleSkewness([2, 4, 6, 3, 1]); // => 0.590128656384365
   */
  static Sample_Skewness(numbers = []) {
    if (numbers.length < 3) throw new Error(`Requires at least three data points`);

    const meanValue = StatisticsService.ArithmeticMean(numbers);

    let sumSquaredDeviations = 0;
    let sumCubedDeviations = 0;
    for (let i = 0; i < numbers.length; i++) {
      let tempValue = numbers[i] - meanValue;
      sumSquaredDeviations += tempValue * tempValue;
      sumCubedDeviations += tempValue * tempValue * tempValue;
    }

    // this is Bessels' Correction: an adjustment made to sample statistics
    // that allows for the reduced degree of freedom entailed in calculating
    // values from samples rather than complete populations.
    const besselsCorrection = numbers.length - 1;

    // Find the mean value of that list
    const theSampleStandardDeviation = Math.sqrt(sumSquaredDeviations / besselsCorrection);

    const n = numbers.length;
    const cubedS = Math.pow(theSampleStandardDeviation, 3);

    return (n * sumCubedDeviations) / ((n - 1) * (n - 2) * cubedS);
  }

  /**
   * [Sample t-test](https://en.wikipedia.org/wiki/Student%27s_t-test#One-sample_t-test)
   * comparing the mean of a sample to a known value, x.
   *
   * Determines whether the population mean is equal to a known value `x`.
   * Usually the results here are used to look up a [p-value](http://en.wikipedia.org/wiki/P-value), which, for
   * a certain level of significance, will let you determine that the null hypothesis can or cannot be rejected.
   *
   * @param {Array<number>} x sample of one or more numbers
   * @param {number} expectedValue expected value of the population mean
   * @returns {number} value
   * @example
   * tTest([1, 2, 3, 4, 5, 6], 3.385).toFixed(2); // => '0.16'
   */
  static Sample_T_Test(numbers = [], expectedValue = 1.0) {
    try {
      const sampleMean = StatisticsService.ArithmeticMean(numbers);
      const sd = StatisticsService.StandardDeviation(numbers);
      const rootN = Math.sqrt(numbers.length);  // Square root the length of the sample
      return (sampleMean - expectedValue) / (sd / rootN);
    } catch(err) {
      console.error(`"Sample_T_Test()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * [Two-Sample T-Test](http://en.wikipedia.org/wiki/Student's_t-test).
   * Tests whether "mean(X) - mean(Y) = difference", (in the most common case, we often have `difference == 0` to test if two samples
   * are likely to be taken from populations with the same mean value) with no prior knowledge on standard deviations of both samples
   * other than the fact that they have the same standard deviation.
   *
   * Usually the results here are used to look up a [p-value](http://en.wikipedia.org/wiki/P-value), which, for
   * a certain level of significance, will let you determine that the null hypothesis can or cannot be rejected.
   * 
   * `diff` can be omitted if it equals 0.
   *
   * [This is used to reject](https://en.wikipedia.org/wiki/Exclusion_of_the_null_hypothesis)
   * a null hypothesis that the two populations that have been sampled into
   * `sampleX` and `sampleY` are equal to each other.
   *
   * @param {Array<number>} sampleX a sample as an array of numbers
   * @param {Array<number>} sampleY a sample as an array of numbers
   * @param {number} [difference=0]
   * @returns {number|null} test result
   *
   * @example
   * tTestTwoSample([1, 2, 3, 4], [3, 4, 5, 6], 0); // => -2.1908902300206643
   */
  static Sample_T_Test_TwoSample(sampleX = [], sampleY = [], difference = 0) {
    const n = sampleX.length;
    const m = sampleY.length;

    if (!n || !m) return null;  // If either sample is empty return `null`.

    const meanX = mean(sampleX);
    const meanY = mean(sampleY);
    const sampleVarianceX = sampleVariance(sampleX);
    const sampleVarianceY = sampleVariance(sampleY);

    if (typeof meanX === "number" && typeof meanY === "number" &&
      typeof sampleVarianceX === "number" && typeof sampleVarianceY === "number"
    ) {
        const weightedVariance = ((n - 1) * sampleVarianceX + (m - 1) * sampleVarianceY) / (n + m - 2);
        return (
          (meanX - meanY - difference) /
          Math.sqrt(weightedVariance * (1 / n + 1 / m))
        );
    }
  }

  /**
   * [Fisher-Yates Shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
   * in-place - which means that it **will change the order of the original array by reference**.
   * This generates a random [permutation](https://en.wikipedia.org/wiki/Permutation) of a set.
   *
   * @param {Array} x sample of one or more numbers
   * @param {Function} [randomSource=Math.random] an optional entropy source that
   * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
   * @returns {Array} x
   * @example
   * var x = [1, 2, 3, 4];
   * shuffleInPlace(x);
   * // x is shuffled to a value like [2, 1, 4, 3]
   */
  static Shuffle(numbers = [], randomSource = Math.random) {
    // store the current length of the x to determine when no elements remain to shuffle.
    let length = numbers.length;

    // While there are still items to shuffle
    while(length > 0) {
        // choose a random index within the subset of the array that is not yet shuffled
        let index = Math.floor(randomSource() * length--);
        let temporary = numbers[length];

        // swap the value at `x[length]` with `x[index]`
        numbers[length] = numbers[index];
        numbers[index] = temporary;
    }

    return numbers;
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
  static SignFunction(number = 2) {
    try {
      if (typeof number !== "number") throw new TypeError("not a number");
      if (number < 0) return -1;
      else if (number === 0) return 0;
      else return 1;
    } catch(err) {
      console.error(`"SignFunction()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * [Silhouette values](https://en.wikipedia.org/wiki/Silhouette_(clustering))
   * for clustered data.
   *
   * @param {Array<Array<number>>} points N-dimensional coordinates of points.
   * @param {Array<number>} labels Labels of points. This must be the same length as `points`,
   * and values must lie in [0..G-1], where G is the number of groups.
   * @return {Array<number>} The silhouette value for each point.
   *
   * @example
   * silhouette([[0.25], [0.75]], [0, 0]); // => [1.0, 1.0]
   */
  static Silhouette(points, labels) {
    if (points.length !== labels.length) throw new Error("must have exactly as many labels as points");

    // Create a lookup table mapping group IDs to point IDs.
    const CreateGroups = (labels) => {
      const numGroups = 1 + max(labels);
      const result = Array(numGroups);
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (result[label] === undefined) {
          result[label] = [];
        }
        result[label].push(i);
      }
      return result;
    }

    // Create a lookup table of all inter-point distances.
    const CalculateAllDistances = (points) => {
      const numPoints = points.length;
      const result = StatisticsService.Matrix(numPoints, numPoints);
      for (let i = 0; i < numPoints; i++) {
        for (let j = 0; j < i; j++) {
          result[i][j] = StatisticsService.EuclideanDistance(points[i], points[j]);
          result[j][i] = result[i][j];
        }
      }
      return result;
    }

    // Calculate the mean distance between a point and all the points in a group (possibly its own).
    const MeanDistanceFromPointToGroup = (which, group, distances) => {
      let total = 0;
      for (let i = 0; i < group.length; i++) {
        total += distances[which][group[i]];
      }
      return total / group.length;
    }

    // Calculate the mean distance between this point and all the points in the nearest group (as determined by which point in another group is closest).
    const MeanDistanceToNearestGroup = (which, labels, groupings, distances) => {
      const label = labels[which];
      let result = Number.MAX_VALUE;
      for (let i = 0; i < groupings.length; i++) {
        if (i !== label) {
          const d = MeanDistanceFromPointToGroup(which, groupings[i], distances);
          if (d < result) result = d;
        }
      }
      return result;
    }

    
    const groupings = CreateGroups(labels);
    const distances = CalculateAllDistances(points);
    const result = [];
    for (let i = 0; i < points.length; i++) {
      let s = 0;
      if (groupings[labels[i]].length > 1) {
        const a = MeanDistanceFromPointToGroup(i, groupings[labels[i]], distances);
        const b = MeanDistanceToNearestGroup(i, labels, groupings, distances);
        s = (b - a) / Math.max(a, b);
      }
      result.push(s);
    }
    return result;
  }

  /**
   * [Silhouette Metric](https://en.wikipedia.org/wiki/Silhouette_(clustering))
   * for a set of N-dimensional points arranged in groups. The metric is the largest individual silhouette value for the data.
   *
   * @param {Array<Array<number>>} points N-dimensional coordinates of points.
   * @param {Array<number>} labels Labels of points. This must be the same length as `points`,
   * and values must lie in [0..G-1], where G is the number of groups.
   * @return {number} The silhouette metric for the groupings.
   *
   * @example
   * silhouetteMetric([[0.25], [0.75]], [0, 0]); // => 1.0
   */
  static SilhouetteMetric(points, labels) {
    const values = StatisticsService.Silhouette(points, labels);
    return StatisticsService.Max(values);
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
   * When removing a value from a list, it's not have to necessary recompute the mean of the list in linear time. 
   * Use this function to compute the new mean by providing the current mean,
   * the number of elements in the list that produced it and the value to remove.
   *
   * @param {number} mean current mean
   * @param {number} n number of items in the list
   * @param {number} value the value to remove
   * @returns {number} the new mean
   *
   * @example
   * subtractFromMean(20.5, 6, 53); // => 14
   */
  static SubtractFromMean(mean = 20.0, n = 10, value = 0) {
    return (mean * n - value) / (n - 1);
  }

  /**
   * Sum Numbers
   * @param {Array} numbers
   * @returns {number} sum
   */
  static Sum(numbers = []) {
    if(numbers.length < 1) return 0;
    if(numbers.length == 1) return numbers[0];
    return Number(numbers.reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2);
  }

  /**
   * The sum of deviations to the Nth power.
   * When n=2 it's the sum of squared deviations.
   * When n=3 it's the sum of cubed deviations.
   *
   * @param {Array<number>} x
   * @param {number} n power
   * @returns {number} sum of nth power deviations
   *
   * @example
   * var input = [1, 2, 3];
   * // since the variance of a set is the mean squared
   * // deviations, we can calculate that with sumNthPowerDeviations:
   * sumNthPowerDeviations(input, 2) / input.length;
   */
  static SumNthPowerDeviations(numbers = [], n = 2) {
    const meanValue = StatisticsService.ArithmeticMean(numbers);

    // This is an optimization: when n is 2 (we're computing a number squared),
    // multiplying the number by itself is significantly faster than using
    // the Math.pow method.
    let sum = 0;
    if (n === 2) {
      for (let i = 0; i < numbers.length; i++) {
        let tempValue = numbers[i] - meanValue;
        sum += tempValue * tempValue;
      }
    } else {
      for (let i = 0; i < numbers.length; i++) {
        sum += Math.pow(numbers[i] - meanValue, n);
      }
    }
    return sum;
  }

  /**
   * [Variance](http://en.wikipedia.org/wiki/Variance)
   * Sum of squared deviations from the mean.
   *
   * This is an implementation of variance, not sample variance:
   * see the `sampleVariance` method if you want a sample measure.
   *
   * @param {Array<number>} x a population of one or more data points
   * @returns {number} variance: a value greater than or equal to zero.
   * zero indicates that all values are identical.
   * @throws {Error} if x's length is 0
   * @example
   * variance([1, 2, 3, 4, 5, 6]); // => 2.9166666666666665
   */
  static Variance(numbers = []) {
    try {
      if (numbers.length < 1) throw new Error("variance requires at least one data point");

      // Find the mean of squared deviations between the mean value and each value.
      const variance = StatisticsService.SumNthPowerDeviations(numbers, 2) / numbers.length;
      return variance;
    } catch(err) {
      console.error(`"Variance()" failed: ${err}`);
      return 1;
    }
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

const _test_Statistics = () => {
  const x = StatisticsService.StandardNormalTable;
  console.info(x);
}


// ----------------------------------------------------------------------------------------------------------------------------------------



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

/**
 * This is a single-layer [Perceptron Classifier](http://en.wikipedia.org/wiki/Perceptron) that takes
 * arrays of numbers and predicts whether they should be classified
 * as either 0 or 1 (negative or positive examples).
 * @class
 * @example
 * // Create the model
 * var p = new PerceptronModel();
 * // Train the model with input with a diagonal boundary.
 * for (var i = 0; i < 5; i++) {
 *     p.train([1, 1], 1);
 *     p.train([0, 1], 0);
 *     p.train([1, 0], 0);
 *     p.train([0, 0], 0);
 * }
 * p.predict([0, 0]); // 0
 * p.predict([0, 1]); // 0
 * p.predict([1, 0]); // 0
 * p.predict([1, 1]); // 1
 */
class PerceptronModel {
  /*:: bias: number */
  /*:: weights: Array<number> */
  constructor() {
    // The weights, or coefficients of the model;
    // weights are only populated when training with data.
    this.weights = [];
    // The bias term, or intercept; it is also a weight but
    // it's stored separately for convenience as it is always
    // multiplied by one.
    this.bias = 0;
  }
  /**
   * **Predict**: Use an array of features with the weight array and bias
   * to predict whether an example is labeled 0 or 1.
   *
   * @param {Array<number>} features an array of features as numbers
   * @returns {number} 1 if the score is over 0, otherwise 0
   */
  Predict(features = []) {
    // Only predict if previously trained on the same size feature array(s).
    if (features.length !== this.weights.length) return null;

    // Calculate the sum of features times weights, with the bias added (implicitly times one).
    let score = 0;
    for (let i = 0; i < this.weights.length; i++) {
      score += this.weights[i] * features[i];
    }
    score += this.bias;

    // Classify as 1 if the score is over 0, otherwise 0.
    if (score > 0) return 1;
    else return 0;
  }

  /**
   * **Train** the classifier with a new example, which is a numeric array of features and a 0 or 1 label.
   *
   * @param {Array<number>} features an array of features as numbers
   * @param {number} label either 0 or 1
   * @returns {PerceptronModel} this
   */
  Train(features = [], label = 0) {
    if (label !== 0 && label !== 1) return null;  // Require that only labels of 0 or 1 are considered.

    // The length of the feature array determines the length of the weight array.
    // The perceptron will continue learning as long as it keeps seeing feature arrays of the same length.
    // When it sees a new data shape, it initializes.
    if (features.length !== this.weights.length) {
      this.weights = features;
      this.bias = 1;
    }
    // Make a prediction based on current weights.
    const prediction = this.Predict(features);
    // Update the weights if the prediction is wrong.
    if (typeof prediction === "number" && prediction !== label) {
      const gradient = label - prediction;
      for (let i = 0; i < this.weights.length; i++) {
        this.weights[i] += gradient * features[i];
      }
      this.bias += gradient;
    }
    return this;
  }
}


