const R = require("ramda");
const fbApi = require("./fbApi");
const moment = require("moment");
const mongo = require("./FluentMongo");
const changeId = require("./Utils").changeId;

const getTodayPostsAll = (
  access_token,
  post_type = "post"
) => page_ids_array => {
  return fbApi
    .batch(page_ids_array, `${post_type}s`, {
      access_token,
      parameters: [
        `since=${moment().format("YYYY-MM-DD")}`,
        "fields=created_time,title,source,description,message,type,picture",
        "limit=100"
      ]
    })
    .then(response => response.map(R.prop("data")))
    .then(R.flatten)
    .then(posts => {
      const now = moment(new Date());
      const now_f = f => parseInt(now.format(f));
      return posts.map(v => {
        return Object.assign({}, v, {
          y: now_f("YYYY"),
          m: now_f("MM"),
          d: now_f("DD"),
          h: now_f("HH")
        });
      });
    });
};

module.exports = {
  getTodayPostsAll: access_token => page_ids_array =>
    getTodayPostsAll(access_token)(page_ids_array).then(posts =>
      posts.filter(R.propEq("type", "link"))
    ),
  getTodayVideosAll: access_token => page_ids_array =>
    getTodayPostsAll(access_token, "video")(page_ids_array),
  saveMany: pages =>
    mongo()
      .connect()
      .setCollection("pages")
      .bulkWrite(pages.map(changeId()))
      .close(),
  getAll: () =>
    mongo()
      .connect()
      .setCollection("pages")
      .find({})
      .close(),
  getFans: access_token => pages =>
    fbApi.batch(pages, "", { access_token, parameters: ["fields=fan_count"] })
};
