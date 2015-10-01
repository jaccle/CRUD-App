var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");
// var Teacher = require("./post");
var db = require("./index");

var teacherSchema = new mongoose.Schema({
	firstname: String,
	lastName: String,
	prefix: String,
	gradeLevel: String,
	email: {
        type: String,
        required: true
    },
	password: {
        type: String,
        required: true
    },
	students: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student"
	}],
    counter: Number
	//birthday, allergies(for caf), address, phone, classes: student
});

//to delete children with parent
teacherSchema.pre('remove', function(callback) {
    db.Teacher.remove({
        teacher: this._id
    }).exec();
    callback();
});



// var teacherSchema = new mongoose.Schema({

// });

teacherSchema.pre('save', function(next) {
    // the keyword this refers to the INSTANCE!
    // {
    //   email: "eschoppik@gmail.com",
    //   _id: ObjectId("382192389021839021")
    // }

    var teacher = this;
    // if the password has not been changed, save the teacher and move on...
    if (!teacher.isModified('password')) {
        return next();
    }

    // db.Teacher.create(req.body.teacher, function(){

    // });

    // when i call next()...this is what happens
    // var teacher = new db.Teacher(req.body.teacher)
    // teacher.save(function(err,teacher){

    // })
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    console.log("pre saving!!");
        if (err) {
            return next(err);
        }
        bcrypt.hash(teacher.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            // define what the password is for the teacher
            teacher.password = hash;
            // everything looks good, let's save this!
            next();
        });
    });
});

// THIS IS DEFINING SCHEMA
// function Person(name){
//   this.name = name
// }

// THIS IS A CLASS METHOD (statics)
// Person.sayHi = function(){
//   return "hi"
// }

// THIS IS AN INSTANCE METHOD (methods)
// Person.prototype.sayGoodbye = function(){
//   return "goodbye"
// }

// var elie = new Person("elie")
// Person.sayHi()
// elie.sayGoodbye()



// don't want to call this first param "teacher"! We have another teacher defined!
// statics === CLASS METHODS
teacherSchema.statics.authenticate = function(formData, callback) {
    // this refers to the model!
    this.findOne({
            teachername: formData.teachername
        },
        function(err, teacher) {
            if (teacher === null) {
                callback("Invalid teachername or password", null);
            } else {
                teacher.checkPassword(formData.password, callback);
            }
        });
};

// in my app.js, when a teacher tries to log in
// submitting the "login" form...this will happen:
// db.Teacher.authenticate(req.body.teacher, function(err,teacher){

// })

// CREATE IS A CLASS METHOD!
// db.Teacher.create({});

// SAVE IS AN INSTANCE METHOD
// var teacher = new db.Teacher({email:"test@test.com"});
// teacher.save()

// methods === INSTANCE METHODS!
teacherSchema.methods.checkPassword = function(password, callback) {
    var teacher = this;
    bcrypt.compare(password, teacher.password, function(err, isMatch) {
        if (isMatch) {
            callback(null, teacher);
        } else {
            callback(err, null);
        }
    });
};

var Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
