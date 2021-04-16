// GOOGLE AMDIN
// COURSENUM
// SPECIAL CLASSES
// TWO HOUR DELAY
// SPREADSHEET
// MARKETPLACE
// EDIT EVENTS?
// ONE BUTTON TO END OF SEMESTER

// This program takes data from Google Classroom and user input to create personalized events in Google Calendar according to each user's class times (Help and Feedback options are available in the add-on)
var userProperties = PropertiesService.getUserProperties();

// Save all possible class times in script properties; information comes from the schedule Brebeuf released
function toHomePage() {
  PropertiesService.getScriptProperties().setProperties({
    "CLASS_1" : "08:30",
    
    "CLASS_2_PRT_A" : "10:05",
    "CLASS_2_PRT_B" : "09:35",

    "CLASS_3_LUNCH_A" : "11:40",
    "CLASS_3_LUNCH_B_I" : "11:10",
    "CLASS_3_LUNCH_B_II" : "12:10",
    "CLASS_3_LUNCH_C" : "11:10",

    "CLASS_4" : "12:45",

    "CLASS_5" : "13:50",
  });
  userProperties.setProperty("courseStateChanged", false);
  return homePage();
}

// Build the homepage of the add-on, which displays all classes stored in user properties and options to retrieve class info from Classroom, create and delete classes, and create events
function homePage() {
  var section = CardService.newCardSection();
  
  var initializeButton = newButton("Retrieve Classes from Classroom", "initialize", "#761113");
  var createButton = newButton("Add a Course", "createCourse", "#761113");

  section.addWidget(initializeButton)
    .addWidget(createButton);

  var courseList = sortCourses();
  for (x in courseList) {
    var courseButtonSet = createToCardButtonSet(courseList[x]);
    section.addWidget(courseButtonSet);
  };
  
  var calendarButton = newButton("Create Events in Calendar", "checkEvents", "#DEAC3F");
  section.addWidget(calendarButton);

  var card = CardService.newCardBuilder()
    .setName("homePage")
    .addSection(section);

  return card.build();
}

// Retrieve classes from Classroom and save them in user properties
function initialize() {
  userProperties.setProperty("courseStateChanged", true);

  const PARAMS = {method: "get", headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}};

  var res = UrlFetchApp.fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&studentId=me&fields=courses/name", PARAMS);

  var response = JSON.parse(res).courses;

  if (response.length == 0) {
    res = UrlFetchApp.fetch("https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&teacherId=me&fields=courses/name", PARAMS);
    response = JSON.parse(res).courses;
  };

  var courseList = [];
  for (x in response) {
    courseList[x] = response[x].name; 
  };

  // Delete previously stored courses
  for (x of chooseCoursesProperties()) {
    userProperties.deleteProperty(x);
  };

  for (y in courseList) {
    var subject = infoFromCourseName(courseList[y]);
    userProperties.setProperty(subject.name.toString(), JSON.stringify(subject));
  };

  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());

  return CardService.newActionResponseBuilder()
    .setNavigation(toHomePage)
    .setNotification(CardService.newNotification()
      .setText("Classes retrieved from Google Classroom."))
    .build();
}


// Take all existing in user properties and return their names, sorted by their entered period numbers if available, else sorted by alphabetical order
function sortCourses() {
  var courseProperties = getCourseProperties();
  var periodNull = [];
  var periodExisting = [];
  var courseList = [];

  for (n in courseProperties) {
    var subject = JSON.parse(courseProperties[n]);
    if (subject.period == null) periodNull.push(subject.name);
    else periodExisting.push(subject);
  };
  
  var periodNum = [];
  for (i in periodExisting) {
    periodNum.push(parseInt(periodExisting[i].period, 10));
  };

  var copyPeriodExisting = [...periodExisting];

  while (copyPeriodExisting.length > 0) {
    periodExisting = [...copyPeriodExisting];
    checkLoop:
    for (i in periodExisting) {
      var nextNum = Math.min(...periodNum);
      if (periodExisting[i].period == nextNum) {
        courseList.push(periodExisting[i].name);
        copyPeriodExisting.splice(i,1);
        periodNum.splice(i,1);
        break checkLoop;
      };
    };
  };

  periodNull.sort();
  for (i of periodNull) {
    courseList.push(i);
  };

  return courseList;
}


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
  };

  var textButton = CardService.newTextButton()
    .setText(buttonText)
    .setAltText(name.toString())
    .setOnClickAction(gotoCourse);

  var buttonSet = CardService.newButtonSet()
    .addButton(imageButton)
    .addButton(textButton);
    
  return buttonSet;
}

