var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/attendance");

module.exports.Student = require("./student");