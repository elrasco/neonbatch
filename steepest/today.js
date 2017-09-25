const Steepests = require('./steepests');
const moment = require('moment');

const now = moment(new Date());

const y = now.year();
const m = now.month() + 1;
const d = now.date();

Steepests.videos.reactions({ y, m, d }).then(Steepests.videos.saveToday);
Steepests.posts.reactions({ y, m, d }).then(Steepests.posts.saveToday);