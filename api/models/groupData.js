const mongoose = require('mongoose');

const groupDataSchema = mongoose.Schema({   //schema for groupInfo
    _id: String,
    group: String, //or use mongoos unique object id
    members: [
        {
            id: String, 
            channelId: String, 
            channelName: String, 
            thumbnail: String, 
            playlistId: String
        }
    ]
});

module.exports = mongoose.model('GroupData', groupDataSchema, 'groupInfo');