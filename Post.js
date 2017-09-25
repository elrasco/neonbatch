const mongo = require('./FluentMongo');

const changeId = fieldName => obj => {
  obj[fieldName || 'objectId'] = obj.id
  return obj;
}

module.exports = {
  saveMany: posts => mongo().connect().setCollection('posts').bulkWrite(posts.map(changeId())).close(),
  getAll: () => mongo().connect().setCollection('posts').find({}).close()
}