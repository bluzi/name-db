const request = require('supertest');
const express = require('express');
const router = require('../api/routes.js');
const app = express();

const mary = "mary";
const jack = "jack";
const err = true;

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
    done()
  })
})






function jackTest(res) {
  const name = res.body.name;
  if (name !== jack) {
    throw new Error("Response does not contain the correct name data");
  }
}

function maryTest(res) {
  const name = res.body.name;
  if (name !== mary) {
    throw new Error("Response does not contain the correct name data");
  }
}
