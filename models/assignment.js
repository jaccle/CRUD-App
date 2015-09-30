var mongoose = require('mongoose');

var assignmentSchema = new mongoose.Schema({
	grades: Array,//index number student.number, 
	//index number corresponds to student in students field array below
	//to keep index number relevant to student info, set a default to reset grades if student is deleted
	name: String,
	standards: Array, //of references
	students: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Student"
            }]
});

var Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;