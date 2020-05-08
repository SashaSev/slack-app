const {WebClient} = require("@slack/web-api");
const dotenv = require("dotenv");
dotenv.config();
const Channel = require("./models/channels")
const User = require("./models/users")
const token = process.env.TOKEN;

const web = new WebClient(token);
const conversationId = process.env.CHANNEL_ID;

exports.getChannels = async () => {
    const res = await web.conversations.list({channel: conversationId});

    return res.channels.map(item => {
        return {
            slack_id: item.id,
            name: item.name
        }
    });

}
exports.getUsers = async () => {
    const res = await web.users.list({channel: conversationId});

    return res.members.map(item => {
        return {
            slack_id: item.id,
            username: item.name,
        }
    });
}
exports.getMessages = async () => {
    const channels = await Channel.find({}).select("slack_id");
    const users = await User.find({})

    let res = [];
    for (let i of channels) {
        const message = await web.conversations.history({channel: i.slack_id});
        let promise = await Promise.all(message.messages.map(async item => {
            const author_id = lookup(item.user, users)
            return {
                message: item.text.substring(0, 100),
                author: author_id,
                channel: i._id
            }
        }));
        res.push(promise)
    }
    return res;
}
const lookup = (item, array) => {
    for (let i of array) {
        if (i.slack_id === item) {
            return i._id
        }
    }
    return item
}

