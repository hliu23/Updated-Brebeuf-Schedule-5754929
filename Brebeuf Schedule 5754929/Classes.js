class Course {
  constructor(name, prt) {
    this._name = name;
    this._prt = prt;
  }
  get name() {
    return this._name;
  }
  set name(val) {
    this._name = val;
  }
  get prt() {
    return this._prt;
  }
  set prt(val) {
    this._prt = val;
  }

  toJSON() {
    return {
      name: this.name,
      prt: this.prt
    };
  }

  // CARD COMPONENTS
  // BUILD

  courseName() {
    var courseName = CardService.newTextInput()
      .setFieldName("name_input")
      .setTitle("Course Name")
      .setValue(this.name);
    return courseName;
  }

  prtVal(UNSELECTED_OPTION = "N/A") {
    var prt = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("prt_input")
      .setTitle("PRT");
      
    switch (this.prt) {
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

    // TEST FOR ERROR?
  }

  saveAndDelete(status){
    var saveButton = CardService.newTextButton()
      .setText("Save Changes")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#761113")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("updateCourseInfo")
        .setParameters({status: status}));

    var deleteButton = CardService.newTextButton()
      .setText("Delete Course")
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor("#DEAC3F")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("deleteCourse")
        .setParameters({status: status}));

    var cardButtonSet = CardService.newButtonSet()
      .addButton(saveButton)
      .addButton(deleteButton);

    return cardButtonSet;    
  }

  
  // NO BUILD()?
}


class Regular_Period extends Course {
  constructor(name, period, prt, lunch) {
    super(name, prt);
    this._period = period;
    this._lunch = lunch; 
  }

  get period() {
    return this._period;
  }
  set period(val) {
    this._period = val;
  }
  
  get lunch() {
    return this._lunch;
  }
  set lunch(val) {
    this._lunch = val;
  }

  toJSON() {
    return {
      name: this.name,
      period: this.period,
      prt: this.prt,
      lunch: this.lunch
    };
  }

  periodNum() {
    var periodNum = CardService.newTextInput()
      .setFieldName("period_input")
      .setTitle("Period Number");
    if (this.period != null) periodNum.setValue(this.period.toString());
    return periodNum;
  }

  // NOT DELETE DEFAULT BECAUSE USE METHOD IN MORE THAN ONE PLACE?
  lunchVal(UNSELECTED_OPTION = "N/A") {
    var lunch = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.RADIO_BUTTON)
      .setFieldName("lunch_input")
      .setTitle("Lunch");
  
    switch (this.lunch) {
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

  irregularButton(status) {
    var irregularButton = CardService.newTextButton()
      .setText("Irregular Class")
      .setOnClickAction(CardService.newAction()
        .setFunctionName("irregularClass")
        .setParameters({status: status}));

    return irregularButton;
  }

  build(status, unselectedOption = "N/A") {
    var courseName = this.courseName();
    var periodNum = this.periodNum();
    var irregularButton = this.irregularButton(status);
    var prtVal = this.prtVal(unselectedOption);
    var lunchVal = this.lunchVal(unselectedOption);
    var saveAndDelete = this.saveAndDelete(status);

    var section = CardService.newCardSection()
      .addWidget(courseName)
      .addWidget(periodNum)
      .addWidget(irregularButton)
      .addWidget(prtVal)
      .addWidget(lunchVal)
      .addWidget(saveAndDelete);

    var card = CardService.newCardBuilder()
      .addSection(section);

    return card.build();
  }
}

class Irregular_Period extends Regular_Period {
  constructor(name, period, prt, lunch, day) {
    super(name, period, prt, lunch);
    this._day = day;
  }

  get day() {
    return this._day;
  }
  set day(val) {
    this._day = val;
  }

  toJSON() {
    return {
      name: this.name,
      period: this.period,
      prt: this.prt,
      lunch: this.lunch,
      day: this.day
    };
  }

  // READABILITY
  dayNum() {
    var dayNum = CardService.newTextInput()
      .setFieldName("day_input")
      .setTitle("Day");
    if (this.day != null) dayNum.setValue(this.day.toString());
    return dayNum;
  }

  build(status) {
    var courseName = this.courseName();
    var dayNum = this.dayNum();
    var periodNum = this.periodNum();
    var prtVal = this.prtVal();
    var lunchVal = this.lunchVal();
    var saveAndDelete = this.saveAndDelete(status);

    var section = CardService.newCardSection()
      .addWidget(courseName)
      .addWidget(dayNum)
      .addWidget(periodNum)
      .addWidget(prtVal)
      .addWidget(lunchVal)
      .addWidget(saveAndDelete);

    var card = CardService.newCardBuilder()
      .addSection(section);

    return card.build();
  }
}

class Irregular_PRT extends Course {
  constructor(name, prt, day, amPm) {
    super(name, prt);
    this._day = day;
    this._amPm = amPm;
  }

  get day() {
    return this._day;
  }
  set day(val) {
    this._day = val;
  }

  get amPm() {
    return this._amPm;
  }
  set amPm(val) {
    this._amPm = val;
  }

  toJSON() {
    return {
      name: this.name,
      prt: this.prt,
      day: this.day,
      amPm: this.amPm
    };
  }

  dayNum() {
    var dayNum = CardService.newTextInput()
      .setFieldName("day_input")
      .setTitle("Day");
    if (this.day != null) dayNum.setValue(this.day.toString());
    return dayNum;
  }

  build(status) {
    var courseName = this.courseName();
    var dayNum = this.dayNum();
    var amPm = this.amPm();
    var prtVal = this.prtVal();
    
    var saveAndDelete = this.saveAndDelete(status);

    var section = CardService.newCardSection()
      .addWidget(courseName)
      .addWidget(dayNum)
      .addWidge(amPm)
      .addWidget(prtVal)
      .addWidget(saveAndDelete);

    var card = CardService.newCardBuilder()
      .addSection(section);

    return card.build();
  }
}


// READABILITY?
  
// CREATE IRREGULAR COURSE


// NULL_STRING
// CHECK FOR ERROR THERE
// DAY TO TOP CLASS?
// IRREGULAR

// COMMON & TEST: BUGS

// TO STRING