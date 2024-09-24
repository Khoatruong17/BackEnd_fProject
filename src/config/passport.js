const { compareSync } = require("bcrypt");
const passport = require("passport");
const User = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8386/auth/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log(profile);
        // Use async/await for User.findOne
        let user = await User.findOne({ googleId: profile.id });

        // If no user exists, create a new user
        if (!user) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null,
          });

          // Save the new user
          await newUser.save();
          return cb(null, newUser);
        } else {
          // If user exists, return the user
          return cb(null, user);
        }
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
