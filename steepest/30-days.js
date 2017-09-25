const moment = require('moment');
const Steepests = require('./steepests');

const yesterday = moment(new Date()).subtract(1, 'day').startOf('day').toDate();
const thirtyDaysAgo = moment(new Date()).subtract(7, 'days').startOf('day').toDate();

Steepests.videos.reactions({ created_at: { $gte: thirtyDaysAgo, $lte: yesterday } }).then(Steepests.videos.save30Days);
Steepests.posts.reactions({ created_at: { $gte: thirtyDaysAgo, $lte: yesterday } }).then(Steepests.posts.save30Days);