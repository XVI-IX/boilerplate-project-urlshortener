require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
// const dns = require('dns');
const mongoose = require('mongoose');
const uniqid = require('uniqid');

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
})

const urls = mongoose.model('urls', urlSchema);



app.use(cors());

app.use(bodyParser.urlencoded());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

  let urlId = uniqid();

  let newUrl = new urls ({
    original_url: req.body.url,
    short_url: urlId,
  })
  newUrl.save((err, data) => {{
    if (err) return console.error(err);
  }})

  res.json({
    'original_url': req.body.url,
    'short_url': urlId
  })
});

app.get('/api/shorturl/:urlId', (req, res) => {
  let urlId = req.params.urlId;

  urls.find({short_url: urlId}, (err, data) => {
    if (err) return console.error(err);
    res.redirect(data[0].original_url);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
