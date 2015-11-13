var setting = require('../Settings');
var db = require('mongodb').Db;
var conn = require('mongodb').Connection;
var server = require('mongodb').Server;

module.export = new db(setting.db,new server(setting.host,conn.DEFAULT_PORT,{}));