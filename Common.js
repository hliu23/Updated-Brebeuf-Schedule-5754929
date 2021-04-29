// This program takes data from Google Classroom and user input to create personalized events in Google Calendar according to each user's class times (Help and Feedback options are available in the add-on)

// 2021.4.27: START FROM filterPreserved() NEXT TIME
// MERGED BETWEEN LATEST GITHUB AND LATEST WEB VERSION
// POSSIBLE LOST OF CHANGES BETWEEN LAST GITHUB COMMIT (FILTER) AND LAST EDIT (COLORS)

// COMMON & IRREGULAR & TEST
// APP SCRIPT -> CLASP -> LOCAL -> GIT -> GITHUBS 

var userProperties = PropertiesService.getUserProperties();


// Return keys of user properties that contain course info
const REGULAR_PREFIX = "REG_";
const IRREGULAR_PREFIX = "IRREG_";
const USER_PREFIX = "USER_";

function update() {
  const CURRENT_VERSION = "2021-04-29-1";
  var version = userProperties.getProperty(USER_PREFIX+"version");
  if (version == null || version != CURRENT_VERSION) {
    userProperties.deleteAllProperties();
  }
  userProperties.setProperty(USER_PREFIX+"version", CURRENT_VERSION);
}


// function chooseCoursesProperties() {
//   
//   var preservedKeys = ["calendarId", "lastCompletedDate", "courseStateChanged"];

//   function filterPreserved(key) {
//     var keep = !(preservedKeys.includes(key));
//     // ADDED NEW PREFIX IN FRONT OF EACH COURSE PROPERTY? SO NO CONFLICTS
    
//     // if (key.includes("IRREGULAR")) keep = false;
//     return keep;
//   } 

//   // FILTER: RETURN TRUE TO KEEP
//   var coursePropertiesKeys = userPropertiesKeys.filter(filterPreserved);
//   return coursePropertiesKeys;
// }

function chooseRegularCoursesProperties() {
  var userPropertiesKeys = userProperties.getKeys();
  console.log(userPropertiesKeys)

  function filterRegular(key) {
    var keep = key.startsWith(REGULAR_PREFIX);
    return keep;
  } 

  var regularCoursePropertiesKeys = userPropertiesKeys.filter(filterRegular);

  return regularCoursePropertiesKeys;
}


// Return parts of user properties that contain course info
function getRegularCoursesProperties() {
  var chooseRegularCourseProperties = chooseRegularCoursesProperties();
  var regularCourseProperties = [];
  for (x of chooseRegularCourseProperties) {
    var property = userProperties.getProperty(x);
    console.log(x);
    regularCourseProperties.push(property);
  }
  return regularCourseProperties;
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

// PRIVACY