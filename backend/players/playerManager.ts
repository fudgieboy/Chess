const uniqid = require("uniqid");

//TODO save player data to database

class Player{
  // constructor(userID:userString){
  //   this.ownerID = userID;
  //   this.gameID = uniqid();
  //   this.players = [];
  //   this.players.push(userID);
  //   this.spectators = [];
  //   this.game = Gamelogic();
  // }

  // addPlayer = (playerID) => {
  //   this.players.push(playerID);
  // }

  // addSpectator = (playerID) => {
  //   this.spectators.push(playerID);
  // }


  // //check if remaining player is not owner. if not owner set owner to someone else
  // removePlayer = (playerID) => {
  //   for(let i = 0; i < this.players.length;i++){
  //     if(this.players[i] == playerID){
  //       this.players.splice(i, 1);
  //     }
  //   }
  // }

  // removeSpectator = (playerID) => {
  //   for(let i = 0; i < this.spectators.length;i++){
  //     if(this.spectators[i] == playerID){
  //       this.spectators.splice(i, 1);
  //     }
  //   }
  // }

  // getBasicBoard = () => {
  //   return this.game.getBasicBoard();
  // }

  // getConstructedGrid = () => {
  //   return this.game.getConstructedGrid();
  // }

  // getValidMoves = (location) => {
  //   return this.game.getValidMoves(location, (val, newMoves)=>{

  //     newMoves.push(val);
  //     return newMoves;
  //   }, {noStop: false, pinCheck: true});
  // }

  // movePiece = (moveData) => {
  //   return this.game.movePiece(moveData);
  // }

  // resetGame = () => {
  //   this.game.resetGame();
  // }

  // getRoomID = () :roomString => {
  //   return this.gameID;
  // }

  // getOwnerID = () :userString => {
  //   return this.gameID;
  // }

  // ownerID:userString;
  // gameID:roomString;
  // players = [];
  // spectators = [];
  // game = null; 
}

class PlayerManager{
  // constructor(){
  //   this.rooms = {};  
  // }

  // findAvailableMatch = (userID:userString):roomString =>{
  //   const room = this.searchRooms(userID);
    
  //   if(room == null){
  //     this.addUserAsSpectator(room, userID);
  //   } else {
  //     this.addUserToRoom(room, userID);
  //   } 
  //   return room.getRoomID();
  // }


  // searchRooms = (userID) => {
  //   for (const roomID in this.rooms) {
  //     const room = this.rooms[roomID];

  //     if (room.players.length < 2) {
  //      return room;
  //     }
  //   }
  //   return null;
  // }

  // removeUserFromRoom = (roomID:roomString, userID:userString) => {
  //   const room = this.rooms[roomID];

  //   if (room) {
  //     room.removePlayer(userID);
  //     console.log(room);
  //   }

    
  //   //should call destroy room function
  //   if(room.players.length == 0){
  //     delete this.rooms[roomID];
  //     this.numRooms = this.numRooms-1;
  //   }
  //   //check if room is empty. if so, delete the room
  // }

  // addUserToRoom = (room, userID:userString) => {
  //   if (room) {
  //     if (room.players.length < 2) {
  //       room.addPlayer(userID);

  //       console.log(room);

  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  // addUserAsSpectator = (roomID:roomString, userID:userString):boolean => {
  //   const room = this.rooms[roomID];
  //   if (room) {
  //     room.addSpectator(userID);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  
  // movePiece = (roomID, userID, moveData) => {
  //   return {result: this.rooms[roomID].movePiece(moveData), users: this.rooms[roomID].players};
  // };

  // getValidMoves = (roomID, userID, location) => {
  //   return this.rooms[roomID].getValidMoves(location);
  // };

  // getConstructedGrid = (roomID, userID) => {

  // };

  // getBasicBoard = (roomID, userID) => {
  //   return this.rooms[roomID].getBasicBoard();
  // };

  // createRoom = (playerID) => {
  //   let pid;
  
  //   if(pid == undefined || pid == null){
  //     pid = playerID;
  //   } else {
  //     pid = null;
  //   }
    
  //   const room = new Room( pid );

  //   this.rooms[room.getRoomID()] = room;
  //   this.numRooms = this.numRooms+1;

  //   return room.getRoomID();
  // };

  // rooms = {};
  // numRooms = 0;
}

export {
  PlayerManager,
};