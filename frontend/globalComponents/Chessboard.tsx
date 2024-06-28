import React, { ReactElement, useState, useEffect} from "react";
import { v4 } from "uuid";
import Chesspiece from "./Pieces/Piece";
// import TodoListStore from "../stores/TodoListStore";
// import LocalStore from "../stores/LocalStore";
// import {getPieceFromType, PB} from "./Pieces/PieceTypes";
import Gamelogic from "../../shared/gamelogic";
import uniqid from 'uniqid';

let socket;
let WSHOST = window.location.host.split(":");
WSHOST = "ws://" + WSHOST[0] + ":" + "8081";

if(global.env !== "development") { 
  socket = new WebSocket(WSHOST, "protocolOne");
} else {
  socket = new WebSocket('ws://localhost:8081', "protocolOne");
}

socket.onopen = () => {
  console.log("socket opened on " + WSHOST);
  const content = { command: "getInitialState"};
  socket.send(JSON.stringify(content));
};


enum orientation {
  black= "down",
  white= "up"
}

const gamelogic = Gamelogic();

let users = [];
let rooms = [];

let initialPositions: Array<string[]> = [ 
  ["rook black", "knight black", "bishop black", "queen black", "king black", "bishop black", "knight black", "rook black"],
  ["pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white"],
  ["rook white", "knight white", "bishop white", "queen white", "king white", "bishop white", "knight white", "rook white"]
];

