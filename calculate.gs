

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the turnaround time for a given sheet and return the average
 * @param {spreadsheet} sheet
 * @returns {duration} formatted time
 */
var CalculateAverageTurnaround = function (sheet) {

    //Parse the stopwatch durations from 'dd hh:mm:ss' into seconds-format, average together, and reformat in 'dd hh:mm:ss' format. 

    var last = sheet.getLastRow();
    var completionTimes = sheet.getRange(3, 44, last, 1).getValues(); //Column AR2:AR (Format: Row, Column, Last Row, Number of Columns)

    //Get list of times and remove all the Bullshit
    var revisedTimes = [];
    try {
        for (var i = 0; i < completionTimes.length; i++) {
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
        Logg(err + ' : Could not fetch list of times. Probably a sheet error.');
    }

    //Convert everything to seconds
    var totals = [];
    try {
        for (var i = 0; i < revisedTimes.length; i++) {
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
        Logg(err + ' : Could not sum times.');
    }

    //sum all the totals
    var totalTotal = 0;
    for (var i = 0; i < totals.length; i++) {
        totalTotal += totals[i];
    }

    //Average the totals (a list of times in minutes)
    var averageMins = totalTotal / totals.length;

    //Recalculate average minutes into readable duration
    var averageRecalc = averageMins;

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
var CalculateDuration = function (start, end) {
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
        Logg(err + " : Calculating the duration has failed for some reason.");
    }
}






/**
 * ----------------------------------------------------------------------------------------------------------------
 * Count Active Users on Each Sheet
 * Mimic =COUNTUNIQUE('Canon Plotter'!J3:J,'Other Tools'!J3:J,Creaform!J3:J,Othermill!J3:J,'Vinyl Cutter'!J3:J,'Haas & Tormach'!J3:J,Shopbot!J5:J,'Advanced Lab'!J3:J,Waterjet!J3:J,Fablight!J3:J,Ultimaker!J3:J,'Laser Cutter'!J3:J)
 * @returns {number} count
 */
function CountActiveUsers() {
    let people = [];
    let nameRange = 'J3:J';
    let plotter = sheetDict.plotter.getRange(nameRange).getValues();
    let other = sheetDict.othertools.getRange(nameRange).getValues();
    let creaform = sheetDict.creaform.getRange(nameRange).getValues();
    let othermill = sheetDict.othermill.getRange(nameRange).getValues();
    let vinyl = sheetDict.vinyl.getRange(nameRange).getValues();
    let haas = sheetDict.haas.getRange(nameRange).getValues();
    let shopbot = sheetDict.shopbot.getRange(nameRange).getValues();
    let adv = sheetDict.advancedlab.getRange(nameRange).getValues();
    let waterjet = sheetDict.waterjet.getRange(nameRange).getValues();
    let fablight = sheetDict.fablight.getRange(nameRange).getValues();
    let ultimaker = sheetDict.ultimaker.getRange(nameRange).getValues();
    let laser = sheetDict.laser.getRange(nameRange).getValues();

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

    //Filter out duplicate entries in the list
    let unique = people.filter((c, index) => {
        return people.indexOf(c) === index;
    });

    var count = unique.length - 1; //Removes the space.
    Logger.log('Active JPS Users : ' + count);
    return count;
}





/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
function CalculateDistribution() {
    let sheets = SpreadsheetApp.getActiveSpreadsheet();
    let people = [];
    let nameRange = 'J3:J';
    let plotter = sheetDict.plotter.getRange(nameRange).getValues();
    let other = sheetDict.othertools.getRange(nameRange).getValues();
    let creaform = sheetDict.creaform.getRange(nameRange).getValues();
    let othermill = sheetDict.othermill.getRange(nameRange).getValues();
    let vinyl = sheetDict.vinyl.getRange(nameRange).getValues();
    let haas = sheetDict.haas.getRange(nameRange).getValues();
    let shopbot = sheetDict.shopbot.getRange(nameRange).getValues();
    let adv = sheetDict.advancedlab.getRange(nameRange).getValues();
    let waterjet = sheetDict.waterjet.getRange(nameRange).getValues();
    let fablight = sheetDict.fablight.getRange(nameRange).getValues();
    let ultimaker = sheetDict.ultimaker.getRange(nameRange).getValues();
    let laser = sheetDict.laser.getRange(nameRange).getValues();

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

    var distribution = {}, max = 0, result = [];

    people.forEach(function (a) {
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
    var counts = [];
    var items = Object.keys(distribution).map(function (key) {
        if (key != "" || key != undefined || key != null) {
            counts.push(distribution[key]);
            return [key, distribution[key]];
        }
    });

    //Log to sheet
    counts.sort((a, b) => a - b);
    for (var i = 0; i < max; i++) {
        let rownum = 2 + i;
        if (counts[i] < 2000) sheetDict.backgrounddata.getRange('V' + rownum).setValue(counts[i]);
    }


    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    // Create a new array with only the first 10 items and remove Tests
    var chop = items.slice(1, 12);
    //Logger.log(chop);
    var loc;
    chop.forEach(function(item) {
        item.forEach(function(pair) {
            if(pair == 'Test')  loc = chop.indexOf(item);
        })
    });
    chop.splice(loc,1);
    Logger.log(chop);
    return chop;

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Calculate the Distribution in the JPS population
 * Writes the distribution to a sheet, and returns the top ten most active users
 * @returns {[string]} names
 */
function CalcDistributionByID() {
    let emails = [];
    let names = [];
    let ids = [];

    let pageRange = 'I4:K';
    
    //Get it all and push to lists
    let plotter = sheetDict.plotter.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
            resolve(
              emails.push( [index, item[0]] ),
              names.push( [index, item[1]] ),
              ids.push( [index, item[2].toString()] )
            );
          })
    });
    let other = sheetDict.othertools.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
            return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let creaform = sheetDict.creaform.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let othermill = sheetDict.othermill.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let vinyl = sheetDict.vinyl.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let haas = sheetDict.haas.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let shopbot = sheetDict.shopbot.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let adv = sheetDict.advancedlab.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let waterjet = sheetDict.waterjet.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let fablight = sheetDict.fablight.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let ultimaker = sheetDict.ultimaker.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });
    let laser = sheetDict.laser.getRange(pageRange).getValues().filter(n => n[0])
        .forEach(async (item,index) => {
          return new Promise(resolve => {
              resolve(
                  emails.push( [index, item[0]] ),
                  names.push( [index, item[1]] ),
                  ids.push( [index, item[2].toString()] ),
              );
            })
    });

    //Logger.log(emails);
    //Logger.log(names);
    //Logger.log(ids);
    
    idList = [];
    ids.forEach( async item => {
        return new Promise(resolve => {
              resolve(
                  idList.push(item[1])
              );
            }) 
    });
    
    let distribution = {}, max = 0, result = [];

    idList.forEach(a => {
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
    let studentList = sheetDict.approved.getRange('C2:C').getValues();
    chop.forEach(item => {
        let index = studentList.findIndex(item[0]);
        let email = sheetDict.approved.getRange('B' + index).getValue();
        sortedEmails.push(email);
    });

    //Query Store and return how much spent
    Logger.log(chop);
    Logger.log(sortedEmails);

    let spending = [];
    sortedEmails.forEach(async email => {
        return new Promise(resolve => {
          resolve(
              spending.push(GetShopifyCustomerByEmail(email).total_spent)
          )
        });
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
function CalculateStandardDeviation() {
     
    let people = [];
    let d = sheetDict.backgrounddata.getRange('V2:V').getValues();
    for(var i = 0; i < d.length; i++){ 
        if(d[i] != '' && d[i] != null && d[i] != undefined && d[i] != ' ') {
            people.push(d[i]); 
        }
    }
    Logger.log('People : ' + people.toString()); 
    
    var n = people.length;
    Logger.log('n = ' + n);
    
    var mean = people.reduce((a, b) => a + b) / n;
    Logger.log('mean = ' + mean);

    var standardDeviation = Math.sqrt(people.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    Logger.log('Standard Deviation for Number of Submissions : ' + standardDeviation);
    return standardDeviation;
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Metrics - DO NOT DELETE
 * Used to Calculate Average Turnaround times and write to 'Data/Metrics' sheet
 */
function Metrics() {
    try {
        //Return Averages to Metrics beginning at cell D26 
        var metricsTab = sheetDict.data;

        var laserSheet = sheetDict.laser; //Laser Sheet
        metricsTab.getRange('D26').setValue(CalculateAverageTurnaround(laserSheet));

        var ultimakerSheet = sheetDict.ultimaker; //Ultimaker Sheet
        metricsTab.getRange('D27').setValue(CalculateAverageTurnaround(ultimakerSheet));

        var fablightSheet = sheetDict.fablight; //Fablight Sheet
        metricsTab.getRange('D28').setValue(CalculateAverageTurnaround(fablightSheet));

        var omaxSheet = sheetDict.waterjet; //Waterjet Sheet
        metricsTab.getRange('D29').setValue(CalculateAverageTurnaround(omaxSheet));

        var advLabSheet = sheetDict.advancedlab; //Advanced Lab Sheet 
        metricsTab.getRange('D30').setValue(CalculateAverageTurnaround(advLabSheet));

        var shopbotSheet = sheetDict.shopbot; //Shopbot Sheet
        metricsTab.getRange('D31').setValue(CalculateAverageTurnaround(shopbotSheet));

        var haasSheet = sheetDict.haas; //Haas Sheet 
        metricsTab.getRange('D32').setValue(CalculateAverageTurnaround(haasSheet));

        var vinylSheet = sheetDict.vinyl; //Vinyl Sheet
        metricsTab.getRange('D33').setValue(CalculateAverageTurnaround(vinylSheet));

        var othermillSheet = sheetDict.othermill; //Othermill Sheet
        metricsTab.getRange('D34').setValue(CalculateAverageTurnaround(othermillSheet));

        var creaformSheet = sheetDict.creaform; //Creaform Sheet
        metricsTab.getRange('D35').setValue(CalculateAverageTurnaround(creaformSheet));

        var otherSheet = sheetDict.othertools; //Other Sheet
        metricsTab.getRange('D36').setValue(CalculateAverageTurnaround(otherSheet));

        var plotter = sheetDict.plotter; //Plotter Sheet
        metricsTab.getRange('D37').setValue(CalculateAverageTurnaround(plotter));
        Logger.log('Recalculated Metrics');
    }
    catch (err) {
        Logger.log(err + ' : Couldnt generate statistics on Metrics.');
    }

}
