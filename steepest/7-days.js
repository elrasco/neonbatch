const moment = require('moment');
const Steepests = require('./steepests');

const yesterday = moment(new Date()).subtract(0, 'day').startOf('day').toDate();
const sevenDaysAgo = moment(new Date()).subtract(6, 'days').startOf('day').toDate();

Steepests.videos.reactions({ created_at: { $gte: sevenDaysAgo, $lte: yesterday } }).then(Steepests.videos.save7Days);
Steepests.posts.reactions({ created_at: { $gte: sevenDaysAgo, $lte: yesterday } }).then(Steepests.posts.save7Days);