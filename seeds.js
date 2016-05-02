var mongoose = require("mongoose");
var Question = require("./models/question");
var Group = require("./models/group");
var Answer = require("./models/answer");
var User = require("./models/user");
var Ranking = require("./models/ranking");

// var data = [
//     {
//         title: "Question 1"
//     },
//     {
//         title: "Question 2"
//     },
//     {
//         title: "Question 3"
//     }
// ];

// var groupdata = [
//     {
//         name: "Group 1"
//     },
//     {
//         name: "Group 2"
//     },
//     {
//         name: "Group 3"
//     },
//     {
//         name: "Group 4"
//     },
//     {
//         name: "Group 5"
//     }
// ];

// function seedDB() {
//     //Remove All Questions
//     Question.remove({}, function(err) {
//       if(err) {
//           console.log(err);
//         }
//         console.log("REMOVED ALL QUESTIONS!!!");
//         //Add few Questions
//         data.forEach(function(seed) {
//             Question.create(seed, function(err, question) {
//                 if(err) {
//                     console.log("SOMETHING WENT WRONG!!!");
//                     console.log(err);
//                 }
//                 else {
//                     console.log("Added a Question");
//                     //Add Answers
//                     Answer.create(
//                         {
//                             text: "Answer 1"
//                         }, function(err, answer) {
//                             if(err) {
//                                 console.log(err);
//                             }
//                             else {
//                                 question.answers.push(answer);
//                                 question.save();
//                                 console.log("Added an Answer!!");
//                             }
//                         });
//                 }
//             })
//         });
//     }); 
//     //Remove All Groups
//     Group.remove({}, function(err) {
//       if(err) {
//           console.log(err);
//         }
//         console.log("REMOVED ALL GROUPS!!!");
//         //Add 5 Groups
//         groupdata.forEach(function(seed) {
//             Group.create(seed, function(err, group) {
//                 if(err) {
//                     console.log("SOMETHING WENT WRONG!!!");
//                     console.log(err);
//                 }
//                 else {
//                     console.log("Added a Group");
//                     //Add Users
//                     User.create(
//                         {
//                             username: "User 1",
//                             password: "password"
//                         }, function(err, user) {
//                             if(err) {
//                                 console.log(err);
//                             }
//                             else {
//                                 group.users.push(user);
//                                 group.save();
//                                 console.log("Added a User!!");
//                             }
//                         });
//                 }
//             })
//         });
//     });
// }

function seedDB() {
    // //Remove All Questions
    // Question.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //     }
    //     console.log("REMOVED ALL QUESTIONS!!!");
    // }); 
    // //Remove All Groups
    // Group.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //     }
    //     console.log("REMOVED ALL GROUPS!!!");
    // });
    // //Remove All Users
    // User.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //     }
    //     console.log("REMOVED ALL USERS!!!");
    // });
    // //Remove All Answers
    // Answer.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //     }
    //     console.log("REMOVED ALL ANSWERS!!!");
    // });
    // //Remove All Rankings
    // Ranking.remove({}, function(err) {
    //   if(err) {
    //       console.log(err);
    //     }
    //     console.log("REMOVED ALL RANKINGS!!!");
    // });
}

module.exports = seedDB;