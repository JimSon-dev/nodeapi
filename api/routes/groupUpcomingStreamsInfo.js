const express = require('express');
const router = express.Router();
const Group = require('../models/groupUpcomingStreamsData');
//handles requests to /liveInfo, /liveInfo/774inc, /liveInfo/voms, /liveInfo/hololive
//{_id:String, group:String, members:[{id:String, channelId:String, isLive:Boolean, title:String, thumbnail:String, videoId:String}]}
router.get('/', (req, res, next) => {   //return data of all channels' live status
    Group.find()
        .select('-_id -__v -members._id -members.stream._id')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
});

router.get('/774inc', (req, res, next) => {   //return data of live status of channels in 774inc
    Group.findById('774inc_UpcomingStreamsData')
        .select('-_id -__v -members._id -members.stream._id')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
});

router.get('/voms', (req, res, next) => {   //return data of live status of channels in voms
    Group.findById('voms_UpcomingStreamsData')
        .select('-_id -__v -members._id -members.stream._id')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
});

router.get('/hololive', (req, res, next) => {   //return data of live status of channels in hololive
    Group.findById('hololive_UpcomingStreamsData')
        .select('-_id -__v -members._id -members.stream._id')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
});

module.exports = router;