const R = require('ramda');
const Statistic = require('../Statistic');
const mongo = require('../FluentMongo');

const steepests = reactions => {
  let mins = {}
  reactions.forEach(c => {
    mins[c.id] = c.total_count;
  })

  let maxs = {};
  reactions.reverse().forEach(c => {
    maxs[c.id] = c.total_count;
  });

  const steepest = R.keys(maxs)
    .map(id => Object.assign({}, { id, total_count: maxs[id] }, { diff: maxs[id] - mins[id] }))
    .sort((c1, c2) => c2.diff - c1.diff);

  return steepest;
}

module.exports = {
  videos: {
    reactions: query => Statistic.getV(query, { created_at: -1 })
      .then(R.map(R.prop('reactions')))
      .then(R.flatten)
      .then(steepests),
    saveToday: reactions => mongo().connect().setCollection('todayVideos').drop().insert(reactions).close(),
    saveYesterday: reactions => mongo().connect().setCollection('yesterdayVideos').drop().insert(reactions).close(),
    save7Days: reactions => mongo().connect().setCollection('7dVideos').drop().insert(reactions).close(),
    save30Days: reactions => mongo().connect().setCollection('30dVideos').drop().insert(reactions).close()
  },
  posts: {
    reactions: query => Statistic.getP(query, { created_at: -1 })
      .then(R.map(R.prop('reactions')))
      .then(R.flatten)
      .then(steepests),
    saveToday: reactions => mongo().connect().setCollection('todayPosts').drop().insert(reactions).close(),
    saveYesterday: reactions => mongo().connect().setCollection('yesterdayPosts').drop().insert(reactions).close(),
    save7Days: reactions => mongo().connect().setCollection('7dPosts').drop().insert(reactions).close(),
    save30Days: reactions => mongo().connect().setCollection('30dPosts').drop().insert(reactions).close()
  }
}