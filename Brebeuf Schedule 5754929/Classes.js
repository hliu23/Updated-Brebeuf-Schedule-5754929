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
}

class Irregular_PRT extends Course {
  constructor(name, prt, day) {
    super(name, prt);
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
      prt: this.prt,
      day: this.day
    };
  }
}

// READABILITY?