'use strict';

const express = require('express');
const Promise = require('bluebird');
Promise.promisifyAll(require('mongoose'));
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const User = require('./models/User');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');
const _ = require('lodash');

// FIXME: move port declarations to env variables defined in the Dockerfile?
const PORT = 3001;
const MONGO_URL = 'mongodb://mongo/micro-boilerplate';

mongoose.connect(MONGO_URL);
const db = mongoose.connection;

const app = express()
  .use(bodyParser.json())
  .set('json spaces', 2);

if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

app.post('/register', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!password) {
    return res.status(400).send({ message: 'You must give a password!' });
  }

  User.findOneAsync({ email })
    .then((user) => {
      if (user) {
        res.status(400).send({ message: 'Email taken, please choose another!' });
      } else {

        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
        const hash = bcrypt.hashSync(password, salt);

        return User.createAsync({ email, username, password: hash })
          .then((user) => {
            // TODO: some more generic way to protect certain attributes. Maybe a custom function
            // in the model?
            res.status(201).send(_.omit(user.toObject(), 'password'));
          })
          .catch((e) => {
            if (e.name === 'ValidationError') {
              res.status(400).send({ message: e.message });
            } else {
              res.status(500).send({ message: 'Something whent terribly wrong!' });
            }
          });
      }
    })
    .catch((e) => res.status(500).send({ message: 'Something whent terribly wrong!' }));
});

const server = app.listen(PORT, () => console.log(`Running at port ${server.address().port}`));

module.exports = app;
