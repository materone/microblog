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

router.user = function(req,res){
	console.log('HEHE');
	console.log('Param:'+req.params.user);
	res.end('Mmia');
};

router.post = function(req,res){

};

router.reg = function(req,res){

};

router.doReg = function(req,res){

};

router.login = function(req,res){

};

router.doLogin = function(req,res){

};

router.logout = function(req,res){

};

module.exports = router;
