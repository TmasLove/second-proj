const express = require('express');
const router  = express.Router();
const UserModel = require('../models/user-model.js');



//We want this page to only be visible to logged in users
router.get('/edit-user/', (req, res, next) => {
  if(req.user) {
    res.locals.user = req.user;
    console.log(req.user);
    res.render('edit-user-profile-view.ejs');
  }
  else {
    res.redirect('/login');
  }

    UserModel.find((err,userResults) => {
      if (err) {
        next(err);
        return;
      }
    });
});



//saving the changes

router.post('/edit-user/:Id/update', (req, res, next) => {

  UserModel.findByIdAndUpdate(
    req.user._id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        // encryptedPassword: req.body.encryptedPassword
      }

    },
    (err, productFromDb) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/' + productFromDb._id);
    }
  );
});



router.post('/saveuser', (req, res, next) => {

  UserModel.findByIdAndUpdate(
    req.user._id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        // encryptedPassword: req.body.encryptedPassword
      }
}, (err, result) => {

  res.redirect('/edit-user/');
});
});


module.exports = router;
