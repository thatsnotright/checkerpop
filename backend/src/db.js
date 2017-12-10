const loki = require('lokijs');

let users = {};

const databaseInitialize = (callback) => {
  users = db.getCollection("users");
  if (users === null) {
    users = db.addCollection("users");
  }
  callback();
}
let db;
module.exports = (callback) => {
  db = new loki('tb.json', {
    autoload: true,
    autoloadCallback: () => databaseInitialize(callback),
    autosave: true,
    autosaveInterval: 4000
  })
  return {
    users: () => users,
  }
};
