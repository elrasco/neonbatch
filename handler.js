"use strict";

const Promise = require("bluebird");
const R = require("ramda");

const Video = require("./lib/Video");
const Post = require("./lib/Post");
const Collector = require("./lib/Collector");
const Statistic = require("./lib/Statistic");
const Page = require("./lib/Page");
const User = require("./lib/User");
const access_token = require("./lib/Token").access_token;
const steepest = require("./lib/steepest");

module.exports = {
  LoadStatistics: (event, context, callback) => {
    Video.getAll()
      .then(Collector.collectStatisticsForVideo())
      .then(Statistic.vsave);
    Post.getAll()
      .then(Collector.collectStatistics())
      .then(Statistic.psave);
  },
  LoadVideos: (event, context, callback) => {
    Page.getAll()
      .then(Page.getTodayVideosAll(access_token))
      .then(Video.saveMany);
  },
  LoadPosts: (event, context, callback) => {
    Page.getAll()
      .then(Page.getTodayPostsAll(access_token))
      .then(Post.saveMany);
  },
  LoadPages: (event, context, callback) => {
    User.getPagesILike(access_token)
      .then(pages => Promise.all([pages, Page.getFans(access_token)(pages), Page.getFansByCountry(access_token)(pages)]))
      .then(([pages, fans, fansByCountry]) => pages.map(p => Object.assign({}, p, R.find(R.propEq("id", p.id))(fans), R.find(R.propEq("id", p.id))(fansByCountry))))
      .then(Page.saveMany);
  },
  Today: (event, context, callback) => {
    steepest.today();
  },
  Yesterday: (event, context, callback) => {
    steepest.yesterday();
  },
  SevenDays: (event, context, callback) => {
    steepest.sevenDays();
  },
  ThirtyDays: (event, context, callback) => {
    steepest.thirtyDays();
  }
};
