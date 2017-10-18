const Page = require("./lib/Page");
const access_token = require("./lib/Token").access_token;
const User = require("./lib/User");
const R = require("ramda");

Page.getAll()
  .then(pages => {
    return Promise.all([pages, Page.getFansByCountry(access_token)(pages)]);
  })
  .then(([pages, pagefanscountry]) => pages.map(p => Object.assign({}, p, R.find(R.propEq("id", p.id))(pagefanscountry))))
  .then(Page.saveMany);
