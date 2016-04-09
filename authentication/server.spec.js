'use strict';

const supertest = require('supertest-as-promised');
const expect = require('chai').expect;

// Mock mongoose since we don't have access to the mongodb container
const mockgoose = require('mockgoose');
mockgoose(require('mongoose'));

const app = require('./server');
const request = supertest(app);

describe('Authentication API', () => {
  describe('POST /register', () => {
    it('should register a new user', () => {
      const newUser = {
        email: 'ridge@vincit.fi',
        username: 'ridge',
        password: 'kissa_90',
      };

      return request
        .post('/register')
        .send(newUser)
        .then((res) => {
          expect(res.status).to.eql(201);
          expect(res.body.email).to.eql(newUser.email);
          expect(res.body.username).to.eql(newUser.username);
          expect(res.body.password).to.eql(undefined);
        });
    });

    it('should fail with missing username', () => {
      return request
        .post('/register')
        .send({ email: 'i.have@no.username', password: 'kissa_90' })
        .then((res) => {
          expect(res.status).to.eql(400);
        });
    });

    it('should also fail with missing password', () => {
      return request
        .post('/register')
        .send({ email: 'i.have@no.username', username: 'ridge' })
        .then((res) => {
          expect(res.status).to.eql(400);
        });
    });
  });
});
