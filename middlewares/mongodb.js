let mongodb = require('mongoose');
let promise = require('bluebird');
let config = require('../config/default');
mongodb.connect(config.mongodb,function(err){
  if (err) throw err;
});
mongodb.Promise = promise;
module.exports = mongodb;
