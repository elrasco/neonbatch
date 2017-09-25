const Page = require('./Page');
const Video = require('./Video');
const Post = require('./Post');
const post = require('./post');
const Statistic = require('./Statistic');
const access_token = require('./Token').access_token;

Video.getAll().then(post.collectStatistics(access_token)).then(Statistic.vsave);
Post.getAll().then(post.collectStatistics(access_token)).then(Statistic.psave);