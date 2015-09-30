var express = require('express'),
    engine = require('ejs-mate'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    db = require('./models'),
    bcrypt = require("bcrypt"),
    morgan = require("morgan"),
    request = require('request'),
    cookieSession = require('cookie-session'),
    loginMiddleware = require('./middleware/loginHelper'),
    routeMiddleware = require('./middleware/routeHelper'),
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

app.use(cookieSession({
    maxage: 60000000,
    secret: "nevertell",
    name: "student cookie"
}));

app.use(morgan('tiny'));
app.use(loginMiddleware);
// app.use(routeMiddleware);


//root
app.get('/', loginMiddleware, function(req, res) {
    db.Teacher.find({}).populate('students').exec(function(err, doc) {
        if (req.session.id) {
            res.redirect('/teachers/' + doc._id);
        } else {
            res.render('home', {
                teacher: doc,
                students: doc.students,
                session: req.session.id
            });
        }
    });
});

//login

app.post('/login', loginMiddleware, function(req, res) {
    db.Teacher.authenticate(req.body.teacher, function(err, doc) {
        if (doc) {
            req.login(doc);
            res.redirect('/teachers/' + doc._id);
        } else {
            console.log(err);
            res.redirect('/');
        }
    });
});


// app.post('/loginStudent', function(req, res) {
//     console.log('doc');
//     db.Student.authenticate(req.body.student, function(err, doc) {
//         console.log(doc);
//         if (doc) {
//             req.login(doc);
//             res.redirect('/students/index');
//         } else {
//             console.log(err);
//             res.redirect('/');
//         }
//     });
// });

//logout
app.get('/logout', function(req, res) {
    db.Teacher.findById(req.session.id, function(err, doc) {
        console.log(doc);
        if (doc) {
            req.logout(doc);
            res.redirect('/teachers/' + doc._id);
        } else {
            console.log(err);
            res.redirect('/');
        }
    });
});


//TEACHER index

app.get('/teachers/:id', loginMiddleware, function(req, res) {
    db.Teacher.findById(req.params.id).populate('students').exec(function(err, doc) {
        res.render('teacher/index', {
            teacher: doc,
            session: req.session.id
        });
    });
});

//edit teacher info
// app.get('/teachers/:id/edit', function(req, res) {
//     db.Teacher.findById(req.params.id).populate('students').exec(function(err, doc) {
//         console.log("Teacher: ", doc);
//         res.render('teacher/edit', {
//             teacher: doc,
//             session: req.session.id
//         });
//     });
// });

app.get('/teachers/:id/edit', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Teacher.findById(id, function(err, doc) {
        res.render('teacher/edit', {
            teacher: doc,
            session: req.session.id
        });
    });
});

app.put('/teachers/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
        
    // findByIdAndUpdate does not work with save() which is needed to hash, so use findById and reformat information to be updated as follows
    db.Teacher.findById(id, function(err,teacher){
        teacher.firstname = req.body.teacher.firstname;
        teacher.lastName = req.body.teacher.lastName;
        teacher.prefix = req.body.teacher.prefix;
        teacher.gradeLevel = req.body.teacher.gradeLevel;
        teacher.email = req.body.teacher.email;
        teacher.password = req.body.teacher.password;
        teacher.assignments = req.body.teacher.assignments;
        teacher.students = req.body.teacher.students;
        teacher.save(function(err, doc) {
                if (req.params.id) {
                    res.redirect("/teachers/" + doc.id);
                } else {
                    res.render("/teachers/" + doc.id + "/edit");
                }
            });         
        });
    });

//see class
app.get('/teachers/:id/students', loginMiddleware, function(req, res) {
    db.Teacher.findById(req.params.id).populate('students').exec(function(err, doc) {
        res.render('students/index', {
            teacher: doc,
            session: req.session.id
        });
    });
});



//View birthdays
app.get('/teachers/:id/students/birthdays', loginMiddleware, function(req, res) {
    db.Teacher.findById(req.params.id).populate('students').exec(
        function(err, doc) {
        console.log("BIRTHDAYS "+doc);
        res.render('teacher/birthday', {
            students: doc.students,
            teacher: doc
        });
    });
});

//View important information
app.get('/teachers/:id/students/important', loginMiddleware, function(req, res) {
    db.Student.find({
        allergies: {
            $exists: true
        }
    }, function(err, doc) {
        res.render('important', {
            students: doc,
            session: req.session.id,
            teacher: req.params.teacher_id
        });
    });
});


//Add a student
app.get('/teachers/:teacher_id/students/new', loginMiddleware, function(req, res) {
    console.log("SESSION " + req.session.id);
    db.Teacher.findById(req.params.teacher_id, function(err, doc) {
        res.render('students/new', {
            teacher: doc,
            session: req.session.id
        });
    });
});

app.post('/teachers/:teacher_id/students', loginMiddleware, function(req, res) {
    db.Student.create(req.body.student, function(err, student) {
        db.Teacher.findById(req.params.teacher_id, function(err, teacher) {
            student.teacher = teacher.id;
            student.save(function(err, student) {
            });
            teacher.students.push(student);
            teacher.save(function(err, teacher) {
                console.log(err);
            });
            res.redirect('/teachers/' + req.params.teacher_id + '/students');
        });
    });
    console.log(req.body);
});

