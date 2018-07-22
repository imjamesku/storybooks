const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (err, req, res, next) => {
    if (err) {
      if (err.name === 'TokenError') {
        res.redirect('/auth/google');
      }
      else {
        throw err;
      }
    }
    else {
      res.redirect('/dashboard');
    }
  });

module.exports = router;