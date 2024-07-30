// import Config from "config";
// import Routes from "./routes";
// import Server from "./common/server";

// const dbUrl = `mongodb://${Config.get("databaseHost")}:${Config.get(
//   "databasePort"
// )}/${Config.get("databaseName")}`;
// const server = new Server()
//   .router(Routes)
//   .configureSwagger(Config.get("swaggerDefinition"))
//   .handleError()
//   .configureDb(dbUrl)
//   .then((_server) => _server.listen(Config.get("port")));

// export default server;

// ****************************In case of mongo db uri *******************//
import Config from "config";
import mongoose from "mongoose";
import Routes from "./routes";
import Server from "./common/server";

const mongoURI = Config.get("mongoURI");


// Connect to MongoDB using mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");

  // Create an instance of the server
  const server = new Server()
    .router(Routes)
    .configureSwagger(Config.get("swaggerDefinition"))
    .handleError();
    
process.stdout.write("\x1b]2; Telegram Bot \x1b\x5c");




  // Start the server
  server.listen(Config.get("port"), () => {
    console.log(`Server is running on port ${Config.get("port")}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit with error if MongoDB connection fails
});





// ************ config file in case of localhost ******************//

// "port": 3002,
// "hostAddress": "",
// "databaseHost": "localhost",
// "databasePort": "27017",
// "databaseName": "telegramBot",
// "jwtsecret": "nodejwt",
// "jwtresetsecret": "nodejwt",
// "jwtOptions": {
//   "expiresIn": "24h"
// },