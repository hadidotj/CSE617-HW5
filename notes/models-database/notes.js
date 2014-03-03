var sql = require('mysql');
var db = undefined;

var notes = {
	connect: function(info, cb) {
		db = sql.createConnection(info);
		db.connect(function(err) {
			if(err) {
				process.stderr.write("Error connecting to MySQL Database:\n" + err);
			} else {
				cb();
			}
		});
	},
	disconnect: function(cb) {
		db.end();
		cb();
	},

	create: function(key, title, body, cb) {
		db.query("INSERT INTO Notes (notekey, title, body) VALUES (?,?,?);",
			[key, title, body],
			function(err) {
				if(err) cb(err);
				else cb();
			});
	},
	update: function(key, title, body, cb) {
		db.query("UPDATE Notes SET title=?, body=? WHERE notekey=?",
			[title,body,key],
			function(err) {
				if(err) cb(err);
				else cb();
			});
	},
	read: function(key, cb) {
		db.query("SELECT * FROM Notes WHERE notekey=?", [key], function(err, result) {
			if(err) cb(err);
			else cb(null, result[0]);
		});
	},
	destroy: function(key, cb) {
		db.query("DELETE FROM Notes WHERE notekey=?", [key], function(err) {
			if(err) cb(err);
			else cb();
		});
	},
	titles: function(cb) {
		var titles = [];
		var query = db.query("SELECT * FROM Notes");
		query
			.on('error', function(err) { cb(err); })
			.on('fields', function(f) { })
			.on('result', function(row) {
				db.pause();
				titles.push({key: row.notekey, title: row.title});
				db.resume();
			})
			.on('end', function() { cb(null,titles); });
	}
};

module.exports = notes;
