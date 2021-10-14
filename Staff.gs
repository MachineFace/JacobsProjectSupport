



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Design Specialist Class function 
 * @param {string} name
 * @param {string} fullname
 * @param {string} email
 */
/**
 * ----------------------------------------------------------------------------------------------------------------
 * Design Specialist Class
 */
class DesignSpecialist
{
  constructor(name, fullname, email)
  {
    this._name = name;
    this._fullname = fullname;
    this._email = email;
    var link;
    this._type = 'Design Specialist';
    this._admin = true;
  }
  get name() { return this._name; }
  set name(x) { this._name = x; }
  get fullname() { return this._fullname; }
  set fullname(x) { this._fullname = x; }
  get email() { return this._email; }
  set email(x) { this._email = x; }
  get link() { return '<a href = "' + this._email + '">' + this._email + '</a>'; }
  get type() { return this._type; }
  get admin() { return this._admin; }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * SS Class - child of DS Class
 */
class StudentSupervisor extends DesignSpecialist
{
  constructor(name, fullname, email)
  {
    // The reserved 'super' keyword is for making super-constructor calls and allows access to parent methods.
    super(name, fullname, email);
    // Note: In derived classes, super() must be called before you can use 'this'. Leaving this out will cause a reference error.
    this._name = name;
    this._fullname = fullname;
    this._email = email;
    var link;
    this._type = 'Student Supervisor';
    this._admin = false;
  }
  get name() { return this._name; }
  set name(x) { this._name = x; }
  get fullname() { return this._fullname; }
  set fullname(x) { this._fullname = x; }
  get email() { return this._email; }
  set email(x) { this._email = x; }
  get link() { return '<a href = "' + this._email + '">' + this._email + '</a>'; }
  get type() { return this._type; }
  get admin() { return this._admin; }
}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Manager Class - child of DS Class
 */
class Manager extends DesignSpecialist 
{ 
  constructor(name, fullname, email) 
  {
    super(name, fullname, email);
    this._name = name;
    this._fullname = fullname;
    this._email = email;
    var link;
    this._type = 'Manager';
    this._admin = true;
  }
  get name() { return this._name; }
  set name(x) { this._name = x; }
  get fullname() { return this._fullname; }
  set fullname(x) { this._fullname = x; }
  get email() { return this._email; }
  set email(x) { this._email = x; }
  get link() { return '<a href = "' + this._email + '">' + this._email + '</a>'; }
  get type() { return this._type; }
  get admin() { return this._admin; }
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
    let stafflist = OTHERSHEETS.staff;
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
  let staff = OTHERSHEETS.staff.getRange(2, 1, OTHERSHEETS.staff.getLastRow(), 4).getValues();

  for (let i in staff) {
    let _name = staff[i][0];
    let _fullname = staff[i][1];
    let _email = staff[i][2];
    let _emailLink = staff[i][3];
    //Logger.log('name = %s, fullname = %s,  email = %s, emaillink = %s',_name,_fullname,_email,_emailLink);

    switch (property) {
        case "fullname":
          // @ts-ignore
          if (staff[i][0] == name) return _fullname;
        case "email":
          // @ts-ignore
          if (staff[i][0] == name) return _email;
        case "emaillink":
          // @ts-ignore
          if (staff[i][0] == name) return _emailLink;
    }
  }
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a Design Specialist from spreadsheet and return a list
 * @returns {[string]} DSList
 */
const CreateDS = () => {
    let stafflist = OTHERSHEETS.staff;
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



