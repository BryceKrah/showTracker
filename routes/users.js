var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');


// user login,logout,sign up routes
users.get('/', function(req,res){
  res.render('./users/profile.html.ejs', { user : req.session.user})
})

users.post('/', db.createUser, function(req, res){
  res.redirect('/users');
})

// users.route('/')
users.get('/new', function(req, res) {
  res.render('./users/new.html.ejs')
})

users.get('/login', function(req, res) {
  res.render('./users/login.html.ejs');
})

users.post('/login', db.loginUser, function(req, res) {
  req.session.user = res.rows

  // when you redirect you must force a save due to asynchronisity
  // https://github.com/expressjs/session/issues/167 **
  // "modern web browsers ignore the body of the response and so start loading
  // the destination page well before we finished sending the response to the client."

  req.session.save(function() {
    res.redirect('/users')
  });
})

users.delete('/logout', function(req, res) {
  req.session.destroy(function(err){
    res.redirect('/');
  })
})

users.get('/:id', db.getUser, function(req,res){
  var id = req.params.id
  res.render('users/profile.html.ejs', {user: res.user[0]});
})

users.get('/:id/favlist', function(req,res){
  var id = req.params.id;
  res.render('./lists/newfavorite.html.ejs', { id : id})
})

users.post('/:id/favlist', db.addShowToFavList,  function(req,res){
  var id = req.params.id;
  res.redirect('/users/' + id);
})



module.exports = users;
