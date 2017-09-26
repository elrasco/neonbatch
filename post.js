const R = require('ramda');
const fbApi = require('./fbApi');
const moment = require('moment');
const changeId = require('./Utils').changeId;

module.exports = {
  collectStatistics: access_token => posts => {
    post_ids = posts.map(R.pick(['id']));

    const summary_total_count_map = field => response => {
      return {
        id: response.id,
        total_count: response[field].summary.total_count
      };
    };

    const sort_by_total_summary = posts => posts.sort((post1, post2) => post2.total_count - post1.total_count);

    const comments = fbApi.batch(post_ids, '', { access_token, parameters: [`fields=comments.summary(1)`] })
      .then(R.flatten)
      .then(R.map(summary_total_count_map('comments')))
      .then(sort_by_total_summary)
      .then(reactions => reactions.map(changeId()));

    const likes = fbApi.batch(post_ids, '', { access_token, parameters: [`fields=likes.summary(1)`] })
      .then(R.flatten)
      .then(R.map(summary_total_count_map('likes')))
      .then(sort_by_total_summary)
      .then(reactions => reactions.map(changeId()));

    const reactions = fbApi.batch(post_ids, '', { access_token, parameters: [`fields=reactions.summary(1)`] })
      .then(R.flatten)
      .then(R.map(summary_total_count_map('reactions')))
      .then(sort_by_total_summary)
      .then(reactions => reactions.map(changeId()));

    return Promise.all([comments, likes, reactions])
      .then(([comments, likes, reactions]) => {
        const created_at = new Date();
        const y = parseInt(moment(created_at).format('YYYY'));
        const m = parseInt(moment(created_at).format('MM'));
        const d = parseInt(moment(created_at).format('DD'));
        const h = parseInt(moment(created_at).format('HH'));
        return {
          created_at,
          y,
          m,
          d,
          h,
          comments,
          likes,
          reactions,
        }
      });
  }
}