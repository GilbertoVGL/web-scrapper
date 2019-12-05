const express = require('express')
const router = express.Router();
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const config = require(`${__dirname}/db/config/config`);

const localUrl = `mongodb://${config.user}:${config.password}@0.0.0.0:27017/admin`;
const mongoDB = process.env.MONGODB_URI || localUrl;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json())
const corsConfig = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
}

app.use(corsConfig);

const search = require('./routes/search');

router.use('/search', search);

app.use('/api', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app