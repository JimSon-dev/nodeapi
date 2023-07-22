const express = require('express');
const app = express();
const _774Routes = require('./api/routes/774inc');
const _VomsRoutes = require('./api/routes/voms');
const _HololiveRoutes = require('./api/routes/hololive');
const _YogsCastRoutes = require('./api/routes/yogscast');
const _GameDevsRoutes = require('./api/routes/gamedevs');
const _liveGroupRoutes = require('./api/routes/groupLiveInfo');
const _upcomingStreamsGroupRoutes = require('./api/routes/groupUpcomingStreamsInfo');
const morgan = require('morgan');

app.use(morgan('dev')); //pass request through the morgan logger

app.use((req, res, next) => {   //add headers to incoming request to avoid CORS errors
    res.header('Cache-Control', 'public, max-age=300, s-maxage=600'); //cache data retrieved from the get requests made
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');//'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next(); //send the request through with the new headers
});

app.use('/api/v1/group/774inc', _774Routes);
app.use('/api/v1/group/voms', _VomsRoutes);
app.use('/api/v1/group/hololive', _HololiveRoutes);
app.use('/api/v1/group/yogscast', _YogsCastRoutes);
app.use('/api/v1/group/gamedevs', _GameDevsRoutes);
app.use('/api/v1/all/liveInfo', _liveGroupRoutes);
app.use('/api/v1/all/UpcomingStreams', _upcomingStreamsGroupRoutes);

app.use((req, res, next) => {   //if 404
    const error = new Error('Page Not Found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, nest) => {    //if some other error
    res.status(error.status || 500).json({
        Error: {
            StatusCode: 404,
            Message: error.message
        }
    });
});

module.exports = app;