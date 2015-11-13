var express = require('express');
var crypto = require('crypto');
var User = require('../models/user');

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
	res.render('reg',{
		title:'用户注册'
	});
};

router.doReg = function(req,res){
	if(req.body['password-repeat'] != req.body['password']){
		req.flash('error','两次输入的口令不一致');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name:req.body.username,
		password:password
	});

	User.get(newUser.name,function(err,user){
		if(user)
			err = 'Username already exist';
		if(err){
			req.flash('error',err);
			return res.redirect('/reg');
		}
		newUser.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success','注册成功');
			return res.redirect('/');
		});
	});
};

router.login = function(req,res){
	res.render('login',{
		title:'用户登入'
	});
};
//post login
router.doLogin = function(req,res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	User.get(req.body.username,function(err,user){
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/login');
		}
		if(user.password != password){
			req.flash('error','密码错误');
			return res.redirect('/login');
		}
		req.session.user = user;
		req.flash('success','登录成功');
		return res.redirect('/');
	});
};

router.logout = function(req,res){
	req.session.user = null;
	req.flash('success','退出成功');
	return res.redirect('/');
};

module.exports = router;
