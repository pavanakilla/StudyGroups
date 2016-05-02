var mongoose = require("mongoose");

var rankingSchema = new mongoose.Schema({
    type: String,
    totalQuestions: {type: Number, default: 0},
    totalQuestionTeacherPoints: {type: Number, default: 0},
    totalQuestionLikes: {type: Number, default: 0},
    totalAnswers: {type: Number, default: 0},
    totalAnswerTeacherPoints: {type: Number, default: 0},
    totalAnswerTeacherpoints: {type: Number, default: 0}
});


module.exports = mongoose.model("Ranking", rankingSchema);