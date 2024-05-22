class Exercise {
  _id;
  username;
  date;
  duration;
  description;

  constructor(id, username, date, duration, description) {
    this._id = id;
    this.username = username;
    this.date = (date ? new Date(date) : new Date()).toDateString();
    this.duration = Number(duration);
    this.description = description;
  }
}

module.exports = Exercise;
