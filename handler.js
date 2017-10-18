"use strict";
const AWS = require("aws-sdk");
const Promise = require("bluebird");

const Video = require("./lib/Video");
const Post = require("./lib/Post");
const Collector = require("./lib/Collector");
const Statistic = require("./lib/Statistic");

module.exports = {
  LoadStatistics: function(event, context, callback) {
    console.log(JSON.stringify(`Event: event`));
    Video.getAll()
      .then(Collector.collectStatisticsForVideo())
      .then(Statistic.vsave);

    Post.getAll()
      .then(Collector.collectStatistics())
      .then(Statistic.psave);
  }
};
