const mongoose = require('mongoose');

const groupLiveDataSchema = mongoose.Schema({   //schema for groupLiveInfo
    _id: String,
    group: String, //or use mongoos unique object id
    members: [
        {
            id: String,
            channelId: String, 
            channelName: String,
            isLive: Boolean, 
            title: String,
            thumbnail: String,
            videoId: String
        }
    ]
});

module.exports = mongoose.model('GroupLiveData', groupLiveDataSchema, 'groupLiveInfo');