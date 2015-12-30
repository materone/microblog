var mongodb = require('mongodb');
var server = new mongodb.Server('localhost',27017,{poolSize:10});
var db = new mongodb.Db('test',server,{w:-1});

function testGet () {
	db.open(function  (err,db) {
		if(err)return console.error(err);
		console.log('DB Connected');
		db.collection('post').find().toArray(function  (err,docs) {
			if(err) return console.error(err);
			db.close();
			docs.forEach(function(doc,index) {
				console.log(index,doc);
			});
		});
	});
};

testGet();
console.log('In Moddule', '[...]');
