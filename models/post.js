var mongodb = require('mongodb').MongoClient
  , assert = require('assert');
 var settings = require('../Settings');

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

Post.get = function get(username,cb){
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

			if(username){
				query.user=username;
			}

			collection.find(query).sort({time:-1}).toArray(function(err,doc){
				db.close();
				if(err){
					cb(err,null);
				}
				var posts = [];
				doc.forEach(function(doc,index){
					var post = new Post(doc.user,doc.post,doc.time);
					posts.push(post);
				});
				cb(null,posts);				
			});
		});
	});
};