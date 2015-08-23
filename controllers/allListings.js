/**
 * GET /
 * All Listings page.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/masterdrive';
var zipcode = "94404";
var beginDate = 1440302440;
var endDate = 1442980839;

var findDriveways = function(db, callback) {
	// db.collection('driveways').insert( { "merchant_id": "1", "address": "111 addr", "city": "Berkeley", "zipcode": "94709", "date_begin": 1440476620, "date_end": 1440476820 } )
   // var cursor = db.collection('driveways').find({ "zipcode": zipcode }, { "date_begin": { $lt : beginDate} }, { "date_end": {$gt: endDate } } );
   var cursor = db.collection('driveways').find({});
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
         callback(doc);
      } else {
         callback(doc);
      }
   });
};

exports.allListings = function(req, res) {
  res.render('allListings', {
    title: 'All Listings'
  });
};

exports.getListings = function(req, res) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  findDriveways(db, function(doc) {
	      return res.json(doc);
	  });
	});
};