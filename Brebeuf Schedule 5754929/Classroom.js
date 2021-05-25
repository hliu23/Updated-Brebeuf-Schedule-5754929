// GOOGLE ADMIN
// COURSENUM
// TWO HOUR DELAY
// SPREADSHEET
// MARKETPLACE
// EDIT EVENTS?
// ONE BUTTON TO END OF SEMESTER
// GOOGLE SHEET? SAME TIME EACH CYCLE
// DATE TIME PICKER / IRREGULAR CLASSES / HTML INTERFACE
// COLOR CODE: SYNC TO CLASSROOM COLORS? / ALT SCHEDULE
// ON THE CREATE EVENTS PAGE BUT DELETED CALENDAR
// NULL STRING
// NAMING
// PICK DATE
// MODIFY SCHEDULE

// CHECK FOR COLLISION
// SCRIPT PROPERTY?
// UPDATES?
var brebeufSchedule5754929 = {
  USER_PREFIX : PropertiesService.getScriptProperties().getProperty("USER_PREFIX"),
  REGULAR_PREFIX : PropertiesService.getScriptProperties().getProperty("REGULAR_PREFIX"),
  IRREGULAR_PERIOD_PREFIX : PropertiesService.getScriptProperties().getProperty("IRREGULAR_PERIOD_PREFIX"),
  IRREGULAR_PRT_PREFIX : PropertiesService.getScriptProperties().getProperty("IRREGULAR_PRT_PREFIX"),

  COLOR_MAIN : PropertiesService.getScriptProperties().getProperty("COLOR_MAIN"),
  COLOR_ALT : PropertiesService.getScriptProperties().getProperty("COLOR_ALT"),

  NULL_STRING : PropertiesService.getScriptProperties().getProperty("NULL_STRING")
}

// FILL IN: CONST?
// Save all possible class times in script properties; information comes from the schedule Brebeuf released
function toHomePage() {
  const DOWN = false;
  if (DOWN == true) {
    return underMaintenance(); 
  } else {
    update();
    userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"courseStateChanged", false);
    return homePage();
  }
}

// Build the homepage of the add-on, which displays all classes stored in user properties and options to retrieve class info from Classroom, create and delete classes, and create events
function homePage() {
  var startSection = CardService.newCardSection();
  
  var initializeButton = newButton("Retrieve Courses from Classroom", "initialize", brebeufSchedule5754929.COLOR_MAIN);
  var createButton = newButton("Add a Course", "createCourse", brebeufSchedule5754929.COLOR_MAIN);

  startSection.addWidget(initializeButton)
    .addWidget(createButton);

  var courseSection = CardService.newCardSection();
  var courseList = sortRegularCourses();
  if (courseList.length == 0) {
    const PROMPT = "No course information stored. \n\nRetrieve courses from Google Classroom by clicking on the first button above.";
    var textExplanation = CardService.newTextParagraph()
      .setText(PROMPT);
    courseSection.addWidget(textExplanation);
  } else {
    for (let x in courseList) {
      var courseButtonSet = createToCardButtonSet(courseList[x]);
      courseSection.addWidget(courseButtonSet);
    }
  }
  
  var calendarSection = CardService.newCardSection();
  var calendarButton = newButton("Create Events in Calendar", "checkEvents", brebeufSchedule5754929.COLOR_ALT);
  calendarSection.addWidget(calendarButton);

  var card = CardService.newCardBuilder()
    .setName("homePage")
    .addSection(startSection)
    .addSection(courseSection)
    .addSection(calendarSection);

  return card.build();
}


