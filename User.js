const R = require('ramda');
const fbApi = require('./fbApi');

module.exports = {
  getPagesILike: access_token => fbApi.get('/me/likes?limit=50', { access_token }).then(result => result.data)
}