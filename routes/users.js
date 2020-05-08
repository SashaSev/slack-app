const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
    console.log("start create data to database")
    if (Object.keys(req.body).length > 0) {
        res.io.emit("connection", "Connect");
    }
    res.send("Channels save to Database")
});

module.exports = router;
