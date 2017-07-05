const express = require('express');
const router  = express.Router();
const UserModel = require('../models/user-model.js');



// const multer = require('multer');
// const myUploader = multer({
// // "dest" (destination) is a multer setting that specifies WHERE to put the uploaded files
//   dest: __dirname + '../public/uploads'
//   //save uploaded files inside public/uploads/
// });

//
// /* GET home page. */
// router.get('/edit-user', (req, res, next) => {
// //If the user is NOT logged in, "req.user" will be empty.
//
// //Check if the user IS logged in
//     if(req.user) {
//       res.locals.currentUser = req.user;
//     }
//   res.render('edit-user-profile-view');
// });



//We want this page to only be visible to logged in users
router.get('/edit-user/', (req, res, next) => {
  if(req.user) {
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
    req.params.myId, {
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.encryptedPassword

    },
    (err, productFromDb) => {
      if (err) {
        next(err);
        return;
      }
      console.log('starts here ---------------');
      console.log(productFromDb);
      res.redirect('/' + productFromDb._id);
    }
  );
});













module.exports = router;
