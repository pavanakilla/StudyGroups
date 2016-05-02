var express = require("express");
var router = express.Router();
var Group = require("../models/group");
var User = require("../models/user");
var middleware = require("../middleware");

//===============
//ROUTES - GROUPS
//===============

//INDEX ROUTE
router.get("/",function(req,res) {
    //get all groups from db
    Group.find({}, function(err, allGroups) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            res.render("groups/groups",{groups:allGroups});
        }
    });
});

//CREATE ROUTE
router.post("/",function(req,res) {
    //get data from the form and save to db
    Group.create(req.body.group, function(err, newGroupCreated) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err)
        }
        else {
            //redirect back to groups page
            res.redirect("/groups/groups");
        }
    });
});

//NEW ROUTE
router.get("/newGroup", function(req, res) {
    res.render("groups/newGroup");
});

//SHOW ROUTE
router.get("/:id",function(req, res) {
    //find the group with provided id
    Group.findById(req.params.id).populate("users").exec(function(err, foundGroup) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            //render show template with that question
            res.render("groups/showGroup", {group: foundGroup});
        }
    });
});

//EDIT ROUTE
router.get("/:id/editGroup",function(req, res) {
    //find the group with provided id
    Group.findById(req.params.id, function(err, foundGroup) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            //render edit template with that group
            res.render("groups/editGroup", {group: foundGroup});
        }
    });
});

//UPDATE ROUTE
router.put("/:id", function(req, res) {
    Group.findByIdAndUpdate(req.params.id, req.body.group, function(err, updatedGroup) {
       if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            res.redirect("/groups/groups/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", function(req, res) {
    //destroy group
    Group.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/groups/groups");
        }
        else {
            res.redirect("/groups/groups");
        }
    })
});

// UPDATE ROUTE - ADD USER
router.put("/:id/:user_id", function(req, res) {
    User.findById(req.params.user_id, function(err, foundUser) {
        if(err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            foundUser.group.id = req.body.group_id;
            foundUser.group.name = req.body.group_name;
            User.findByIdAndUpdate(req.params.user_id, foundUser, function(err, updatedUser) {
               if(err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    Group.findById(req.params.id, function(err, foundGroup) {
                        if(err) {
                            console.log(err);
                            res.redirect("back");
                        }
                        else {
                            foundGroup.users.push(updatedUser);
                            Group.findByIdAndUpdate(req.params.id, foundGroup, function(err, updatedGroup) {
                                if(err) {
                                    console.log(err);
                                    res.redirect("back");
                                }
                                else {
                                    res.redirect("/groups/groups/"+req.params.id);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//SHOW ROUTE - USER
router.get("/:id/:user_id",function(req, res) {
    //find the user with provided id
    User.findById(req.params.user_id, function(err, foundUser) {
        if(err) {
            console.log("SOMETHING WENT WRONG!!!");
            console.log(err);
        }
        else {
            //render show template with that question
            res.render("users/showUser", {user: foundUser});
        }
    });
});

module.exports = router;