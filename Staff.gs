

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Class for Creating a Design Specialist Employee
 */
class DesignSpecialist
{
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
  }) {
    this.name = name ? name : `DS`;
    this.fullname = fullname ? fullname : `Design Specialist`;
    this.email = email ? email : `jacobsprojectsupport@berkeley.edu`;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = `Design Specialist`;
    this.isAdmin = true;
    this.shortCode = `DS`;
  }
  
  get() {
    return {
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
    }
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * SS Class - child of DS Class
 * Note: In derived classes, super() must be called before you can use 'this'. Leaving this out will cause a reference error.
 */
class StudentSupervisor extends DesignSpecialist
{
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
  }) {
    // The reserved 'super' keyword is for making super-constructor calls and allows access to parent methods.
    super(name, fullname, email);
    this.name = name ? name : `SS`;
    this.fullname = fullname ? fullname : `Student Supervisor`;
    this.email = email ? email : `jacobsprojectsupport@berkeley.edu`;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = 'Student Supervisor';
    this.isAdmin = false;
    this.shortCode = `SS`;
  }

  get() {
    return {
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
    }
  }

}


/**
 * ----------------------------------------------------------------------------------------------------------------
 * Manager Class - child of DS Class
 */
class Manager extends DesignSpecialist 
{ 
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
  }) 
  {
    super(name, fullname, email);
    this.name = name ? name : `MA`;
    this.fullname = fullname ? fullname : `Manager`;
    this.email = email ? email : `jacobsprojectsupport@berkeley.edu`;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = 'Manager';
    this.isAdmin = true;
    this.shortCode = `MA`;
  }

  get() {
    return {
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
    }
  }
  
}



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Return Staff Email as a string.
 */
const StaffEmailAsString = () => {
  let emaillist = OTHERSHEETS.Staff.getRange(2, 3, OTHERSHEETS.Staff.getLastRow() - 1, 1).getValues();
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
  let staff = OTHERSHEETS.Staff.getRange(2, 1, OTHERSHEETS.Staff.getLastRow(), 4).getValues();

  for (let i in staff) {
    let _name = staff[i][0];
    let _fullname = staff[i][1];
    let _email = staff[i][2];
    let _emailLink = staff[i][3];
    // console.info(`Name : ${name}, Full : ${fullname}, Email : ${email}, Link : ${link}`);

    switch (property) {
      case "fullname":
        if (staff[i][0] == name) return _fullname;
      case "email":
        if (staff[i][0] == name) return _email;
      case "emaillink":
        if (staff[i][0] == name) return _emailLink;
    }
  }
}

/**
 * Helper Make Link Function
 */
const MakeLink = (email) => `<a href = "${email}">${email}</a>`;



/**
 * ----------------------------------------------------------------------------------------------------------------
 * Create a Design Specialist from spreadsheet and return a list
 * @returns {[string]} DSList
 */
const CreateDS = () => {
  let staff = [];
  let range = OTHERSHEETS.Staff.getRange(2, 1, OTHERSHEETS.Staff.getLastRow() - 1, 5).getValues();
  let culled = range.filter(Boolean);

  culled.forEach( row => {
    let name = row[0];
    let fullname = row[1];
    let email = row[2];
    let link = row[3];
    let type = row[4];
    // console.info(`Name : ${name}, Full : ${fullname}, Email : ${email}, Link : ${link}`);
    if(email && !link) {
      link = MakeLink(email);
      OTHERSHEETS.Staff.getRange(OTHERSHEETS.Staff.getLastRow() - 1, 4).setValue(link);
    }
    if(type == "DS") {
      let ds = new DesignSpecialist({name : name, fullname : fullname, email : email});
      staff.push(ds);
    } else if(type == "MA") {
      let ma = new Manager({name : name, fullname : fullname, email : email});
      staff.push(ma)
    } else if(type == "SS") {
      let ss = new StudentSupervisor({name : name, fullname : fullname, email : email});
      staff.push(ss);
    }
  });
  console.info(JSON.stringify(staff));
  return staff;
}


const _testDS = () => {
  const ds = new DesignSpecialist({
    name : "Mike",
    fullname : "Mike Special",
    email : "some@email.com",
  })
  console.info(ds.get())
  console.info(`Name : ${ds.name}`)
}












