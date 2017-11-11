const request = require('supertest');
const express = require('express');
const router = require('../api/routes.js');
const app = express();

const mary = "mary";
const jack = "jack";
const err = true;
const errObj = new Error("Response does not contain the correct payload");

app.use('/', router);
const server = app.listen(5000);





describe('/:name', () => {
  it('sends correct name data with a 200 resp status when querying names existing in the db', (done) => {
    request(server)
      .get('/jack')
      .expect(200)
      .expect(jackTest);

    request(server)
      .get('/mary')
      .expect(200)
      .expect(maryTest)
      .end(done);
  })
  it('sends an err msg with a 404 resp status when querying names not existing in the db', (done) => {
    request(server)
      .get('/faa')
      .expect(404)
      .expect(errTest)

    request(server)
      .get('/saa')
      .expect(404)
      .expect(errTest)
      .end(done);
  })
})





function jackTest(res) {
  const name = res.body.name;
  if (name !== jack) {
    throw errObj;
  }
}

function maryTest(res) {
  const name = res.body.name;
  if (name !== mary) {
    throw errObj;
  }
}

function errTest(res) {
  const resBody = res.body.err
  if (resBody !== err) {
    throw errObj;
  }
}
