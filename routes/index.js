var express = require('express');
var router = express.Router();

const debug = require('debug')('testing:main');



router.get('/kelas/:id', (req, res) => {
  debug(req.params.id);
  console.log(`Ini adalah permintaan request untuk "/kelas/ ${req.params.id}"`);
  res.send(`Ini adalah halaman untuk kelas  ${req.params.id}`);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
