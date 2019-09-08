const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const port = 8088; // default port to listen
const mLabDb = 'mongodb://yossi:Yossia89@ds317808.mlab.com:17808/youtube-play-list';
const DOCUMENT_ID = '5d715de11f5c91117ac20b06';
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(mLabDb, {useNewUrlParser: true})
  .then( () => console.log('The Mongoose connection is ready'))
  .catch(error => console.log('Some problem with the connection ' + error));


const Schema = mongoose.Schema;

const playListSchema = new Schema({
    list: [{
        id: String,
        contentDetails: {
            duration: String
        },
        snippet: {
            title: String
        }
    }]
});

const PlayList = mongoose.model('playlist', playListSchema);

app.use(express.json());

app.post( "/list", ( req, res ) => {
    PlayList.update(
      { _id: DOCUMENT_ID },
      { $push: { list: req.body.video } },
      { safe: true, multi:true }, (err, obj) => {
          res.json(obj);
    });
});

app.get( "/list", ( req, res ) => {
    PlayList.find({}, (error, data) => {
        if(error) {
            console.log("error getting data", error);
        } else {
            console.log("data", data[0]);
        }
    }).then((data) => {
        res.json(data[0]);
    });
});

app.put( "/list/update", ( req, res ) => {
    PlayList.update(
      { _id: DOCUMENT_ID },
      { $pull: { list: { id: req.body.video.id } }},
      { safe: true, multi:true }, (err, obj) => {
          res.json(obj);
    });

});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
