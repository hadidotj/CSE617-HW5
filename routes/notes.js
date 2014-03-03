var notes = undefined;
exports.configure = function(params) {
	notes = params.model;
}

var readNote = function(key, res, done) {
	notes.read(key,
		function(err, data) {
			if(err) {
				res.render('showerror', {title: "Cound not read note " + key, error: err});
			} else done(null, data);
		});
}

exports.add = function(req, res, next) {
	var key = (arguments[3]) ? arguments[3] : "";
	res.render('noteedit', {
		title: "Add Note",
		docreate: true,
		notekey: key,
		note: { title: "", body: ""}
	});
}

exports.save = function(req, res, next) {
	((req.body.docreate === "create") ? notes.create : notes.update)
	(req.body.notekey, req.body.title, req.body.body, function(err) {
		if(err) {
			res.render('showerror', {title: "Could not save model", error: err});
		} else {
			res.redirect('/noteview?key=' + req.body.notekey);
		}
	});
}

exports.view = function(req, res, next) {
	if(req.query.key) {
		readNote(req.query.key, res, function(err, data) {
			if(!err && data) {
				res.render('noteview', {
					title: data.title,
					notekey: req.query.key,
					note: data
				});
			} else if(!data) {
				res.render('showerror', {title: "Not Found", error: "A note with " + req.query.key + " was not found!"});
			}
		});
	} else {
		res.render('showerror', {title: "No note key given!", error: "Must be provided a key to view a note."});
	}
}

exports.edit = function(req, res, next) {
	if(req.query.key) {
		readNote(req.query.key, res, function(err, data) {
			if(!err) {
				if(data) {
					res.render('noteedit', {
						title: "Edit " + data.title,
						docreate: false,
						notekey: req.query.key,
						note: data
					});
				} else {
					exports.add(req, res, next, req.query.key);
				}
			}
		});
	} else {
		res.render('showerror', {
			title: "No key given for Note",
			error: "Must provided a key to edit a note"
		});
	}
}

exports.destroy = function(req, res, next) {
	if(req.query.key) {
		readNote(req.query.key, res, function(err, data) {
			if(!err && data) {
				res.render('notedestroy', {
					title: data.title,
					notekey: req.query.key,
					note: data
				});
			} else if(!data) {
				res.render('showerror', {title: "Not Found", error: "A note with " + req.query.key + " was not found!"});
			}
		});
	} else {
		res.render('showerror', {
			title: "No note key given for delete!",
			error: "Must provide a key of a note to delete."
		});
	}
}

exports.dodestroy = function(req, res, next) {
	notes.destroy(req.body.notekey, function(err) {
		if(err) {
			res.render('showerror', {
				title: "Could ot delete Note " + req.body.notekey,
				error: err
			});
		} else {
			res.redirect('/');
		}
	});
}
