"use strict"
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const veloCalc = require('./utils/velocityCalc');
const starLinkData = require('./rawPV.json');
const fs = require('fs');
const PORT = process.env.PORT || 80;
app.use(express.static(path.join(__dirname, "../client")));
app.get("/", (req, res) => {
    res.sendFile("/index.html");
});
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});
const io = require("socket.io")(httpServer);
io.on("connection", socket => {
    socket.emit('init', starLinkData);
    setInterval(async () => {
        veloCalc();
        let updatedData = await fs.readFileSync('./rawPV.json', 'utf-8', (err)=>{
            if(err) console.log(err);
        });
        socket.emit('updateData', updatedData);
    }, 5000);
});
