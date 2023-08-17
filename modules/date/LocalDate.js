export class DayOfWeek {
  static SUNDAY = new DayOfWeek("Sunday", "Sun.", true, 0);
  static MONDAY = new DayOfWeek("Monday", "Mon.", false, 1);
  static TUESDAY = new DayOfWeek("Tuesday", "Tues.", false, 2);
  static WEDNESDAY = new DayOfWeek("Wednesday", "Wed.", false, 3);
  static THURSDAY = new DayOfWeek("Thursday", "Thu.", false, 4);
  static FRIDAY = new DayOfWeek("Friday", "Fri.", false, 5);
  static SATURDAY = new DayOfWeek("Saturday", "Sat.", true, 6);
  static #allDays = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];
  #name;
  #shortName;
  #isWeekend;
  #number;
  constructor(name, shortName, isWeekend, number) {
    this.#name = name;
    this.#shortName = shortName;
    this.#isWeekend = isWeekend;
    this.#number = number;
  }
  get name() {
    return this.#name;
  }
  get shortName() {
    return this.#shortName;
  }
  get weekend() {
    return this.#isWeekend;
  }
  get number() {
    return this.#number;
  }
  static fromNumber(number) {
    return DayOfWeek.#allDays.find((day) => day.number === number);
  }
}
export class LocalDate {
  #jsDate;
  static #isInternalConstructing = false;
  constructor(jsDate) {
    if (!LocalDate.#isInternalConstructing) {
      throw "LocalDate constructor is private. Use a static method to get an instance";
    }
    this.#jsDate = jsDate;
  }

  get year() {
    return this.#jsDate.getUTCFullYear();
  }

  get date() {
    return this.#jsDate.getUTCDate();
  }

  get month() {
    return this.#jsDate.getUTCMonth() + 1;
  }

  get day() {
    return this.#jsDate.getUTCDay();
  }

  get dayOfWeek() {
    return DayOfWeek.fromNumber(this.day);
  }

  get weekend() {
    return this.#jsDate.getUTCDay() === 0 || this.#jsDate.getUTCDay() === 6;
  }

  millisecondsUntilNextDate() {
    const todayAsDate = new Date();
    const tomorrowDate =  new Date(`${todayAsDate.getFullYear()}-${LocalDate.pad(
      todayAsDate.getMonth() + 1
    )}-${LocalDate.pad(todayAsDate.getDate() + 1)}T00:00:00.000`)
    return tomorrowDate.getTime() - todayAsDate.getTime()
  }

  next() {
    const clonedDate = new Date(this.#jsDate);
    clonedDate.setUTCDate(clonedDate.getUTCDate() + 1);
    LocalDate.#isInternalConstructing = true;
    const instance = new LocalDate(clonedDate);
    LocalDate.#isInternalConstructing = false;
    return instance;
  }

  prior() {
    const clonedDate = new Date(this.#jsDate);
    clonedDate.setUTCDate(clonedDate.getUTCDate() - 1);
    LocalDate.#isInternalConstructing = true;
    const instance = new LocalDate(clonedDate);
    LocalDate.#isInternalConstructing = false;
    return instance;
  }

  toISOString() {
    return `${this.#jsDate.getUTCFullYear()}-${LocalDate.pad(
      this.#jsDate.getUTCMonth() + 1
    )}-${LocalDate.pad(this.#jsDate.getUTCDate())}`;
  }

  toLocaleString() {
    return LocalDateFormatter.format(this);
  }

  isGreaterThan(otherLocalDate) {
    const yearGreater = this.year > otherLocalDate.year;
    const yearEqual = this.year === otherLocalDate.year;
    const monthGreater = this.month > otherLocalDate.month;
    const monthEqual = this.month === otherLocalDate.month;
    const dateGreater = this.date > otherLocalDate.date;
    const dateEqual = this.date === otherLocalDate.date;
    if (yearGreater) {
      return true;
    } else if (yearEqual && monthGreater) {
      return true;
    } else if (yearEqual && monthEqual && dateGreater) {
      return true;
    }
    return false;
  }

  isEqual(otherLocalDate) {
    const yearEqual = this.year === otherLocalDate.year;
    const monthEqual = this.month === otherLocalDate.month;
    const dateEqual = this.date === otherLocalDate.date;
    return yearEqual && monthEqual && dateEqual;
  }

  asNumber() {
    return this.#jsDate.getTime();
  }

  clone() {
    LocalDate.#isInternalConstructing = true;
    const instance = new LocalDate(new Date(this.toISOString()));
    LocalDate.#isInternalConstructing = false;
    return instance;
  }

  isValid() {
    return this.#jsDate != "Invalid Date";
  }

  static pad(number) {
    const numberString = String(number);
    if (numberString.length < 2) {
      return `0${number}`;
    }
    return numberString;
  }

  static today() {
    const todayAsDate = new Date();
    // Take today, get the user's year-month-date to initialize a LocalDate of today
    // If I did new LocalDate(new Date()), then the LocalDate would be whatever 'today' is in England
    LocalDate.#isInternalConstructing = true;
    const instance = LocalDate.fromISOString(
      `${todayAsDate.getFullYear()}-${LocalDate.pad(
        todayAsDate.getMonth() + 1
      )}-${LocalDate.pad(todayAsDate.getDate())}`
    );
    LocalDate.#isInternalConstructing = false;
    return instance;
  }

  static fromISOString(string) {
    LocalDate.#isInternalConstructing = true;
    const instance = new LocalDate(new Date(string));
    LocalDate.#isInternalConstructing = false;
    return instance;
  }
}

class LocalDateFormatter {
  static #enUS = (localDate) =>
    `${localDate.month}/${localDate.date}/${localDate.year}`;
  static #zhCN = (localDate) =>
    `${localDate.year}-${localDate.month}-${localDate.date}`;
  static format(localDate) {
    if (navigator.language === "en-US") {
      return this.#enUS(localDate);
    } else if (navigator.language === "zh-CN") {
      return this.#zhCN(localDate);
    } else {
      return this.#enUS(localDate);
    }
  }
}