function gotoCourse(e) {
  var name = e.parameters.name;
  var navUi = CardService.newNavigation().pushCard(uiForCourse(name));
  return CardService.newActionResponseBuilder()
    .setNavigation(navUi)
    .build();
}

function createCourse() {
  var uiNull = CardService.newNavigation().pushCard(uiForCourse(null));
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
  if (prtPosition !== -1) {
    var prtLetter = convertedCourseName.slice((prtPosition + prtSearchWord.length), (prtPosition + prtSearchWord.length+1));
    if (prtLetter !== "A" && prtLetter !== "B") prtLetter = null;
  } else prtLetter = null;

  let lunchSearchWord = "LUNCH ";
  var lunchPosition = convertedCourseName.search(lunchSearchWord);

  if (lunchPosition !== -1) {
    var lunchLetter = convertedCourseName.slice((lunchPosition + lunchSearchWord.length), (lunchPosition + lunchSearchWord.length+1));
    if (lunchLetter !== "A" && lunchLetter !== "B" && lunchLetter !== "C") lunchLetter = null;
  } else lunchLetter = null;

  let periodSearchWord = ["PERIOD ","PER. ","PER ","P. "];
  var periodPosition = -1;
  var len;
  var periodNum = null;
  periodLoop:
  for (var i = 0; i < periodSearchWord.length; i++) {
    periodPosition = convertedCourseName.search(periodSearchWord[i]);
    if (periodPosition !== -1) {
      len = periodSearchWord[i].length;
      periodNum = convertedCourseName.slice((periodPosition + len), (periodPosition + len+1));
      break periodLoop;
    }
  }
  if (periodNum == NaN || periodNum == " " || periodNum == null) periodNum = null;
  else {
    periodNum = parseInt(periodNum, 10);
    if (periodNum < 1 || periodNum > 8) periodNum = null;
  }

  var courseInfo = new Subject(courseName, periodNum, prtLetter, lunchLetter);
  return courseInfo;
}

