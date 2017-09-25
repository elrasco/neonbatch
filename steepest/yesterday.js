const moment = require('moment');
const Steepests = require('./steepests');

const yesterday = moment(new Date()).subtract(1, 'day');

const y = yesterday.year();
const m = yesterday.month() + 1;
const d = yesterday.date();

Steepests.videos.reactions({ y, m, d }).then(Steepests.videos.saveYesterday);
Steepests.posts.reactions({ y, m, d }).then(Steepests.posts.saveYesterday);