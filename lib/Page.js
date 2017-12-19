const R = require("ramda");
const fbApi = require("./fbApi");
const moment = require("moment");
const mongo = require("./FluentMongo");
const changeId = require("./Utils").changeId;

const getTodayPostsAll = (access_token, post_type = "post") => page_ids_array => {
  let fieldsFor = {
    post: "created_time,source,description,picture,from,type,message",
    video: "created_time,title,source,description,picture,from,content_category,length"
  };
  //console.log(`since=${moment().format("YYYY-MM-DD")}`);
  return fbApi
    .batch(page_ids_array, `${post_type}s`, {
      access_token,
      parameters: [`since=${moment().format("YYYY-MM-DD")}`, `fields=${fieldsFor[post_type]}`, "limit=100"]
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
    })
    .then(posts =>
      posts.map(p => {
        let toBeReturned = Object.assign({}, p, { page_id: p.from.id, page: p.from });
        delete toBeReturned.from;
        return toBeReturned;
      })
    );
};

module.exports = {
  getTodayPostsAll: access_token => page_ids_array =>
    getTodayPostsAll(access_token)(page_ids_array).then(posts => {
      return posts.filter(post => {
        return !R.propEq("type", "video")(post);
      });
    }),
  getTodayVideosAll: access_token => page_ids_array => getTodayPostsAll(access_token, "video")(page_ids_array),
  saveMany: (pages, recordFilter) =>
    mongo()
      .connect()
      .setCollection("pages")
      .bulkWrite(pages.map(changeId()), recordFilter)
      .close(),
  getAll: () =>
    mongo()
      .connect()
      .setCollection("pages")
      .find({})
      .close(),
  getFans: access_token => pages => fbApi.batch(pages, "", { access_token, parameters: ["fields=fan_count,name"] }),
  getExtraFields: access_token => pages =>
    fbApi.batch(pages, "", { access_token, parameters: ["fields=fan_count,name,picture,id,username"] }).then(pages => {
      return pages.map(p => {
        return {
          name: p.name,
          fan_count: p.fan_count,
          picture: p.picture.data.url,
          id: p.id,
          username: p.username
        };
      });
    }),
  getFansByCountry: access_token => pages =>
    fbApi
      .batch(pages, "insights/page_fans_country", { access_token, parameters: [] })
      .then(batchResult => batchResult.map(result => result.data[0]))
      .then(batchResult => batchResult.filter(result => !!result))
      .then(batchResult =>
        batchResult.map(result => {
          if (result) {
            return {
              id: result.id.split("/")[0],
              fans_country: result.values[1].value
            };
          }
        })
      )
};