//View one student
app.get('/teachers/:teacher_id/students/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Student.findById(id).populate('teacher').exec(
        function(err, doc) {
            if (doc) {
                res.render('students/show', {
                    student: doc,
                    session: req.session.id,
                    teacher: doc.teacher
                });
            }
        });
});

// Update a student
app.get('/teachers/:teacher_id/students/:id/edit', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Student.findById(id).populate('teacher').exec(
        function(err, doc) {
            res.render('students/edit', {
                student: doc,
                session: req.session.id,
                teacher: doc.teacher
            });
        });
});

app.put('/teachers/:teacher_id/students/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    var firstName = req.body.student.firstName,
        lastName = req.body.student.lastName,
        nickName = req.body.student.nickName,
        gender = req.body.student.gender,
        number = req.body.student.number,
        birthday = req.body.student.birthday,
        allergies = req.body.student.allergies,
        other = req.body.student.other,
        email = req.body.student.email,
        password = req.body.student.password,
        teacher = req.body.student.teacher,
        assignments = req.body.student.assignments
        // ,
        // parent1 = [{
        //     fullname: req.body.parent1.fullname,
        //     relationship: req.body.parent1.relationship,
        //     email: req.body.parent1.email,
        //     phone: req.body.parent1.phone,
        //     workphone: req.body.parent1.workphone
        // }],
        // parent2 = [{
        //     fullname: req.body.parent2.fullname,
        //     relationship: req.body.parent2.relationship,
        //     email: req.body.parent1.email,
        //     phone: req.body.parent2.phone,
        //     workphone: req.body.parent2.workphone
        // }],
        // emergency = [{
        //     fullname: req.body.emergency.fullname,
        //     relationship: req.body.emergency.relationship,
        //     phone: req.body.emergency.phone,
        //     workphone: req.body.emergency.workphone
        // }]
    ;
    console.log("request body is: ", req.body);
    db.Student.findByIdAndUpdate(id, {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        gender: gender,
        number: number,
        birthday: birthday,
        allergies: allergies,
        other: other,
        email: email,
        password: password,
        assignments: assignments
    }, function(err, doc) {
            if (doc) {
                doc.populate('teacher');
                doc.save();
                res.redirect('/teachers/' + req.params.teacher_id + '/students/' + id);
            } else {
                res.render('students/edit', {
                    student: doc,
                    session: req.session.id,
                    teacher: doc.teacher
                });
            }
        });
});

// !!!!!!!!!!!!!// Update teacher
// app.put('/class', loginMiddleware, function(req, res) {
//     var id = req.params.id;
//     var teacher = req.body.student.teacher;
//     db.Student.update({}, {$set: {teacher: teacher}}, {multi: true}, function(err, doc) {
//         if (doc) {
//             res.redirect("/");
//         } else {
//             res.render('404');
//         }
//     });
// });

// Remove one student
app.delete('/teachers/:teacher_id/students/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Student.findByIdAndRemove(id, req.body, function(err, doc) {
        res.redirect("/");
    });
});

//View gradebook
app.get('/grades', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Assignment.find({}, function(err, doc) {
        console.log("session: "+req.session.id +', teacher id'+id);
            res.render('assignment/index', {
                assignments: doc,
                teacher: req.session.id
        });
    });
});


app.post('/grades/:id', loginMiddleware, function(req, res) {
    db.Assignment.create(req.body.assignment, function(err, doc) {
        res.redirect('/grades');
    });
});

//Edit Assignments
app.put('/teachers/:teacher_id/grades/:id', loginMiddleware, function(req, res) {
    db.Assignment.update(req.params.id, function(err, doc) {
        res.redirect('/grades');
    });
});


// Update a student's grades
app.get('/teachers/:teacher_id/grades/:id/edit', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Student.findById(id, function(err, doc) {
        res.render('assignment/editassign', {
            student: doc,
            teacher: req.session.id
        });
    });
});

app.put('/teachers/:teacher_id/grades/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    var assignment = req.body.assignment;
    db.Assignment.findByIdAndUpdate(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/grades");
        }
    });
});

// Remove one assignment
app.delete('/teachers/:teacher_id/grades/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Assignment.findByIdAndRemove(id, req.body, function(err, doc) {
        if (doc) {
            res.redirect("/grades");
        }
    });
});


//View single assignment's grades
app.get('/teachers/:teacher_id/students/:student_id/grades/:id', loginMiddleware, function(req, res) {
    var id = req.params.id;
    db.Assignment.findById(id, function(err, doc) {
        if (doc) {
            res.render('assignment/show', {
                student: doc,
                teacher: req.session.id
            });
        }
    });
});


//404 redirects
app.get('*', loginMiddleware, function(req, res) {
    res.render('404');
});




app.listen(3000, function() {
    console.log("Starting a server on localhost: 3000");
});
