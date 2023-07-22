const express = require('express');
const router = express.Router();
const Group = require('../models/groupData');
const ChannelSchema = require('../models/channelData');
const mongoose = require('mongoose');
const Channel = mongoose.model('ChannelData', ChannelSchema, 'hololive');
//handle get request to /hololive and /hololive/{channelNumber}
/*
channelData
    {_id:String, id:Number, channelId:String, channelName:String, numberOfVideos:String, group:String, playlistId:String, 
        videos:[{title:String, videoID:String, datePublished:String, thumbnails:{mediumURL:String}}]}
groupData
    {_id:String, group: String, members:[{id:String, channelId:String, channelName:String, thumbnail:String, playlistId:String}]}
*/
router.get('/:channel', (req, res, next) => {   //return channelInfo of specific channel in hololive, all videos
    const id = req.params.channel;
    if (isNaN(id) && isNaN(parseInt(id))) { //check if the parameter is a number
        res.status(404).json({Error: {StatusCode: 404, Message: "Page Not Found!"}});
        return;
    }
    //collect query values if they were included in the request url
    var searchQuery = req.query.search.toLowerCase();   //searched word
    const searchPage = req.query.page;  //only used to check if queryToken is needed
    var sorting = req.query.sorting == undefined? "newestFirst" : req.query.sorting;    //used to determine whether to reverse the data or not
    var trySearch = false;
    var initialSearch = false;  //resets the limits for the j variable after the queryToken has been used in the initial search
    var posToken = [ 0, 0 ];    //used to keep track of the index already searched
    if (searchPage > 1) 
        posToken = req.query.queryToken.split("_");
    if (searchQuery)    //if a non empty string was used
        trySearch = true;
    Channel.findById('hololive_' + id)
        .select(trySearch == true ? "" : '-_id -__v -playlistId -pages')    //if searching, get whole document
        .exec()
        .then(doc => {
            if (trySearch) {
                var searchedDoc = {id: doc.id, channelId: doc.channelId, channelName: doc.channelName, numberOfVideos: doc.numberOfVideos, numberOfPages : doc.numberOfPages, group: doc.group, queryToken: "", pages: [ { videos: [], currentPage: searchPage, nextPage: "" } ]};
                var counter = 0;
                if (posToken[0] == 0 && posToken[1] == 0 && sorting == "oldestFirst")   //sets index when the data needs to be reversed
                    posToken = [ (doc.pages.length - 1), (doc.pages[doc.pages.length - 1].videos.length - 1) ];
                for (let i = posToken[0]; sorting == "newestFirst" ? i < doc.pages.length : i >= 0; sorting == "newestFirst" ? i++ : i--) {
                    for (let j = initialSearch == false ? posToken[1] : (sorting == "newestFirst" ? 0 : doc.pages[i].videos.length - 1); sorting == "newestFirst" ? j < doc.pages[i].videos.length : j >= 0; sorting == "newestFirst" ? j++ : j--) {
                        if (doc.pages[i].videos[j].title.toLowerCase().includes(searchQuery)) { //if the search word is included in a video's title
                            searchedDoc.pages[0].videos.push(doc.pages[i].videos[j]);   //push the video details
                            counter++;
                            if (counter == 60) {    //when 60 videos have been pushed into the object
                                searchedDoc.queryToken = i + "_" + (sorting == "newestFirst" ? (j + 1) : (j - 1));  //set queryToken for additional searches of the same word
                                searchedDoc.pages[0].nextPage = parseInt(searchPage) + 1;
                                break;
                            }
                        } 
                    }
                    if (!initialSearch)
                            initialSearch = true;
                    if (counter == 60) 
                        break;
                }
                if (searchedDoc.pages.length > 0)
                    res.status(200).json(searchedDoc);
                else
                    res.status(404).json({Error: {StatusCode: 404, Message: "Page Not Found!"}});
            }
            else {
                if (doc != null)
                    res.status(200).json(doc);
                else
                    res.status(404).json({Error: {StatusCode: 404, Message: "Page Not Found!"}});
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
});

router.get('/:channel/:page', (req, res, next) => {   //return channelInfo of specific channel in 774inc, all videos
    const id = req.params.channel;
    const pageNumber = req.params.page;
    if ((isNaN(pageNumber) && isNaN(parseInt(pageNumber))) || (isNaN(id) && isNaN(parseInt(id)))) { //check if the parameters are numbers
        res.status(404).json({Error: {StatusCode: 404, Message: "Page Not Found!"}});
        return;
    }
    var projection = {_id:0, id: 1, channelId: 1, channelName: 1, numberOfVideos: 1, numberOfPages: 1, group: 1, 
        pages: { $arrayElemAt: ["$pages", parseInt(pageNumber - 1)]}};
    /*
    if (parseInt(pageNumber) > 1)   //pageNumber 1 returns channel info along with first page of videos, every other page just returns video info
        projection = {_id:0, pages: { $arrayElemAt: ["$pages", parseInt(pageNumber - 1)]}};
    */
    Channel.findById('hololive_' + id)
    .select(projection)
    .exec()
    .then(doc => {
        if (doc.pages.length > 0)
            res.status(200).json(doc);
        else
            res.status(404).json({Error: {StatusCode: 404, Message: "Page Not Found!"}});
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: error});
    });
});

router.get('/', (req, res, next) => {   //return groupInfo/memberInfo for each channel in hololive
    Group.findById('hololive')
        .select('-_id -__v -members._id -members.playlistId')
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