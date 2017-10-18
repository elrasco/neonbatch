const Page = require("./Page");
const Video = require("./Video");
const Post = require("./Post");
const Collector = require("./Collector");
const Statistic = require("./Statistic");

Video.getAll()
  .then(Collector.collectStatisticsForVideo())
  .then(Statistic.vsave);

Post.getAll()
  .then(Collector.collectStatistics())
  .then(Statistic.psave);