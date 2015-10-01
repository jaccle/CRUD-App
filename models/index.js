var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/attendance");

module.exports.Student = require("./student");
module.exports.Teacher = require("./teacher");
module.exports.Assignment = require("./assignment");
module.exports.Parent = require("./parent");