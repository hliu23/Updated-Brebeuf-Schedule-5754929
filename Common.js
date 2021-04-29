// COMMON & IRREGULAR
// APP SCRIPT -> CLASP -> LOCAL -> GIT -> GITHUBS 

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
// NOT WORKING?
function newButton(text, fnName, color, key = undefined, value = undefined) {
  var action = CardService.newAction()
    .setFunctionName(fnName);
  if (key !== undefined && value !== undefined) {
    // WARNING
    // if (key.length != value.length) console.log("Warning: the numbers of keys and values provided do not match in function " + fnName + "associated with button " + text);
    action.setParameters({key: value.toString()});
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

function prtOptions(unselectedOption, prtVal) {
  const UNSELECTED_OPTION = unselectedOption;

  var prt = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("PRT")
    .setFieldName("prt_input");

  switch (prtVal) {
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

  return prt;
}

function lunchOptions(unselectedOption, lunchVal) {
  const UNSELECTED_OPTION = unselectedOption;

  var lunch = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("Lunch")
    .setFieldName("lunch_input");

  switch (lunchVal) {
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

  return lunch;
}

function deleteUserInfo() {
  userProperties.deleteAllProperties()
}