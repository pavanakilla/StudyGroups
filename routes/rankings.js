var express = require("express");
var router = express.Router();
var Group = require("../models/group");
var User = require("../models/user");
var middleware = require("../middleware");

//==================
//ROUTES - RANKINGS
//==================

//INDEX ROUTE
router.get("/",function(req,res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'questions': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'questions': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "questions"});
                }
            });
        }
    });
});


//SHOW ROUTE - questions
router.get("/questions",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'questions': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'questions': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "questions"});
                }
            });
        }
    });
});

//SHOW ROUTE - questionLikes
router.get("/questionLikes",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'questionLikes': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'questionLikes': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "questionLikes"});
                }
            });
        }
    });
});

//SHOW ROUTE - questionTeacherPoints
router.get("/questionTeacherPoints",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'questionTeacherPoints': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'questionTeacherPoints': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "questionTeacherPoints"});
                }
            });
        }
    });
});

//SHOW ROUTE - answers
router.get("/answers",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'answers': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'answers': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "answers"});
                }
            });
        }
    });
});

//SHOW ROUTE - answerlikes
router.get("/answerLikes",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'answerLikes': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'answerLikes': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "answerLikes"});
                }
            });
        }
    });
});

//SHOW ROUTE - answerTeacherPoints
router.get("/answerTeacherPoints",function(req, res) {
    //get all top 5 users from db with given sorting
    User.find({username: {$ne: "Teacher"}}).sort({'answerTeacherPoints': -1}).limit(5).exec(function(err, allUsers) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            Group.find({}).sort({'answerTeacherPoints': -1}).limit(5).exec(function(err, allGroups) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("rankings/rankings",{users:allUsers, groups:allGroups, ranking: "answerTeacherPoints"});
                }
            });
        }
    });
});

module.exports = router;