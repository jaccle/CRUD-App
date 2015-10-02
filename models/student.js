var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");
// var Student = require("./post");
var db = require("./index");


var studentSchema = new mongoose.Schema({
                   firstName: String,
                   lastName: String,
                   nickName: String,
                   gender: String,
                   number: Number,
                   grade: String,
                   birthday: String,
                   allergies: String,
                   other: String,
                   email: String,
                   password: String,
                   // attendance: Boolean, //default new Date() //String?
                   teacher: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Teacher"
                    },
                   assignments: [{
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Assignment"
                    }],
                   parent1: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Parent"
                    },
                    parent2: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Parent"
                    },
                    emergency: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "Parent"
                    }
                  });

//can view all assignments, edit assignments from there
//side bar to show students, can see assignments there, button to edit grade field
//can have note field added to grades as well
//add link to grade page

//can make report cards
//can make inputs so student can customize input dropdown
//notes off to side

//to delete children with parent
studentSchema.pre('remove', function(callback) {
    db.Student.remove({
        student: this._id
    }).exec();
    callback();
});



// var studentSchema = new mongoose.Schema({

// });

studentSchema.pre('save', function(next) {
    // the keyword this refers to the INSTANCE!
    // {
    //   email: "eschoppik@gmail.com",
    //   _id: ObjectId("382192389021839021")
    // }

    var student = this;
    // if the password has not been changed, save the student and move on...
    if (!student.isModified('password')) {
        return next();
    }

    // db.Student.create(req.body.student, function(){

    // });

    // when i call next()...this is what happens
    // var student = new db.Student(req.body.student)
    // student.save(function(err,student){

    // })
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        console.log('bcrypt salt running');
        if (err) {
            console.log('if(err)', err);
            return next(err);
        }
        bcrypt.hash(student.password, salt, function(err, hash) {
          if (err) {
            console.log('hash student password, if(err)', err);
            return next(err);
          }
            // define what the password is for the student

            // student.password = hash;
          console.log(student.password);
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



// don't want to call this first param "student"! We have another student defined!
// statics === CLASS METHODS
studentSchema.statics.authenticate = function(formData, callback) {
    // this refers to the model!
    this.findOne({
            studentname: formData.studentname
        },
        function(err, student) {
            if (student === null) {
                callback("Invalid studentname or password", null);
            } else {
                student.checkPassword(formData.password, callback);
            }
        });
};

// in my app.js, when a student tries to log in
// submitting the "login" form...this will happen:
// db.Student.authenticate(req.body.student, function(err,student){

// })

// CREATE IS A CLASS METHOD!
// db.Student.create({});

// SAVE IS AN INSTANCE METHOD
// var student = new db.Student({email:"test@test.com"});
// student.save()

// methods === INSTANCE METHODS!
studentSchema.methods.checkPassword = function(password, callback) {
    var student = this;
    bcrypt.compare(password, student.password, function(err, isMatch) {
        if (isMatch) {
            callback(null, student);
        } else {
            callback(err, null);
        }
    });
};

var Student = mongoose.model("Student", studentSchema);

module.exports = Student;

