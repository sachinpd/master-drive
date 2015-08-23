/**
 * GET /
 * Register page.
 */
exports.register = function(req, res) {
  res.render('register', {
    title: 'Register'
  });
};