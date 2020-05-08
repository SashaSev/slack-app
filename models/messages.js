const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        maxLength: 100,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
       ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }
})
const Message = mongoose.model("Message", messageSchema);

module.exports = Message