const Video = require("./lib/Video");
const Post = require("./lib/Post");
const Collector = require("./lib/Collector");
const Statistic = require("./lib/Statistic");

Video.getAll()
  .then(Collector.collectStatisticsForVideo())
  .then(Statistic.vsave);

Post.getAll()
  .then(Collector.collectStatistics())
  .then(Statistic.psave);
