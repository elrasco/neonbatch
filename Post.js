const mongo = require('./FluentMongo');

module.exports = {
  saveMany: posts => mongo().connect().setCollection('posts').bulkWrite(posts).close(),
  getAll: () => mongo().connect().setCollection('posts').find({}).close()
}