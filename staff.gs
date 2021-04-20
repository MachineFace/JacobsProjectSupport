



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Design Specialist Class function 
 * @param {string} name
 * @param {string} fullname
 * @param {string} email
 */
var DesignSpecialist = (name, fullname, email) => {
    this.name = name;
    this.fullname = fullname;
    this.email = email;
    this.emailLink = '<a href = "' + email + '">' + email + '</a>';
}




/**
 * ----------------------------------------------------------------------------------------------------------------
 * Turn an email address into a link
 * @param {string} email
 * @returns {string} link
 */
const MakeLink = (email) => {
    return '<a href="mailto:' + email + '">' + email + '</a>';
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return Staff Email as a string.
 */
const StaffEmailAsString = () => {
    let stafflist = sheetDict.staff;
    let last = stafflist.getLastRow();
    let emaillist = stafflist.getRange(2, 3, last - 1, 1).getValues();
    return emaillist.toString();
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Invoke Design Specialist properties
 * @param {string} name
 * @param {string} property
 * @returns {string} fullname, email, or email link
 */
const InvokeDS = (name, property) => {
    let stafflist = sheetDict.staff;
    let last = stafflist.getLastRow();
    let staffrange = stafflist.getRange(2, 1, last, 4).getValues();

    for (let i in staffrange) {
        let _name = staffrange[i][0];
        let _fullname = staffrange[i][1];
        let _email = staffrange[i][2];
        let _emailLink = staffrange[i][3];
        //Logger.log('name = %s, fullname = %s,  email = %s, emaillink = %s',_name,_fullname,_email,_emailLink);

        switch (property) {
            case "fullname":
                // @ts-ignore
                if (staffrange[i][0] == name) return _fullname;
            case "email":
                // @ts-ignore
                if (staffrange[i][0] == name) return _email;
            case "emaillink":
                // @ts-ignore
                if (staffrange[i][0] == name) return _emailLink;
        }
    }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a Design Specialist from spreadsheet and return a list
 * @returns {[string]} DSList
 */
const CreateDS = () => {
    let stafflist = sheetDict.staff;
    let last = stafflist.getLastRow();
    let staffrange = stafflist.getRange(2, 1, last, 4).getValues();

    let DSList = [];
    for (let i = 0; i < staffrange.length - 1; i++) {
        let _name = staffrange[i][0];
        let _fullname = staffrange[i][1];
        let _email = staffrange[i][2];
        let _emailLink = staffrange[i][3];

        if (_emailLink == null || _emailLink == undefined || _emailLink == "" && _email != null) {
            // @ts-ignore
            _emailLink = MakeLink(_email);
            stafflist.getRange(last, 4).setValue(_emailLink);
        }
        // @ts-ignore
        let DS = new DesignSpecialist(_name, _fullname, _email);  //Make a new DS
        DSList.push(DS);  //Push to List
    }
    DSList.forEach(element => Logg(element));
    // @ts-ignore
    return DSList;
}



