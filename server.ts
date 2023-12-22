import {config} from "./apiKeys";
import express from "express";
import path from "path";
import colors from "colors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import * as jwtHelper from "./backend/utils/jwtHelper";
import utils from "./backend/utils/misc";
import ejs from "ejs";
import Gamelogic from './shared/gamelogic';
import {createServer} from 'http';
import {v4} from 'uuid';
import {WebSocketServer} from 'ws';
import {connection} from "./backend/dataAccess/dbConnection";
const uniqid = require("uniqid");

import listRoutes from "./backend/list/listRoutes";
import userRoutes from "./backend/users/userRoutes";

const {n} = utils;

const winston = require('winston');
const port = 8080;

const WSPORT = 8081;

console.log(`***WS port on ${WSPORT + 1}`);
console.log(`***WS port is ${typeof(WSPORT)}`);

type userString = string;
type roomString = string;

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

connection(config.dbCreds);

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

  !n(encodedToken)? req.userToken = jwtHelper.verifyLoginToken(encodedToken):null;
 
  next();
});

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
 

app.use(listRoutes);
app.use(userRoutes);

console.log("starting app...");

const ip = dev ? "localhost":"0.0.0.0";

app.listen(port, ip, () => {
  console.log(colors.yellow(`Listening to app on ${port} in ${curEnv} mode`));
});

const gamelogic = Gamelogic();
 
const userIDs = {};
let numPlayers = 0;
// const waitingUsers = {};

const updateAllInRoom = (ws, userIDs, action) => {
  wss.clients.forEach( (client) => {
    if(ws['userid'] != client['userid'] && userIDs.includes(client['userid'])){
      client.send(action);
    }
  });
};

const updateAllExcept = (ws, action) => {
  wss.clients.forEach( (client) => {
    if(ws!=client){
      client.send(action);
    }
  });
};

const resendUserList = () => {
  wss.clients.forEach( (client) => {
    client.send(JSON.stringify({command: "addUser", users: userIDs}));
  });
};

// class PlayerManager{

// }


class Room{
  constructor(userID:userString){
    this.ownerID = userID;
    this.gameID = uniqid();
    this.players = [];
    this.players.push(userID);
    this.spectators = [];
    this.game = Gamelogic();
  }

  addPlayer = (playerID) => {
    this.players.push(playerID);
  }

  addSpectator = (playerID) => {
    this.spectators.push(playerID);
  }


  //check if remaining player is not owner. if not owner set owner to someone else
  removePlayer = (playerID) => {
    for(let i = 0; i < this.players.length;i++){
      if(this.players[i] == playerID){
        this.players.splice(i, 1);
      }
    }
  }

  removeSpectator = (playerID) => {
    for(let i = 0; i < this.spectators.length;i++){
      if(this.spectators[i] == playerID){
        this.spectators.splice(i, 1);
      }
    }
  }

  getBasicBoard = () => {
    return this.game.getBasicBoard();
  }

  getConstructedGrid = () => {
    return this.game.getConstructedGrid();
  }

  getValidMoves = (location) => {
    return this.game.getValidMoves(location, (val, newMoves)=>{

      newMoves.push(val);
      return newMoves;
    }, {noStop: false, pinCheck: true});
  }

  movePiece = (moveData) => {
    return this.game.movePiece(moveData);
  }

  resetGame = () => {
    this.game.resetGame();
  }

  getGameID = () :roomString => {
    return this.gameID;
  }

  getOwnerID = () :userString => {
    return this.gameID;
  }

  ownerID:userString;
  gameID:roomString;
  players = [];
  spectators = [];
  game = null; 
}
class RoomManager{
  constructor(){
    this.rooms = {};  
  }

  findAvailableMatch = (userID:userString):roomString =>{
    let room = this.searchRooms(userID);
    
    if(room == null){
      this.addUserAsSpectator(room, userID);
    } else {
      this.addUserToRoom(room, userID);
    } 
    return room.getGameID();
  }


  searchRooms = (userID) => {
    for (const roomID in this.rooms) {
      const room = this.rooms[roomID];

      if (room.players.length < 2) {
       return room;
      }
    }
    return null;
  }

