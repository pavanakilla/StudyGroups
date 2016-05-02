var express = require("express");
var router = express.Router({mergeParams: true});
var Question = require("../models/question");
var Answer = require("../models/answer");
var User = require("../models/user");
var middleware = require("../middleware");

//================
//ROUTES - ANSWERS
//================

//CREATE ROUTE
router.post("/", function(req, res) {
    //lookup question using ID
    Question.findById(req.params.id, function(err, question) {
        if(err) {
            console.log(err);
            res.redirect("/questions/questions");
        }
        else {
            //create new answer
            Answer.create(req.body.answer, function(err, answer) {
                if(err) {
                    console.log(err);
                }
                else {
                    //add author to answer
                    User.findById(req.user._id, function(err, foundUser) {
                        if(err) {
                            res.redirect("back");
                        }
                        else {
                            answer.author.id = foundUser._id;
                            answer.author.username = foundUser.username;
                            answer.created = Date.now();
                            answer.group.id = foundUser.group.id;
                            answer.group.name = foundUser.group.name;
                            answer.save();
                            //connect new answer to question
                            question.answers.push(answer);
                            if(foundUser._id.equals(question.author.id)) {
                                question.authorAnswers = question.authorAnswers+1;
                            }
                            question.save();
                            foundUser.answers = foundUser.answers+1;
                            User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                                if(err) {
                                    req.flash("error", "User not updated");
                                    res.redirect("back");
                                }
                                else {
                                    //redirect question show page
                                    res.redirect("/questions/questions/"+question._id);
                                }
                            });
                        }
                    })
                }
            });
        }
    })
});

//EDIT ROUTE
router.get("/:answer_id/editAnswer", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findById(req.params.answer_id, function(err, foundAnswer) {
        if(err) {
            res.redirect("back");
        }
        else {
            res.render("answers/editAnswer", {question_id: req.params.id, answer: foundAnswer});
        }
    });
});

//UPDATE ROUTE
router.put("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
       if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/questions/questions/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    User.findById(req.user._id, function(err, foundUser) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            Answer.findById(req.params.answer_id, function(err, foundAnswer) {
                if(err) {
                    console.log(err);
                }
                else {
                    foundUser.answerLikes = foundUser.answerLikes - foundAnswer.likes;
                    foundUser.answerTeacherPoints = foundUser.answerTeacherPoints - foundAnswer.teacherPoints;
                    //destroy answer
                    Answer.findByIdAndRemove(req.params.answer_id, function(err) {
                        if(err) {
                            res.redirect("/questions/questions/"+req.params.id);
                        }
                        else {
                            foundUser.answers = foundUser.answers-1;
                            User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
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
                                            if(foundQuestion.author.id.equals(foundUser._id)){
                                                foundQuestion.authorAnswers = foundQuestion.authorAnswers - 1;
                                                foundQuestion.authorAnswerLikes = foundQuestion.authorAnswerLikes - foundAnswer.likes;
                                                foundQuestion.authorAnswerTeacherPoints = foundQuestion.authorAnswerTeacherPoints - foundAnswer.teacherPoints;
                                                Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                                    if(err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        res.redirect("/questions/questions/"+req.params.id);
                                                    }
                                                });
                                            }
                                            else {
                                                res.redirect("/questions/questions/"+req.params.id);
                                            }
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
router.put("/:answer_id/teacherPoints", function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
       if(err) {
            res.redirect("back");
        }
        else {
            User.findById(updatedAnswer.author.id, function(err, foundUser) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundUser.answerTeacherPoints = foundUser.answerTeacherPoints+1;
                    User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            Question.findById(req.params.id, function(err, foundQuestion) {
                                if(err) {
                                    res.redirect("back");
                                    console.log(err);
                                }
                                else {
                                    if(updatedUser._id.equals(foundQuestion.author.id)) { 
                                        foundQuestion.answerTeacherPoints = foundQuestion.answerTeacherPoints+1;
                                        foundQuestion.authorAnswerTeacherPoints = foundQuestion.authorAnswerTeacherPoints+1;
                                        Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                            if(err) {
                                                res.redirect("back");
                                                console.log(err);
                                            }
                                            else {
                                                console.log(updatedUser.answerTeacherPoints);
                                                console.log(updatedQuestion.answerTeacherPoints);
                                                res.redirect("/questions/questions/"+req.params.id);
                                            }
                                        });
                                    }
                                    else {
                                        res.redirect("/questions/questions/"+req.params.id);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//UPDATE ROUTE - LIKES
router.put("/:answer_id/likes", function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
       if(err) {
            res.redirect("back");
        }
        else {
            User.findById(updatedAnswer.author.id, function(err, foundUser) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundUser.answerLikes = foundUser.answerLikes+1;
                    User.findByIdAndUpdate(foundUser._id, foundUser, function(err, updatedUser) {
                        if(err) {
                            res.redirect("back");
                            console.log(err);
                        }
                        else {
                            Question.findById(req.params.id, function(err, foundQuestion) {
                                if(err) {
                                    res.redirect("back");
                                    console.log(err);
                                }
                                else {
                                    if(updatedUser._id.equals(foundQuestion.author.id)) { 
                                        foundQuestion.answerLikes = foundQuestion.answerLikes+1;
                                        foundQuestion.authorAnswerLikes = foundQuestion.authorAnswerLikes+1;
                                        Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                            if(err) {
                                                res.redirect("back");
                                                console.log(err);
                                            }
                                            else {
                                                console.log(updatedUser.answerLikes);
                                                console.log(updatedQuestion.answerLikes);
                                                res.redirect("/questions/questions/"+req.params.id);
                                            }
                                        });
                                    }
                                    else {
                                        res.redirect("/questions/questions/"+req.params.id);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;