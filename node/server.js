'use strict';
const express = require('express');
const redis = require('redis');
const MONGO_URL = 'mongodb://mongo';
const PORT = 3000;

const MongoClient = require('mongodb').MongoClient;
// using host entries created by docker in /etc/hosts
const RedisClient = redis.createClient('6379', 'redis');

// App
const app = express();
app.get('/', function (req, res) {
  RedisClient.incr('counter', function(err, counter) {
    if(err) return next(err);
    res.send('This page has been viewed ' + counter + ' times!');
  });
});

app.get('/docs', function (req, res) {
  MongoClient.connect(MONGO_URL, function(err, db) {
    var collection = db.collection('documents');
    collection.find({}).toArray(function(err, docs){
       res.send(docs);
     });
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
