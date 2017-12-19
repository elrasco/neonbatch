const MongoClient = require("mongodb").MongoClient;

const DB_STRING = "mongodb://52.58.109.69:27018/neon";
//const DB_STRING = "mongodb://192.168.0.209:27017/neon";

module.exports = () => {
  let db;
  let current;
  let currentCollection;
  return (_this = {
    connect: (url = DB_STRING) => {
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
    bulkWrite: (documents, recordFilter = { key: "id", value: "id" }) => {
      let insertMany = [];
      documents.forEach(document => {
        let filter = {};
        filter[recordFilter.key] = document[recordFilter.value];
        let updateOne = {
          filter,
          update: document,
          upsert: true
        };
        console.log(filter);
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
