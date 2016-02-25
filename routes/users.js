var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');

// test function for route hit
function testFunction(req,res){
  res.send(req.method + ' users not implemented');
};


// create new user
users.post('/', testFunction);

// show new user signup page
users.get('/new', testFunction);

// show user login page
users.get('/login', testFunction);

// log user in
users.post('/login', testFunction);


// log user out
users.delete('/logout', testFunction);


module.exports = users;
