const mongo = require('./FluentMongo');
const changeId = require('./Utils').changeId;

module.exports = {
  saveMany: videos => mongo().connect().setCollection('videos').bulkWrite(videos.map(changeId())).close(),
  getAll: () => mongo().connect().setCollection('videos').find({}).close()
}