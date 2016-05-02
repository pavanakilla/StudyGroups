var mongoose = require("mongoose");

var groupSchema = new mongoose.Schema({
    name: String,
    users: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                username: {type: String, default: "Author"}
            }
        ],
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

module.exports = mongoose.model("Group", groupSchema);