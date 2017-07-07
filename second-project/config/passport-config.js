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
        console.log('PASS ' + formPassword);
        console.log('USER ' + userFromDb);
        console.log('PW ' + userFromDb.encryptedPassword);
        if(bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false) {
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
