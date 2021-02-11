/*      On open, create a custom menu

  function onOpen() {
  let spreadsheet = SpreadsheetApp.getActive();
  let menuItems = [
    {name: 'Generate Billing', functionName: 'customFunc'},
    {name: 'Some other function', functionName: 'otherFunc'}
  ];
  spreadsheet.addMenu('JPS', menuItems);
}
*/
    
    /*    
        onFormSubmit - Draft of new way to cast these variables - CP 2-8-21
        
        - All of the basic form questions (name, email, student ID, etc.) and columns have been made uniform on all sheets
    
        var data = {
            name: e.namedValues['Name'][0], 
            email: e.namedValues['Email Address'][0],
            sid: e.namedValues['Your Student ID Number?'][0],
            studentType: e.namedValues['What is your affiliation to the Jacobs Institute?'][0],
            projectname: e.namedValues['Project Name'][0],
            shipping: e.namedValues['Do you need your parts shipped to you?'][0],
            timestamp: e.namedValues['Timestamp'][0]
        };

        var {name, email, sid, studentType, projectname, shipping, timestamp} = data;
    */



  /*    
      onEdit - Draft of new way to cast these variables - CP 2-8-21 
      
      - All of the basic form questions (name, email, student ID, etc.) and columns have been made uniform on all sheets
          
          var status = getByHeader("(INTERNAL) Status", thisRow);   
          var designspecialist = getByHeader("(INTERNAL): DS Assigned", thisRow); 
          var priority = getByHeader("(INTERNAL): Priority", thisRow);
          var jobnumber = getByHeader("(INTERNAL AUTO) Job Number", thisRow);
          var studentApproval = getByHeader("Student Has Approved Job", thisRow);
          var submissiontime = getByHeader("Timestamp", thisRow);
          var email = getByHeader("Email Address", thisRow);
          var name = getByHeader("What is your name", thisRow); 
          var sid = getByHeader("Student ID Number", thisRow);
          var studentType = getByHeader("What is your affiliation to the Jacobs Institute?", thisRow);
          var projectname = getByHeader("Project Name", thisRow);
          var shippingQuestion = getByHeader("Do you need your parts shipped to you?", thisRow);
          var cost = getByHeader("Estimate", thisRow); 
      
      
  */

