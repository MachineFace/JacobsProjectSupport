/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Calculating Metrics
 */
class Calculate
{
  constructor() {
    this.writer = new WriteLogger();
  }

  CalculateAverageTurnaround (sheet) {
    try {
      // Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format. 
      let completionTimes = GetColumnDataByHeader(sheet, HEADERNAMES.elapsedTime);
      let culled = completionTimes.filter(Boolean);
      
      // Convert everything to seconds
      let totals = [];
      culled.forEach(time => {
        if(time === typeof(String)) console.error(`Not a number: ${time}`) 
        else {
          let days = +Number(time[0]) * 24 * 60; // days to hours to minutes
          let hours = +Number(time[1]) * 60; // hours to minutes
          let minutes = +Number(time[2]); // minutes     
          let seconds = +Number(time[3]); // seconds, forget about seconds
          let total = days + hours + minutes;
          totals.push(total);
        }
      })

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
      console.error(`${err} : Calculating the turnaround times has failed for some reason.`);
    }
  }
  PrintTurnaroundTimes () {
    try {
      let data = [];
      Object.values(SHEETS).forEach(sheet => {
        data.push([`${sheet.getName()} Turnaround`, this.CalculateAverageTurnaround(sheet)]);
      })
      data.forEach( (entry, index) => {
        OTHERSHEETS.Data.getRange(26 + index, 2, 1, 1 ).setValue(entry[0]);
        OTHERSHEETS.Data.getRange(26 + index, 4, 1, 1 ).setValue(entry[1]);
      })
    }
    catch (err) {
      this.writer.Error(`${err} : Printing the turnaround times has failed for some reason.`);
    }
  }


  CalculateDuration (start, end) {
    try {
      end = end instanceof Date ? new Date(end) : new Date();  //if supplied with nothing, set end time to now
      start = start instanceof Date ? new Date(start) : new Date(end - 87000000);  //if supplied with nothing, set start time to now minus 24 hours.

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

      // Write
      let formatted = `days : ${days.toString()}, hrs : ${hrs.toString()}, mins : ${minutesAsString}, secs : ${secondsAsString}`;
      let out = `${days} ${hrs}:${minutesAsString}:${secondsAsString}`;
      console.info(`Duration = ${out}`);
      return out;  // Return Completed time
    }
    catch (err) {
      console.error(`${err} : Calculating the duration has failed for some reason.`);
    }
  }


  CountActiveUsers () {
    let persons = []
    Object.values(SHEETS).forEach(sheet => {
      let peeps = GetColumnDataByHeader(sheet, HEADERNAMES.name);
      let culled = peeps.filter(Boolean);
      culled.forEach(person => {
        if(person != "FORMULA ROW" || person != null || person != undefined || person != "Test" || person != "" || person != " ") persons.push(person);
      })
    })

    //Filter out duplicate entries in the list
    let unique = persons.filter((c, index) => {
      return persons.indexOf(c) === index;
    });

    let count = unique.length - 1; //Removes the space.
    this.writer.Info(`Active JPS Users : ${count}`);
    return count;
  }
  PrintActiveUsers () {
    const count = this.CountActiveUsers();
    OTHERSHEETS.Data.getRange(`B4`).setValue(`TOTAL STUDENTS CURRENTLY USING JPS`);
    OTHERSHEETS.Data.getRange(`C4`).setValue(count);
  }


  CountEachSubmission () {
    let data = []
    Object.values(SHEETS).forEach(sheet => {
      let range = GetColumnDataByHeader(sheet, HEADERNAMES.timestamp);
      let culled = range.filter(Boolean);
      let count = culled.length - 2;
      if(count < 0) count = 0;
      // this.writer.Info(`Sheet : ${sheet.getName()}, Count : ${count}`);
      data.push([sheet.getSheetName(), count]);
    })
    console.warn(data)
    return data;
  }
  PrintSubmissionData () {
    let data = this.CountEachSubmission();
    data.forEach( (entry, index) => {
      OTHERSHEETS.Data.getRange(13 + index , 2, 1, 1).setValue(entry[0]);
      OTHERSHEETS.Data.getRange(13 + index , 3, 1, 1).setValue(entry[1]);
    })
  }


