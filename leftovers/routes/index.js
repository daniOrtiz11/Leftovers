var express = require('express');
var router = express.Router();

exports.index = function(req, res){
res.render('home', { title: 'ejs' });};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

module.exports = router;