// WHAT IF VAR COURSE IS NOT STORED IN USERPROPERTIES?
// Create a detailed class info page that allows the user to alter the class name, period number, PRT and lunch letter and save changes (if all fields are filled in as expected) or delete the course
function uiForCourse(course) {

  // NEWLY CREATED COURSE
  const NULL_STRING = "!nullnullnullnullnullnullnullnullnullnull!";

  var subject; 
  if (course != null) subject = JSON.parse(PropertiesService.getUserProperties().getProperty(course));
  else subject = new Subject("", null, null, null);

  var status;
  if (course == null) status = NULL_STRING;
  else status = course.toString();
    
  var courseName = CardService.newTextInput()
    .setFieldName("name_input")
    .setTitle("Course Name")
    .setValue(subject.name);
    
  var periodNum = CardService.newTextInput()
    .setFieldName("period_input")
    .setTitle("Period Number");

  if (subject.period != null) periodNum.setValue(subject.period.toString());
  
  // SUBJECT AND STATUS?

  var irregularClass = newButton("Irregular Class", "irregularClass", "N/A", "status", status);

  var prt = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("PRT")
    .setFieldName("prt_input");

  const UNSELECTED_OPTION = "No selection found. Select an option.";

  switch (subject.prt) {
    case ("A"):
      prt.addItem("A", "A", true)
      .addItem("B", "B", false)
      .addItem(UNSELECTED_OPTION, null, false);
      break;
    case ("B"): 
      prt.addItem("A", "A", false)
      .addItem("B", "B", true)
      .addItem(UNSELECTED_OPTION, null, false);
      break;
    default:
      prt.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem(UNSELECTED_OPTION, null, true);
      break;
  } 
    
  var lunch = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("Lunch")
    .setFieldName("lunch_input");
  switch (subject.lunch) {
    case ("A"):
      lunch.addItem("A", "A", true)
      .addItem("B", "B", false)
      .addItem("C", "B", false)
      .addItem(UNSELECTED_OPTION, null, false);
      break;
    case ("B"):
      lunch.addItem("A", "A", false)
      .addItem("B", "B", true)
      .addItem("C", "C", false)
      .addItem(UNSELECTED_OPTION, null, false);
      break;
    case ("C"):
      lunch.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem("C", "C", true)
      .addItem(UNSELECTED_OPTION, null, false);
      break;
    default:
      lunch.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem("C", "C", false)
      .addItem(UNSELECTED_OPTION, null, true);
      break;
  }

  // TO STRING
  
  var saveButton = CardService.newTextButton()
    .setText("Save Changes")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#761113")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("updateCourseInfo")
      .setParameters({subject: subject.name, status: status}));


  var deleteButton = CardService.newTextButton()
    .setText("Delete Course")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#DEAC3F")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("deleteCourse")
      .setParameters({subject: subject.name, status: status}));

  var cardButtonSet = CardService.newButtonSet()
    .addButton(saveButton)
    .addButton(deleteButton);
    
  var section = CardService.newCardSection()
    .addWidget(courseName)
    .addWidget(periodNum)
    .addWidget(irregularClass)
    .addWidget(prt)
    .addWidget(lunch)
    .addWidget(cardButtonSet);
    

  var card = CardService.newCardBuilder()  
    .addSection(section);

  return card.build();
}


// Construct class that will store course info
class Subject {
  constructor(name, period, prt, lunch) {
    this.name = name;
    this.period = period;
    this.prt = prt;
    this.lunch = lunch;   
  };
}


// Update course info in user properties according to user input
function updateCourseInfo(e) {
  const NULL_STRING = "!nullnullnullnullnullnullnullnullnullnull!";

  userProperties.setProperty("courseStateChanged", true);
  try {
    var name = e.commonEventObject.formInputs["name_input"].stringInputs.value[0];
    var period = e.commonEventObject.formInputs["period_input"].stringInputs.value[0];
    if (period == " ") throw new TypeError;
    else if (isNaN(period)) throw new TypeError;
    else if (period < 1 || period > 8) throw new TypeError;

    var prt = e.commonEventObject.formInputs["prt_input"].stringInputs.value[0];
    var lunch = e.commonEventObject.formInputs["lunch_input"].stringInputs.value[0];
  
    if (prt == "null" || lunch == "null") throw new TypeError;
  }
  // Catch TypeError
  catch (err) {
    if (err.name !== "TypeError") {
      console.log(err);
      throw err;
    }
    else {
      return newNotify("Please make sure all the fields are filled in correctly.");
    }
  };
  
  var subject = e.parameters.subject;
  var status = e.parameters.status;
  
  period = parseInt(period, 10);
  if (status !== NULL_STRING) {
    userProperties.deleteProperty(subject);
  };
  
  var course = new Subject(name, period, prt, lunch);
  userProperties.setProperty(course.name, JSON.stringify(course));

  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNavigation(toHomePage)
    .setNotification(CardService.newNotification()
      .setText("Changes successfully saved."))
    .build();
}

// Delete course info from user properties from course page
function deleteCourse(e) {
  const NULL_STRING = "!nullnullnullnullnullnullnullnullnullnull!";

  userProperties.setProperty("courseStateChanged", true);
  var status = e.parameters.status;

  if (status !== NULL_STRING) {
    var subject = e.parameters.subject;
    userProperties.deleteProperty(subject);
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
  userProperties.setProperty("courseStateChanged", true);
  subject = e.parameters.name;
  PropertiesService.getUserProperties().deleteProperty(subject);
  var updateHomePage = CardService.newNavigation().updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNavigation(updateHomePage)
    .build();
}
