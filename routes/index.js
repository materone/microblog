var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/hello',function(req,res,next){
	console.log(req.params);
	res.write('Hello\n');
	res.end(new Date().toString());
});	

router.get('/hello/:key',function(req,res,next){
  console.log(req.params);
	res.write('Hello\n');
	res.end(new Date().toString());
});


router.get('/', function(req, res, next) {
	//console.log(req);
  res.render('index', { title: 'Express ' + req.query.name,cont:req.query.son});
});

module.exports = router;
