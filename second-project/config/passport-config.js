//We are configuring passport in a seperate file
// To avoid making a mess in "app.js"

const passport = require('passport');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model.js');

// serializeUser  (controls what goes inside the bowl
//                - saves only the users database ID in the bowl
//                - happens ONLY when you log in
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
}); //   |
      //null in first argument means NO ERROR 👍

// deserializeUser (controls what you get when you check the bowl)
//                - uses the ID in the bowl to retrieve the users information
//                - happens everytime you visit the site after logging in
passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById(
    idFromBowl,
    (err, userFromDb) => {
      if (err) {
        return;
      }
      next(null, userFromDb);
      //    |
         //null in first argument means NO ERROR 👍
    }
  );
});


// STRATEGIES -----------------------
//        the different ways we can log into our app
// passport-local (log in with username and password from a form)

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {                                           // 1st argument -> settings object
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },
  (formUsername, formPassword, next) => {       //2nd argument -> callback
                                            // will be called when user tried to login

    // #1 Is there an account with the provided username?
    // (is there a user with that username in the database?)

    UserModel.findOne(
      {username: formUsername},
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        // Check if "userFromDb" is empty
        if(userFromDb === null) {
          // In passport, if you call next() with "false" in the 2nd position,
          // that means LOGIN FAILED.
          next(null, false);
          return;
        }
        // #2 If there is a user with that username, is the PASSWORD correct?
        if(bcrypt.compareSync(formPassword, userFromDb.encryptedPassword)=== false) {
          //in passport, if you call next() with "false" in 2nd position,
          // that means LOGIN FAILED

          next(null, false);
          return;
        }

        next(null, userFromDb);
      }
    );
  })

);

// passport-facebook (log in with facebook account)
const FbStrategy = require('passport-facebook').Strategy;

passport.use(new FbStrategy(
  {  //1st argument -> settings object
    clientID: '454222498273049',
    clientSecret: '9af9e00ce9be31544e655ff22a35e5b1',
    callbackURL: '/auth/facebook/callback'
  },          // OUR route (name this whatever you want)

  (accessToken, refreshToken, profile, next) => {  //2nd argument -> callback
            // (will be called when a user allows us to log them in with facebook)
        console.log('');
        console.log('-----------🌎 FACEBOOK PROFILE INFO 🌎 ------------');
        console.log(profile);
        console.log('');

        UserModel.findOne(
          {facebookId: profile.id},
          (err, userFromDb) => {
              //"userFromDb" will be empty if this is first time the user logs in with facebook
              // check if they have logged in before
              if(userFromDb) {
                next(null, userFromDb);
                return;
              }

              // If it's the first time they log in, SAVE THEM IN THE DB!
              const theUser = new UserModel({
                fullName: profile.displayName,
                facebookId: profile.id
              });
              theUser.save((err) => {
                if (err) {
                  next(err);
                  return;
                }
                next(null, theUser);
              });
          }
        );
            // Receiving the facebook user info and SAVING IT!
            // UNLESS we have already saved their info, in which case we log them in.
  }

));
// passport-google-oauth (log in with with your Google account)
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy(
  {   // 1st argument -> settings object
    clientID: 'blah blah blah',
    clientSecret: 'blah blah blah',
    callbackURL: '/auth/google/callback'
  },              // out route (name this whatever you want)

  (accessToken, refreshToken, profile, next) => {  // 2nd argument -> callback
          // (will be called when a user allows us to log them in with Google)
      console.log('');
      console.log('---------🏏 GOOGLE PROFILE INFO 🏏---------');
      console.log(profile);
      console.log('');

      UserModel.findOne(
        { googleId: profile.id },

        (err, userFromDb) => {
            if (err) {
              next(err);
                //  |
                // error in 1st argument means something unforeseen happened 😫
              return;
            }

            // "userFromDb" will be empty if
            // this is first time the user logs in with Facebook

            // Check if they have logged in before
            if (userFromDb) {
              // If they have, just log them in.
              next(null, userFromDb);
              return;
            }

            // If it's the first time they log in, SAVE THEM IN THE DB!
            const theUser = new UserModel({
              fullName: profile.displayName,
              googleId: profile.id
            });

            // If displayName is empty, use email instead.
            if (theUser.fullName === undefined) {
              theUser.fullName = profile.emails[0].value;
            }

            theUser.save((err) => {
                if (err) {
                  next(err);
                  return;
                }

                // Now that they are saved, log them in.
                next(null, theUser);
            });
        }
      );
  }
));
