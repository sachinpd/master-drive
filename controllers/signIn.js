/**
 * GET /
 * Sign in page.
 */
 var nconf = require('nconf');
 var url = require('url');
 var request = require('request');
 var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var mongoUrl = 'mongodb://localhost:27017/masterdrive';
nconf.env();
nconf.file({ file: 'config.json' });

exports.signIn = function(req, res) {
  res.render('signIn', {
    title: 'Sign In',
    DIGITS_CONSUMER_KEY: nconf.get('DIGITS_CONSUMER_KEY'),
    GA_TRACKING_ID: nconf.get('GA_TRACKING_ID')
  });
};

exports.logout = function(req, res) {
	req.session.user = null;
  res.render('home', {
    title: 'Home',
    DIGITS_CONSUMER_KEY: nconf.get('DIGITS_CONSUMER_KEY'),
    GA_TRACKING_ID: nconf.get('GA_TRACKING_ID'), 
    user: null
  });
};

/**
 * POST Digits login.
 */
exports.digits = function (req, res) {
  var apiUrl = req.body['apiUrl']
  var credentials = req.body['credentials']
  var verified = true;
  var messages = [];

  // Verify the OAuth consumer key.
  if (credentials.indexOf('oauth_consumer_key="' + nconf.get('DIGITS_CONSUMER_KEY') + '"') == -1) {
    verified = false;
    messages.push('The Digits API key does not match.');
  }

  // Verify the hostname.
  var hostname = url.parse(req.body.apiUrl).hostname;
  if (hostname != 'api.digits.com' && hostname != 'api.twitter.com') {
    verified = false;
    messages.push('Invalid API hostname.');
  }

  // Do not perform the request if the API key or hostname are not verified.
  if (!verified) {
    return res.send({
      phoneNumber: "",
      userID: "",
      error: messages.join(' ')
    });
  }

  // Prepare the request to the Digits API.
  var options = {
    url: apiUrl,
    headers: {
      'Authorization': credentials
    }
  };

  var insertUserIfNotThere = function(db, fabric_id, callback) {
  	console.log ("Finding fabric_id: " + fabric_id);
	db.collection('users').findOne({"fabric_id": String(fabric_id)}, function (err, doc) {
	if (doc) { 
		console.log("already exists.")
 	} else {
		console.log ("inserting. doesnt exist yet.")
		db.collection('users').insert( { "fabric_id": fabric_id });
	}
	});
 }

  // Perform the request to the Digits API.
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Send the verified phone number and Digits user ID.
      var digits = JSON.parse(body)
      console.log(digits.phone_number);
      console.log(digits.id_str)
      MongoClient.connect(mongoUrl, function(err, db) {
		  assert.equal(null, err);
		  req.session.user = digits.id_str;
		  insertUserIfNotThere(db, digits.id_str, function() {
		      db.close();
		  });
		});
      return res.render('allListings', {
        phoneNumber: digits.phone_number,
        userID: digits.id_str,
        error: ''
      });
    } else {
      // Send the error.
      return res.render('allListings', {
        phoneNumber: '',
        userID: '',
        error: error.message
      });
    }
  });
};
