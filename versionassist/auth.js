const passport = require('passport');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = '624157383905-vof80mq3s9vji286al2u00bg0jsfh6h7.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';


passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://version-assist.mt.vcnash.oraclevcn.com:3000/auth/google/callback",
  /* callbackURL: "http://localhost:3000/auth/google/callback", */
  
},
function(accessToken, refreshToken, profile, done) {
  console.log(process.env.SUPER_ADMIN, process.env.MONGODB_URL, process.env.REDIS_URL);
  console.log(profile.emails[0].value);
  User.findOne({
      'email': profile.emails[0].value
  }, function(err, user) {
      if (err) {
          return done(err);
      }
      if (!user) {
          if(profile.emails[0].value === process.env.SUPER_ADMIN){
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              role: ['guest', 'admin']
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
            console.log("------- super admin logged in --------");
          }
          else{
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              role: ['guest']
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
            console.log("-------- normal user logged in ----------");
          }
      } else {
        console.log("--------- existing user logged in ----------");
        return done(err, user);
      }
  });
}
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});