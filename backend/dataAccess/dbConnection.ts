import mongoose from "mongoose";

const connection = (creds) => {
	const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true};
	// const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: "300000", connectTimeoutMS: "30000"};

	// const db = mongoose.connection;
	
	mongoose.connect( creds.devUrl , dbOptions);
	mongoose.set("useCreateIndex", true);
};

export {
	connection
};