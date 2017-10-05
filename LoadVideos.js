const Page = require("./Page");
const Video = require("./Video");
const Post = require("./Post");
const access_token = require("./Token").access_token;

//Page.getAll().then(Page.getTodayVideosAll(access_token)).then(Video.saveMany);
Page.getAll()
  .then(Page.getTodayPostsAll(access_token))
  .then(Post.saveMany);
