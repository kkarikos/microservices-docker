const q = 'payments';
const RABBIT_URL = 'amqp://rabbitmq';
const RabbitClient = require('amqplib');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

connect().then(null, console.warn);

function connect() {
  return RabbitClient.connect(RABBIT_URL)
    .then((connection) => {
      startChannel(connection);
    })
    .catch((e) => {
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
        const payload = JSON.parse(msg.content);
        var charge = stripe.charges.create({
          amount: payload.amount,
          currency: payload.currency,
          source: payload.source,
          description: payload.description
        }, function(err, charge) {
          if (err) console.log(err);
          if (err && err.type === 'StripeCardError') {
            // The card has been declined
          }
          console.log(charge);
        });
        ch.ack(msg);
      }
    });
  });
}
