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

var findDriveways = function(db, zipcode, beginDate, endDate, callback) {
  var now = new Date();
  var nowEpoch = now.getTime();
    beginDate = nowEpoch;
    endDate = endDate || new Date(2020, 6, 26).getTime();
    var zipHash = {};
    if (zipcode) {
      zipHash = { "zipcode": zipcode };
    }
    var cursor = db.collection('driveways').find(zipHash, {"consumer_id":0});
   var htmlToReturn = "<div class='row items-container'>";
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
      	htmlToReturn += "<div class='item-container'><img class='item-img' src='" + doc.photo_url + "'><div class='row'><div class='col-xs-4'>" + doc.city + "</div><div class='col-xs-4'>" + doc.zipcode + "</div><div class='col-xs-4'>$" + doc.price + "</div><div class='item-btn'> <button data-sc-key='sbpb_YzBlMTI5ZDItMTljZC00OWVkLTkyNGEtY2Y4Zjg3NjcxODAw' data-name='MasterDrive' data-description='Rent parking at " + doc.zipcode + "' data-reference = '" + doc._id + "' data-amount= '" + (doc.price*100) + "' data-color='#12B830 '> Reserve </button> </div></div></div>"
        db.collection('driveways').updateOne({"address":doc.address},{$set:{"consumer_id":1}});      
      } else {
        htmlToReturn += "</div>"
         callback(htmlToReturn);
      }
   });
};

exports.allListings = function(req, res) {
  res.render('allListings', {
    title: 'All Listings'
  });
};

exports.filterListings = function(req, res) {
  console.log("out")
  MongoClient.connect(url, function(err, db) {
    console.log("in");
    assert.equal(null, err);
    findDriveways(db, req.params.zipcode, req.params.startDate, req.params.endDate, function(doc) {
      console.log(doc);
      res.send({htmlToReturn: doc});
    });
  });
};


exports.getListings = function(req, res) {
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  findDriveways(db, null, req.params.startDate, req.params.endDate, function(doc) {
	  	console.log(doc);
	  	res.send({htmlToReturn: doc});
	  });
	});
};

exports.purchase= function(req, res) {
  console.log("called");
  res.render('purchase', {
    title: 'Rent It'
  });
};