const Chessboard: React.FC = (): ReactElement => {

  const [delayedEvents, setDelayedEvents] = useState([]);

//pass a move uuid from the backend and a time.
  const intervalID = setInterval(() => { 
    for(let i = 0; i < delayedEvents.length; i ++){
      if (delayedEvents[i] && delayedEvents[i].command == "finishMove") {
        if(finishMoveLocal(delayedEvents[i].location, delayedEvents[i].target, delayedEvents[i].moveID, delayedEvents[i].newBoard )){
          delayedEvents[i] = null;       
        }
      }
    }

    clearInterval(intervalID);
  }, 50); //this is a hack to get the board to update when the store changes. I need to find a better way to do this
  
  useEffect(() => {
    socket.onmessage = (event) => {
      let data;
      let inputCommands;

      try{
        data =  event.data.toString();
        inputCommands = JSON.parse(data);
      }catch(error){
        console.log("error in json parsing");
      }
      
      if(inputCommands && inputCommands.command == "returnInitialState"){
        finishInitializtion(inputCommands.newBoard);
      } else if(inputCommands && inputCommands.command == "receiveMoves"){
        recieveMoves(inputCommands.movelist);
      } else if(inputCommands && inputCommands.command == "finishForeignMove"){
        finishForeignMove( inputCommands.location, inputCommands.target, inputCommands.moveID, inputCommands.newBoard);
      } else if (inputCommands && inputCommands.command == "finishMove") {
        setDelayedEvents([...delayedEvents, inputCommands] ); 
      } else if (inputCommands && inputCommands.command == "updateRoomList") {
        rooms = inputCommands.rooms;
        setRoomList(constructRoomList());
      } else if (inputCommands && inputCommands.command == "addRoom") {
      } else if (inputCommands && inputCommands.command == "removeRoom") {
      } else if (inputCommands && inputCommands.command == "addUser") {
        users = inputCommands.users;
        setUserList(constructUserList());
      } else if (inputCommands && inputCommands.command == "disconnectUser") {
        users = inputCommands.users;
        setUserList(constructUserList());
      }
    };
  }, []); //only run this on mount and unmount, not every render

  const whiteInCheck= false;
  const blackInCheck= false;

  const capturedWhite= [];
  const capturedBlack= [];
  
  const GRIDWIDTH = 8;
  let highlightActive = false;
  
  let moveList = [];

  const [userList, setUserList] = useState<JSX.Element[]>(
    constructUserList()
  );
  
  const [roomList, setRoomList] = useState<JSX.Element[]>(
    constructRoomList()
  );
  
  function joinRoom(e){
    const content = {command: "joinRoom", targetRoomID: e.currentTarget.id};
    socket.send(JSON.stringify(content));
  }

  function getRoomInfo(e){
    const content = {command: "getRequestedRoomInfo", targetRoomID: e.currentTarget.id};
    socket.send(JSON.stringify(content));
  }
  
  function constructRoomList() : JSX.Element[] {
    const list:JSX.Element[] = [];

    for(let k = 0; k < rooms.length; k++){
      list.push(<button id = {rooms[k]} 
        onClick = {(e)=>{
          joinRoom(e);
        }}
        onMouseEnter = {(e)=>{
          getRoomInfo(e);
        }} key = {uniqid()}>
          {rooms[k]}
      </button>);
    }

    return list;
  }
  
  function constructUserList() : JSX.Element[] {
    const list:JSX.Element[] = [];

    for(let k = 0; k < users.length; k++){
      list.push(<div key = {uniqid()}>
          <div >{users[k]}</div>
      </div>);
    }

    return list;
  }

  const [constructedBoard, setConstructedBoard] = useState<Array<ReactElement[]>>(
    constructPositions()
  );

  function constructPositions() : Array<ReactElement[]> {
    const positions: Array<ReactElement[]> = [];
    for(let i = 0; i < GRIDWIDTH; i ++){
      const arr:ReactElement[] = [];
      const even:string = (( i % 2 ) == 0 ? "even":"odd");
      const classes:string = "gridPosition " + even;
      for(let k = 0; k < GRIDWIDTH; k ++){
          const position = initialPositions[i][k];
          const split = position.split(" ");
          const piece = position.length != 0? 
          <Chesspiece boardPosition = {i + " " + k} pieceType = {split[0]} pieceColor = {split[1]} /> : null;
          arr.push(
          <div className = {classes}
            id = {i +" " + k}
            onDragEnter = {(e)=>{
              if(!highlightActive){
                // highlightActive = true;
                // e.currentTarget.classList.add("glow");
                const movingPiece = e.dataTransfer.getData("movingpiece");
                const targ = e.currentTarget.id;
                const orgCords = {x: movingPiece[0], y: movingPiece[2]};
                const targCoords = {x: targ[0], y: targ[2]};
                
                getValidMoves(orgCords);
              }
            }}
            onClick={()=>{
            }}
            onDragOver = {(e)=>{ 
              e.preventDefault(); //this is needed to allow the drop event to fire
            }}
            onDragLeave = {(e)=>{
              e.currentTarget.classList.remove("glow");
            }}
            onDrop = {(e)=>{
              // clearHighlightedSquares();
              e.preventDefault();
              e.currentTarget.classList.remove("glow");
              const movingPiece = e.dataTransfer.getData("movingpiece");
              movePiece(movingPiece, e.currentTarget.id);
              // console.log(e.currentTarget.id);
            }}
            key={i + " " + k}><div className = "pieceContainer">
                {piece}
              </div>
            </div>);
      }
      positions.push(arr);
    }
    return positions;
  }

  function finishForeignMove(currentLocation, targetLocation, moveID, newBoard){
    return finishMovePiece(currentLocation, targetLocation, moveID, newBoard);
  }

  function finishMoveLocal(currentLocation, targetLocation, moveID, newBoard){
    return finishMovePiece(currentLocation, targetLocation, moveID, newBoard);
  }

  const completedMoves = {};
  
  function movePiece(currentLocation, targetLocation){
    const moveTime:Date = new Date();

    const targetPos = {x: 0, y: 0};
    const currentPos = {x: 0, y: 0};

    targetPos.x = targetLocation[0];
    targetPos.y = targetLocation[2];

    currentPos.x = currentLocation[0];
    currentPos.y = currentLocation[2];

    if(currentPos.x === targetPos.x && currentPos.y === targetPos.y){
      return;
    }
    // setConstructedBoard(constructPositions()); 

    const content = {command: "movePiece", moveTime: moveTime, location: currentLocation, target: targetLocation};
    socket.send(JSON.stringify(content));
  }


  function finishInitializtion(newBoard){
    initialPositions = newBoard;
    setConstructedBoard(constructPositions());
  }

  function finishMovePiece(currentLocation, targetLocation, moveID, newBoard){ //probably should include pieceID
    
    if(completedMoves[moveID] == undefined || completedMoves[moveID] == false){

      const targetPos = {x: 0, y: 0}; 
      const currentPos = {x: 0, y: 0};

      targetPos.x = targetLocation[0];
      targetPos.y = targetLocation[2];

      currentPos.x = currentLocation[0];
      currentPos.y = currentLocation[2];

      // initialPositions[targetPos.x][targetPos.y] = initialPositions[currentPos.x][currentPos.y];
      initialPositions = newBoard;

      completedMoves[moveID] = true;
      setConstructedBoard(constructPositions());
      return true;
    }
    return false;
  }
  

  function recieveMoves(validMoves){
    // validMoves.forEach((i)=>{
    //   const el = document.getElementById( i.x  + " " + i.y );
    //   el.classList.add("moveglow");
    // });
  }

  const clearHighlightedSquares = () => {
    for(let i = 0; i < GRIDWIDTH; i ++){
      for(let k = 0; k < GRIDWIDTH; k ++){
        const el = document.getElementById( i + " " + k );
        el.classList.remove("moveglow");
          
      }
    }
  };

  // const getPieceFromCoords( org: {x: number, y: number} ){
  //   const piece = initialPositions[org.y][org.x];
  // };
  
  // const getPieceIDFromCoords( org: {x: number, y: number} ){
  //   const piece = initialPositions[org.y][org.x];
  // };

  const getValidMoves = (currentLocation) => {
    const content = {command: "getValidMoves", location: currentLocation};
    socket.send(JSON.stringify(content));
  };

  return (
    <div id = "board">
        {/* <div className= "capturedWhite captured">
          {capturedWhite}
        </div> */}
        <div id ="innercontainer">
          {constructedBoard}
        </div>
        <div id = "roomTitle">Open Rooms:</div>
        <div id = "userlist">{userList}</div>
        <div id = "roomlist">{roomList}</div>
        {/* <div className= "capturedBlack captured">
          {capturedBlack}
        </div> */}
    </div>
  );
};

export default Chessboard;

Chessboard.displayName = "Chessboard";
