// COMMON & IRREGULAR

// Return keys of user properties that contain course info
function chooseCoursesProperties() {
  var userPropertiesKeys = userProperties.getKeys();
  var preservedKeys = ["calendarId", "lastCompletedDate", "courseStateChanged"];

  function filterPreserved(key) {
    return !(preservedKeys.includes(key));
  } 

  var coursePropertiesKeys = userPropertiesKeys.filter(filterPreserved);
  return coursePropertiesKeys;
}


// Return parts of user properties that contain course info
function getCourseProperties() {
  var chooseCourseProperties = chooseCoursesProperties();
  var courseProperties = [];
  for (x of chooseCourseProperties) {
    var property = PropertiesService.getUserProperties().getProperty(x);
    courseProperties.push(property);
  }
  return courseProperties;
}

// CONST
// DEFAULT?
// WARNING FOR COLOR?
// NOTE: REQUIRED THE ENTERING OF N/A FOR COLORS DUE TO HAVING OPTIONAL VALUES FOR KEYS AND VALUES - ALT IS TO LABEL PARAMETERS
// DEFAULT?
// Parameters: string, string (identifier), hexadecimal color (N/A if not needed), key, list of value
/**
 * @param {String} text Text displayed on the button
 * @param {String} fnName Name of the function the button calls
 * @param {String} color Hexadecimal color of the button, enter "N/A" if leaving blank
 * @param {String} key Optional key for a parameter of the function
 * @param {} value Option value for a parameter of the function
 */
function newButton(text, fnName, color, key = undefined, value = undefined) {
  var action = CardService.newAction()
    .setFunctionName(fnName);
  if (key !== undefined && value !== undefined) {
    // WARNING
    // if (key.length != value.length) console.log("Warning: the numbers of keys and values provided do not match in function " + fnName + "associated with button " + text);
    action.setParameters({key: value});
  }

  var button = CardService.newTextButton()
    .setText(text)
    .setOnClickAction(action);

  if (color != "N/A") button.setTextButtonStyle(CardService.TextButtonStyle.FILLED).setBackgroundColor(color);

  return button;
}

// ONE PARAM?

function newNotify(text) {
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(text))
    .build();
}


// function functionalityCheck() {
//   return 0;
// }

// function testCases(func, input = null, expectedResults) {
//   var returnVal = func(input);
//   var success = false;
//   if (returnVal == expectedResults) success = true;
//   return success;
// }

function test(){
  // Logger.log(testCases(functionalityCheck, 0));
  // Logger.log(functionalityCheck(null));

  let date = new Date("Apr 15 2021");
  let time = date.getTime();
  Logger.log(time);
  Logger.log("here")

}
// DECLARATION



function deleteUserInfo() {
  userProperties.deleteAllProperties()
}