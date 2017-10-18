const MongoClient = require("mongodb").MongoClient;

module.exports = () => {
  let db;
  let current;
  let currentCollection;
  return (_this = {
    connect: (url = "mongodb://52.58.109.69:27018/neon") => {
      current = new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, _db) => {
          db = _db;
          resolve({ action: "connect", result: _db });
        });
      });
      return _this;
    },
    setCollection: _collection => {
      currentCollection = _collection;
      return _this;
    },
    bulkWrite: documents => {
      let insertMany = [];
      documents.forEach(document => {
        let updateOne = { filter: { id: document.id }, update: document, upsert: true };
        insertMany.push({ updateOne });
      });
      current = current.then(
        latest =>
          new Promise((resolve, reject) => {
            db.collection(currentCollection).bulkWrite(insertMany, { ordered: false }, (err, result) => {
              resolve({ action: "bulkWrite", result, db });
            });
          })
      );
      return _this;
    },
    insert: document => {
      current = current.then(
        latest =>
          new Promise((resolve, reject) => {
            db.collection(currentCollection).insert(document, (err, result) => {
              resolve({ action: "insert", result, db });
            });
          })
      );
      return _this;
    },
    find: (query, sort = {}) => {
      current = current.then(
        latest =>
          new Promise((resolve, reject) => {
            db
              .collection(currentCollection)
              .find(query)
              .sort(sort)
              .toArray((err, result) => {
                resolve({ action: "find", result });
              });
          })
      );
      return _this;
    },
    drop: () => {
      current = current.then(
        latest =>
          new Promise((resolve, reject) => {
            db.dropCollection(currentCollection, (err, result) => {
              resolve({ action: "drop", result });
            });
          })
      );
      return _this;
    },
    close: () =>
      current.then(
        latest =>
          new Promise((resolve, reject) => {
            db.close();
            resolve(latest.result);
          })
      )
  });
};