// Retrieve classes from Classroom and save them in user properties
function initialize() {
  userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"courseStateChanged", true);

  const PARAMS = {method: "get", headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}};
  var res = UrlFetchApp.fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&studentId=me&fields=courses/name", PARAMS);
  var response = JSON.parse(res).courses;

  if (response.length == 0) {
    res = UrlFetchApp.fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&teacherId=me&fields=courses/name", PARAMS);
    response = JSON.parse(res).courses;
  }

  var courseList = [];
  for (let x in response) {
    courseList[x] = response[x].name; 
  }

  // EFFICIENCY
  // DELETE
  // Delete previously stored courses
  for (let x of propKeys(brebeufSchedule5754929.REGULAR_PREFIX)) {
    userProperties.deleteProperty(x);
  }
  for (let x of propKeys(brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX)) {
    userProperties.deleteProperty(x);
  }
  for (let x of propKeys(brebeufSchedule5754929.IRREGULAR_PRT_PREFIX)) {
    userProperties.deleteProperty(x);
  }

  for (let y in courseList) {
    var subject = infoFromCourseName(courseList[y]);
    userProperties.setProperty(brebeufSchedule5754929.REGULAR_PREFIX+subject.name.toString(), JSON.stringify(subject));
  }

  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());

  return CardService.newActionResponseBuilder()
    .setNavigation(toHomePage)
    .setNotification(CardService.newNotification()
      .setText("Classes retrieved from Google Classroom."))
    .build();
}

function sortIrregularPerCourses() {

}
// Take all existing in user properties and return their names, sorted by their entered period numbers if available, else sorted by alphabetical order
function sortRegularCourses() {
  // JSON?
  var courseProperties = getProps(brebeufSchedule5754929.REGULAR_PREFIX);

  var periodNull = [];
  var periodExisting = [];
  var courseList = [];

  for (let n in courseProperties) {
    let subject = courseProperties[n];
    if (subject.period == null) periodNull.push(subject.name);
    else periodExisting.push(subject);
  }
  
  var periodNum = [];
  for (let i in periodExisting) {
    periodNum.push(parseInt(periodExisting[i].period, 10));
  }

  var copyPeriodExisting = [...periodExisting];

  while (copyPeriodExisting.length > 0) {
    periodExisting = [...copyPeriodExisting];
    checkLoop:
    for (let i in periodExisting) {
      var nextNum = Math.min(...periodNum);
      if (periodExisting[i].period == nextNum) {
        courseList.push(periodExisting[i].name);
        copyPeriodExisting.splice(i,1);
        periodNum.splice(i,1);
        break checkLoop;
      }
    }
  }

  periodNull.sort();
  for (let i of periodNull) {
    courseList.push(i);
  }

  return courseList;
}



// MATCH COLOR OF EVENTS TO CLASSROOM
// SELECT?
// Create buttons that can be checked on to view detailed info about classes
function createToCardButtonSet(name) {
  var gotoCourse = CardService.newAction()
    .setFunctionName("gotoCourse")
    .setParameters({name: name.toString()});
  var deleteCourseFromMenu = CardService.newAction()
    .setFunctionName("deleteCourseFromMenu")
    .setParameters({name: name.toString()});

  var imageButton = CardService.newImageButton()
    .setIconUrl("https://i.imgur.com/9BxNaT7.png")
    .setOnClickAction(deleteCourseFromMenu);

  const MAX_TEXT_LENGTH = 28;
  var buttonText = name.slice(0);
  if (buttonText.length > MAX_TEXT_LENGTH) {
    buttonText = buttonText.slice(0, MAX_TEXT_LENGTH);
  }

  var textButton = CardService.newTextButton()
    .setText(buttonText)
    .setAltText(name.toString())
    .setOnClickAction(gotoCourse);

  var buttonSet = CardService.newButtonSet()
    .addButton(imageButton)
    .addButton(textButton);
    
  return buttonSet;
}

// CONVERT COURSE OUTSIDE?
// NAME OR PROPERTY?
function gotoCourse(e) {
  var name = e.parameters.name;  
  var subject = JSON.parse(userProperties.getProperty(brebeufSchedule5754929.REGULAR_PREFIX+name));
  subject = Object.assign(new Regular_Period(), subject);
  var status = name.toString();

  const REG_UNSELECTED_OPTION = "No selection found. Select an option.";
  // NEED CONST?

  var navUi = CardService.newNavigation().pushCard(subject.build(status, REG_UNSELECTED_OPTION));
  return CardService.newActionResponseBuilder()
    .setNavigation(navUi)
    .build();
}

