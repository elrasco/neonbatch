const R = require("ramda");
const fbApi = require("./fbApi");
const moment = require("moment");
const changeId = require("./Utils").changeId;
const Token = require("./Token");
const Page = require("./Page");

const collectStatistics = () => posts => {
  post_ids = posts.map(p => {
    return {
      id: p.id,
      access_token: Token.getAppAccessToken()
    };
  });
  const summary_total_count_map = field => response => {
    return {
      id: response.id,
      total_count: response[field].summary.total_count,
      page_id: response.from.id
    };
  };

  const summary_total_count_shares = response => {
    return {
      id: response.id,
      total_count: (response.shares || {}).count || 0,
      page_id: response.from.id
    };
  };

  const sort_by_total_count = posts => posts.sort((post1, post2) => post2.total_count - post1.total_count);

  const add_page_fan_count = (insights, pages) =>
    insights.map(insight => {
      const page = pages.find(p => p.id === insight.page_id);
      //console.log(insight);
      return {
        id: insight.id,
        total_count: insight.total_count,
        page_id: insight.page_id,
        page_fan_count: page.fan_count
      };
    });

  const insights = fbApi
    .batch(post_ids, "", { access_token: Token.getAppAccessToken(), parameters: [`fields=comments.summary(1),likes.summary(1),reactions.summary(1),shares,from`] })
    .then(R.flatten)
    .then(response => [
      R.map(summary_total_count_map("comments"))(response),
      R.map(summary_total_count_map("likes"))(response),
      R.map(summary_total_count_map("reactions"))(response),
      R.map(summary_total_count_shares)(response)
    ])
    .then(([comments, likes, reactions, shares]) => {
      //devo aggiungere i valori delle pagine
      return Promise.all([comments, likes, reactions, shares, Page.getAll()]);
    })
    .then(([comments, likes, reactions, shares, pages]) => [
      add_page_fan_count(comments, pages),
      add_page_fan_count(likes, pages),
      add_page_fan_count(reactions, pages),
      add_page_fan_count(shares, pages)
    ])
    .then(([comments, likes, reactions, shares]) => [sort_by_total_count(comments), sort_by_total_count(likes), sort_by_total_count(reactions), sort_by_total_count(shares)])
    .then(([comments, likes, reactions, shares]) => [comments.map(changeId()), likes.map(changeId()), reactions.map(changeId()), shares.map(changeId())]);

  return insights.then(insights => {
    const created_at = new Date();
    const y = parseInt(moment(created_at).format("YYYY"));
    const m = parseInt(moment(created_at).format("MM"));
    const d = parseInt(moment(created_at).format("DD"));
    const h = parseInt(moment(created_at).format("HH"));
    return {
      created_at,
      y,
      m,
      d,
      h,
      comments: insights[0],
      likes: insights[1],
      reactions: insights[2],
      shares: insights[3]
    };
  });
};

module.exports = {
  collectStatisticsForVideo: () => posts => {
    let _posts = posts.map(p => Object.assign({}, p, { id: p.page_id ? `${p.page_id}_` + p.id : p.id }));
    return collectStatistics()(_posts).then(statistic => {
      statistic.comments = statistic.comments.map(c => Object.assign(c, { objectId: c.objectId.split("_")[1], id: c.objectId.split("_")[1] }));
      statistic.likes = statistic.likes.map(c => Object.assign(c, { objectId: c.objectId.split("_")[1], id: c.objectId.split("_")[1] }));
      statistic.reactions = statistic.reactions.map(c => Object.assign(c, { objectId: c.objectId.split("_")[1], id: c.objectId.split("_")[1] }));
      statistic.shares = statistic.shares.map(c => Object.assign(c, { objectId: c.objectId.split("_")[1], id: c.objectId.split("_")[1] }));
      return statistic;
    });
  },
  collectStatistics
};
