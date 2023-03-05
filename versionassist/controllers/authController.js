const passport = require('passport');


module.exports.auth_google = passport.authenticate('google', { scope: [ 'email', 'profile' ] })

module.exports.auth_google_callback = passport.authenticate( 'google', {
    successRedirect: '/configure',
    failureRedirect: '/auth/google/failure'
})

module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
}

module.exports.auth_google_failure = (req, res) => {
    res.send('Failed to authenticate..');
}