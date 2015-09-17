var mongoose = require("mongoose");


var studentNumber = 1;

var studentSchema = new mongoose.Schema({
                   firstName: String,
                   lastName: String,
                   nickName: String,
                   gender: String,
                   number: Number,
                   age: Number,
                   birthday: String,
                   allergies: String,
                   other: String,
                   teacher: String,
                   grades: [{
                     assignment: String,
                     grade: String
                    }]
                  });


var Student = mongoose.model("Student", studentSchema);

module.exports = Student;
