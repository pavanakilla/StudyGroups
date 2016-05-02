var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var User = require("../models/user");
var middleware = require("../middleware");

//==================
//ROUTES - QUESTIONS
//==================

//INDEX ROUTE
router.get("/",function(req,res) {
    //get all questions from db
    Question.find({}, function(err, allQuestions) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            User.findById(req.user, function(err, foundUser) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("questions/questions",{questions:allQuestions, user:foundUser});
                }
            });
        }
    });
});

//CREATE ROUTE
router.post("/",function(req,res) {
    User.findById(req.user, function(err, foundUser) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            //get data from the form and save to db
            Question.create(req.body.question, function(err, newQuestionCreated) {
                if(err) {
                    console.log("SOMETHING WENT WRONG!!!");
                    console.log(err)
                }
                else {
                    //add author to question
                    newQuestionCreated.author.id = req.user._id;
                    newQuestionCreated.author.username = req.user.username;
                    //add group info
                    newQuestionCreated.group.id = foundUser.group.id;
                    newQuestionCreated.group.name = foundUser.group.name;
                    //add date created
                    newQuestionCreated.created = Date.now();
                    newQuestionCreated.save();
                    foundUser.questions = foundUser.questions+1;
                    User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                        if(err) {
                            req.flash("error", "User not updated");
                            res.redirect("back");
                        }
                        else {
                            //redirect back to questions page
                            res.redirect("/questions/questions");
                        }
                    });
                }
            });
        }
    });
});

//NEW ROUTE
router.get("/newQuestion", function(req, res) {
    res.render("questions/newQuestion");
});

//SHOW ROUTE
router.get("/:id",function(req, res) {
    //find the question with provided id
    Question.findById(req.params.id).populate("answers").exec(function(err, foundQuestion) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            //render show template with that question
            res.render("questions/showQuestion", {question: foundQuestion});
        }
    });
});

//EDIT ROUTE
router.get("/:id/editQuestion", middleware.checkQuestionOwnership, function(req, res) {
    Question.findById(req.params.id, function(err, foundQuestion) {
        if(err) {
            console.log(err);
        }
        else {
            //render edit template with that question
            res.render("questions/editQuestion", {question: foundQuestion});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkQuestionOwnership, function(req, res) {
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion) {
       if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            res.redirect("/questions/questions/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkQuestionOwnership, function(req, res) {
    User.findById(req.user._id, function(err, foundUser) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            Question.findById(req.params.id, function(err, foundQuestion) {
                if(err) {
                    console.log(err);
                }
                else {
                    foundUser.questionLikes = foundUser.questionLikes - foundQuestion.likes;
                    foundUser.questionTeacherPoints = foundUser.questionTeacherPoints - foundQuestion.teacherPoints;
                    foundUser.answerLikes = foundUser.answerLikes - foundQuestion.authorAnswerLikes;
                    foundUser.answerTeacherPoints = foundUser.answerTeacherPoints - foundQuestion.authorAnswerTeacherPoints;
                    foundUser.answers = foundUser.answers - foundQuestion.authorAnswers;
                    //destroy question
                    Question.findByIdAndRemove(req.params.id, function(err) {
                        if(err) {
                            res.redirect("/questions/questions");
                        }
                        else {
                            foundUser.questions = foundUser.questions-1;
                            User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                                if(err) {
                                    console.log(err);
                                    res.redirect("back");
                                }
                                else {
                                    res.redirect("/questions/questions");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//UPDATE ROUTE - TEACHER POINTS
router.put("/:id/teacherPoints", function(req, res) {
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion) {
       if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            User.findById(updatedQuestion.author.id, function(err, foundUser) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundUser.questionTeacherPoints = foundUser.questionTeacherPoints+1;
                    User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            console.log(updatedUser.questionTeacherPoints);
                            res.redirect("/questions/questions/"+req.params.id);
                        }
                    });
                }
            });
        }
    });
});

//CREATE ROUTE - LIKES
router.put("/:id/likes", function(req, res) {
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion) {
       if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            User.findById(updatedQuestion.author.id, function(err, foundUser) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundUser.questionLikes = foundUser.questionLikes+1;
                    console.log(foundUser.questionLikes);
                    User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            console.log(updatedUser.questionLikes);
                            res.redirect("/questions/questions/"+req.params.id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;