  removeUserFromRoom = (roomID:roomString, userID:userString) => {
    const room = this.rooms[roomID];

    if (room) {
      room.removePlayer(userID);
    }

    //should call destroy room function
    if(room.players.length == 0){
      delete this.rooms[roomID];
      this.numRooms = this.numRooms-1;
    }
    //check if room is empty. if so, delete the room
  }

  addUserToRoom = (room, userID:userString) => {
    if (room) {
      if (room.players.length < 2) {
        room.addPlayer(userID);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  addUserAsSpectator = (roomID:roomString, userID:userString):boolean => {
    const room = this.rooms[roomID];
    if (room) {
      room.addSpectator(userID);
      return true;
    } else {
      return false;
    }
  }
  
  movePiece = (roomID, userID, moveData) => {
    return {result: this.rooms[roomID].movePiece(moveData), users: this.rooms[roomID].players};
  };

  getValidMoves = (roomID, userID, location) => {
    return this.rooms[roomID].getValidMoves(location);
  };

  getConstructedGrid = (roomID, userID) => {

  };

  getBasicBoard = (roomID, userID) => {
    return this.rooms[roomID].getBasicBoard();
  };

  createRoom = (playerID) => {
    let pid;
  
    if(pid == undefined || pid == null){
      pid = playerID;
    } else {
      pid = null;
    }
    
    const room = new Room( pid );

    this.rooms[room.getGameID()] = room;
    this.numRooms = this.numRooms+1;

    return room.getGameID();
  };

  rooms = {};
  numRooms = 0;
}

const roomManager = new RoomManager();

wss.on('connection', function connection(ws) {
  let newID = uniqid();
  ws['userid'] =  newID;

  userIDs[newID] = newID;

  numPlayers = numPlayers+1;
  resendUserList();


  if(numPlayers % 2 == 1){
    ws['room'] = roomManager.createRoom(newID);

  } else { 
    ws['room'] = roomManager.findAvailableMatch(newID);

  } 
   
  ws.binaryType = 'arraybuffer';
  ws.send(JSON.stringify({command: "initUser", newUserID: v4()}));

  ws.onclose = () => {
    setTimeout(() => {
        ws.terminate();
        console.log("disconnecting user " + ws['userid']);
    }, 500);
      
    const curSize = wss.clients.size;
    if(curSize < 2){
      console.log("game reset");
      gamelogic.resetGame();
      ws.send(JSON.stringify({command: "resetGame"}));
    }
    
    roomManager.removeUserFromRoom(ws['room'], ws['userid']);
    userIDs[ ws['userid']] = null;
    delete userIDs[ ws['userid']];
    numPlayers = numPlayers-1;
    resendUserList(); 
  };


  

  ws.on('message', function message(data) {

    const inputCommands = JSON.parse(data.toString());

    if(inputCommands.command == "getInitialState"){
      ws.send(JSON.stringify({command: "returnInitialState", newBoard: roomManager.getBasicBoard(ws['room'], ws['userid'])}));
    }

    if(inputCommands.command == "getValidMoves"){
      const moves = roomManager.getValidMoves( ws['room'], ws['userid'], inputCommands.location);
      ws.send(JSON.stringify({command: "receiveMoves", movelist: moves}));
    }
    
    if(inputCommands.command == "movePiece"){
      const moveTime = new Date(inputCommands.moveTime);
      const moveData = {
              location: inputCommands.location, 
              target: inputCommands.target, 
              moveTime: moveTime
      };
      
      const move = roomManager.movePiece(ws['room'], ws['userid'], moveData);
      const gameResponse = move.result;
      const users = move.users;

      if(gameResponse.completed == true){ 
        // authoritatively respond with newboard
        ws.send(JSON.stringify({command: "finishMove", completeTime: new Date(), moveID: v4(), newBoard: gameResponse.newBoard, location: inputCommands.location, target: inputCommands.target}));
        
        updateAllInRoom(ws, users, JSON.stringify({command: "finishForeignMove", newBoard: gameResponse.newBoard, completeTime: new Date(), moveID: v4(), location: inputCommands.location, target: inputCommands.target}));
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