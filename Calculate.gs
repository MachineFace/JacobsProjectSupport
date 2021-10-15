

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the turnaround time for a given sheet and return the average
 * @param {spreadsheet} sheet
 * @returns {duration} formatted time
 */
const CalculateAverageTurnaround = (sheet) => {
  const writer = new WriteLogger();
  // Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format. 
  let completionTimes = sheet.getRange(3, 44, sheet.getLastRow(), 1).getValues(); // Column AR2:AR (Format: Row, Column, Last Row, Number of Columns)

  // Get list of times and remove all the Bullshit
  let revisedTimes = [];
  try {
    for (let i = 0; i < completionTimes.length; i++) {
      let time = completionTimes[i][0];
      if (time != '' || time != undefined || time != null || time != ' ' || time != NaN || time != '[]') {
        let ds = time.replace(" ", ":");
        let t = ds.split(':');
        if (!isNaN(parseFloat(t[1])) && isFinite(t[1])) // check if the 2nd number out of the array of 4 is BS or not - if not BS, write the values to the array
        {
          revisedTimes.push(t);
        }
      }
    }
  }
  catch (err) {
    writer.Error(`${err} : Couldn't fetch list of times. Probably a sheet error.`);
  }

  //Convert everything to seconds
  let totals = [];
  try {
    for (let i = 0; i < revisedTimes.length; i++) {
      //Time
      let days = (+revisedTimes[i][0] * 24 * 60); //days to hours to minutes
      let hours = (+revisedTimes[i][1] * 60); //hours to minutes
      let minutes = (+revisedTimes[i][2]); //minutes     
      let seconds = (+revisedTimes[i][3]); //seconds, forget about seconds

      let total = days + hours + minutes;
      totals.push(total);
    }
  }
  catch (err) {
    Logger.log(`${err} : Could not sum times.`);
  }

  //sum all the totals
  let totalTotal = 0;
  for (let i = 0; i < totals.length; i++) {
    totalTotal += totals[i];
  }

  //Average the totals (a list of times in minutes)
  let averageMins = totalTotal / totals.length;

  //Recalculate average minutes into readable duration
  let averageRecalc = averageMins;

  let mins = parseInt((averageRecalc % 60), 10); //Calc mins
  averageRecalc = Math.floor(averageRecalc / 60); //Difference mins to hrs
  let minutesAsString = mins < 10 ? "0" + mins : mins + ""; //Pad with a zero

  let hrs = averageRecalc % 24; //Calc hrs
  averageRecalc = Math.floor(averageRecalc / 24); //Difference hrs to days
  let dys = averageRecalc;

  //Format into readable time and return (if data is still missing, set it to zero)
  if (isNaN(dys)) dys = 0;
  if (isNaN(hrs)) hrs = 0;
  if (isNaN(minutesAsString)) minutesAsString = 0;

  let formatted = dys + 'd ' + hrs + 'h ' + minutesAsString + "m";
  return formatted;
}
const PrintTurnaroundTimes = () => {
  let data = [];
  for(const [key, sheet] of Object.entries(SHEETS)) {
    data.push([`${sheet.getName()} Turnaround`, CalculateAverageTurnaround(sheet)]);
  }
  data.forEach( (entry, index) => {
    OTHERSHEETS.data.getRange(26 + index, 2, 1, 1 ).setValue(entry[0]);
    OTHERSHEETS.data.getRange(26 + index, 4, 1, 1 ).setValue(entry[1]);
  })
}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate Turnaround Time
 * @param {time} start
 * @param {time} end
 * @returns {duration} formatted time
 */
const CalculateDuration = (start, end) => {
  const writer = new WriteLogger();
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
    writer.Info("Duration = " + formatted);

    // Return Completed time
    return formatted;
  }
  catch (err) {
    writer.Error(`${err} : Calculating the duration has failed for some reason.`);
  }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Count Active Users on Each Sheet
 * Mimic =COUNTUNIQUE('Canon Plotter'!J3:J,'Other Tools'!J3:J,Creaform!J3:J,Othermill!J3:J,'Vinyl Cutter'!J3:J,'Haas & Tormach'!J3:J,Shopbot!J5:J,'Advanced Lab'!J3:J,Waterjet!J3:J,Fablight!J3:J,Ultimaker!J3:J,'Laser Cutter'!J3:J)
 * @returns {number} count
 */
