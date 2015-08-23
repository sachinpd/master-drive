var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/masterdrive';
//var zipcode = "94404";
//var beginDate
//var endDate

var findDriveways = function(db, callback) {
   var cursor =db.collection('driveways').find({ "zipcode": zipcode, { "date_begin": { $lt : beginDate} }, { "date_end": {$gt: endDate } } } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findDriveways(db, function() {
      db.close();
  });
});


