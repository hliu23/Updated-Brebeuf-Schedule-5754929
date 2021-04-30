// Date => Brebeuf Day => Classes that Day => PRT and Lunch => Fit back to Schedule

// LAST CHANGED
// OPTION ASK: YOU HAVE MADE SOME CHANGES: CREATE NEW EVENTS STARTING NOW? 
  // CREATE NEW EVENTS FROM NOW
  // CREATE NEW EVENTS FROM WHEN THE EVENTS CREATED ENDED
  // ERASE PREVIOUSLY CREATED EVENTS (FROM NOW TO PLANNED)
// LAST SUCCESSFUL
// GENERATE DATE (POSSIBLE RANGE)

var requests = [];

// Check that course info are entered as expected (do not allow proceeding until issue fixed)
function checkEvents() {
  var courseProperties = getRegularCoursesProperties();

  try {
    var periodNum = [];
    var schedule = [];

    for (x in courseProperties) {
      course = JSON.parse(courseProperties[x]);
      courseNum = parseInt(course.period, 10);
      courseName = course.name;
      periodNum[x] = courseNum;
      schedule[courseNum] = course;
      
      if (courseNum == null) {
        throw new Error("Please make sure \"" + courseName + "\" has a period number.");
      } else if (course.prt == null) {
        throw new Error("Please make sure \"" + courseName + "\" has a PRT letter.");
      } else if (course.lunch == null) {
        throw new Error("Please make sure \"" + courseName + "\" has a lunch letter.");
      };
    };

    
    var setPeriodNum = [...new Set(periodNum)];
    if (periodNum.length > setPeriodNum.length) {
      throw new Error("Please make sure no two courses have the same period number.");
    };
  }
  catch (err) {
    return newNotify(err.message);
  };

  return createCalendar(schedule);
}

// Create calendar in user's calendar if it has not been created or if the user has made any changes to course info since last run
function createCalendar(schedule) {
  try {
    var courseStateChanged = userProperties.getProperty(USER_PREFIX+"courseStateChanged");
    var calProperty = userProperties.getProperty(USER_PREFIX+"calendarId");
    
    var resCode = 0;

    const PARAMS = {method: "get", headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}, muteHttpExceptions: true};
    var res = UrlFetchApp.fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList/" + calProperty, PARAMS);
    resCode = res.getResponseCode();

    if (calProperty == null || resCode != 200 || courseStateChanged == "true") {
      var calendar = CalendarApp.createCalendar("Brebeuf Schedule 5754929", {
        summary: "A calendar with scheduled personalized reminders at Brebeuf class time.",
        timeZone: "America/New_York"
      });
      calendar.setColor("#761113");

      var calId = calendar.getId();

      userProperties.setProperty(USER_PREFIX+"calendarId", calId);
      if (resCode != 200 || courseStateChanged == "true") {
        userProperties.deleteProperty(USER_PREFIX+"lastCompletedDate");
      };
      
    } else var calId = calProperty;

    return eventsCard(calId, schedule);
  }
  catch (err) {
    console.log(err);
    return newNotify("Calendar creation failed. Please refresh the page. If error persists, report through \"Feedback\" feature in the menu.");
  };
}

// Build card with button that creates events of this 8-day cycle upon clicking
function eventsCard(calId, schedule) {
  var explanation = CardService.newTextParagraph()
    .setText("Press the button below to create events one 8-day cycle at a time.");
  
  var calButton = CardService.newTextButton()
    .setText("Create Events")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("createEvents")
      .setParameters({calId: calId, schedule: JSON.stringify(schedule)}))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#761113");

  var section = CardService.newCardSection()
    .addWidget(explanation)
    .addWidget(calButton);

  var card = CardService.newCardBuilder()
    .addSection(section)
    .build();
  
  return card;
}

