const Page = require('./Page');
const Video = require('./Video');
const Post = require('./Post');
const PostStatsCollector = require('./PostStatsCollector');
const Statistic = require('./Statistic');
const access_token = require('./Token').access_token;

Video.getAll().then(PostStatsCollector.collectStatistics(access_token)).then(Statistic.vsave);
Post.getAll().then(PostStatsCollector.collectStatistics(access_token)).then(Statistic.psave);