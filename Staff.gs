

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## Class for Creating an Employee
 * Abstract Class
 */
class Employee {
  constructor({
    name : name = `FirstName`, 
    fullname : fullname = `FirstName LastName`, 
    email : email = SERVICE_EMAIL,
    areas : areas = [],
  }) {
    this.id = IDService.CreateId();
    this.name = name;
    this.fullname = fullname;
    this.email = email;
    this.areas = areas;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = `Employee`;
    this.isAdmin = false;
    this.shortCode = `EM`;
  }
  
  ToString() {
    return {
      id : this.id,
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
      areas : this.areas,
    }
  }

}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## Class for Creating a Design Specialist Employee
 */
class DesignSpecialist extends Employee {
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
    areas : areas,
  }) {
    // The reserved 'super' keyword is for making super-constructor calls and allows access to parent methods.
    super(name, fullname, email, areas);
    this.id = IDService.CreateId();
    this.name = name ? name : `DS`;
    this.fullname = fullname ? fullname : `Design Specialist`;
    this.email = email ? email : SERVICE_EMAIL;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = `Design Specialist`;
    this.isAdmin = true;
    this.shortCode = `DS`;
    this.areas = areas ? areas : [];
    this.SetAreas();
  }
  
  get() {
    return {
      id : this.id,
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
      areas : this.areas,
    }
  }

  /** @private */
  SetAreas () {
    switch (this.name) {
      case "Chris":
        this.areas = [ SHEETS.Advancedlab.getSheetName(), ];
        break;
      case "ChrisMyers":
        this.areas = [ SHEETS.Shopbot.getSheetName(), ];
        break;
      case "Cody":
        this.areas = [ SHEETS.Plotter.getSheetName(), SHEETS.GSI_Plotter.getSheetName(), SHEETS.Fablight.getSheetName(), SHEETS.Vinyl.getSheetName(), ];
        break;
      case "Gary":
        this.areas = [ SHEETS.Waterjet.getSheetName(), SHEETS.Othertools.getSheetName(), ];
        break;
      case "Nicole":
        break;
      case "Staff":
        this.areas = [ SHEETS.Laser.getSheetName(), ];
        break;
      default:
      case undefined:
        this.areas = [];
        break;
    }
  }

}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## SS Class - child of DS Class
 * Note: In derived classes, super() must be called before you can use 'this'. Leaving this out will cause a reference error.
 */
class StudentSupervisor extends Employee {
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
    areas : areas,
  }) {
    // The reserved 'super' keyword is for making super-constructor calls and allows access to parent methods.
    super(name, fullname, email, areas);
    this.id = IDService.CreateId();
    this.name = name ? name : `SS`;
    this.fullname = fullname ? fullname : `Student Supervisor`;
    this.email = email ? email : SERVICE_EMAIL;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = 'Student Supervisor';
    this.isAdmin = false;
    this.shortCode = `SS`;
    this.areas = areas ? areas : [];
  }

  get() {
    return {
      id : this.id,
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
      areas : this.areas,
    }
  }

}

/**
 * ----------------------------------------------------------------------------------------------------------------
 * ## Manager Class - child of DS Class
 */
class Manager extends Employee { 
  constructor({
    name : name, 
    fullname : fullname, 
    email : email,
    areas : areas,
  }) 
  {
    super(name, fullname, email, areas);
    this.id = IDService.CreateId();
    this.name = name ? name : `MA`;
    this.fullname = fullname ? fullname : `Manager`;
    this.email = email ? email : SERVICE_EMAIL;
    this.link = `<a href = "${this.email}">${this.email}</a>`;
    this.type = 'Manager';
    this.isAdmin = true;
    this.shortCode = `MA`;
    this.areas = areas ? areas : [];
  }

  get() {
    return {
      id : this.id,
      name : this.name,
      fullname : this.fullname,
      email : this.email,
      link : this.link,
      type : this.type,
      isAdmin : this.isAdmin,
      shortCode : this.shortCode,
      areas : this.areas,
    }
  }
  
}

const _testEmployee = () => {
  const e = new Employee({ 
    name : `Dick`, 
    fullname : `Dick Dickwad`, 
    email : `dickwad@berkeley.edu`,
    areas : [ `Backyard`, `Frontyard`, `Basement`, ],
  });
  console.info(`Employee: ${JSON.stringify(e.ToString(), null, 3)}`)
}


