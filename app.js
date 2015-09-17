var express = require('express'),
    engine = require('ejs-mate'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    db = require('./models'),
    app = express();

app.engine('ejs', engine);

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

// method-override
app.use(methodOverride('_method'));
app.use(methodOverride('X-HTTP-Method-Override'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); // for parsing application/json

//javascript link
app.use(express.static(__dirname + "/public"));

//root
app.get('/', function(req, res) {
    db.Student.find({}, function(err, doc) {
        console.log(doc);
        res.render('index', {
            students: doc
        });
    });
});

//View important information
app.get('/class/important', function(req, res) {
    db.Student.find({allergies: {$exists: true}}, function(err, doc) {
        console.log(doc);
        res.render('important', {
            students: doc
        });
    });
});

//View birthdays
app.get('/class/birthdays', function(req, res) {
    db.Student.find({allergies: {$exists: true}}, function(err, doc) {
        console.log(doc);
        res.render('birthday', {
            students: doc
        });
    });
});

//Add a student
app.get('/student/add', function(req, res) {
    res.render('new');   
});

app.post('/student', function(req, res) {
    db.Student.create(req.body.student, function(err, doc) {
        res.redirect('/');
    });
    console.log(req.body);
});

//View one student
app.get('/student/info/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findById(id, function(err, doc) {
        if (doc) {
            res.render('student', {
                student: doc
            });
        } else {
            res.render('404');
        }
    });
});

// Update a student
app.get('/student/edit/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findById(id, function(err, doc) {
        res.render('edit', {
            student: doc
        });
    });
});

app.put('/student/:id', function(req, res) {
    var id = req.params.id;
    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        number = req.body.number,
        nickName = req.body.nickName,
        gender = req.body.gender,
        age = req.body.age,
        birthday = req.body.birthday,
        allergies = req.body.allergies,
        other = req.body.other,
        homeroomTeacher = req.body.homeroomTeacher,
        grades = req.body.grades;
    db.Student.findByIdAndUpdate(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/");
        } else {
            res.render('404');
        }
    });
});

// Update teacher
app.put('class', function(req, res) {
    var id = req.params.id;
    var homeroomTeacher = req.body.homeroomTeacher;
    db.Student.find(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/");
        } else {
            res.render('404');
        }
    });
});

// Remove one student
app.delete('/student/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findByIdAndRemove(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/");
        }
    });
});

//View gradebook
app.get('/class/grades', function(req, res) {
    db.Student.find({}, function(err, doc) {
        console.log(doc);
        res.render('404', {
            students: doc
        });
    res.render('404');
    });
});

app.get('/grades/:id', function(req, res) {
    var id = req.params.id;
    db.Student.find({}, function(err, doc) {
        console.log(doc);
        res.render('404', {
            students: doc
        });
    res.render('404');
    });
});

//Add an assigment
app.post('/grade/assigment', function(req, res) {
    db.Student.create(req.body.student, function(err, doc) {
        res.redirect('/grades');
    });
    console.log(req.body);
});

//View grades
app.get('/student/grades/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findById(id, function(err, doc) {
        if (doc) {
            res.render('student', {
                grade: doc
            });
        } else {
            res.render('404');
        }
    });
});

// Update an assignment
app.get('/grades/edit/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findById(id, function(err, doc) {
        res.render('edit', {
            grade: doc
        });
    });
});

app.put('/grades/:id', function(req, res) {
    var id = req.params.id;
    var assignment = req.body.assignment;
    db.Grade.findByIdAndUpdate(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/grades");
        } else {
            res.render('404');
        }
    });
});

// Remove one assignment
app.delete('/grades/:id', function(req, res) {
    var id = req.params.id;
    db.Student.findByIdAndRemove(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/grades");
        }
    });
});







app.listen(3000, function() {
    console.log("Starting a server on localhost: 3000");
});




