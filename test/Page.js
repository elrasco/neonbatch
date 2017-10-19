const Page = require("../lib/Page");
const TOKEN = require("../lib/Token").access_token;

Page.getTodayPostsAll(TOKEN, "post")(["102099916530784"]).then(posts => {
  console.log(posts);
});
