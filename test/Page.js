const Page = require("../lib/Page");
const User = require("../lib/User");
const access_token = require("../lib/Token").access_token;
const R = require("ramda");
/* 
Page.getTodayPostsAll(TOKEN, "post")(["102099916530784"]).then(posts => {
  console.log(posts);
}); */

User.getPagesILike(access_token)
  .then(pages => Promise.all([pages, Page.getFans(access_token)(pages), Page.getFansByCountry(access_token)(pages)]))
  .then(([pages, fans, fansByCountry]) => pages.map(p => Object.assign({}, p, R.find(R.propEq("id", p.id))(fans), R.find(R.propEq("id", p.id))(fansByCountry))))
  .then(Page.saveMany);
//.then(console.log);
