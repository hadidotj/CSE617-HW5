var mysql = require('mysql');

var db = mysql.createConnection({host:"localhost", user:"test", password:"mypassword",database:"notes"});
db.connect(function(err) {
	console.log("Connect(err) : " +err);
});

db.query("SELECT * FROM notes", function(err, rows) {
	console.log("Query: ");
	console.log(err);
	console.log(rows);
});

db.end();
