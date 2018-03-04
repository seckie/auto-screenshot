'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const shoot = require('./shoot.js');
const validUrl = require('valid-url');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './src/views');
app.set('view engine', 'pug');
app.locals.pretty = true;

app.get('/', function (req, res) {
  res.render('index', {currentDirectory: __dirname});
});

app.post('/', function (req, res) {
  const width = req.body.width;
  const height = req.body.height;
  const urls = req.body.urls.split(/[\r\n]+/);
  const validatedUrls = urls.filter(function (url) {return validUrl.isUri(url);
  });
  res.render('index', {
    isProcessing: true,
    currentDirectory: __dirname,
    width: width,
    height: height,
    urls: validatedUrls
  });
});

app.post('/shoot', function (req, res) {
  res.set('Content-Type', 'application/json');
  shoot(req.body).then(function (result) {
    res.send(result);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
