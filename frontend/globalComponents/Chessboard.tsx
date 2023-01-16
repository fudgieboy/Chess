import React, { ReactElement, useState } from "react";
import { v4 } from "uuid";
import Chesspiece from "./Pieces/Piece";
import TodoListStore from "../stores/TodoListStore";
import LocalStore from "../stores/LocalStore";
import {getPieceFromType, PB} from "./Pieces/PieceTypes";
import Gamelogic from "../../shared/gamelogic";
//https://www.npmjs.com/package/react-chess-pieces

const socket = new WebSocket('ws://localhost:8081', "protocolOne");

enum orientation {
  black= "down",
  white= "up"
}

// const gamelogic = Gamelogic();
  
const currentPositions: Array<string[]> = [
  ["rook black", "knight black", "bishop black", "queen black" , "king black", "bishop black", "knight black", "rook black"],
  ["pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black", "pawn black"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "queen black", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white", "pawn white"],
  ["rook white", "knight white", "bishop white", "queen white", "king white", "bishop white", "knight white", "rook white"]
];

const Chessboard: React.FC = (): ReactElement => {
  socket.onmessage = (event) => {
    let data;
    let inputCommands;

    console.log("receive message");
    console.log(event.data);

    try{
      data =  event.data.toString();
      inputCommands = JSON.parse(data);
    }catch(error){
      console.log("error in json parsing");
    }
    
    if(inputCommands && inputCommands.command == "receiveMoves"){
      recieveMoves(inputCommands.movelist);
    } else if(inputCommands && inputCommands.command == "finishForeignMove"){
      console.log("finishForeignMove");
      finishForeignMove( inputCommands.location, inputCommands.target);
    } else if (inputCommands && inputCommands.command == "finishMove") {
      console.log("finishMove");
      finishMoveLocal( inputCommands.location, inputCommands.target );
    }
  };

  const whiteInCheck= false;
  const blackInCheck= false;
  
  const GRIDWIDTH = 8;
  let highlightActive = false;
  

  const [constructedBoard, setConstructedBoard] = useState<Array<ReactElement[]>>(
    constructPositions()
  );

  function constructPositions() : Array<ReactElement[]> {
    console.trace();
    console.log("constructPositions");
    const positions: Array<ReactElement[]> = [];
    for(let i = 0; i < GRIDWIDTH; i ++){
      const arr:ReactElement[] = [];
      const even:string = (( i % 2 ) == 0 ? "even":"odd");
      const classes:string = "gridPosition " + even;
      for(let k = 0; k < GRIDWIDTH; k ++){
          const position = currentPositions[i][k];
          const split = position.split(" ");
          const piece = position.length != 0? 
          <Chesspiece boardPosition = {i + " " + k} pieceType = {split[0]} pieceColor = {split[1]} /> : null;
          arr.push(
          <div className = {classes}
            id = {i +" " + k}
            onDragEnter = {(e)=>{
              if(!highlightActive){
                highlightActive = true;
                e.currentTarget.classList.add("glow");
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
              console.log('drop');
              clearHighlightedSquares();
              e.preventDefault();
              e.currentTarget.classList.remove("glow");
              const movingPiece = e.dataTransfer.getData("movingpiece");
              movePiece(movingPiece, e.currentTarget.id);
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

  function finishForeignMove(currentLocation, targetLocation){
    finishMovePiece(currentLocation, targetLocation);
  }

  function finishMoveLocal(currentLocation, targetLocation){
    finishMovePiece(currentLocation, targetLocation);
  }
  
  function finishMovePiece(currentLocation, targetLocation){ //probably should include pieceID
      const targetPos = {x: 0, y: 0};
      const currentPos = {x: 0, y: 0};

      targetPos.x = targetLocation[0];
      targetPos.y = targetLocation[2];

      currentPos.x = currentLocation[0];
      currentPos.y = currentLocation[2];

      currentPositions[targetPos.x][targetPos.y] = currentPositions[currentPos.x][currentPos.y];
      currentPositions[currentPos.x][currentPos.y] = ""; 
      setConstructedBoard(constructPositions());
  }
  
  function movePiece(currentLocation, targetLocation){ 
    console.log("movePiece");
    const moveTime:Date = new Date();

    const targetPos = {x: 0, y: 0};
    const currentPos = {x: 0, y: 0};

    targetPos.x = targetLocation[0];
    targetPos.y = targetLocation[2];

    currentPos.x = currentLocation[0];
    currentPos.y = currentLocation[2];

    if(currentPos.x === targetPos.x && currentPos.y === targetPos.y){
      console.log("piece not moved");
      return;
    }

    // currentPositions[targetPos.x][targetPos.y] = currentPositions[currentPos.x][currentPos.y];
    // currentPositions[currentPos.x][currentPos.y] = "";
    
    // setConstructedBoard(constructPositions()); 

    const content = {command: "movePiece", moveTime: moveTime, location: currentLocation, target: targetLocation};
    socket.send(JSON.stringify(content));
  }

  function recieveMoves(validMoves){
    currentHighlightedSpaces = validMoves;

    validMoves.forEach((i)=>{
      const el = document.getElementById( i.x  + " " + i.y );
      el.classList.add("moveglow");
    });
  }

  let currentHighlightedSpaces = [];

  const clearHighlightedSquares = () => {
    console.log("clearHighlightedSquares");
    highlightActive = false;
    currentHighlightedSpaces.forEach((i)=>{
      let el = document.getElementById( i.x  + " " + i.y );
      el.classList.remove("moveglow");
    });
  };

  // const getPieceFromCoords( org: {x: number, y: number} ){
  //   const piece = currentPositions[org.y][org.x];
  // };
  
  // const getPieceIDFromCoords( org: {x: number, y: number} ){
  //   const piece = currentPositions[org.y][org.x];
  // };

  const getValidMoves = (currentLocation) => {
    console.log("getting valid moves");
    const content = {command: "getValidMoves", location: currentLocation};
    socket.send(JSON.stringify(content));
  };

  return (
    <div id = "board">
        <div id ="innercontainer">
          {constructedBoard}
        </div>
    </div>
  );
};

export default Chessboard;

Chessboard.displayName = "Chessboard";
