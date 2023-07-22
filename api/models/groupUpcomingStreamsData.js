const mongoose = require('mongoose');

const groupUpcomingStreamsDataSchema = mongoose.Schema({   //schema for groupUpcomingStreamsInfo
    _id: String,
    group: String, //or use mongoos unique object id
    members: [
        {
            id: String,
            channelId: String, 
            channelName: String,
            hasUpcomingStream: Boolean,
            stream: [{
                title: String,
                thumbnail: String,
                videoId: String,
                date: String,
                dateMS: Number
            }]
        }
    ]
});

module.exports = mongoose.model('GroupUpcomingStreamsData', groupUpcomingStreamsDataSchema, 'groupUpcomingStreamsInfo');