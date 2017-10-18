const mongo = require('./FluentMongo');

module.exports = {
  vsave: statistics => mongo().connect().setCollection('vstatistics').insert(statistics).close(),
  psave: statistics => mongo().connect().setCollection('pstatistics').insert(statistics).close(),
  getVAll: () => mongo().connect().setCollection('vstatistics').find({}).close(),
  getV: (q, s) => mongo().connect().setCollection('vstatistics').find(q, s).close(),
  getPAll: () => mongo().connect().setCollection('pstatistics').find({}).close(),
  getP: (q, s) => mongo().connect().setCollection('pstatistics').find(q, s).close(),
}