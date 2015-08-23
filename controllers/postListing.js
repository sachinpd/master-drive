/**
 * GET /
 * Post Listing page.
 */
exports.postListing = function(req, res) {
  res.render('postListing', {
    title: 'Post Listing',
    DIGITS_CONSUMER_KEY: nconf.get('DIGITS_CONSUMER_KEY'),
    GA_TRACKING_ID: nconf.get('GA_TRACKING_ID')
  });
};