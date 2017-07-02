const express = require('express');
const router  = express.Router();

// /* GET home page. */
// router.get('/user-profile', (req, res, next) => {
// //If the user is NOT logged in, "req.user" will be empty.
//
// //Check if the user IS logged in
//     if(req.user) {
//       res.locals.currentUser = req.user;
//     }
//   res.render('user-profile-view');
// });

//We want this page to only be visible to logged in users
router.get('/user-profile', (req, res, next) => {
  if(req.user) {
    res.render('user-profile-view.ejs');
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
