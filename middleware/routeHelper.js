var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Teacher.findById(req.params.id, function(err, teacher){
      if (teacher.ownerId !== req.session.id) {
        res.redirect('/');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) { //preventing both for users already logged in
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;