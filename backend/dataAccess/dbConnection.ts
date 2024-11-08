import {config} from "../../apiKeys";

const connection = (creds) => {
	console.log("connecting to DB");

	console.log(creds);

	const mongoose = require("mongoose");
	const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: 300000, connectTimeoutMS: 30000};
	mongoose.connect( creds.devUrl , dbOptions);
	mongoose.set("useCreateIndex", true);
	const db = mongoose.connection;
	// l(db);
};

connection(config.dbCreds);

export {
	connection
};

//TODO: reconnect DB to CHESS table