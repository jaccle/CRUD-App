var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/attendance");

module.exports.Student = require("./student");
module.exports.Teacher = require("./teacher");
module.exports.Assignment = require("./assignment");
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/teacherportal");