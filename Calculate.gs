class Calculate
{
  constructor() {

  }

  CalculateAverageTurnaround (sheet) {
    // Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format. 
    let completionTimes = sheet.getRange(3, 44, sheet.getLastRow(), 1).getValues(); // Column AR2:AR (Format: Row, Column, Last Row, Number of Columns)
    completionTimes = [].concat(...completionTimes);
    let culled = completionTimes.filter(Boolean);
    
    // Convert everything to seconds
    let totals = [];
    culled.forEach(time => {
      let days = (+time[0] * 24 * 60); // days to hours to minutes
      let hours = (+time[1] * 60); // hours to minutes
      let minutes = (+time[2]); // minutes     
      let seconds = (+time[3]); // seconds, forget about seconds
      let total = days + hours + minutes;
      totals.push(total);
    })

    // Sum all the totals
    let sum = 0;
    totals.forEach( (item, index) => sum += item);

    // Average the totals (a list of times in minutes)
    let average = sum / totals.length;

    let mins = parseInt((average % 60), 10); // Calc mins
    average = Math.floor(average / 60); // Difference mins to hrs
    let minutesAsString = mins < 10 ? "0" + mins : mins + ""; // Pad with a zero

    let hrs = average % 24; // Calc hrs
    average = Math.floor(average / 24); // Difference hrs to days
    let dys = average;

    //Format into readable time and return (if data is still missing, set it to zero)
    if (isNaN(dys)) dys = 0;
    if (isNaN(hrs)) hrs = 0;
    if (isNaN(minutesAsString)) minutesAsString = 0;

    let formatted = dys + 'd ' + hrs + 'h ' + minutesAsString + "m";
    Logger.log(formatted);
    return formatted;
  }
  PrintTurnaroundTimes () {
    let data = [];
    for(const [key, sheet] of Object.entries(SHEETS)) {
      data.push([`${sheet.getName()} Turnaround`, this.CalculateAverageTurnaround(sheet)]);
    }
    data.forEach( (entry, index) => {
      OTHERSHEETS.data.getRange(26 + index, 2, 1, 1 ).setValue(entry[0]);
      OTHERSHEETS.data.getRange(26 + index, 4, 1, 1 ).setValue(entry[1]);
    })
  }


  CalculateDuration (start, end) {
    try {
      end = end ? end : new Date();  //if supplied with nothing, set end time to now
      start = start ? start : new Date(end - 87000000);  //if supplied with nothing, set start time to now minus 24 hours.

      let timeDiff = Math.abs((end - start) / 1000); //Abs Value Milliseconds to sec

      let secs = Math.floor(timeDiff % 60); //Calc seconds
      timeDiff = Math.floor(timeDiff / 60); //Difference seconds to minutes
      let secondsAsString = secs < 10 ? "0" + secs : secs + ""; //Pad with a zero

      let mins = timeDiff % 60; //Calc mins 
      timeDiff = Math.floor(timeDiff / 60); //Difference mins to hrs
      let minutesAsString = mins < 10 ? "0" + mins : mins + ""; //Pad with a zero

      let hrs = timeDiff % 24; //Calc hrs
      timeDiff = Math.floor(timeDiff / 24); //Difference hrs to days
      let days = timeDiff;

      //Write
      let formatted = days + ' ' + hrs + ':' + minutesAsString + ':' + secondsAsString;
      Logger.log("Duration = " + formatted);

      // Return Completed time
      return formatted;
    }
    catch (err) {
      Logger.log(`${err} : Calculating the duration has failed for some reason.`);
    }
  }


  CountActiveUsers () {
    let persons = []
    for(const [key, sheet] of Object.entries(SHEETS)) {
      let peeps = sheet.getRange(2, 10, sheet.getLastRow() -1, 1 ).getValues();
      peeps = [].concat(...peeps);
      peeps.forEach(person => {
        if(person != "FORMULA ROW" || person != null || person != undefined || person != "Test" || person != "" || person != " ") {
          persons.push(person);
        }
      })
    }

    //Filter out duplicate entries in the list
    let unique = persons.filter((c, index) => {
      return persons.indexOf(c) === index;
    });

    let count = unique.length - 1; //Removes the space.
    Logger.log(`Active JPS Users : ${count}`);
    return count;
  }
  PrintActiveUsers () {
    const users = this.CountActiveUsers();
    OTHERSHEETS.data.getRange("C4").setValue(users);
  }


  CountEachSubmission () {
    let data = []
    for(const [key, sheet] of Object.entries(SHEETS)) {
      // let count = sheet.getLastRow() - 3;
      let range = sheet.getRange(2, 8, sheet.getLastRow() - 1).getValues();
      range = [].concat(...range);
      let culled = []
      culled = range.filter(Boolean);
      let count = culled.length - 2;
      // Logger.log(`Sheet : ${sheet.getName()}, Count : ${count}`);
      data.push([sheet.getName(), count]);
    }
    Logger.log(data);
    return data;
  }
  PrintSubmissionData () {
    let data = this.CountEachSubmission();
    data.forEach( (entry, index) => {
      OTHERSHEETS.data.getRange(13 + index , 2, 1, 1).setValue(entry[0]);
      OTHERSHEETS.data.getRange(13 + index , 3, 1, 1).setValue(entry[1]);
    })
  }


  CreateTopTen () {
    const distribution = this.CalculateDistribution();
    // Create a new array with only the first 10 items and remove Tests
    let chop = distribution.slice(0, 11);

    let loc;
    chop.forEach((item) => {
      item.forEach((pair) => {
        if(pair == 'Test') {
          loc = chop.indexOf(item);
        }
      })
    });
    chop.splice(loc,1);

    chop.forEach((pair, index) => {
      Logger.log(`${pair[0]} -----> ${pair[1]}`)
      OTHERSHEETS.data.getRange(106+index,2,1,1).setValue(pair[0])
      OTHERSHEETS.data.getRange(106+index,3,1,1).setValue(pair[1])
    })

    return chop;

  }

  CalculateDistribution () {
    let userList = [];
    for(const [name, sheet] of Object.entries(SHEETS)) { 
      let users = sheet.getRange(3, 10, sheet.getLastRow(), 1).getValues();
      users = [].concat(...users);
      users.forEach( user => {
        if(user != null || user != undefined || user != "" || user != " " || user != "Test" || user != "FORMULA ROW") {
          userList.push(user);
        }
      })
    }
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
    // items.splice(0,1);
    Logger.log(items);
    return items;  
  }

  PrintDistributionNumbers () {
    let userList = [];
    for(const [name, sheet] of Object.entries(SHEETS)) { 
      let users = [].concat(...sheet.getRange(3, 10, sheet.getLastRow(), 1).getValues());
      users.forEach( user => userList.push(user));
    }
    let culled = userList.filter(Boolean);
    let occurrences = culled.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    let items = Object.keys(occurrences).map((key) => occurrences[key]);
    items.sort((first, second) => second - first);
    Logger.log(items)
    items.forEach( (item, index) => OTHERSHEETS.backgrounddata.getRange(2 + index, 22, 1, 1).setValue(item));
  }



  CountTypes () {
    let userList = [];
    for(const [name, sheet] of Object.entries(SHEETS)) { 
      if(sheet.getName() != SHEETS.advancedlab.getName()) {
        let types = sheet.getRange(3, 24, sheet.getLastRow(), 1).getValues();
        types = [].concat(...types);
        types.forEach( type => {
          if(type !== null || type !== undefined || type !== "" || type !== " " || type !== "Test" || type !== "FORMULA ROW") {
            userList.push(type);
          }
        })
      }
    }
    let adv = SHEETS.advancedlab.getRange(3, 27, SHEETS.advancedlab.getLastRow() -1, 1).getValues();
    adv = [].concat(...adv);
    adv.forEach(item => userList.push(item));

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
    Logger.log(items);
    
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
      OTHERSHEETS.data.getRange(45 + index, 2, 1, 1).setValue(item[0]);
      OTHERSHEETS.data.getRange(45 + index, 3, 1, 1).setValue(item[1]);
    })
    return types;
  }

  CreateTopTenByID () {
    let count = {};
    let userList = [];
    for(const [name, sheet] of Object.entries(SHEETS)) {
      if(sheet.getName() != SHEETS.advancedlab.getName()) {
        let users = sheet.getRange(3, 11, sheet.getLastRow() -1, 1).getValues();
        users = [].concat(...users);
        users.forEach( user => {
          if(user!= null || user != undefined || user != "" || user != " " || user != "Test" || user != "FORMULA ROW") {
            userList.push(user);
          }
        })
      } 
    }
    let adv = SHEETS.advancedlab.getRange(3, 14, SHEETS.advancedlab.getLastRow() -1, 1).getValues();
    adv = [].concat(...adv);
    adv.forEach(id => {
      if(id !== null || id !== undefined || id !== "" || id !== " " ) {
        userList.push(id.toString());
      }
    })

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

    // Fetch Top 10 Power Users
    const chop = items.slice(0, 11);
    Logger.log(chop);

    // Match ID with Email
    let output = [];
    chop.forEach(id => {
      const finder = OTHERSHEETS.approved.createTextFinder(id[0]);
      const search = finder.findNext();
      if (search != null) {
        let index = search.getRow();
        Logger.log(`INDEX : ${index}`);
        let email = OTHERSHEETS.approved.getRange(index, 2, 1, 1).getValue();
        output.push([email, id[1]]);
      }
    })
    Logger.log(output);
    return output;
  }


  CalculateStandardDeviation () {
    const distribution = this.CalculateDistribution();
    let n = distribution.length;
    Logger.log(`n = ${n}`);

    let values = [];
    distribution.forEach(person => values.push(person[1]))
    Logger.log(values)
    let mean = values.reduce((a, b) => a + b) / n;
    Logger.log(`Mean = ${mean}`);

    let standardDeviation = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    Logger.log(`Standard Deviation for Number of Submissions : ${standardDeviation}`);
    return standardDeviation;
  }


  CalculateArithmeticMean () {
    const distribution = this.CalculateDistribution();
    let n = distribution.length;
    Logger.log(`n = ${n}`);

    let values = [];
    distribution.forEach(person => values.push(person[1]))
    Logger.log(values)
    let mean = values.reduce((a, b) => a + b) / n;
    Logger.log(`Mean = ${mean}`);

    return mean;
  }
  PrintStatistics () {
    const mean = this.CalculateArithmeticMean();
    OTHERSHEETS.data.getRange(102, 3, 1, 1).setValue(mean);
    const stand = this.CalculateStandardDeviation();
    OTHERSHEETS.data.getRange(103, 3, 1, 1).setValue(stand);
  }


  CountTiers () {
    let tiers = OTHERSHEETS.approved.getRange(3, 4, OTHERSHEETS.approved.getLastRow() -2, 1).getValues();
    tiers = [].concat(...tiers);

    let occurrences = tiers.reduce( (acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    
    let items = Object.keys(occurrences).map((key) => {
      if (key !== "" || key !== undefined || key !== null || key !== " ") {
        return [key, occurrences[key]];
      }
    });
    // Logger.log(items);
    return items;  
  }
  PrintTiers () {
    const tiers = this.CountTiers();
    tiers.forEach( (tier, index) => {
      OTHERSHEETS.data.getRange(39 + index, 3, 1, 1).setValue(tier[1]);
      Logger.log(tier)
    });
  }



  CountStatuses () {
    let statuses = [];
    for(const [name, sheet] of Object.entries(SHEETS)) { 
      let stats = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
      stats = [].concat(...stats);
      stats.forEach( status => statuses.push(status));
    }
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
    Logger.log(items);
    
    return items; 
  }
  PrintStatusCounts () {
    let data = this.CountStatuses();
    let completed = 0;
    let cancelled = 0;
    let inprogress = 0;
    data.forEach( status => {
      if(status[0] == STATUS.completed || status[0] == STATUS.billed || status[0] == STATUS.closed || status[0] == STATUS.pickedUp) {
        completed += status[1];
      }
      if(status[0] == STATUS.cancelled) cancelled += status[1];
      if(status[0] == STATUS.inProgress) inprogress += status[1];
    })
    OTHERSHEETS.data.getRange(8, 3, 1, 1).setValue(completed);
    OTHERSHEETS.data.getRange(9, 3, 1, 1).setValue(cancelled);
    OTHERSHEETS.data.getRange(10, 3, 1, 1).setValue(inprogress);
    Logger.log(completed);
  }

  AdvancedLabCounts () {

    let range = SHEETS.advancedlab.getRange(3, 5, SHEETS.advancedlab.getLastRow() -1, 1).getValues();
    range = [].concat(...range);
    let printers = []
    printers = range.filter(Boolean);

    let occurrences = printers.reduce( (acc, curr) => {
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

    Logger.log(items);
    
    return items;  
  }

  _GetByHeader (sheet, colName, row) {
    let data = sheet.getDataRange().getValues();
    let col = data[0].indexOf(colName);
    if (col != -1) {
      return data[row - 1][col];
    }
  };
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
  const calc = new Calculate();
  try {
    Logger.log(`Calculating Metrics .....`);
    calc.PrintActiveUsers();
    calc.PrintTiers();
    calc.PrintStatusCounts();
    calc.PrintStatistics();
    calc.PrintTypesCount();
    calc.PrintSubmissionData();
    calc.PrintTurnaroundTimes();
    calc.PrintDistributionNumbers();
    Logger.log(`Recalculated Metrics`);
  } catch (err) {
    Logger.log(`${err} : Couldn't generate statistics on Metrics.`);
  }
}

const _testDist = () => {
  const c = new Calculate();
  c.PrintDistributionNumbers();
}







