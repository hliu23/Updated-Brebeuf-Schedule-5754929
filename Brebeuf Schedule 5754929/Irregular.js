// ACTIVE BUILDING
function irregularClass(e) {
  // MARK CHANGED; RETAIN INFO; DELETE OLD PROPERTY
  // NOTE: SEPARATED INTO DIFFERENT STATEMENTS BECAUSE MULTIPLE ERRORS MAY EXIST

  var name;
  try {
    name = e.commonEventObject.formInputs["name_input"].stringInputs.value[0];
  } catch (err) {
    if (err.name !== "TypeError") {
      console.log(err);
      throw err;
    } else name = null;
  }
  var period;
  try {
    period = e.commonEventObject.formInputs["period_input"].stringInputs.value[0];
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

  var classInfo = [name, period, prt, lunch];
  var status = e.parameters.status;
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
      .setParameters({classInfo: JSON.stringify(classInfo), status: status}))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor("#761113");

   var prtClass = CardService.newTextButton()
    .setText("Meeting during PRT")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("setPrtClass")
      .setParameters({classInfo: JSON.stringify(classInfo), status: status}))
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

// FROM STARTING DATE?
// FROM STARTING TIME?

// JSON

function setPeriodClass(e) {
  // HIDDEN SETTINGS?
  var classInfo = e.parameters.classInfo;
  classInfo = JSON.parse(classInfo);

  var subject = new Irregular_Period(classInfo[0], classInfo[1], classInfo[2], classInfo[3], null);
  return subject.build(e.parameters.status);

  // IN TITLE / IN SECTION? SEPARATE FUNCTION TO SEARCH FOR
  // STATUS
}

function setPrtClass(e) {
  
}
