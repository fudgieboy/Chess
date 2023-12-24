import {config} from "./apiKeys";
import express from "express";
import path from "path";
import colors from "colors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import * as jwtHelper from "./backend/utils/jwtHelper";
import * as utils from "./backend/utils/misc";
import ejs from "ejs";
import Gamelogic from './shared/gamelogic';
import {createServer} from 'http';
import {v4} from 'uuid';
import {WebSocketServer} from 'ws';
const winston = require('winston');
const port = 8080;

const WSPORT = 8081;

console.log(`***WS port on ${WSPORT + 1}`);
console.log(`***WS port is ${typeof(WSPORT)}`);

const logConfiguration = {
  'transports': [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/mainLog.txt'
      })
  ]
};

const slogConfiguration = {
  'transports': [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/socketMessages.txt'
      })
  ]
};

const slogger = winston.createLogger(slogConfiguration);
const logger = winston.createLogger(logConfiguration);

const app = express();
const server = createServer();
const wss = new WebSocketServer({ port: WSPORT });

require("@babel/register")({extensions: [".js", ".ts"]});

const curEnv = config.curEnv;
const dev = (curEnv === "development");
require("pretty-error").start();

// connection(config.dbCreds);

app.use(cookieParser(config.cookieSecret, { httpOnly: true })); 
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

ejs.delimiter = "?";
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "build/dist"))); //don't remove this, needed fir /dist files
app.use(express.static("build/dist"));

app.use(function(req, res, next) {
  if(dev){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  } 
  
  // res.header("Content-Type", "text/javascript");
  next();
}); 

app.use(function(req, res, next) {
  const encodedToken = req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  // !utils.n(encodedToken)? req.userToken = jwtHelper.verifyLoginToken(encodedToken):null;
 
  next();
});

console.log("curEnv: " + curEnv);

let dirPrefix = "build/";
if(curEnv == "production"){
  dirPrefix = "";
}

app.get("/", (req,res) => {

  // const message = {header: req.header, body: req.body, query: req.query, cookies: req.cookies, userToken: req.userToken, curEnv: curEnv, ip: req.socket.remoteAddress};

  // logger.log({
  //   message: message,
  //   level: 'info'
  // });

  res.render(path.resolve(__dirname, dirPrefix + "dist", "index.ejs"), {
    socketPort: WSPORT
  });
}); 
 
console.log("starting app...");

// const address = (config.curEnv == "production")? '3.232.19.78': '127.0.0.1';

app.listen(port, () => {
  console.log(colors.yellow(`Listening to app on ${port} in ${curEnv} mode`));
});

const gamelogic = Gamelogic();

wss.on('connection', function connection(ws) {

  ws.binaryType = 'arraybuffer';
  ws.send(JSON.stringify({command: "initUser", newUserID: v4()}));

  ws.onclose = () => {

    setTimeout(() => {
        ws.terminate();
        console.log("terminating");
    }, 500);
      
    let curSize = wss.clients.size;
    if(curSize < 2){
      console.log("game reset");
      gamelogic.resetGame();
      ws.send(JSON.stringify({command: "resetGame"}));
    }
    
    wss.clients.forEach( (client) => {
      if(ws!=client){
          client.send("closed");
      }
    });
  };

  ws.on('message', function message(data) {

    // slogger.log({
    //   message: data.toString(),
    //   level: 'info'
    // });
    
    const inputCommands = JSON.parse(data.toString());

    if(inputCommands.command == "getValidMoves"){
      const moves = gamelogic.getValidMoves(inputCommands.location, (val, newMoves)=>{

        newMoves.push(val);
        return newMoves;
      }, {noStop: false, pinCheck: true});
      ws.send(JSON.stringify({command: "receiveMoves", movelist: moves}));
    }
    
    if(inputCommands.command == "movePiece"){
      const moveTime = new Date(inputCommands.moveTime);
      const moveData = {
              location: inputCommands.location, 
              target: inputCommands.target, 
              moveTime: moveTime
      };
      
      const gameResponse = gamelogic.movePiece(moveData);

      if(gameResponse.completed == true){ 
        // authoritatively respond with newboard

        ws.send(JSON.stringify({command: "finishMove", completeTime: new Date(), moveID: v4(), newBoard: gameResponse.newBoard, location: inputCommands.location, target: inputCommands.target}));
        wss.clients.forEach( (client) => {
          if(ws!=client){
            client.send(JSON.stringify({command: "finishForeignMove", newBoard: gameResponse.newBoard, completeTime: new Date(), moveID: v4(), location: inputCommands.location, target: inputCommands.target}));
          }
        });
      } else {
        //error in moving piece 
        // ws.send(JSON.stringify({command: "finishMove", completeTime: new Date(), moveID: v4(), location: inputCommands.location, target: inputCommands.target}));

        // wss.clients.forEach( (client) => {
        //   if(ws!=client){
        //     client.send(JSON.stringify({command: "finishForeignMove", location: inputCommands.location, target: inputCommands.target}));
        //   }
        // }); {

      }
    }
  });

  ws.send('connection initialized');
});

export {};