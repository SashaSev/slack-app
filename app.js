const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/users");
const Message = require("./models/messages")
const startRouter = require('./routes/users');
const mongoose = require("mongoose");
const app = express();
const socket = require('socket.io')
const {getChannels, getUsers, getMessages} = require("./slack");
const server = require("http").createServer(app);
const io = socket(server);
const Channel = require("./models/channels")


mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

})
    .then(connect => {
        console.log('database successful connected');
    })
    .catch(err => {
        console.log('mongo db no connected');
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.io = io;
    next();
});

io.on("connection", async function () {
    let channel = await getChannels();
    await Channel.create(channel);

    let users = await getUsers();
    await User.create(users);

    let messages = await getMessages();
    for (let i of messages) {
        await Message.create(i);
    }
})

app.use('/start', startRouter);


server.listen(process.env.PORT, () => console.log(`Server running ${process.env.PORT}`))


