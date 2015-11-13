var mongodb = require('mongodb').MongoClient
  , assert = require('assert');
 var settings = require('../Settings');

function User(user){
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

User.prototype.save = function(cb){
	var user = {
		name:this.name,
		password:this.password,
	};

	mongodb.connect(settings.url,function(err,db){
		assert.equal(null, err);
  		console.log("Connected correctly to server");
		if(err){
			db.close();
			return cb(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				db.close();
				return cb(err);
			}

			collection.ensureIndex('name',{unique:true});
			collection.insert(user,{safe:true},function(err,user){
				db.close();
				cb(err,user);
			});
		});
	});
};

User.get = function(username,cb){
	mongodb.connect(settings.url,function(err,db){
		if(err){
			db.close();
			return cb(err);
		}
		db.collection('users',function(err,collection){
			if(err){
				db.close();
				return cb(err);
			}

			collection.findOne({name:username},function(err,doc){
				db.close();
				if(doc){
					var user = new User(doc);
					cb(err,user);
				}else{
					cb(err,null);
				}
			});
		});
	});
};