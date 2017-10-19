const Steepests = require("./steepests");
const moment = require("moment");

const endDay = moment(new Date())
  .add(1, "day")
  .startOf("day")
  .toDate();
const startDay = moment(new Date())
  .startOf("day")
  .toDate();

module.exports.today = () => {
  Steepests.videos.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.videos.saveToday);
  Steepests.posts.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.posts.saveToday);
};
