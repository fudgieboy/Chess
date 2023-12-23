// import bcrypt from "bcryptjs";
// import uniqid from "uniqid";
// import mongoose from "mongoose";
 
// const UserSchema = new mongoose.Schema({
// 	memberID: {
// 		type: String,
// 		index: true
// 	},
// 	username: {
// 		type: String,
// 		index: false
// 	},
// 	registerDate: {
// 		type: Number,
// 		index: false
// 	},
// 	lastLoginDate: {
// 		type: Number,
// 		index: false
// 	},
// 	password: {
// 		type: String
// 	},
// 	email: {
// 		type: String
// 	},
// 	refreshToken: {
// 		type: String
//     },
//     accessToken: {
//         type: String
//     }
// });

// const UserModel = mongoose.model("User", UserSchema);

// const UserData = {
// 	comparePassword : function(candidatePassword, hash, callback){
// 		bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
// 			callback(err, isMatch);
// 		});
// 	},

// 	registerUser : function(newUser, callback){
// 		let user = UserModel(newUser);
// 		bcrypt.genSalt(10, function(err, salt) {
// 			bcrypt.hash(newUser.password, salt, function(err, hash) {
// 				user.password = hash;
// 				user.memberID = uniqid();
// 				user.registerDate = new Date().getTime();
// 				user.save();
// 				callback(null, user);
// 			});
// 		});
// 	},

// 	checkExistingUser : function(email, username, callback){
// 		console.log(email);
// 		console.log(username);
// 		UserModel.findOne({$or: [
// 			{email: email},
// 			{username: username}
// 		]}, callback);
// 	},

// 	getUserByEmail : function(email, callback){
// 		// console.log(validator.isEmail(email));
// 		UserModel.findOne({email: email}, callback);
// 	},

// 	getUserByUsername : function(username, callback){
// 		UserModel.findOne({username: username}, callback);
// 	}
// };

// export = {UserData};
