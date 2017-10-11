const R = require("ramda");
const fbApi = require("./fbApi");
const Video = require("./Video");
const access_token = require("./Token").access_token;
const mongo = require("./FluentMongo");

Video.getAll()
  .then(videos => {
    let video_ids = videos.map(R.pick(["id"]));
    return Promise.all([
      fbApi
        .batch(video_ids, "", { access_token, parameters: [`fields=from,length,content_category`] })
        .then(R.flatten)
        .then(response => response),
      videos
    ]);
  })
  .then(([new_videos, old_videos]) => {
    old_videos.map(v => {
      try {
        const video_with_new_fields = new_videos.find(nv => nv.id === v.id);
        if (video_with_new_fields) {
          return Object.assign(v, {
            page_id: new_videos.find(nv => nv.id === v.id).from.id,
            length: video_with_new_fields.length,
            content_category: video_with_new_fields.content_category
          });
        }
        return v;
      } catch (e) {
        return v;
      }
    });

    /*     mongo()
      .connect()
      .setCollection("videos")
      .bulkWrite(old_videos)
      .close(); */
  });
