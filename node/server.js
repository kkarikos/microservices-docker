'use strict';
const express = require('express');
const redis = require('redis');
const MONGO_URL = 'mongodb://mongo';
const RABBIT_URL = 'amqp://rabbitmq';
const PORT = 3000;
const JOBS_QUEUE = 'jobs';
const PAYMENTS_QUEUE = 'payments';
const MongoClient = require('mongodb').MongoClient;
// using host entries created by docker in /etc/hosts
const RedisClient = redis.createClient('6379', 'redis');
const Rabbitmq = require('amqplib');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

let channel;
let replyQueue;

// TODO: create exchanges. eg. payments exchange
var connect = () => {
  return Rabbitmq.connect(RABBIT_URL).then((conn) => {
    conn.createConfirmChannel().then((ch) => {
      channel = ch;
      channel.assertQueue('', {exclusive: true}).then((done) => {
        replyQueue = done.queue;
      });
    });
  }).catch(() => {
    setTimeout(connect, 1000);
  });
};

connect().then(() => console.log('%s connected to rabbit', process.env.NODE_ID));

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

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
  // TODO: publish instead of sendToQueue, which will also accept callback function
  // TODO: assertExchange
  channel.assertQueue(JOBS_QUEUE);
  // TODO: do bind for exchange/queue
  channel.consume(replyQueue, function(msg) {
    // TODO: use socket.io to push message to client
    console.log('reply from worker: %s', msg.content);
  }, {noAck: true});

  channel.sendToQueue(
    JOBS_QUEUE,
    new Buffer('something to do'),
    { correlationId: generateUuid(), replyTo: replyQueue},
    function(err, ok) {
      if (!err) console.log('NODE:%s: ack callback received', process.env.NODE_ID);
    }
  );

  res.status(202).send('Job accepted: ' + Date.now());
});

app.post('/payments/charge', (req, res) => {
  const payload = {
    source: req.body.stripeToken,
    amount: req.body.amount,
    currency: req.body.currency,
    description: req.body.description
  };

  channel.assertQueue(PAYMENTS_QUEUE);

  channel.sendToQueue(
    PAYMENTS_QUEUE,
    new Buffer(JSON.stringify(payload))
  );

  res.status(202).send('payment in process: ' + Date.now());
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