  CreateTopTen () {
    const distribution = this.CalculateDistribution();
    // Create a new array with only the first 10 items and remove Tests
    let chop = distribution.slice(0, 11);

    chop.forEach((pair, index) => {
      let email = this.FindEmail(pair[0]);
      console.warn(email)
      console.warn(`${pair[0]} -----> ${pair[1]}`)
      OTHERSHEETS.Data.getRange(106 + index, 1, 1, 1).setValue(index + 1)
      OTHERSHEETS.Data.getRange(106 + index, 2, 1, 1).setValue(pair[0])
      OTHERSHEETS.Data.getRange(106 + index, 3, 1, 1).setValue(pair[1])
      OTHERSHEETS.Data.getRange(106 + index, 5, 1, 1).setValue(email ? email : `Email not found`);
    })

    return chop;

  }

  FindEmail (name) {
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

  CalculateDistribution () {
    let userList = [];
    Object.values(SHEETS).forEach(sheet => {
      let users = GetColumnDataByHeader(sheet, HEADERNAMES.name);
      users.forEach( user => {
        if(!user || user == `FORMULA ROW` || user == `Test`) {
          // Do nothing
        }
        else {
          userList.push(user);
        }
      });
    });
    let culled = userList.filter(Boolean);
    let occurrences = culled.reduce( (acc, curr) => {
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
  PrintDistributionNumbers () {
    let userList = [];
    Object.values(SHEETS).forEach(sheet => {
      let users = GetColumnDataByHeader(sheet, HEADERNAMES.name);
      let culled = users.filter(Boolean);
      culled.forEach( user => userList.push(user));
    })
    let occurrences = userList.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences).map((key) => occurrences[key]);
    items.sort((first, second) => second - first);
    console.warn(items);
    items.forEach( (item, index) => OTHERSHEETS.Backgrounddata.getRange(2 + index, 22, 1, 1).setValue(item));
  }

  CountTypes () {
    let userList = [];
    Object.values(SHEETS).forEach(sheet => {
      let types = GetColumnDataByHeader(sheet, HEADERNAMES.afiliation);
      let culled = types.filter(Boolean);
      culled.forEach( type => {
        if(type != null || type != undefined || type != "" || type != " " || type != "Test" || type != "FORMULA ROW") {
          userList.push(type);
        }
      });
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
    items.splice(0,1);
    console.warn(items);
    return items;  
  }
  PrintTypesCount () {
    let indexes = [];
    let types = this.CountTypes();
    types.forEach(type => {
      let name = type[0];
      indexes.push(TYPES.indexOf(name));
    })
    let missingTypes = [];
    TYPES.forEach(type => missingTypes.push(type));

    let temp1 = []
    types.forEach(item => temp1.push(item[0]));

    let nums = FindMissingElementsInArrays(temp1, missingTypes);
    nums.forEach(index => missingTypes.splice(index, 1));
    missingTypes.forEach(item => types.push([item, 0]));
    types.forEach( (item, index) => {
      OTHERSHEETS.Data.getRange(45 + index, 2, 1, 1).setValue(item[0]);
      OTHERSHEETS.Data.getRange(45 + index, 3, 1, 1).setValue(item[1]);
    })
    return types;
  }

  CalculateStandardDeviation () {
    const distribution = this.CalculateDistribution();
    let n = distribution.length;
    // console.info(`n = ${n}`);

    let values = [];
    distribution.forEach(person => values.push(person[1]))
    // console.info(values)
    let mean = values.reduce((a, b) => a + b) / n;
    console.warn(`Mean = ${mean}`);

    let standardDeviation = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    console.warn(`Standard Deviation for Number of Submissions : ${standardDeviation}`);
    return standardDeviation;
  }


  CalculateArithmeticMean () {
    const distribution = this.CalculateDistribution();
    let n = distribution.length;
    // console.info(`n = ${n}`);

    let values = [];
    distribution.forEach(person => values.push(person[1]))
    // console.info(values)
    let mean = values.reduce((a, b) => a + b) / n;
    console.warn(`Mean = ${mean}`);

    return mean;
  }
  PrintStatistics () {
    const mean = this.CalculateArithmeticMean();
    OTHERSHEETS.Data.getRange(102, 2, 1, 1).setValue(`Arithmetic Mean for Project Submissions : `)
    OTHERSHEETS.Data.getRange(102, 3, 1, 1).setValue(mean);
    const stand = this.CalculateStandardDeviation();
    OTHERSHEETS.Data.getRange(103, 2, 1, 1).setValue(`Standard Deviation for Project Submissions : `);
    OTHERSHEETS.Data.getRange(103, 3, 1, 1).setValue(stand);
  }


  CountTiers () {
    let tiers = OTHERSHEETS.Approved.getRange(3, 4, OTHERSHEETS.Approved.getLastRow() -2, 1).getValues();
    tiers = [].concat(...tiers);

    let occurrences = tiers.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    let items = Object.keys(occurrences).map((key) => {
      if (key !== "" || key !== undefined || key !== null || key !== " ") {
        return [key, occurrences[key]];
      }
    });
    // console.info(items);
    return items;  
  }
  PrintTiers () {
    const tiers = this.CountTiers();
    tiers.forEach( (tier, index) => {
      OTHERSHEETS.Data.getRange(39 + index, 2, 1, 1).setValue(`Tier ${tier[0]} Applicants`);
      OTHERSHEETS.Data.getRange(39 + index, 3, 1, 1).setValue(tier[1]);
      console.warn(tier.toString())
    });
  }



  CountStatuses () {
    let statuses = [];
    Object.values(SHEETS).forEach(sheet => {
      let stats = GetColumnDataByHeader(sheet, HEADERNAMES.status);
      let culled = stats.filter(Boolean);
      culled.forEach( status => statuses.push( Object.keys(STATUS).find(key => STATUS[key] === status)))
    })

    let occurrences = statuses.reduce( (acc, curr) => {
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
    items.splice(0,1);
    console.warn(items);
    return items; 
  }
  PrintStatusCounts () {
    let data = this.CountStatuses();
    let completed = 0;
    let cancelled = 0;
    let inprogress = 0;
    data.forEach( status => {
      console.warn(`Status : ${status[0]}, Value : ${status[1]}`);
      if(status[0] == `completed` || status[0] == `billed` || status[0] == `closed` || status[0] == `pickedUp`) {
        completed += status[1];
      }
      else if(status[0] == `cancelled`) cancelled += status[1];
      else if(status[0] == `inProgress`) inprogress += status[1];
    })
    OTHERSHEETS.Data.getRange(8, 2, 1, 1).setValue(`COMPLETED JOBS`);
    OTHERSHEETS.Data.getRange(8, 3, 1, 1).setValue(completed);

    OTHERSHEETS.Data.getRange(9, 2, 1, 1).setValue(`CANCELLED JOBS`);
    OTHERSHEETS.Data.getRange(9, 3, 1, 1).setValue(cancelled);

    OTHERSHEETS.Data.getRange(10, 2, 1, 1).setValue(`IN-PROGRESS JOBS`)
    OTHERSHEETS.Data.getRange(10, 3, 1, 1).setValue(inprogress);
    console.warn(`Completed : ${completed}, Cancelled : ${cancelled}, In-Progress : ${inprogress}`);
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
  console.time(`Metrics Timer `)
  const calc = new Calculate();
  try {
    console.info(`Calculating Metrics .....`);
    calc.PrintActiveUsers();
    calc.PrintTiers();
    calc.PrintStatusCounts();
    calc.PrintStatistics();
    calc.PrintTypesCount();
    calc.PrintSubmissionData();
    calc.PrintTurnaroundTimes();
    calc.PrintDistributionNumbers();
    console.info(`Recalculated Metrics`);
  } catch (err) {
    console.error(`${err} : Couldn't generate Metrics for some dumb reason...`);
  }
  console.timeEnd(`Metrics Timer `)
}

const _testDist = () => {
  const c = new Calculate();
  let start = new Date().toDateString();
  let end = new Date(3,10,2020,10,32,42);
  // c.CalculateDuration(start, end);
  // c.CalculateAverageTurnaround(SHEETS.Laser);
  c.CreateTopTen()
}







