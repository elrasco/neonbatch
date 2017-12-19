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
const tokenManager = require("./lib/Token");
const steepest = require("./lib/steepest");

module.exports = {
  LoadVideoStatistics: (event, context, callback) => {
    Video.getAll()
      .then(Collector.collectStatisticsForVideo())
      .then(Statistic.vsave);
  },
  LoadPostStatistics: (event, context, callback) => {
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
    Page.getAll()
      .then(pages => pages.filter(p => !p.name))
      .then(pages =>
        pages.map(p => {
          return {
            id: p.objectId,
            objectId: p.objectId
          };
        })
      )
      .then(pages => Promise.all([pages, Page.getExtraFields(tokenManager.getAppAccessToken())(pages)]))
      .then(([pages, extraFields]) =>
        Promise.all([pages.map(p => Object.assign({}, p, R.find(R.propEq("username", p.id))(extraFields))), Page.getFansByCountry(tokenManager.getAppAccessToken())(pages)])
      )
      .then(([pages, fansByCountry]) => pages.map(p => Object.assign({}, p, R.find(R.propEq("id", p.id))(fansByCountry))))
      .then(pages => Page.saveMany(pages, { key: "objectId", value: "username" }));
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
