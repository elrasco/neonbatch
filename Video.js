const mongo = require('./FluentMongo');

module.exports = {
  saveMany: videos => mongo().connect().setCollection('videos').bulkWrite(videos).close(),
  getAll: () => mongo().connect().setCollection('videos').find({}).close()
}