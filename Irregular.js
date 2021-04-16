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

  var explanation = CardService.newTextParagraph()
    .setText("To set \"" + courseName + "\" as an irregular class, select an option below."+classInfo);

  var periodClass = newButton("Meeting during Class Period", "setPeriodClass", "#761113");
  var prtClass = newButton("Meeting during PRT", "setPrtClass", "#DEAC3F");
  var selection = CardService.newButtonSet()
    .addButton(periodClass)
    .addButton(prtClass);

  var example = CardService.newTextParagraph()
    .setText("\n(Irregular class: \nA class that does not meet 5 days per cycle.) \n(Ex. Freshman Seminar, College Counseling Seminar, Community Service, Independent Study, etc.)");


  var section = CardService.newCardSection()
    .addWidget(explanation)
    .addWidget(selection)
    .addWidget(example);
    
  var card = CardService.newCardBuilder()
    .addSection(section)

  return card.build();

  // CONVERT BACK
}

// Update course info in user properties according to user input
function updateIncompleteCourseInfo(e) {
  userProperties.setProperty("courseStateChanged", true);
  try {
    if (period == " ") throw new TypeError;
    else if (isNaN(period)) throw new TypeError;
    else if (period < 1 || period > 8) throw new TypeError;

    
  
    if (prt == "null" || lunch == "null") throw new TypeError;

  }
  // Catch TypeError
  catch (err) {
    if (err.name !== "TypeError") throw err;
    else {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText("Please make sure all the fields are filled in correctly."))
      .build();
    };
  };

  
  var subject = e.parameters.subject;
  var status = e.parameters.status;
  
  period = parseInt(period, 10);
  if (status !== "!nullnullnullnullnullnullnullnullnullnull!") {
    userProperties.deleteProperty(subject);
  };
  
  var course = new Subject(name, period, prt, lunch);  
  userProperties.setProperty(course.name, JSON.stringify(course));

  var toHomePage = CardService.newNavigation().popToNamedCard("homePage").updateCard(homePage());
  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText("Changes successfully saved."))
    .setNavigation(toHomePage)
    .build();
}

// day, period, prt, lunch
// day, morning? prt

function uiForIrregularPeriodClass(course) {
  var subject;
  if (course != null) subject = JSON.parse(PropertiesService.getUserProperties().getProperty(course));
  else subject = new Subject("", null, null, null);
    
  var courseName = CardService.newTextInput()
    .setFieldName("name_input")
    .setTitle("Course Name")
    .setValue(subject.name);
    
  var periodNum = CardService.newTextInput()
    .setFieldName("period_input")
    .setTitle("Period Number");

  if (subject.period != null) periodNum.setValue(subject.period.toString());

  var irregularClass = CardService.newTextButton()
    .setText("Irregular Class")
    .setOnClickAction(CardService.newAction()
      .setFunctionName("irregularClass")
      .setParameters({courseName: subject.name}));

  var prt = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("PRT")
    .setFieldName("prt_input");

  const unselectedOption = "No selection found. Select an option.";

  switch (subject.prt) {
    case ("A"):
      prt.addItem("A", "A", true)
      .addItem("B", "B", false)
      .addItem(unselectedOption, null, false);
      break;
    case ("B"): 
      prt.addItem("A", "A", false)
      .addItem("B", "B", true)
      .addItem(unselectedOption, null, false);
      break;
    default:
      prt.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem(unselectedOption, null, true);
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
      .addItem(unselectedOption, null, false);
      break;
    case ("B"):
      lunch.addItem("A", "A", false)
      .addItem("B", "B", true)
      .addItem("C", "C", false)
      .addItem(unselectedOption, null, false);
      break;
    case ("C"):
      lunch.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem("C", "C", true)
      .addItem(unselectedOption, null, false);
      break;
    default:
      lunch.addItem("A", "A", false)
      .addItem("B", "B", false)
      .addItem("C", "C", false)
      .addItem(unselectedOption, null, true);
    break;
  }

  if (course == null) status = "!nullnullnullnullnullnullnullnullnullnull!";
  else status = course.toString();
  
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

function setPeriodClass(e){
  userProperties.setProperty("courseStateChanged", true);
}

function setPrtClass(e){
  userProperties.setProperty("courseStateChanged", true);
}