/**
 * ## Get Staff 
 */
const GetStaff = () => {
  try {
    let staff = {};
    let range = [...OTHERSHEETS.Staff.getRange(2, 1, OTHERSHEETS.Staff.getLastRow() - 1, 5).getValues()]
      .filter(Boolean);

    range.forEach( (row, index) => {
      if(!row) return;
      let name = row[0];
      let fullname = row[1];
      let email = row[2];
      let link = row[3];
      let type = row[4];
      if(email && !link) {
        link = MakeLink(email);
        OTHERSHEETS.Staff.getRange(OTHERSHEETS.Staff.getLastRow() - 1, 4).setValue(link);
      }
      switch(type) {
        case `DS`:
          staff[name] = new DesignSpecialist({
            name : name, 
            fullname : fullname, 
            email : email
          });
          break;
        case `MA`:
          staff[name] = new Manager({
            name : name, 
            fullname : fullname, 
            email : email
          });
          break;
        case `SS`:
          staff[name] = new StudentSupervisor({
            name : name, 
            fullname : fullname, 
            email : email
          });
          break;
      }
    });
    // console.info(JSON.stringify(staff));
    return staff;
  } catch(err) {
    console.error(`"GetStaff()" failed: ${err}`);
    return null;
  }
}




/**
 * ### Return All Staff Email as a string.
 * USED in Daily Email Summary
 * 
 * @returns {string} email
 */
const StaffEmailAsString = () => {
  try {
    let emaillist = SheetService.GetColumnDataByHeader(OTHERSHEETS.Staff, `EMAIL`)
      .filter(Boolean);
    let f = [...new Set(emaillist)].toString();
    return f;
  } catch(err) {
    console.error(`"StaffEmailAsString()" failed: ${err}`);
    return null;
  }
}


/**
 * ### Invoke Design Specialist properties
 * 
 * @param {string} name
 * @param {string} property
 * @returns {string} fullname, email, or email link
 */
const InvokeDS = (name, property) => {
  try {
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
  } catch(err) {
    console.error(`"InvokeDS()" failed: ${err}`);
    return null;
  }
}





/**
 * ### Create a Design Specialist from spreadsheet and return a list
 * 
 * @returns {[string]} DSList
 */
// const BuildStaff = () => {
//   try {
//     let staff = {};
//     let range = OTHERSHEETS.Staff.getRange(2, 1, OTHERSHEETS.Staff.getLastRow() - 1, 5).getValues();
//     let culled = range.filter(Boolean);

//     culled.forEach( (row, index) => {
//       let name = row[0];
//       let fullname = row[1];
//       let email = row[2];
//       let link = row[3];
//       let type = row[4];
//       // console.info(`Name : ${name}, Full : ${fullname}, Email : ${email}, Link : ${link}`);
//       if(email && !link) {
//         link = `<a href = "${email}">${email}</a>`;
//         OTHERSHEETS.Staff.getRange(OTHERSHEETS.Staff.getLastRow() - 1, 4).setValue(link);
//       }
//       if(type == "DS") {
//         let ds = new DesignSpecialist({
//           name : name, 
//           fullname : fullname, 
//           email : email
//         });
//         staff[name] = ds;
//       } else if(type == "MA") {
//         let ma = new Manager({
//           name : name, 
//           fullname : fullname, 
//           email : email
//         });
//         staff[name] = ma;
//       } else if(type == "SS") {
//         let ss = new StudentSupervisor({
//           name : name, 
//           fullname : fullname, 
//           email : email
//         });
//         staff[name] = ss;
//       }
//     });
//     // console.info(JSON.stringify(staff));
//     return staff;
//   } catch(err) {
//     console.error(`"BuildStaff()" failed: ${err}`);
//     return null;
//   }
// }




/**
 * ### Make Email Link
 * Make an email link formatted like: 
 * `<a href="name@email.edu">name@email.edu</a>`
 * 
 * @param {string} email
 * @returns {string} link
 */
const MakeLink = (email) => {
  try {
    if(!EmailService.ValidateEmail(email)) return null;
    let link = `<a href="${email}">${email}</a>`;
    return link;
  } catch(err) {
    console.error(`"MakeLink()" failed: ${err}`);
    return null;
  }
}










