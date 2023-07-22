const mongoose = require('mongoose');

//schema for channelData, exported the schema to be able to dynamically choose which collection to save the data to
const channelDataSchema = mongoose.Schema({ 
    _id: String,
    id: Number,
    channelId: String, //or use mongoos unique object id
    channelName: String, 
    numberOfVideos: String,
    numberOfPages: String, 
    group: String, 
    playlistId: String, 
    pages: [
        {
            _id: 0, //stops _id from being made
            videos: [
                {
                    _id: 0,
                    title: String,  
                    videoID: String, 
                    datePublished: String,
                    datePublishedUnformatted: String,
                    thumbnails: 
                    {
                        mediumURL: String 
                    } 
                }
            ],
            currentPage: String,
            nextPage: String
        }
    ]
});

module.exports = channelDataSchema;