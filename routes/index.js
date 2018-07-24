const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  //res.send('It works!');
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Story.find({user: req.user.id})
    .then(stories => {
      res.render('index/dashboard', {stories: stories});
    });
 // res.render('index/dashboard');
});

router.get('/about', (req, res) => {
  //console.log(req.user);
  //console.log(req.user.firstName);
  res.render('index/about');
});

module.exports = router;