var express = require("express");
var router = express.Router();
var Question = require("../models/question");
var User = require("../models/user");
var Group = require("../models/group");
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
                    res.render("public_questions/publicQuestions",{questions:allQuestions, user:foundUser});
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
                    Group.findById(foundUser.group.id, function(err, foundGroup) {
                        if(err) {
                            res.redirect("back");
                        }
                        else {
                            foundGroup.questions = foundGroup.questions+1; 
                            Group.findByIdAndUpdate(foundUser.group.id, foundGroup, function(err, updatedGroup) {
                                if(err) {
                                    console.log(err);
                                }
                                else {
                                    //redirect back to questions page
                                    res.redirect("/public_questions/publicQuestions");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//NEW ROUTE
router.get("/newQuestion", function(req, res) {
    res.render("public_questions/newQuestion");
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
            User.findById(req.user, function(err, foundUser) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    //render show template with that question
                    res.render("public_questions/showQuestion", {question: foundQuestion, user: foundUser});
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:id/editQuestion", middleware.checkPublicQuestionOwnership, function(req, res) {
    Question.findById(req.params.id, function(err, foundQuestion) {
        if(err) {
            console.log(err);
        }
        else {
            //render edit template with that question
            res.render("public_questions/editQuestion", {question: foundQuestion});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkPublicQuestionOwnership, function(req, res) {
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion) {
       if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            res.redirect("/public_questions/publicQuestions/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkPublicQuestionOwnership, function(req, res) {
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
                    Group.findById(foundQuestion.group.id, function(err, foundGroup) {
                        if(err) {
                            console.log(err);
                            res.redirect("back");
                        }
                        else {
                            foundGroup.questionLikes = foundGroup.questionLikes - foundQuestion.likes;
                            foundGroup.questionTeacherPoints = foundGroup.questionTeacherPoints - foundQuestion.teacherPoints;
                            foundGroup.answerLikes = foundGroup.answerLikes - foundQuestion.authorAnswerLikes;
                            foundGroup.answerTeacherPoints = foundGroup.answerTeacherPoints - foundQuestion.authorAnswerTeacherPoints;
                            foundGroup.answers = foundGroup.answers - foundQuestion.authorAnswers;
                            //destroy question
                            Question.findByIdAndRemove(req.params.id, function(err) {
                                if(err) {
                                    res.redirect("/public_questions/publicQuestions");
                                }
                                else {
                                    foundGroup.questions = foundGroup.questions-1;
                                    Group.findByIdAndUpdate(foundGroup._id, foundGroup, function(err, updatedGroup) {
                                        if(err) {
                                            console.log(err);
                                            res.redirect("back");
                                        }
                                        else {
                                            res.redirect("/public_questions/publicQuestions");
                                        }
                                    });
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
            Group.findById(updatedQuestion.group.id, function(err, foundGroup) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundGroup.questionTeacherPoints = foundGroup.questionTeacherPoints+1;
                    Group.findByIdAndUpdate(foundGroup._id, foundGroup, function(err, updatedGroup) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            console.log(updatedGroup.teacherPoints);
                            res.redirect("/public_questions/publicQuestions/"+req.params.id);
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
            Group.findById(updatedQuestion.group.id, function(err, foundGroup) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundGroup.questionLikes = foundGroup.questionLikes+1;
                    Group.findByIdAndUpdate(foundGroup._id, foundGroup, function(err, updatedGroup) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            console.log(updatedGroup.likes);
                            res.redirect("/public_questions/publicQuestions/"+req.params.id);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;