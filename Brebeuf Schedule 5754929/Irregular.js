// ACTIVE BUILDING
// CONVERT; DELETE OLD (GO BACK?); ENTER NEW INFO; SAVE NEW INFO; RENDER COURSELIST; DIRECT STRAIGHT TO PAGE; REQUEST
function irregularClass(e) {
  // MARK CHANGED; RETAIN INFO; DELETE OLD PROPERTY
  // DELETE OLD COMMENTS
  var name;
  var nameInput = e.commonEventObject.formInputs.name_input;
  if (nameInput === undefined) name = null;
  else name = nameInput.stringInputs.value[0];

  var period;  
  var periodInput = e.commonEventObject.formInputs.period_input;
  if (periodInput === undefined) period = null;
  else period = periodInput.stringInputs.value[0];
  

  // NOTE: IMPOSSIBLE TO HAVE "NULL" ENTERED BECAUSE OPTIONS INSTEAD OF TEXT INPUT

  var prt = e.commonEventObject.formInputs.prt_input.stringInputs.value[0];
  if (prt == "null") prt = null;
  var lunch = e.commonEventObject.formInputs.lunch_input.stringInputs.value[0];
  if (lunch == "null") lunch = null;

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
    .setBackgroundColor(brebeufSchedule5754929.COLOR_MAIN);

   var prtClass = CardService.newTextButton()
    .setText("Meeting during PRT")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("setPrtClass")
      .setParameters({classInfo: JSON.stringify(classInfo), status: status}))
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor(brebeufSchedule5754929.COLOR_ALT);
  
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


function setPeriodClass(e) {
  // HIDDEN SETTINGS?
  var classInfo = e.parameters.classInfo;
  classInfo = JSON.parse(classInfo);
  console.log(classInfo);

  var subject = new Irregular_Period(classInfo[0], classInfo[1], classInfo[2], classInfo[3], null);
  return subject.build(e.parameters.status);

  // IN TITLE / IN SECTION? SEPARATE FUNCTION TO SEARCH FOR
  // STATUS
}

function setPrtClass(e) {
  var classInfo = e.parameters.classInfo;
  classInfo = JSON.parse(classInfo);
  // name, prt, day, amPm
  // PERIOD TO PRT?

  var subject = new Irregular_PRT(classInfo[0], classInfo[2], null, null);
  return subject.build(e.parameters.status, unselectedOption = null);
  // EXPLAIN SECOND PRT
}
