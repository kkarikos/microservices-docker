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
let channel;

var connect = () => {
  return Rabbitmq.connect(RABBIT_URL).then((conn) => {
    conn.createChannel().then((ch) => {
      channel = ch;
    });
  }).catch(() => {
    setTimeout(connect, 1000);
  });
};

connect().then(() => console.log('%s connected to rabbit', process.env.NODE_ID));

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
  channel.assertQueue(q);
  channel.sendToQueue(q, new Buffer('something to do'));
  res.status(202).send('Job accepted: ' + Date.now());
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
