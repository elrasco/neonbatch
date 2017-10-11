const R = require('ramda');
const fbApi = require('./fbApi');

module.exports = {
  getPagesILike: access_token => fbApi.get('/me/likes?limit=70&fields=name,id,picture,created_time', { access_token }).then(result => result.data)
}