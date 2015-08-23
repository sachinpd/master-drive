var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/masterdrive';

var postDriveway = function(db, callback) {
	db.collection('driveways').insert( { "merchant_id": "1", "address": "111 addr", "city": "Berkeley", "zipcode": "94709", "date_begin": 1440476620, "date_end": 1440476820 } )
};

/**
 * GET /
 * Post Listing page.
 */
exports.postListing = function(req, res) {
  res.render('postListing', {
    title: 'Post Listing'
  });
};

/**
 * POST /
 * Post Listing page.
 */
exports.addListing = function(req, res) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  postDriveway(db, req.startDate, req.endDate, req.address, req.city, req.state, req.zipcode);
	});
  res.render('postListing', {
    title: 'Post Listing'
  });
};