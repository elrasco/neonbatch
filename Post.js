const mongo = require('./FluentMongo');
const changeId = require('./Utils').changeId;

module.exports = {
  saveMany: posts => mongo().connect().setCollection('posts').bulkWrite(posts.map(changeId())).close(),
  getAll: () => mongo().connect().setCollection('posts').find({}).close()
}