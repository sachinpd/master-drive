var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/masterdrive';

var postDriveway = function(db, user, startDate, endDate, address, city, state, zipcode, price) {
	db.collection('driveways').insert( { "price": price, "merchant_id": user, "address": address, "city": city, "zipcode": zipcode, "date_begin": parseInt(startDate), "date_end": parseInt(endDate), "photo_url": "http://www.angieslist.com/files/styles/no-dimensions/public/null/driveway_450.jpg?itok=xf2c0rip" } )
};

var findMyDriveways = function(db, user, callback) {
	// db.collection('driveways').insert( { "merchant_id": "1", "address": "111 addr", "city": "Berkeley", "zipcode": "94709", "date_begin": 1440476620, "date_end": 1440476820 } )
   // var cursor = db.collection('driveways').find({ "zipcode": zipcode }, { "date_begin": { $lt : beginDate} }, { "date_end": {$gt: endDate } } );
   var cursor = db.collection('driveways').find({"merchant_id": user});
   var htmlToReturn = "<div class='row items-container'>";
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
      	htmlToReturn += "<div class='item-container'><img class='item-img' src='" + doc.photo_url + "'><div class='row'><div class='col-xs-4'>" + doc.city + "</div><div class='col-xs-4'>" + doc.zipcode + "</div><div class='col-xs-4'>$" + doc.price + "</div></div></div>"
      } else {
          htmlToReturn += "</div>"
         callback(htmlToReturn);
      }
   });
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
  console.log(req.params)
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  postDriveway(db, req.session.user, req.params.startDate, req.params.endDate, req.params.address, req.params.city, req.params.state, req.params.zipcode, req.params.price);
		findMyDriveways(db, req.session.user, function(doc) {
			res.send({htmlToReturn: doc});
		      db.close();
		  });
	});
};
