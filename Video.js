const mongo = require('./FluentMongo');

const changeId = fieldName => obj => {
  obj[fieldName || 'objectId'] = obj.id
  return obj;
}

module.exports = {
  saveMany: videos => mongo().connect().setCollection('videos').bulkWrite(videos.map(changeId())).close(),
  getAll: () => mongo().connect().setCollection('videos').find({}).close()
}