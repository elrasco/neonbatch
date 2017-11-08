const R = require("ramda");
const Statistic = require("../Statistic");
const mongo = require("../FluentMongo");

const steepests = reactions => {
  let mins = {};
  let pages = {};
  reactions.forEach(c => {
    mins[c.id] = c.total_count;
    pages[c.id] = { page_id: c.page_id, page_fan_count: c.page_fan_count };
  });

  let maxs = {};
  reactions.reverse().forEach(c => {
    maxs[c.id] = c.total_count;
  });

  const steepest = R.keys(maxs).map(objectId => {
    return Object.assign({}, { objectId, total_count: maxs[objectId] }, { diff: maxs[objectId] - mins[objectId] }, pages[objectId]);
  });
  //.sort((c1, c2) => c2.diff - c1.diff);

  return steepest;
};

const splitStats = stats => {
  const getReactions = reaction_type => R.flatten(R.map(R.prop(reaction_type))(stats));
  return [getReactions("reactions"), getReactions("comments"), getReactions("likes"), getReactions("shares")];
};

const merge = (reactions, comments, likes, shares) =>
  reactions.map(reaction => {
    const c = comments.find(c => c.objectId === reaction.objectId) || {};
    const l = likes.find(c => c.objectId === reaction.objectId) || {};
    const s = shares.find(c => c.objectId === reaction.objectId) || {};
    return {
      objectId: reaction.objectId,
      page_id: reaction.page_id,
      page_fan_count: reaction.page_fan_count,
      reactions_total_count: reaction.total_count,
      reactions_diff: reaction.diff,
      comments_total_count: c.total_count,
      comments_diff: c.diff,
      likes_total_count: l.total_count,
      likes_diff: l.diff,
      shares_total_count: s.total_count,
      shares_diff: s.diff
    };
  });

module.exports = {
  videos: {
    reactions: query =>
      Statistic.getV(query, { created_at: -1 })
        .then(splitStats)
        .then(([r, c, l, s]) => [steepests(r), steepests(c), steepests(l), steepests(s)])
        .then(([r, c, l, s]) => merge(r, c, l, s)),
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
    reactions: query =>
      Statistic.getP(query, { created_at: -1 })
        .then(splitStats)
        .then(([r, c, l, s]) => [steepests(r), steepests(c), steepests(l), steepests(s)])
        .then(([r, c, l, s]) => merge(r, c, l, s)),
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
