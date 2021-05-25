function viewProperties() {
  console.log(userProperties.getProperties());
  console.log(PropertiesService.getScriptProperties().getProperties());
}

function setScriptProperties() {
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

    "USER_PREFIX" : "USER_",
    "REGULAR_PREFIX" : "REG_",
    "IRREGULAR_PERIOD_PREFIX" : "IRR_PER_",
    "IRREGULAR_PRT_PREFIX" : "IRR_PRT_",

    "COLOR_MAIN" : "#761113",
    "COLOR_ALT" : "#DEAC3F",

    "NULL_STRING" : "!nullnullnullnullnullnullnullnullnullnull!"
  });
}

// SYNTAX SUGAR?

function cleanScriptProperties() {
  PropertiesService.getScriptProperties().deleteAllProperties();
}


function update() {
  const CURRENT_VERSION = "2021-05-07-2";
  var version = userProperties.getProperty(brebeufSchedule5754929.USER_PREFIX+"version");
  if (version == null || version != CURRENT_VERSION) {
    // Updates
    // KEEP PROPERTIES
    userProperties.deleteAllProperties();
  }
  userProperties.setProperty(brebeufSchedule5754929.USER_PREFIX+"version", CURRENT_VERSION);
}

function underMaintenance(estimatedTimeUp = null) {
  // NEW DATE?
  if (estimatedTimeUp !== null) {
    const ESTIMATED_TIME_UP = new Date(estimatedTimeUp);
    var maintenance = "This add-on is undergoing maintenance and is currently unavailable. Please check again after " + ESTIMATED_TIME_UP + ". Thank you for your patience!";
  } else {
    var maintenance = "This add-on is undergoing maintenance and is currently unavailable. Please check again later. Thank you for your patience!";
  }
  
  var text = CardService.newTextParagraph()
    .setText(maintenance);
  var section = CardService.newCardSection()
    .addWidget(text);
  var card = CardService.newCardBuilder()
    .addSection(section);
  return card.build();
  // HEADER?
}

// PRIVACY