const Page = require("./Page");
const Video = require("./Video");
const Post = require("./Post");
const Collector = require("./Collector");
const Statistic = require("./Statistic");
const access_token = require("./Token").access_token;

Video.getAll()
  .then(Collector.collectStatisticsForVideo(access_token))
  .then(Statistic.vsave);

Post.getAll()
  .then(Collector.collectStatistics(access_token))
  .then(Statistic.psave);
