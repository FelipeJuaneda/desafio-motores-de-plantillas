var express = require('express');
var router = express.Router();
const products = require('../src/contenedor')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form.pug');
});

router.get('/productos', function(req, res, next) {
  res.render('products.pug', {products: products.getAll()});
});

router.post('/productos', function(req, res, next) {
  products.save(req.body)
  res.redirect('/productos')
});
module.exports = router;
