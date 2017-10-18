const Page = require("./lib/Page");
const Video = require("./lib/Video");
const Post = require("./lib/Post");
const access_token = require("./Token").access_token;

Page.getAll()
  .then(Page.getTodayVideosAll(access_token))
  .then(Video.saveMany);
Page.getAll()
  .then(Page.getTodayPostsAll(access_token))
  .then(Post.saveMany);
