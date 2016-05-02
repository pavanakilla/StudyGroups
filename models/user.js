var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    group: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            },
        name: String
    },
    questions: {type: Number, default: 0},
    answers: {type: Number, default: 0},
    questionLikes: {type: Number, default: 0},
    totalQuestionLikes: {type: Number, default: 0},
    questionTeacherPoints: {type: Number, default: 0},
    totalQuestionTeacherPoints: {type: Number, default: 0},
    answerLikes: {type: Number, default: 0},
    totalAnswerLikes: {type: Number, default: 0},
    answerTeacherPoints: {type: Number, default: 0},
    totalanswerTeacherPoints: {type: Number, default: 0}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);