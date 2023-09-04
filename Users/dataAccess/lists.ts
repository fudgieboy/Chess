// import utils = require("../utils/misc");
// const mongoose = require("mongoose");
// const uniqid = require("uniqid");

// const ListSchema = new mongoose.Schema({
// 	memberID: {
// 		type: String,
// 		index: true
// 	},
// 	listID: {
// 		type: String,
// 		index: false
// 	},
// 	creationDate: {
// 		type: Number,
// 		index: false
// 	},
// 	list: {
// 		type: Array,
// 		index: false
// 	}
// });

// const ListData = mongoose.model("List", ListSchema);

// ListData.getListbyUserId = function(memberID, callback){
// 	utils.l(memberID);
// 	ListData.findOne({ memberID: memberID}, callback);
// };

// ListData.updateList = function(memberID, inputData, callback){
// 	inputData.listID = uniqid();
// 	ListData.findOneAndUpdate( { memberID : memberID }, inputData, { upsert : true }, callback );
// 	// List.updateOne( { memberID : memberID }, listData, { upsert : true }, callback );
// };


// export = ListData;