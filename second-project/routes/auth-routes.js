const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const UserModel = require('../models/user-model.js');



//signup
router.get('/signup', (req, res, next) => {
  res.render('auth-views/signup-view.ejs');
});



router.post('/signup', (req, res, next) => {
  if (req.body.signupUserName === '' || req.body.signupPassword === '') {
    res.locals.messageForDumbUsers = 'Please provide both username and password';
    res.render('auth-views/signup-view');
    return;
  }
  UserModel.findOne({
      username: req.body.signupUserName
    },
    (err, userFromDb) => {
      if (userFromDb) {
        res.locals.messageForDumbUsers = "Sorry but that username is taken.";
      }
    }
  );

  const salt = bcrypt.genSaltSync(10);
  const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);


  const theUser = new UserModel({
    fullName: req.body.signupFullName,
    username: req.body.signupUserName,
    encryptedPassword: scrambledPassword
  });

  console.log(theUser);
  console.log('fails after the user');

  theUser.save((err) => {
console.log('fails before if  in the save');
    if (err) {
      console.log('5');
      next(err);
      return;
    }
    res.redirect('/login');
  });

});

//END REGISTRATION--------------------------------------------------------------
const passport = require('passport');
//
//LOG IN------------------------------------------------------------------------
router.get('/login', (req, res, next) => {
  res.render('auth-views/login-view.ejs');
});

router.post('/login', passport.authenticate(
  'local', //1st argument -> name of the strategy
  //                            (determined by the strategy's npm package)
  { //2nd argument -> settings object
    successRedirect: '/generate-memes', //"successRedirect" (where to go if login worked)
    failureRedirect: '/login' //"failureRedirect" (where to go if login failed)
  }
));

//END LOGIN --------------------------------------------------------------------
router.get('/logout', (req, res, next) => {
  //the req.logout() function is definded by the passport middleware (app.js)
  req.logout();
  res.redirect('/');
});

// SOCIAL LOGINS ------------------------------------
// determines by the strategy's npm package
//                       |
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook', {
      successRedirect: '/edit-user',
      failureRedirect: '/login'

    }
  )
);

// END SOCIAL LOGGINS ---------------------------------------







module.exports = router;