// COMBINE THE TWO?
function createCourse() {
  var subject = new Regular_Period("", null, null, null);
  var status = brebeufSchedule5754929.NULL_STRING;

  // CANNOT PASS NULL VAL AS E.PARAMETERS ?
  var uiNull = CardService.newNavigation().pushCard(subject.build(status));
  return CardService.newActionResponseBuilder()
    .setNavigation(uiNull)
    .build();
}

// CONVERT TO ONE CASE
// WHILE LOOP
// Get course info (period, prt, lunch) from course name if possible
function infoFromCourseName(courseName) {
  var convertedCourseName = courseName.toUpperCase();
  let prtSearchWord = "PRT ";
  var prtPosition = convertedCourseName.search(prtSearchWord);
  var prtLetter;
  if (prtPosition !== -1) {
    prtLetter = convertedCourseName.slice((prtPosition + prtSearchWord.length), (prtPosition + prtSearchWord.length+1));
    if (prtLetter !== "A" && prtLetter !== "B") prtLetter = null;
  } else prtLetter = null;

  let lunchSearchWord = "LUNCH ";
  var lunchPosition = convertedCourseName.search(lunchSearchWord);

  var lunchLetter;
  if (lunchPosition !== -1) {
    lunchLetter = convertedCourseName.slice((lunchPosition + lunchSearchWord.length), (lunchPosition + lunchSearchWord.length+1));
    if (lunchLetter !== "A" && lunchLetter !== "B" && lunchLetter !== "C") lunchLetter = null;
  } else lunchLetter = null;

  let periodSearchWord = ["PERIOD ","PER. ","PER ","P. "];
  var periodPosition = -1;
  var len;
  var periodNum = null;
  periodLoop:
  for (let i = 0; i < periodSearchWord.length; i++) {
    periodPosition = convertedCourseName.search(periodSearchWord[i]);
    if (periodPosition !== -1) {
      len = periodSearchWord[i].length;
      periodNum = convertedCourseName.slice((periodPosition + len), (periodPosition + len+1));
      break periodLoop;
    }
  }
  if (isNaN(periodNum) || periodNum == " " || periodNum == null) periodNum = null;
  else {
    periodNum = parseInt(periodNum, 10);
    if (periodNum < 1 || periodNum > 8) periodNum = null;
  }

  var courseInfo = new Regular_Period(courseName, periodNum, prtLetter, lunchLetter);
  return courseInfo;
}


// WHAT IF VAR COURSE IS NOT STORED IN USERPROPERTIES?
// Create a detailed class info page that allows the user to alter the class name, period number, PRT and lunch letter and save changes (if all fields are filled in as expected) or delete the course



// SAVE PROCESS
// DETECT STATE CHANGED?
// DIRECT TO SCRIPT PROPERTY

// ""
// TERNARY
// TEMPLATE LITERAL

// CAPS: ENTERED?
// DIFFERENT FUNCTION? REPEATED
// SCRIPT PROPERTY

