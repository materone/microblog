var m = require('./m');
var tm1 = require('./tm1');
//var db = require('../models/db');
var client = require('mongodb').MongoClient;

console.log('A:'+m.getA());
m.setA(100);
console.log('After set A in main A:'+m.getA());

tm1.test();

var db;

// Initialize connection once
client.connect("mongodb://localhost:27017/test", function(err, database) {
  if(err) throw err;
  db = database;
  listpost();
  db.collection('restaurants',function  (err,col) {
  	col.find().toArray(function (err,docs) {
  		docs.forEach(function (doc,index) {
  			console.log(index+' ==>'+doc);
  		});
  	});
  	db.close();
  });
});

var listpost = function() {
	db.collection('post',function(err,col){
		console.log('In 001:' + db.serverConfig);
		if(err){
			//db.close();
			console.log(err);
			throw err;
		}

		col.count(function(err,count){
			console.log('In 002');
			if(err){
				console.log(err);
			}
			console.log('page cnt:%d',count);
			//console.log(count);
		});
		//db.close();
	});
};


console.log('End of main');
