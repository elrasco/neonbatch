const moment = require("moment");
const Steepests = require("./steepests");

const startDay = moment(new Date())
  .subtract(1, "day")
  .startOf("day")
  .toDate();
const endDay = moment(new Date())
  .startOf("day")
  .toDate();

module.exports.yesterday = () => {
  Steepests.videos.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.videos.saveYesterday);
  Steepests.posts.reactions({ created_at: { $gte: startDay, $lte: endDay } }).then(Steepests.posts.saveYesterday);
};
