const express = require('express');
const router  = express.Router();




router.get('/feed', (req, res, next) => {
  if(req.user) {
    res.render('feed-view.ejs');
  }
  else {
    res.redirect('/login');
  }
});













module.exports = router;
