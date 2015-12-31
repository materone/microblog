var mongodb = require('mongodb').MongoClient
  , assert = require('assert');
 var settings = require('../Settings');

 var pSize = 10;

function Post(username,post,time){
	this.user = username;
	this.post = post;
	if(time){
		this.time = time;
	}else{
		this.time = new Date();
	}
}

module.exports = Post;

Post.prototype.save = function save(cb){
	var post = {
		user:this.user,
		post:this.post,
		time:this.time
	};

	mongodb.connect(settings.url,function(err,db){
		assert.equal(null, err);
  		console.log("Connected correctly to server");
		if(err){
			db.close();
			return cb(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				return cb(err);
			}

			collection.ensureIndex('user');
			collection.insert(post,{safe:true},function(err,post){
				db.close();
				cb(err,post);
			});
		});
	});
};

Post.get = function get(username,req,cb){
	mongodb.connect(settings.url,function(err,db){
		if(err){
			db.close();
			return cb(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				db.close();
				return cb(err);
			}

			var query = {};
			var pInfo = {};

			if(username){
				query.user=username;
			}

			collection.count(function(err,count){
				if(err){
					console.log(err);
				}
				pInfo.count = count;
				pInfo.uName = username;
				console.log('page cnt:%d',count);
				console.log('message:%d',pInfo.count);
				console.log('message name:%s',pInfo.uname);
				//console.log(count);
				//fig pageinfo
				var pNo=1;
				var pCount = 0;
				if(req.query.pNo != null){
					pNo = req.query.pNo;
				}else if(req.query.pSize != null){
					pSize = req.query.pSize;
				}
				pInfo.pNo = pNo;
				pInfo.pSzie = pSize;
				pInfo.pCount = Math.ceil(count/pSize);

				collection.find(query).skip((pNo-1)*pSize).limit(pSize).sort({time:-1}).toArray(function(err,doc){
					db.close();
					if(err){
						cb(err,null);
					}
					var posts = [];
					var ret = {};
					doc.forEach(function(doc,index){
						var post = new Post(doc.user,doc.post,doc.time);
						posts.push(post);
					});
					ret.posts = posts;
					ret.pInfo = pInfo;
					console.log(pInfo);
					cb(null,ret);				
				});
			});
		});
	});
};