var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");
// var Parent = require("./post");
var db = require("./index");

var parentSchema = new mongoose.Schema({
	fullName: String,
	relationship: String,
	email: String,
	password: String,
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student"
	},
     phone: String,
     workPhone: String
});

//to delete children with parent
parentSchema.pre('remove', function(callback) {
    db.Parent.remove({
        parent: this._id
    }).exec();
    callback();
});



// var parentSchema = new mongoose.Schema({

// });

parentSchema.pre('save', function(next) {
    // the keyword this refers to the INSTANCE!
    // {
    //   email: "eschoppik@gmail.com",
    //   _id: ObjectId("382192389021839021")
    // }

    var parent = this;
    // if the password has not been changed, save the parent and move on...
    if (!parent.isModified('password')) {
        return next();
    }

    // db.Parent.create(req.body.parent, function(){

    // });

    // when i call next()...this is what happens
    // var parent = new db.Parent(req.body.parent)
    // parent.save(function(err,parent){

    // })
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    console.log("pre saving!!");
        if (err) {
            return next(err);
        }
        bcrypt.hash(parent.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            // define what the password is for the parent
            parent.password = hash;
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



// don't want to call this first param "parent"! We have another parent defined!
// statics === CLASS METHODS
parentSchema.statics.authenticate = function(formData, callback) {
    // this refers to the model!
    this.findOne({
            parentname: formData.parentname
        },
        function(err, parent) {
            if (parent === null) {
                callback("Invalid parentname or password", null);
            } else {
                parent.checkPassword(formData.password, callback);
            }
        });
};

// in my app.js, when a parent tries to log in
// submitting the "login" form...this will happen:
// db.Parent.authenticate(req.body.parent, function(err,parent){

// })

// CREATE IS A CLASS METHOD!
// db.Parent.create({});

// SAVE IS AN INSTANCE METHOD
// var parent = new db.Parent({email:"test@test.com"});
// parent.save()

// methods === INSTANCE METHODS!
parentSchema.methods.checkPassword = function(password, callback) {
    var parent = this;
    bcrypt.compare(password, parent.password, function(err, isMatch) {
        if (isMatch) {
            callback(null, parent);
        } else {
            callback(err, null);
        }
    });
};

var Parent = mongoose.model("Parent", parentSchema);

module.exports = Parent;
