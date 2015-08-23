/**
 * GET /
 * My Listings page.
 */
exports.myListings = function(req, res) {
  res.render('myListings', {
    title: 'My Listings'
  });
};