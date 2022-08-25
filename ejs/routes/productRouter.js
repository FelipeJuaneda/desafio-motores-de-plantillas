var express = require('express');
var router = express.Router();
const products = require('../src/contenedor')

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/productos', (req, res) => {
  res.render('products', { products: products.getAll() });
});

router.post('/productos', (req, res) => {
  products.save(req.body)
  res.redirect('/productos');
});

module.exports = router;