const CountActiveUsers = () => {
  const writer = new WriteLogger();
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

  var count = unique.length - 1; //Removes the space.
  writer.Info(`Active JPS Users : ${count}`);
  return count;
}
const PrintActiveUsers = () => {
  const users = CountActiveUsers();
  OTHERSHEETS.data.getRange("C4").setValue(users);
}

/**
 * Count Number of Submissions
 */
const CountEachSubmission = () => {
  const writer = new WriteLogger();
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
  writer.Info(data)
  return data;
}
const PrintSubmissionData = () => {
  let data = CountEachSubmission();
  data.forEach( (entry, index) => {
    OTHERSHEETS.data.getRange(13 + index , 2, 1, 1).setValue(entry[0]);
    OTHERSHEETS.data.getRange(13 + index , 3, 1, 1).setValue(entry[1]);
  })
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
const CreateTopTen = () => {
  const writer = new WriteLogger();
  const distribution = CalculateDistribution();
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
    writer.Info(`${pair[0]} -----> ${pair[1]}`)
    OTHERSHEETS.data.getRange(106+index,2,1,1).setValue(pair[0])
    OTHERSHEETS.data.getRange(106+index,3,1,1).setValue(pair[1])
  })

  return chop;

}

/**
 * Calculate Distribution of projects.
 */
const CalculateDistribution = () => {
  const writer = new WriteLogger();
  let count = {};
  let userList = [];
  for(const [name, sheet] of Object.entries(SHEETS)) { 
    let users = sheet.getRange(3, 10, sheet.getLastRow(), 1).getValues();
    users = [].concat(...users);
    users.forEach( user => {
      if(user!= null || user != undefined || user != "" || user != " " || user != "Test" || user != "FORMULA ROW") {
        userList.push(user);
      }
    })
  }
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
  writer.Info(items);
  return items;  
}


/**
 * Count Types of Users
 */
const CountTypes = () => {
  const writer = new WriteLogger();
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
  writer.Debug(items);
  
  return items;  
}
const PrintTypesCount = () => {
  let indexes = [];
  let types = CountTypes();
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

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
const CreateTopTenByID = () => {
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



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Standard Deviation in the JPS Population
 * @param {[any]} array
 * @returns {number} standard deviation
 */
const CalculateStandardDeviation = () => {
  const writer = new WriteLogger();
  const distribution = CalculateDistribution();
  let n = distribution.length;
  writer.Debug(`n = ${n}`);

  let values = [];
  distribution.forEach(person => values.push(person[1]))
  writer.Debug(values)
  let mean = values.reduce((a, b) => a + b) / n;
  writer.Info(`Mean = ${mean}`);

  let standardDeviation = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  writer.Info(`Standard Deviation for Number of Submissions : ${standardDeviation}`);
  return standardDeviation;
}


/**
 * Arithmetic Mean
 */
const CalculateArithmeticMean = () => {
  const writer = new WriteLogger();
  const distribution = CalculateDistribution();
  let n = distribution.length;
  writer.Debug(`n = ${n}`);

  let values = [];
  distribution.forEach(person => values.push(person[1]))
  writer.Debug(values)
  let mean = values.reduce((a, b) => a + b) / n;
  writer.Info(`Mean = ${mean}`);

  return mean;
}
const PrintStatistics = () => {
  const mean = CalculateArithmeticMean();
  OTHERSHEETS.data.getRange(102, 3, 1, 1).setValue(mean);
  const stand = CalculateStandardDeviation();
  OTHERSHEETS.data.getRange(103, 3, 1, 1).setValue(stand);
}


/**
 * Count Tiers
 */
const CountTiers = () => {
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
const PrintTiers = () => {
  const tiers = CountTiers();
  tiers.forEach( (tier, index) => {
    OTHERSHEETS.data.getRange(39 + index, 3, 1, 1).setValue(tier[1]);
    Logger.log(tier)
  });
}



/**
 * Count Statuses
 */
const CountStatuses = () => {
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
const PrintStatusCounts = () => {
  let data = CountStatuses();
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

const AdvancedLabCounts = () => {

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


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
  try {
    Logger.log(`Calculating Metrics .....`);
    PrintActiveUsers();
    PrintTiers();
    PrintStatusCounts();
    PrintStatistics();
    PrintTypesCount();
    PrintSubmissionData();
    PrintTurnaroundTimes();
    Logger.log(`Recalculated Metrics`);
  }
  catch (err) {
    Logger.log(`${err} : Couldn't generate statistics on Metrics.`);
  }

}









