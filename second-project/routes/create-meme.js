const express = require('express');
const router  = express.Router();



//generate memes route
router.get('/generate-memes', (req, res, next) => {
  if(req.user) {
    res.render('generate-meme-view.ejs');
  }
  else {
    res.redirect('/login');
  }
});






module.exports = router;
