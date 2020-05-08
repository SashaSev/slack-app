const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    slack_id :{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    // name:{
    //     type: String,
    //     required: true
    // },
})
const User = mongoose.model("User", userSchema);

module.exports = User