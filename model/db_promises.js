var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://ahg01:pg@localhost/ctras';
var db = pgp(connectionString);

module.exports = db;
