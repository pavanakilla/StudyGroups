var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
    text: String,
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
    likes: {type: Number, default: 0},
    teacherPoints: {type: Number, default: 0}
});

module.exports = mongoose.model("Answer", answerSchema);