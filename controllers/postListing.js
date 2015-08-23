/**
 * GET /
 * Post Listing page.
 */
exports.postListing = function(req, res) {
  res.render('postListing', {
    title: 'Post Listing'
  });
};