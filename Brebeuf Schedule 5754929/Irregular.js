// ACTIVE BUILDING
function irregularClass(e) {
  // MARK CHANGED; RETAIN INFO; DELETE OLD PROPERTY
  // NOTE: SEPARATED INTO DIFFERENT STATEMENTS BECAUSE MULTIPLE ERRORS MAY EXIST
  try {
    var name = e.commonEventObject.formInputs["name_input"].stringInputs.value[0];
  } catch (err) {
    if (err.name !== "TypeError") {
      console.log(err);
      throw err;
    } else name = null;
  }
  try {
    var period = e.commonEventObject.formInputs["period_input"].stringInputs.value[0];
  } catch (err) {
    if (err.name !== "TypeError") {
      console.log(err);
      throw err;
    } else period = null;
  }

  // CATCH; IF
  // CONTINUE RUNNING

  // NOTE: IMPOSSIBLE TO HAVE "NULL" ENTERED BECAUSE OPTIONS INSTEAD OF TEXT INPUT

  var prt = e.commonEventObject.formInputs["prt_input"].stringInputs.value[0];
  if (prt == "null") prt = null;
  var lunch = e.commonEventObject.formInputs["lunch_input"].stringInputs.value[0];
  if (lunch == "null") lunch = null;
  // STRING INSTEAD OF NULL

  var status = e.parameters.status;
  var classInfo = [name, period, prt, lunch, status];


  var courseName;
  if (name == null) courseName = "Untitled";
  else courseName = name;

  const EXPLANATION_TEXT = "To set \"" + courseName + "\" as an irregular class, select an option below.";
  const EXAMPLE_TEXT = "\n(Irregular class: \nA class that does not meet 5 days per cycle.) \n(Ex. Freshman Seminar, College Counseling Seminar, Community Service, Independent Study, etc.)";

  var explanation = CardService.newTextParagraph()
    .setText(EXPLANATION_TEXT);

  var periodClass = CardService.newTextButton()
    .setText("Meeting during Class Period")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("setPeriodClass")
      .setParameters({classInfo: JSON.stringify(classInfo)}))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#761113");

   var prtClass = CardService.newTextButton()
    .setText("Meeting during PRT")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("setPrtClass")
      .setParameters({classInfo: JSON.stringify(classInfo)}))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#DEAC3F");
  
  var selection = CardService.newButtonSet()
    .addButton(periodClass)
    .addButton(prtClass);

  var example = CardService.newTextParagraph()
    .setText(EXAMPLE_TEXT);

  var section = CardService.newCardSection()
    .addWidget(explanation)
    .addWidget(selection)
    .addWidget(example);
    
  var card = CardService.newCardBuilder()
    .addSection(section);

  return card.build();

  // CONVERT BACK
}

// TESTED: POSSIBLE TO PASS IN HALF-FINISHED CARD AS ARG, ADD ELEMENTS TO IT, THEN RETURN THE WHOLE CARD BUILT

// FROM STARTING DATE?
// FROM STARTING TIME?


// MAP?

function setPeriodClass(e) {
  // HIDDEN SETTINGS?
  // userProperties.setProperty(USER_PREFIX+"courseStateChanged", true);
  var classInfo = e.parameters.classInfo;
  classInfo = JSON.parse(classInfo);
  // MORE EFFICIENT WAY?
  var nameVal = classInfo[0];
  var periodVal = classInfo[1];
  var prtVal = classInfo[2];
  var lunchVal = classInfo[3];
  var status = classInfo[4];

  const UNSELECTED_OPTION = "N/A";

  var prt = prtOptions(UNSELECTED_OPTION, prtVal);
  var lunch = lunchOptions(UNSELECTED_OPTION, lunchVal);

  var section = CardService.newCardSection()
    .addWidget(prt)
    .addWidget(lunch);

  var card = CardService.newCardBuilder()
    .addSection(section);
  
  return card.build();
}

function setPrtClass(e) {
  userProperties.setProperty(USER_PREFIX+"courseStateChanged", true);
}

// day, period, prt, lunch
// day, morning? prt

