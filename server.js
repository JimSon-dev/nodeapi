const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect('mongodb+srv://public:readonly123@testingenvcluster.cjv9i.mongodb.net/customYoutubeDB?retryWrites=true&w=majority'), { useNewUrlParser: true, useUnifiedTopology: true  };
    } catch (error) {
        console.log(error);
    } finally {
        //mongoose.connection.close();
    }
};
connectToDB();

const port = process.env.PORT || 3000;  //port of the node server
const server = http.createServer(app);  //connect app.js to the server

server.listen(port);    //starts listening for connections