// Create event requests and push into the global variable "requests"
function createEvents(e) {
  console.time("createEvents");
  var calId = e.parameters.calId;
  var schedule = JSON.parse(e.parameters.schedule);
  
  var lastDate = userProperties.getProperty(USER_PREFIX+"lastCompletedDate");
  if (lastDate == null) {
    var startDate = new Date();
    startDate.setHours(0,0,0,0);
  } else {
    var startDate = new Date(Number(lastDate));
    startDate.setDate(startDate.getDate() + 1);
  };

  var currentDate = new Date(startDate);
  var msCurrentDate = Date.parse(startDate);

  if (brebeufDay(startDate) == 8) {
    createEventsOfDay(calId, schedule, startDate);
    userProperties.setProperty(USER_PREFIX+"lastCompletedDate", msCurrentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  while (brebeufDay(currentDate) !== 8) {
    createEventsOfDay(calId, schedule, currentDate);
    msCurrentDate = Date.parse(currentDate);
    userProperties.setProperty(USER_PREFIX+"lastCompletedDate", msCurrentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  createEventsOfDay(calId, schedule, currentDate);
  msCurrentDate = Date.parse(currentDate);
  userProperties.setProperty(USER_PREFIX+"lastCompletedDate", msCurrentDate);
    
  batchRequests();
  console.timeEnd("createEvents");

  return newNotify("Events successfully created.");
}

// Send a batch request to the Google Calendar API using info from the variable "requests"
function batchRequests() {
  const BOUNDARY = "5754929";

  var firstRequest = requests.splice(0,1);

  var payload = "--" + BOUNDARY + "\r\nContent-Type: application/http\r\n\r\n" + firstRequest[0].method + " " + firstRequest[0].endpoint + "\r\nContent-Type: application/json\r\n\r\n" + JSON.stringify(firstRequest[0].body) + "\r\n\r\n";

  for (i in requests) {
    let event = requests[i];
    let req = "--" + BOUNDARY + "\r\nContent-Type: application/http\r\n\r\n" + event.method + " " + event.endpoint + "\r\nContent-Type: application/json\r\n\r\n" + JSON.stringify(event.body) + "\r\n\r\n";
    payload += req;
  }

  payload += ("--" + BOUNDARY + "--");

  const PARAMS = {method: "post", contentType: "multipart/mixed; boundary=" + BOUNDARY, payload: payload, headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()}};
  var res = UrlFetchApp.fetch("https://www.googleapis.com/batch/calendar/v3/", PARAMS);
  console.log(res.getContentText());  
}

  
function createEventsOfDay(calId, schedule, currentDate) {
  var brDay = brebeufDay(currentDate);

  if (brDay != null) {

    var cOrder = classOrder(brDay);
    for (n in cOrder) {
  
      let currentPeriodNum = cOrder[n];
      let course = schedule[currentPeriodNum];
      if (course != null) {
        let classNumInDay = Number(n)+1;

        let callStr;
        switch (classNumInDay) {
          case (1):
          case (4):
          case (5): 
            callStr = "CLASS_"+classNumInDay;
            break;
          case (2):
            let prt = course.prt;
            callStr = "CLASS_"+classNumInDay+"_PRT_"+prt;
            break;
          case (3):
            let lunch = course.lunch;
            callStr = "CLASS_"+classNumInDay+"_LUNCH_"+lunch;
            break;
          default:
            break;
        }
        var scriptProperties = PropertiesService.getScriptProperties();


        if (callStr !== "CLASS_3_LUNCH_B") {
          let classTime = scriptProperties.getProperty(callStr);
          classTime = classTime.split(":").map(x => Number(x));

          let startTime = new Date(currentDate);
          startTime.setHours(classTime[0],classTime[1],0,0);
          
          let endTime = new Date(startTime);
          endTime.setHours(startTime.getHours()+1,startTime.getMinutes(),0,0);


          requests.push({
            method: "POST",
            endpoint: `/calendar/v3/calendars/${calId}/events/`,
            body: {
              "start": {
                "dateTime": startTime.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "end": {
                "dateTime": endTime.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "summary": course.name,
              "reminders": {
                "overrides": [
                  {
                    "method": "popup",
                    "minutes": 5
                  }
                ],
                "useDefault": false
              },
              "colorId": currentPeriodNum
            }
          });

        } else {
          let classTimeI = scriptProperties.getProperty(callStr+"_I");
          let classTimeII = scriptProperties.getProperty(callStr+"_II");

          classTimeI = classTimeI.split(":").map(x => Number(x));
          classTimeII = classTimeII.split(":").map(x => Number(x));

          
          let startTimeI = new Date(currentDate);
          startTimeI.setHours(classTimeI[0],classTimeI[1],0,0);

          let endTimeI = new Date(startTimeI);
          endTimeI.setHours(startTimeI.getHours(),startTimeI.getMinutes()+30,0,0);

          requests.push({
            method: "POST",
            endpoint: `/calendar/v3/calendars/${calId}/events/`,
            body: {
              "start": {
                "dateTime": startTimeI.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "end": {
                "dateTime": endTimeI.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "summary": course.name+" (Part 1)",
              "reminders": {
                "overrides": [
                  {
                    "method": "popup",
                    "minutes": 5
                  }
                ],
                "useDefault": false
              },
              "colorId": currentPeriodNum
            }
          });

          let startTimeII = new Date(currentDate);
          startTimeII.setHours(classTimeII[0],classTimeII[1],0,0);

          let endTimeII = new Date(startTimeII);
          endTimeII.setHours(startTimeII.getHours(),startTimeII.getMinutes()+30,0,0);


          requests.push({
            method: "POST",
            endpoint: `/calendar/v3/calendars/${calId}/events/`,
            body: {
              "start": {
                "dateTime": startTimeII.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "end": {
                "dateTime": endTimeII.toISOString(),
                "timeZone": "America/Los_Angeles"
              },
              "summary": course.name+" (Part 2)",
              "reminders": {
                "overrides": [
                  {
                    "method": "popup",
                    "minutes": 5
                  }
                ],
                "useDefault": false
              },
              "colorId": currentPeriodNum
            }
          });
        }
      }
    }
  }
}

// Return the number of entered date in the Brebeuf 8-day cycle
function brebeufDay(enteredDate) {
  var enteredDate = new Date(enteredDate);
  enteredDate.setHours(0,0,0,0);

  const SPECIAL_DAY = ["Feb 15, 2021", "Mar 15, 2021", "Mar 22, 2021", "Mar 23, 2021", "Mar 24, 2021", "Mar 25, 2021", "Mar 26, 2021", "Apr 2, 2021", "Apr 5, 2021"];
  const EXTENDED_BREAK = [["May 29, 2021", "Aug 5, 2021", "RESET"]];
  var day_one = new Date("Feb 9, 2021");
  // OFF TIMES
  // INCLUDE, INCLUDE
  // CHECK DATE
  // SKIPPING FIRST DATE
  // STARTING FROM DAY 8 AFTER SUMMER BREAK
  // DELETE OLD CALENDAR AND CREATE NEW UP-TO-DATE
  // EXPORT SETTINGS
  // DELETED PROPERTIES: INFO REENTER

  var specialDays = [];
  var extendedBreak = [];
  for (x in SPECIAL_DAY) {
    specialDays[x] = new Date(SPECIAL_DAY[x]);
  }
  for (y in EXTENDED_BREAK) {
    let startDate = new Date(EXTENDED_BREAK[y][0]);
    let endDate = new Date(EXTENDED_BREAK[y][1]);
    extendedBreak[y] = [startDate, endDate];
    let newDate = new Date(EXTENDED_BREAK[y][1]);
    newDate.setDate(newDate.getDate() + 1);
    // EFFICIENCY?
      
    if (EXTENDED_BREAK[y][2] === "RESET" && enteredDate.getTime() > endDate.getTime()) day_one = new Date(newDate);
  }
  // LIST IN TIME AND DELETE?

  
  var brebeufDay = 0;
  var dayTest = new Date(day_one);

  if (enteredDate.getTime() == day_one.getTime()) brebeufDay = 1;
  else if (enteredDate.getTime() < day_one.getTime()) brebeufDay = null;
  else if (enteredDate.getDay() == 6 || enteredDate.getDay() == 0) brebeufDay = null;
  else {
    for (s of specialDays) {
      if (enteredDate.getTime() == s.getTime()) brebeufDay = null;
    };
    for (e of extendedBreak) {
        if (enteredDate.getTime() >= e[0].getTime() && enteredDate.getTime() <= e[1].getTime()) brebeufDay = null;
    }
    
    if (brebeufDay != null) {
      var dayCount = 0;

      var testEntered = new Date(enteredDate);
      testEntered.setDate(testEntered.getDate() + 1);
      
      while (dayTest.getTime() != testEntered.getTime()) {

        if (!(dayTest.getDay() == 6 || dayTest.getDay() == 0)) {
          var breakDay = false;
          for (y of specialDays) {
            if (dayTest.getTime() == y.getTime()) breakDay = true;
          }
          if (!breakDay) dayCount ++;
        } 
        dayTest.setDate(dayTest.getDate() + 1);
      }

      brebeufDay = dayCount % 8;
    }
  }
  if (brebeufDay == 0) brebeufDay = 8;

  return brebeufDay;
} 

// Return the order of classes on the entered Brebeuf day
function classOrder(n) {
  const START_ORDER = [1,8,6,5,3];
  var classOrder = new Array(...START_ORDER);
  for (x in classOrder) {
    classOrder[x] = (classOrder[x] + n - 1) % 8;
    if (classOrder[x] == 0) classOrder[x] = 8;
  }
  return classOrder;
}

function temporary() {
  userProperties.deleteProperty(USER_PREFIX+"calendarId");
}