var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');


users.use(function(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    next()
  } else {
    res.status(401);
    res.render('error.html.ejs')
  }
})

users.get('/:id', db.getUserList, function(req,res){
  var id = req.params.id
  res.render('users/profile.html.ejs', {user: res.user[0]});
});

users.get('/:id/favlist', function(req,res){
  var id = req.params.id;
  res.render('./lists/newfavorite.html.ejs', { id : id})
});

users.post('/:id/favlist', db.addShowToFavList,  function(req,res){
  var id = req.params.id;
  res.redirect('/users/' + id);
});

users.delete('/:id/delete', db.deleteAccount, function(req,res){
  var id = req.params.id;
  res.redirect('/')
})


users.get('/:id/editshow', function(req,res){
  var id = req.params.id;
  res.render('./lists/editshow.html.ejs', {id : id})
});
users.delete('/:id/editshow', db.deleteShow, function(req,res){
  var id = req.params.id;
  res.redirect('/users/'+id)
})
users.put('/:id/favlist', db.editShow, function(req,res){
  var id = req.params.id;
  res.redirect('/users/'+id)
});


users.get('/:id/allshows', db.getShowDetails, function(req,res){
  var id = req.params.id;
  res.render('lists/allshows.html.ejs', {user : res.user[0]})
})


module.exports = users;
