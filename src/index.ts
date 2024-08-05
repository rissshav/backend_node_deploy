import express, { Application } from "express";
import bodyParser from "body-parser";

import morgan from "morgan";
// import swaggerUi from "swagger-ui-express";
import { serve, setup } from "swagger-ui-express";
import { bootstrapAdmin } from "./utils/bootstrap.util";
import Routes from "./routes";

import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
//import socketIo from "./socket.io/index.socket.io"

// let swaggerDoc = require('../public/swagger/swagger.json')
// dotenv.config();
dotenv.config({ path: path.join(__dirname, '..', '.env') })
// connect to mongodb
require("./configs/mongoose.configs");

const PORT = process.env.PORT || 8002;

const app: Application = express();
const server = require('http').createServer(app);
//const http = require('http').Server(app);

// const io = socketIo(require('socket.io')(server, { cors:{
//   origin:'*'
// } }));
// app.set('io', io)

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", 1);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,authtoken"
  );
  next();
});

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname,'..','/public')));

// cron.schedule('*/2 * * * *', async () =>{
//   await axios.get('https://bharatbit-apis.zip2box.com/api/user/liveprice').then((res) => {
//     console.log(res.data, "res")
//   }).catch((err) => {
//     console.log(err, "err")
//   })
// })

// cron.schedule('*/2 * * * *', async () =>{
//   await axios.get(`${process.env.BASE_URL}api/user/liveprice`).then((res) => {
//     console.log(res.data, "res")
//   }).catch((err) => {
//     console.log(err, "err")
//   })
// })



// cron.schedule('0 0 0 * * *', async () => {
//   await axios.get('https://bharatbit-apis.zip2box.com/api/user/expireoffer').then((res) => {
//     console.log(res.data, "res")
//   }).catch((err) => {
//     console.log(err, "err")
//   })
// });

// app.use(
//   '/swagger',
//   serve,
//   setup(swaggerDoc)
// )

app.use(
  "/swagger",
  serve,
  setup(undefined, {
    swaggerOptions: {
      url: "/swagger/swagger.json",
    },
  })
);

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api", Routes);
bootstrapAdmin(() => {
  console.log("Bootstraping finished!");
});

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  console.log("swagger link ", `localhost:${PORT}/swagger`);
});

//"mongodb+srv://mahabharat_usr:3q0512nje4Jl9b7Q@mahabharatdb-230e5dc3.mongo.ondigitalocean.com"