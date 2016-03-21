const q = 'jobs';
const RABBIT_URL = 'amqp://rabbitmq';
const RabbitClient = require('amqplib');

connect().then(null, console.warn);

function connect() {
  return RabbitClient.connect(RABBIT_URL)
    .then((connection) => {
      startChannel(connection);
    })
    .catch((e) => {
      console.log('cannot connect to rabbitmq: ' + e);
      setTimeout(connect, 1000);
    });
}

function startChannel(connection) {
  process.once('SIGINT', connection.close.bind(connection));
  return connection.createChannel()
  .then((ch) => {
    ch.assertQueue(q);
    ch.consume(q, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
}
