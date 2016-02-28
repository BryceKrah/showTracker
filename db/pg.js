var pg = require('pg');
var connectionString = "postgres://Bryce:baseball@localhost/showTracker";
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');


function loginUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done()
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query("SELECT * FROM users WHERE email LIKE ($1);", [email], function(err, results) {
        done()
        if (err) {
          return console.error('error running query', err)
        }

        if (results.rows.length === 0) {
          res.status(204).json({success: true, data: 'no content'})
        } else if (bcrypt.compareSync(password, results.rows[0].password_digest)) {
          res.rows = results.rows[0]
          next()
        }
      })
    })
}

function createSecure(email, password, callback) {
  // hashing the password given by the user at signup
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      // this callback saves the user to our databased
      // with the hashed password

      // saveUser(email, hashed)
      callback(email, hash)
    })
  })
}


function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);

  function saveUser(email, hash) {
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done()
        console.log(err)
        return res.status(500).json({success: false, data: err})
      }

      var query = client.query("INSERT INTO users( email, password_digest, name, bio) VALUES ($1, $2, $3, $4);", [email, hash, req.body.name, req.body.bio], function(err, result) {
        done()
        if (err) {
          return console.error('error running query', err)
        }
        next()
      })
    })
  }
}



function showAllUsers(req,res,next){
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }

    var query = client.query('SELECT id,name,bio FROM users ORDER BY id', function(err, results) {
      done();

      if (err) {
        console.error('Error with query', err);
      }

      res.users = results.rows;
      next();
    });
  })
}

function addShowToFavList(req,res,next){
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("INSERT INTO shows (name,genre,seasons) VALUES ($1,$2,$3) RETURNING id;", [req.body.name, req.body.genre, req.body.seasons], function(err, results) {
      done();

      if (err) {
        console.error('Error with query', err);
      }
      var query = client.query("INSERT INTO xref (user_id, show_id) VALUES ($1, (currval('shows_id_seq')));", [req.params.id], function(err, results) {
        done();

        if (err) {
          console.error('Error with query', err);
        }
      next();
    });
  });
  })
}



function getUserList(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }

    client.query('SELECT users.id as id, users.name as name, users.bio as bio, array_agg(shows.name) as shows, array_agg(shows.id) as showID FROM users LEFT JOIN xref on xref.user_id = users.id LEFT JOIN shows on xref.show_id = shows.id WHERE users.id = $1 GROUP BY users.name, users.id;', [req.params.id], function(err, results) {
      done();

      if (err) {
        console.error('Error with query', err);
      }
      res.user = results.rows;
      next();
    });
  });
};

function editShow(req, res, next) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }

    client.query('UPDATE shows SET name = $1, seasons = $3, genre = $4 WHERE id = $2', [req.body.name, req.params.id, req.body.seasons, req.body.genre], (err, results) => {
      done();

      if (err) {
        console.error('Error with query', err);
      }

      next();
    });

  });

};


function getShowDetails(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }

    client.query('SELECT users.id as id, users.name as name, users.bio as bio, array_agg(shows.name) as shows, array_agg(shows.genre) as genre, array_agg(shows.seasons) as seasons, array_agg(shows.id) as showID FROM users LEFT JOIN xref on xref.user_id = users.id LEFT JOIN shows on xref.show_id = shows.id WHERE users.id = $1 GROUP BY users.name, users.id;', [req.params.id], function(err, results) {
      done();
      if (err) {
        console.error('Error with query', err);
      }
      res.user = results.rows;
      next();
    });
  });
};

function deleteShow(req,res,next){
  pg.connect(connectionString, function(err, client, done) {
  if (err) {
    done();
    console.log(err);
    res.status(500).json({success: false, data: err});
  }
  console.log(req.body.sid);
  client.query('DELETE FROM xref WHERE user_id = $1 AND show_id = $2', [req.params.id, req.body.sid], function(err, results) {
    console.log(req.body.sid);
    done();
    if (err) {
      console.error('Error with query', err);
    }
    next();
  });

});
}




module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.showAllUsers = showAllUsers;
module.exports.addShowToFavList = addShowToFavList;
module.exports.getUserList = getUserList;
module.exports.editShow = editShow;
module.exports.getShowDetails = getShowDetails;
module.exports.deleteShow = deleteShow;
