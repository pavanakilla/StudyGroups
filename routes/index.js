var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//======================
// ROUTES - LANDING PAGE
//======================

router.get("/",function(req,res) {
   res.render("landing", {currentUser: req.user});
});

//=====================
//AUTHENTICATION ROUTES
//=====================

//SIGN UP
router.get("/register", function(req, res) {
    res.render("register");
});

//SIGN UP
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success","Welcome to Study Groups "+user.username);
            res.redirect("/questions/questions");
        })
    });
});

//LOGIN
router.get("/login", function(req, res) {
    res.render("login");
});

//LOGIN
router.post("/login", passport.authenticate("local", 
                {
                    successFlash: 'Welcome to Study Groups',
                    successRedirect: "/questions/questions",
                    failureRedirect: "/login",
                    failureFlash: true
                }), 
                function(req, res) {}
);

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/");
});

module.exports = router;