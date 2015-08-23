/**
 * GET /
 * Home page.
 */

  var nconf = require('nconf');

nconf.env();
nconf.file({ file: 'config.json' });

exports.index = function(req, res) {
  res.render('home', {
    title: 'Home',
    DIGITS_CONSUMER_KEY: "frJ8gMQFtKili3jzRTK6lTUQh",
    GA_TRACKING_ID: nconf.get('GA_TRACKING_ID'),
    user: req.session.user
  });
};