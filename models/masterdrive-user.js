var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/masterdrive';
var drivewayPurchased= "1234567";
var user = "8888888"

var updateDriveways = function(db, callback) {
   db.collection('driveways').updateOne(
      { "driveway_id" : drivewayPurchased },
      {
        $set: { "consumer_id": user }
      }, function(err, results) {
      console.log(results);
      callback();
   });
};


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  updateDriveways(db, function() {
      db.close();
  });
});

