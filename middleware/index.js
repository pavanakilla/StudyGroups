//middleware logic
var Question = require("../models/question");
var Answer = require("../models/answer");
var User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkQuestionOwnership = function (req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {
        //find the question with provided id
        Question.findById(req.params.id, function(err, foundQuestion) {
            if(err) {
                req.flash("error", "Question not found");
                res.redirect("back");
            }
            else {
                //does the user own the question
                if(foundQuestion.author.id.equals(req.user._id)) {
                    //go to next step
                    next();
                }
                else {
                    req.flash("error", "You do not have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.checkAnswerOwnership = function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {
        //find the answer with provided id
        Answer.findById(req.params.answer_id, function(err, foundAnswer) {
            if(err) {
                req.flash("error", "Answer not found");
                res.redirect("back");
            }
            else {
                //does the user own the answer
                if(foundAnswer.author.id.equals(req.user._id)) {
                    //go to next step
                    next();
                }
                else {
                    req.flash("error", "You do not have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.checkPublicQuestionOwnership = function (req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {
        //find the question with provided id
        Question.findById(req.params.id, function(err, foundQuestion) {
            if(err) {
                req.flash("error", "Question not found");
                res.redirect("back");
            }
            else {
                //does the user own the question
                User.findById(req.user._id, function(err, foundUser) {
                    if(err) {
                        req.flash("error", "User not found");
                    }
                    else {
                        if(foundQuestion.group.id.equals(foundUser.group.id)) {
                            //go to next step
                            next();
                        }
                        else {
                            req.flash("error", "You do not have the permission to do that!");
                            res.redirect("back");
                        }
                    }
                });
            }
        });
    }
    else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.checkPublicAnswerOwnership = function(req, res, next) {
    //check if user is logged in
    if(req.isAuthenticated()) {
        //find the answer with provided id
        Answer.findById(req.params.answer_id, function(err, foundAnswer) {
            if(err) {
                req.flash("error", "Answer not found");
                res.redirect("back");
            }
            else {
                //does the user own the answer
                User.findById(req.user._id, function(err, foundUser) {
                    if(err) {
                        req.flash("error", "User not found");
                    } else {
                        if(foundAnswer.group.id.equals(foundUser.group.id)) {
                            //go to next step
                            next();
                        }
                        else {
                            req.flash("error", "You do not have the permission to do that!");
                            res.redirect("back");
                        }
                    }
                });
            }
        });
    }
    else {
        req.flash("error", "Please Login First!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  req.flash("error","Please Login First!");
  res.redirect("/login");
};

module.exports = middlewareObj;