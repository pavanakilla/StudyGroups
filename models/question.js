var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    title: String,
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: {type: String, default: "Author"}
        },
    created: {type: Date, default: Date.now()},
    group: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            },
        name: String
    },
    publicQuestion: String,
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ],
    authorAnswers: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    teacherPoints: {type: Number, default: 0},
    answerLikes: {type: Number, default: 0},
    authorAnswerLikes: {type: Number, default: 0},
    answerTeacherPoints: {type: Number, default: 0},
    authorAnswerTeacherPoints: {type: Number, default: 0},
});

module.exports = mongoose.model("Question", questionSchema);