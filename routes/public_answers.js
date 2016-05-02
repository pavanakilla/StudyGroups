var express = require("express");
var router = express.Router({mergeParams: true});
var Question = require("../models/question");
var Answer = require("../models/answer");
var User = require("../models/user");
var Group = require("../models/group");
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
            res.redirect("/public_questions/publicQuestions");
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
                            if(foundUser.group.id.equals(question.group.id)) {
                                question.authorAnswers = question.authorAnswers+1;
                            }
                            question.save();
                            Group.findById(foundUser.group.id, function(err, foundGroup) {
                                if(err) {
                                    res.redirect("back");
                                }
                                else {
                                    foundGroup.answers = foundGroup.answers+1; 
                                    Group.findByIdAndUpdate(foundUser.group.id, foundGroup, function(err, updatedGroup) {
                                        if(err) {
                                            console.log(err);
                                        }
                                        else {
                                            //redirect question show page
                                            res.redirect("/public_questions/publicQuestions/"+question._id);
                                        }
                                    });
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
router.get("/:answer_id/editAnswer", middleware.checkPublicAnswerOwnership, function(req, res) {
    Answer.findById(req.params.answer_id, function(err, foundAnswer) {
        if(err) {
            res.redirect("back");
        }
        else {
            res.render("public_answers/editAnswer", {question_id: req.params.id, answer: foundAnswer});
        }
    });
});

//UPDATE ROUTE
router.put("/:answer_id", middleware.checkPublicAnswerOwnership, function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
       if(err) {
            res.redirect("back");
        }
        else {
            res.redirect("/public_questions/publicQuestions/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:answer_id", middleware.checkPublicAnswerOwnership, function(req, res) {
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
                    Group.findById(foundUser.group.id, function(err, foundGroup) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            foundGroup.answerLikes = foundGroup.answerLikes - foundAnswer.likes;
                            foundGroup.answerTeacherPoints = foundGroup.answerTeacherPoints - foundAnswer.teacherPoints;
                            //destroy answer
                            Answer.findByIdAndRemove(req.params.answer_id, function(err) {
                                if(err) {
                                    res.redirect("/questions/questions/"+req.params.id);
                                }
                                else {
                                    foundGroup.answers = foundGroup.answers-1;
                                    Group.findByIdAndUpdate(foundUser.group.id, foundGroup, function(err, updatedGroup) {
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
                                                    if(foundQuestion.group.id.equals(foundUser.group.id)){
                                                        foundQuestion.authorAnswers = foundQuestion.authorAnswers - 1;
                                                        foundQuestion.authorAnswerLikes = foundQuestion.authorAnswerLikes - foundAnswer.likes;
                                                        foundQuestion.authorAnswerTeacherPoints = foundQuestion.authorAnswerTeacherPoints - foundAnswer.teacherPoints;
                                                        Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                                            if(err) {
                                                                console.log(err);
                                                            }
                                                            else {
                                                                res.redirect("/public_questions/publicQuestions/"+req.params.id);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        res.redirect("/public_questions/publicQuestions/"+req.params.id);
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
            Group.findById(updatedAnswer.group.id, function(err, foundGroup) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundGroup.answerTeacherPoints = foundGroup.answerTeacherPoints+1;
                    Group.findByIdAndUpdate(updatedAnswer.group.id, foundGroup, function(err, updatedGroup) {
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
                                    if(updatedGroup._id.equals(foundQuestion.group.id)) { 
                                        foundQuestion.answerTeacherPoints = foundQuestion.answerTeacherPoints+1;
                                        foundQuestion.authorAnswerTeacherPoints = foundQuestion.authorAnswerTeacherPoints+1;
                                        Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                            if(err) {
                                                res.redirect("back");
                                                console.log(err);
                                            }
                                            else {
                                                console.log(updatedGroup.answerTeacherPoints);
                                                console.log(updatedQuestion.answerTeacherPoints);
                                                res.redirect("/public_questions/publicQuestions/"+req.params.id);
                                            }
                                        });
                                    }
                                    else {
                                        res.redirect("/public_questions/publicQuestions/"+req.params.id);
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
            Group.findById(updatedAnswer.group.id, function(err, foundGroup) {
                if(err) {
                    res.redirect("back");
                    console.log(err);
                }
                else {
                    foundGroup.answerLikes = foundGroup.answerLikes+1;
                    Group.findByIdAndUpdate(updatedAnswer.group.id, foundGroup, function(err, updatedGroup) {
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
                                    if(updatedGroup._id.equals(foundQuestion.group.id)) { 
                                        foundQuestion.answerLikes = foundQuestion.answerLikes+1;
                                        foundQuestion.authorAnswerLikes = foundQuestion.authorAnswerLikes+1;
                                        Question.findByIdAndUpdate(foundQuestion._id, foundQuestion, function(err, updatedQuestion) {
                                            if(err) {
                                                res.redirect("back");
                                                console.log(err);
                                            }
                                            else {
                                                console.log(updatedGroup.answerLikes);
                                                console.log(updatedQuestion.answerLikes);
                                                res.redirect("/public_questions/publicQuestions/"+req.params.id);
                                            }
                                        });
                                    }
                                    else {
                                        res.redirect("/public_questions/publicQuestions/"+req.params.id);
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