const R = require("ramda");
const Statistic = require("../Statistic");
const mongo = require("../FluentMongo");

const steepests = reactions => {
  let mins = {};
  let page_ids = {};
  reactions.forEach(c => {
    mins[c.id] = c.total_count;
    page_ids[c.id] = c.page_id;
  });

  let maxs = {};
  reactions.reverse().forEach(c => {
    maxs[c.id] = c.total_count;
  });

  const steepest = R.keys(maxs)
    .map(objectId => {
      return Object.assign({}, { objectId, total_count: maxs[objectId] }, { diff: maxs[objectId] - mins[objectId] }, { page_id: page_ids[objectId] });
    })
    .sort((c1, c2) => c2.diff - c1.diff);

  return steepest;
};

module.exports = {
  videos: {
    reactions: query =>
      Statistic.getV(query, { created_at: -1 })
        .then(R.map(R.prop("reactions")))
        .then(R.flatten)
        .then(steepests),
    saveToday: reactions =>
      mongo()
        .connect()
        .setCollection("todayVideos")
        .drop()
        .insert(reactions)
        .close(),
    saveYesterday: reactions =>
      mongo()
        .connect()
        .setCollection("yesterdayVideos")
        .drop()
        .insert(reactions)
        .close(),
    save7Days: reactions =>
      mongo()
        .connect()
        .setCollection("7dVideos")
        .drop()
        .insert(reactions)
        .close(),
    save30Days: reactions =>
      mongo()
        .connect()
        .setCollection("30dVideos")
        .drop()
        .insert(reactions)
        .close()
  },
  posts: {
    reactions: query => {
      return Statistic.getP(query, { created_at: -1 })
        .then(R.map(R.prop("reactions")))
        .then(R.flatten)
        .then(steepests);
    },
    saveToday: reactions =>
      mongo()
        .connect()
        .setCollection("todayPosts")
        .drop()
        .insert(reactions)
        .close(),
    saveYesterday: reactions =>
      mongo()
        .connect()
        .setCollection("yesterdayPosts")
        .drop()
        .insert(reactions)
        .close(),
    save7Days: reactions =>
      mongo()
        .connect()
        .setCollection("7dPosts")
        .drop()
        .insert(reactions)
        .close(),
    save30Days: reactions =>
      mongo()
        .connect()
        .setCollection("30dPosts")
        .drop()
        .insert(reactions)
        .close()
  }
};
