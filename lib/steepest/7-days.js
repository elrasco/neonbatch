const moment = require("moment");
const Steepests = require("./steepests");

const endDay = moment(new Date())
  .startOf("day")
  .toDate();
const startDay = moment(new Date())
  .subtract(6, "days")
  .startOf("day")
  .toDate();

module.exports.sevenDays = () => {
  Steepests.videos.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.videos.save7Days);
  //Steepests.posts.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.posts.save7Days);
};
