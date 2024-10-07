const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models");
const User = db.users;
// console.log("User: ",User);

// Cấu hình Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "987834807877-sjl3onl2tbmhniu1g8c2dkqqb8m6u045.apps.googleusercontent.com",
      clientSecret: process.env.SECRET_GOOGLE,
      callbackURL: "https://dm-api.adful.io/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // console.log("Profile: ", profile);
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (user) {
          //   console.log("User found: ", user);
          return done(null, user);
        } else {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          //   console.log("User created: ", user);
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
