const express = require('express');
const utils = require('./utils');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send({ state: 'running' });
});

router.get('/:name', (req, res, next) => {
  utils.findName(req.params.name)
    .then(result => res.status(200).send(result).end())
    .catch(err => res.status(404).send({ err: true, debug: err }));
});

router.get('/search/:term', (req, res, next) => {
  utils.searchTerm(req.params.term)
    .then(results => res.status(200).send(results).end())
    .catch(err => res.status(404).send({ err: true, debug: err }));
});

module.exports = router;
