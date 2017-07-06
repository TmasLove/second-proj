const express = require('express');

const PostModel = require('../models/post-model.js');

const router  = express.Router();
// var multer  = require('multer');





router.get('/feed', (req, res, next) => {
  PostModel.find((err, postResults) => {
    if(err) {
      next(err);
      return;
    }
    res.render('feed-view.ejs', {
      postsAndStuff: postResults
    });
  });
});



module.exports = router;
