// This program takes data from Google Classroom and user input to create personalized events in Google Calendar according to each user's class times (Help and Feedback options are available in the add-on)


// COMMON & IRREGULAR & TEST
// APP SCRIPT -> CLASP -> LOCAL -> GIT -> GITHUBS 

// AVOID GLOBAL VARIABLES
var userProperties = PropertiesService.getUserProperties();

// SCRIPT PROPERTY?

function propKeys(identifier) {
  var userPropKeys = userProperties.getKeys();

  function filterByIdentifier(key) {
    var keep;
    if (identifier === brebeufSchedule5754929.REGULAR_PREFIX) keep = key.startsWith(brebeufSchedule5754929.REGULAR_PREFIX);
    else if (identifier === brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX) keep = key.startsWith(brebeufSchedule5754929.IRREGULAR_PERIOD_PREFIX);
    else if (identifier === brebeufSchedule5754929.IRREGULAR_PRT_PREFIX) keep = key.startsWith(brebeufSchedule5754929.IRREGULAR_PRT_PREFIX);
    return keep;
  }
  var propKeys = userPropKeys.filter(filterByIdentifier);

  return propKeys;
}

// RENDERING?


// Return parts of user properties that contain course info
function getProps(identifier) {
  var propKeysList = propKeys(identifier);
  var props = [];
  for (let x of propKeysList) {
    var prop = userProperties.getProperty(x);
    prop = JSON.parse(prop);
    props.push(prop);
  }
  return props;
}

// UPLOAD IMAGE TO SITE
// CONST
// DEFAULT?
// WARNING FOR COLOR?
// NOTE: REQUIRED THE ENTERING OF N/A FOR COLORS DUE TO HAVING OPTIONAL VALUES FOR KEYS AND VALUES - ALT IS TO LABEL PARAMETERS
// DEFAULT?
// Parameters: string, string (identifier), hexadecimal color (N/A if not needed)
/**
 * @param {String} text Text displayed on the button
 * @param {String} fnName Name of the function the button calls
 * @param {String} color Hexadecimal color of the button, enter "N/A" if leaving blank
 */
// NOT WORKING?
function newButton(text, fnName, color) {
  var button = CardService.newTextButton()
    .setText(text)
    .setOnClickAction(CardService.newAction()
      .setFunctionName(fnName));
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
