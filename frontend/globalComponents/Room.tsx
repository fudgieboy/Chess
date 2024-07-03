import React, { ReactElement, useState, ReactNode, useEffect} from "react";
import v4 from "uuid/v4";

interface IRoom {
  name: string;
  index: number;
  joinRoom: ()=>void;
  getRoomInfo: (i)=>void;
  updateRoomNameInList: (index: number, name: string)=>void;
}

const Room: React.FC<IRoom> = (props: IRoom): ReactElement => {
  const [name, setName] = useState(props.name);
  
  const updateRoomName = (newName)=>{
    setName(newName);
    props.updateRoomNameInList(props.index, newName);
  };

  return(
    <li id = { props.index + ""} className = "subContainer" >
          <input className = "button folderButton" onChange = {(ev)=>{updateRoomName(ev.target.value)}} type = "text" value ={name}/>
    </li>
  );
};

export default Room;