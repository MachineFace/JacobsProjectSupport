

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the turnaround time for a given sheet and return the average
 * @param {spreadsheet} sheet
 * @returns {duration} formatted time
 */
const CalculateAverageTurnaround = (sheet) => {

    //Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format. 
    let completionTimes = sheet.getRange(3, 44, sheet.getLastRow(), 1).getValues(); //Column AR2:AR (Format: Row, Column, Last Row, Number of Columns)

    //Get list of times and remove all the Bullshit
    let revisedTimes = [];
    try {
        for (let i = 0; i < completionTimes.length; i++) {
            let time = completionTimes[i][0];
            if (time != '' || time != undefined || time != null || time != ' ' || time != NaN || time != '[]') {
                let ds = time.replace(" ", ":");
                let t = ds.split(':');
                if (!isNaN(parseFloat(t[1])) && isFinite(t[1])) //check if the 2nd number out of the array of 4 is BS or not - if not BS, write the values to the array
                {
                    revisedTimes.push(t);
                }
            }
        }
    }
    catch (err) {
        Logger.log(`${err} : Could not fetch list of times. Probably a sheet error.`);
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





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate Turnaround Time
 * @param {time} start
 * @param {time} end
 * @returns {duration} formatted time
 */
const CalculateDuration = (start, end) => {
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
        Logg("Duration = " + formatted);

        //Return Completed time
        return formatted;
    }
    catch (err) {
        Logg(`${err} : Calculating the duration has failed for some reason.`);
    }
}






/**
 * ----------------------------------------------------------------------------------------------------------------
 * Count Active Users on Each Sheet
 * Mimic =COUNTUNIQUE('Canon Plotter'!J3:J,'Other Tools'!J3:J,Creaform!J3:J,Othermill!J3:J,'Vinyl Cutter'!J3:J,'Haas & Tormach'!J3:J,Shopbot!J5:J,'Advanced Lab'!J3:J,Waterjet!J3:J,Fablight!J3:J,Ultimaker!J3:J,'Laser Cutter'!J3:J)
 * @returns {number} count
 */
const CountActiveUsers = () => {
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
  Logger.log(`Active JPS Users : ${count}`);
  return count;
}





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
const CalculateDistribution = () => {
    let sheets = SpreadsheetApp.getActiveSpreadsheet();
    let people = [];
    let nameRange = 'J3:J';
    let plotter = SHEETS.plotter.getRange(nameRange).getValues();
    let other = SHEETS.othertools.getRange(nameRange).getValues();
    let creaform = SHEETS.creaform.getRange(nameRange).getValues();
    let othermill = SHEETS.othermill.getRange(nameRange).getValues();
    let vinyl = SHEETS.vinyl.getRange(nameRange).getValues();
    let haas = SHEETS.haas.getRange(nameRange).getValues();
    let shopbot = SHEETS.shopbot.getRange(nameRange).getValues();
    let adv = SHEETS.advancedlab.getRange(nameRange).getValues();
    let waterjet = SHEETS.waterjet.getRange(nameRange).getValues();
    let fablight = SHEETS.fablight.getRange(nameRange).getValues();
    let ultimaker = SHEETS.ultimaker.getRange(nameRange).getValues();
    let laser = SHEETS.laser.getRange(nameRange).getValues();

    plotter.forEach(item => people.push(item[0]));
    other.forEach(item => people.push(item[0]));
    creaform.forEach(item => people.push(item[0]));
    othermill.forEach(item => people.push(item[0]));
    vinyl.forEach(item => people.push(item[0]));
    haas.forEach(item => people.push(item[0]));
    shopbot.forEach(item => people.push(item[0]));
    adv.forEach(item => people.push(item[0]));
    waterjet.forEach(item => people.push(item[0]));
    fablight.forEach(item => people.push(item[0]));
    ultimaker.forEach(item => people.push(item[0]));
    laser.forEach(item => people.push(item[0]));

    let distribution = {}, max = 0, result = [];

    people.forEach((a) => {
        distribution[a] = (distribution[a] || 0) + 1;
        if (distribution[a] > max) {
            max = distribution[a];
            result = [a];
            return;
        }
        if (distribution[a] === max) {
            result.push(a);
        }
    });


    //Fetch Top 10 Power Users
    // Create items array
    let counts = [];
    let items = Object.keys(distribution).map(function (key) {
        if (key != "" || key != undefined || key != null) {
            counts.push(distribution[key]);
            return [key, distribution[key]];
        }
    });

    //Log to sheet
    counts.sort((a, b) => a - b);
    for (let i = 0; i < max; i++) {
        let rownum = 2 + i;
        if (counts[i] < 2000) OTHERSHEETS.backgrounddata.getRange('V' + rownum).setValue(counts[i]);
    }


    // Sort the array based on the second element
    items.sort((first, second) => {
        return second[1] - first[1];
    });

    // Create a new array with only the first 10 items and remove Tests
    let chop = items.slice(0, 11);
    //Logger.log(chop);
    let loc;
    chop.forEach((item) => {
        item.forEach((pair) => {
            if(pair == 'Test')  loc = chop.indexOf(item);
        })
    });
    chop.splice(loc,1);
    // Logger.log(chop);

    chop.forEach((pair, index) => {
      Logger.log(`${pair[0]} -----> ${pair[1]}`)
      OTHERSHEETS.data.getRange(106+index,2,1,1).setValue(pair[0])
      OTHERSHEETS.data.getRange(106+index,3,1,1).setValue(pair[1])
    })

    return chop;

}

const CalculateDistributionTwo = () => {
  let count = {};
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
  let occurrences = userList.reduce( (acc, curr) => {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  }, {});
  let items = Object.keys(occurrences).map((key) => {
    if (key != "" || key != undefined || key != null) {
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
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
var CalcDistributionByID = () => {
    let sheets = {
        'Ultimaker' : SHEETS.ultimaker.getRange(2, 9, SHEETS.ultimaker.getLastRow() -1, 3).getValues(),
        'Laser Cutter' : SHEETS.laser.getRange(2, 9, SHEETS.laser.getLastRow() -1, 3).getValues(),
        'Fablight' : SHEETS.fablight.getRange(2, 9, SHEETS.fablight.getLastRow() -1, 3).getValues(),
        'Waterjet' : SHEETS.waterjet.getRange(2, 9, SHEETS.waterjet.getLastRow() -1, 3).getValues(),
        'Advanced Lab' : SHEETS.advancedlab.getRange(2, 9, SHEETS.advancedlab.getLastRow() -1, 3).getValues(),
        'Shopbot' : SHEETS.shopbot.getRange(2, 9, SHEETS.shopbot.getLastRow() -1, 3).getValues(),
        'Haas & Tormach' : SHEETS.haas.getRange(2, 9, SHEETS.haas.getLastRow() -1, 3).getValues(),
        'Vinyl Cutter' : SHEETS.vinyl.getRange(2, 9, SHEETS.vinyl.getLastRow() -1, 3).getValues(),
        'Othermill' : SHEETS.othermill.getRange(2, 9, SHEETS.othermill.getLastRow() -1, 3).getValues(),
        'Other Tools' : SHEETS.othertools.getRange(2, 9, SHEETS.othertools.getLastRow() -1, 3).getValues(),
    }

    let ids = [];
    let names = [];
    let emails = [];

    for (let [page, values] of Object.entries(sheets)) {
        values.forEach( (item, index) => {          
            let i = index + 2;
            //Logger.log('Item : ' + item  + ', Index : ' + i); 

            let email = item[0];
            if(email !== null || email !== undefined || email != "") {
                emails.push(email);
            } 
            

            let name = item[1];
            if(name !== null || name !== undefined || name != "") {
                names.push(name);
            }
            

            let id = item[2];
            if(id !== null || id !== undefined || id != "" || id === typeof Number) {
                ids.push(id.toString());
            }
                 
        })
    }
    
    let cleanedIDS = ids.filter(n => n)
    Logger.log(cleanedIDS);
    
    
    let distribution = {}, max = 0, result = [];

    cleanedIDS.forEach(a => {
        distribution[a] = (distribution[a] || 0) + 1;
        if (distribution[a] > max) {
            max = distribution[a];
            result = [a];
            return;
        }
        if (distribution[a] === max) {
            result.push(a);
        }
    });
  

    //Fetch Top 10 Power Users
    // Create items array
    var items = Object.keys(distribution).map(key => {
        return [key, distribution[key]];
    });

    // Sort the array based on the second element
    items.sort( (first, second) => {
        return second[1] - first[1];
    });
    
    // Create a new array with only the first 10 items and remove Tests
    var chop = items.slice(0, 11);

    //Match IDS to emails
    let sortedEmails = [];
    let studentList = OTHERSHEETS.approved.getRange('C2:C').getValues();
    chop.forEach(async item => {
        let index = studentList.findIndex(item[0]) + 2;
        let email = OTHERSHEETS.approved.getRange('B' + index).getValue();
        return await sortedEmails.push(email);
    });

    //Query Store and return how much spent
    Logger.log(chop);
    Logger.log(sortedEmails);
    
    let spending = [];
    sortedEmails.forEach(async email => {
        return await spending.push(GetShopifyCustomerByEmail(email).total_spent) 
    });

    Logger.log(spending);
    
    return chop;
  
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Standard Deviation in the JPS Population
 * @param {[any]} array
 * @returns {number} standard deviation
 */
const CalculateStandardDeviation = () => {
     
    let people = [];
    let d = OTHERSHEETS.backgrounddata.getRange('V2:V').getValues();
    for(let i = 0; i < d.length; i++){ 
        if(d[i] != '' && d[i] != null && d[i] != undefined && d[i] != ' ') {
            people.push(d[i]); 
        }
    }
    Logger.log(`People : ${people.toString()}`); 
    
    let n = people.length;
    Logger.log(`n = ${n}`);
    
    let mean = people.reduce((a, b) => a + b) / n;
    Logger.log(`Mean = ${mean}`);

    let standardDeviation = Math.sqrt(people.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    Logger.log(`Standard Deviation for Number of Submissions : ${standardDeviation}`);
    return standardDeviation;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
const Metrics = () => {
    try {
        //Return Averages to Metrics beginning at cell D26 
        let metricsTab = OTHERSHEETS.data;

        let laserSheet = SHEETS.laser; //Laser Sheet
        metricsTab.getRange('D26').setValue(CalculateAverageTurnaround(laserSheet));

        let ultimakerSheet = SHEETS.ultimaker; //Ultimaker Sheet
        metricsTab.getRange('D27').setValue(CalculateAverageTurnaround(ultimakerSheet));

        let fablightSheet = SHEETS.fablight; //Fablight Sheet
        metricsTab.getRange('D28').setValue(CalculateAverageTurnaround(fablightSheet));

        let omaxSheet = SHEETS.waterjet; //Waterjet Sheet
        metricsTab.getRange('D29').setValue(CalculateAverageTurnaround(omaxSheet));

        let advLabSheet = SHEETS.advancedlab; //Advanced Lab Sheet 
        metricsTab.getRange('D30').setValue(CalculateAverageTurnaround(advLabSheet));

        let shopbotSheet = SHEETS.shopbot; //Shopbot Sheet
        metricsTab.getRange('D31').setValue(CalculateAverageTurnaround(shopbotSheet));

        let haasSheet = SHEETS.haas; //Haas Sheet 
        metricsTab.getRange('D32').setValue(CalculateAverageTurnaround(haasSheet));

        let vinylSheet = SHEETS.vinyl; //Vinyl Sheet
        metricsTab.getRange('D33').setValue(CalculateAverageTurnaround(vinylSheet));

        let othermillSheet = SHEETS.othermill; //Othermill Sheet
        metricsTab.getRange('D34').setValue(CalculateAverageTurnaround(othermillSheet));

        let creaformSheet = SHEETS.creaform; //Creaform Sheet
        metricsTab.getRange('D35').setValue(CalculateAverageTurnaround(creaformSheet));

        let otherSheet = SHEETS.othertools; //Other Sheet
        metricsTab.getRange('D36').setValue(CalculateAverageTurnaround(otherSheet));

        let plotter = SHEETS.plotter; //Plotter Sheet
        metricsTab.getRange('D37').setValue(CalculateAverageTurnaround(plotter));
        Logger.log('Recalculated Metrics');
    }
    catch (err) {
        Logger.log(`${err} : Couldnt generate statistics on Metrics.`);
    }

}









