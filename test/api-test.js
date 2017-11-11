const request = require('supertest');
const express = require('express');
const router = require('../api/routes.js');
const app = express();

const mary = "mary";
const jack = "jack";
const err = true;

app.use('/', router);
const server = app.listen(5000);
