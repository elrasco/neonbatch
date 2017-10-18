const Page = require('./Page');
const Video = require('./Video');
const User = require('./User');
const access_token = require('./Token').access_token;
const R = require('ramda');

User.getPagesILike(access_token)
  .then(pages => Promise.all([pages, Page.getFans(access_token)(pages)]))
  .then(([pages, pagefans]) => pages.map(p => Object.assign({}, p, R.find(R.propEq('id', p.id))(pagefans))))
  .then(Page.saveMany);