'use strict';
const express = require('express');
const redis = require('redis');
const MONGO_URL = 'mongodb://mongo';
const RABBIT_URL = 'amqp://rabbitmq';
const PORT = 3000;
const JOBS_QUEUE = 'jobs';
const PAYMENTS_QUEUE = 'payments';
const MongoClient = require('mongodb').MongoClient;
const RedisClient = redis.createClient('6379', 'redis');
const Rabbitmq = require('amqplib');
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.set('origins', '*:*');
io.set('transports', [ 'websocket', 'xhr-polling', 'jsonp-polling']);

server.listen(PORT);
io.on('connection', function(socket){
  // TODO: use rooms for communicating clients
  console.log('a user connected');
});

let channel;
let replyQueue;
let rabbitConnection;

// TODO: create exchanges. eg. payments exchange
var connect = () => {
  return Rabbitmq.connect(RABBIT_URL).then((conn) => {
    rabbitConnection = conn;
    conn.createConfirmChannel()
    .then((ch) => {
      channel = ch;
      // create reply queue per client
      return channel.assertQueue('', {exclusive: true});
    })
    .then((done) => {
      replyQueue = done.queue;
    })
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
  rabbitConnection.createChannel().then((ch) => {
    ch.assertQueue('', {exclusive: true, autoDelete: true}).then((reply) => {
      const corrId = generateUuid();
      ch.consume(reply.queue, (msg) => {
        console.log('reply from worker: %s', msg.content);
        if (msg.properties.correlationId == corrId) {
          // TODO: emit to single client using rooms
          io.sockets.emit('news', { hello: 'world' });
          ch.close().then(() => console.log('channel closed'));
        }
      }, {noAck: true});

      const ex = 'jobs';
      ch.assertExchange(ex, 'direct', {}).then(() => {
        ch.publish(ex, '', new Buffer('something to do'), { correlationId: corrId, replyTo: reply.queue },
          function(err, ok) {
            if (!err) console.log('NODE:%s: ack callback received', process.env.NODE_ID);
          });
      });
      
      res.status(202).send('Job accepted: ' + corrId);
    });
  });
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

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

console.log('Running on http://localhost:' + PORT);
