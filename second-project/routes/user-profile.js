const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/edit-user', (req, res, next) => {
//If the user is NOT logged in, "req.user" will be empty.

//Check if the user IS logged in
    if(req.user) {
      res.locals.currentUser = req.user;
    }
  res.render('edit-user-profile-view');
});

//We want this page to only be visible to logged in users
router.get('/edit-user', (req, res, next) => {
  if(req.user) {
    res.render('edit-user-profile-view.ejs');
  }
  else {
    res.redirect('/login');
  }
});



//saving the changes

// router.get('/edit-user', (req, res, next) => {

//update
//firstname
//lastname
//time-zone
//email
//username
//password




// }







module.exports = router;
