const mongoose = require('mongoose');
const superagent = require('superagent');
const { isNull } = require('util');

async function connectToDB() {
    try {
        await mongoose.connect('mongodb+srv://temp:customyoutubeadmin1029@cluster0.cjv9i.mongodb.net/customYoutubeDB?retryWrites=true&w=majority'), { useNewUrlParser: true, useUnifiedTopology: true  };
    } catch (error) {
        console.log(error);
    } finally {
        //mongoose.connection.close();
    }
};
connectToDB();

//items(snippet(title,description,thumbnails),contentDetails(videoId,videoPublishedAt))
console.log("version 0.12");
console.log("used cluster0.cjv9i.mongodb.net/customYoutubeDB ");
