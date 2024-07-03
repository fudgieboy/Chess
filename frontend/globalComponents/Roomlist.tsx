import React, { ReactElement, useState, useEffect, useRef} from "react";
import uniqid from 'uniqid';
import Room from "./Room";

interface RoomlistProps {
  joinRoom: ()=>void;
  getRoomInfo: ()=>void;
  updateRoomName: (newVal, i)=>void;
  rooms: string[];
}

const Roomlist: React.FC<RoomlistProps> = (props:RoomlistProps): ReactElement => {
  const rooms = props.rooms;
  let listsObject = useRef(rooms);
  
  
  const [roomList, setRoomList] = useState<JSX.Element[]>(
    constructRoomList()
  );
  
  
  function getRoomInfo (i){
    console.log("getRoomInfo");
  }

  function updateRoomName (newVal, i){ 
    listsObject.current[i] = newVal;
    props.updateRoomName(newVal, i);
  }
  
  function constructRoomList() : JSX.Element[] {
    const list:JSX.Element[] = [];

    for(let k = 0; k < rooms.length; k++){
      list.push(<Room name = {rooms[k]} 
        joinRoom = {props.joinRoom}
        getRoomInfo = {getRoomInfo}
        updateRoomNameInList = {updateRoomName}
        index = {k}
      />);
    }

    return list;
  }

  useEffect(()=>{
    setRoomList(constructRoomList());
  }, [rooms]);

  const [focusedRoom, setFocusedRoom] = useState<string>("test");
   
  return (
      <div id = "roomdatacontainer">
        <div id = "roomlist">{roomList}</div>
        <div id = "roominfo">{focusedRoom}</div>
      </div>
  );
};

export default Roomlist;

Roomlist.displayName = "Roomlist";