// CONSIST OR EFFICIENT?
// Update course info in user properties according to user input
function updateCourseInfo(e) {

  userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"courseStateChanged", true);
  var identifier = e.parameters.identifier;

  function throwErr(errPosition = "each field") {
    var errMessage = `Please make sure ${errPosition} is filled out correctly.`;
    throw new TypeError(errMessage);
  }

  // TESTING
  // MESSAGE
  
  // NOTE: DID NOT CREATE VARIABLES FOR ERRPOSITION BECAUSE ONLY USED ONCE AND IN ONE PLACE
  try {
    var nameInput = e.commonEventObject.formInputs.name_input;
    if (nameInput === undefined) throwErr("the course name");  
    else var name = nameInput.stringInputs.value[0];

    var prtInput = e.commonEventObject.formInputs.prt_input;
    if (prtInput === undefined) throwErr("the PRT");
    else {
      var prt = prtInput.stringInputs.value[0];
      if (prt == "null") throwErr("the PRT");
    }

    if (identifier == brebeufSchedule5754929.REGULAR_PREFIX || identifier == IRREGULAR_PERIOD_PREFIX) {
      var periodInput = e.commonEventObject.formInputs.period_input;
      if (periodInput === undefined) throwErr("the period number");
      else {
        var period = periodInput.stringInputs.value[0];
        if (period == " " || isNaN(period) || period < 1 || period > 8) throwErr("the period number");
      }

      var lunchInput = e.commonEventObject.formInputs.lunch_input;
      if (lunchInput === undefined) throwErr("the lunch");
      else {
        var lunch = lunchInput.stringInputs.value[0];
        if (lunch == "null") throwErr("the lunch");
      }
    }

    if (identifier == brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX || identifier == IRREGULAR_PRT_PREFIX) {
      var dayInput = e.commonEventObject.formInputs.day_input;
      if (dayInput === undefined) throwErr("the day"); 
      // MESSAGE?
      else {
        var day = dayInput.stringInputs.value[0];
        if (day == " " || isNaN(day) || day < 1 || day > 8) throwErr("the day");
      }
    }

    if (identifier == brebeufSchedule5754929.IRREGULAR_PRT_PREFIX) {
      var amPmInput = e.commonEventObject.formInputs.ampm_input;
      if (amPmInput === undefined) throwErr("the time");
      else {
        var amPm = amPmInput.stringInputs.value[0];
        if (amPm == "null") throwErr("the time");
        // AFTERNOON PRT: IF NEEDED
        // CAN BE NULL?
      }
      // THIS
    }
  }
  // Catch TypeError
  catch (err) {
    if (err.name !== "TypeError") {
      console.log(err);
      throw err;
    }
    else return newNotify(err.message);
  }
  
  var status = e.parameters.status;
  
  period = parseInt(period, 10);
  day = parseInt(day, 10);
  // HERE


  if (status !== brebeufSchedule5754929.NULL_STRING) {
    if (identifier == brebeufSchedule5754929.REGULAR_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.REGULAR_PREFIX+status);
    else if (identifier == brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX+status);
    else if (identifier == brebeufSchedule5754929.IRREGULAR_PRT_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.IRREGULAR_PRT_PREFIX+status);
    // ELSE?
  }
  // PREFIX

  var course;
  if (identifier == brebeufSchedule5754929.REGULAR_PREFIX) {
    course = new Regular_Period(name, period, prt, lunch);
    userProperties.setProperty(brebeufSchedule5754929.REGULAR_PREFIX+course.name, JSON.stringify(course));
  } 
  else if (identifier == brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX) {
    course = new Irregular_Period(name, period, prt, lunch, day);
    userProperties.setProperty(brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX+course.name, JSON.stringify(course));
  } 
  else if (identifier == brebeufSchedule5754929.IRREGULAR_PRT_PREFIX) {
    course = new Irregular_PRT(name, prt, day, amPm);
    userProperties.setProperty(brebeufSchedule5754929.IRREGULAR_PRT_PREFIX+course.name, JSON.stringify(course));
  }

  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNavigation(toHomePage)
    .setNotification(CardService.newNotification()
      .setText("Changes successfully saved."))
    .build();
}

// START HERE TOMORROW 2021.5.18
// CREATING IRREGULAR EVENTS DO NOT WORK YET

// Delete course info from user properties from course page
function deleteCourse(e) {
  
  // SCRIPT PROPERTY? PREFIX?

  userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"courseStateChanged", true);
  var status = e.parameters.status;

  if (status !== brebeufSchedule5754929.NULL_STRING) {
    if (identifier == brebeufSchedule5754929.REGULAR_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.REGULAR_PREFIX+status);
    else if (identifier == brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX+status);
    else if (identifier == brebeufSchedule5754929.IRREGULAR_PRT_PREFIX) userProperties.deleteProperty(brebeufSchedule5754929.IRREGULAR_PRT_PREFIX+status);
    // ELSE?
  }
  
  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNavigation(toHomePage)
    .setNotification(CardService.newNotification()
      .setText("Course deleted."))
    .build();
}

// Delete course from user properties from home page
function deleteCourseFromMenu(e) {
  
  userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"courseStateChanged", true);
  var subject = e.parameters.name;
  userProperties.deleteProperty(brebeufSchedule5754929.REGULAR_PREFIX+subject);
  var updateHomePage = CardService.newNavigation().updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNavigation(updateHomePage)
    .build();
}