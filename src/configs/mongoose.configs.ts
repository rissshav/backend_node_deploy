import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGODB_URI as string, {
    dbName: process.env.DBNAME
  })
  .then(() => { console.log("Mongodb connected to " + process.env.MONGODB_URI) })
  .catch((err: any) => console.log(err));

// mongoose.Promise=Promise;
// mongoose.connect(process.env.MONGODB_URI as string,{useNewUrlParser: true }
// );
// mongoose.connection.on('error',(error:Error)=>console.log(error))

mongoose.connection.on("connected", function () {
  console.info("connected to " + process.env.DBNAME);
});

// If the connection throws an error
mongoose.connection.on("error", function (err: any) {
  console.info("DB connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.info("DB connection disconnected");
}); 

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});