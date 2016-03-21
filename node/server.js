'use strict';
const express = require('express');
const redis = require('redis');
const MONGO_URL = 'mongodb://mongo';
const RABBIT_URL = 'amqp://rabbitmq';
const PORT = 3000;
const q = 'jobs';
const MongoClient = require('mongodb').MongoClient;
// using host entries created by docker in /etc/hosts
const RedisClient = redis.createClient('6379', 'redis');
const Rabbitmq = require('amqplib');

const app = express();

app.get('/', function (req, res) {
  RedisClient.incr('counter', (err, counter) => {
    if(err) return next(err);
    res.send('This page has been viewed ' + counter + ' times!');
  });
});

app.get('/docs', function (req, res) {
  MongoClient.connect(MONGO_URL, (err, db) => {
    var collection = db.collection('documents');
    collection.find({}).toArray((err, docs) => {
       res.send(docs);
     });
  });
});

app.get('/job', function (req, res) {
  Rabbitmq.connect(RABBIT_URL).then((conn) => {
    return conn.createChannel().then((ch) => {
      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer('something to do'));
      res.status(202).send('Job accepted: ' + Date.now());
    });
  }).then(null, console.warn);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
