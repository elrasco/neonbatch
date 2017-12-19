const Graph = require("fb");
const Promise = require("bluebird");
const R = require("ramda");

const asBatchRequests = (calls, mapResponseFunction, access_token) =>
  Graph.api(`/`, "POST", { include_headers: false, batch: calls, access_token })
    .then(responses => responses.filter(res => res.code === 200))
    .then(responses => responses.map(res => res.body))
    .then(responses => responses.map(res => JSON.parse(res)))
    .then(mapResponseFunction);

const get_post_attributes = (nodes, path, parameters, map, access_token) => {
  let requests = [];
  nodes.forEach(node => {
    if (node.token) {
      parameters = parameters.concat(`access_token=${node.token}`);
    }
    requests.push({
      method: "GET",
      relative_url: `${node.id}/${path}?${parameters.join("&")}`
    });
  });

  return asBatchRequests(requests, map, access_token);
};

const batch = (nodes, path, { parameters = [], map = response => response, access_token }) => {
  let _nodes = nodes.slice();
  let collector = [];
  while (_nodes.length) {
    collector.push(get_post_attributes(_nodes.splice(0, 50), path, parameters, map, access_token));
  }
  return Promise.all(collector).then(R.flatten);
};

const get = (path, { map = response => response, access_token }) => {
  return Graph.api(path, { access_token });
};

module.exports.batch = batch;
module.exports.get = get;
