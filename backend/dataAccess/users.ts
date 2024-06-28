import bcrypt from "bcryptjs";
import uniqid from "uniqid";
import {Schema, model} from "mongoose";
interface User {
	name: string;
	memberID: string;
	publicID: string;
	registerDate: string;
	password: string;
	email: string;
	friendRequests: Array<string>;
	friends: Array<string>;
	outgoingFriendRequests: Array<string>;
	username: string;
	// lastLoginDate: string;
	// refreshToken: string;
    // accessToken: string;
  }
  
  // Schema
  const UserSchema = new Schema<User>({
	name: { type: String, required: false },
	memberID: { type: String, required: true },
	publicID: { type: String, required: true },
	registerDate: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	username: { type: String, required: true },
	friends: { type: Array, required: true },
	friendRequests: { type: Array, required: true },
	outgoingFriendRequests: { type: Array, required: true },
	// refreshToken: { type: String, required: true },
	// accessToken: { type: String, required: true },
  });

const UserModel = model("Users", UserSchema);

const UserData = {
	comparePassword : function(candidatePassword, hash, callback){
		bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
			callback(err, isMatch);
		});
	},

	registerUser : function(newUser, callback){
		const user = new UserModel(newUser);
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newUser.password, salt, function(err, hash) {

				console.log("newUser");				
				console.log(newUser);				
				
				user.password = hash;
				user.username = newUser.username;
				user.name = newUser.name;
				user.email = newUser.email;
				user.memberID = uniqid();
				user.publicID = uniqid();
				user.registerDate = new Date().getTime();
				user.save();
				callback(null, user);
			});
		});
	},

	checkExistingUser : function(email, username, callback){
		console.log(email);
		console.log(username);
		UserModel.findOne({$or: [
			{email: email},
			{username: username}
		]}, callback);
	},

	getUserByEmail : function(email, callback){
		// console.log(validator.isEmail(email));
		UserModel.findOne({email: email}, callback);
	},

	getUserByUsername : function(username, callback){
		UserModel.findOne({username: username}, callback);
	}
};

export default UserData;
