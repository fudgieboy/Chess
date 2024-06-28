import React, {Component, useState} from "react";
import Api from "../API/loginAPI"; 

// export const incVal = (old) => ({
//       passedVal: old.passedVal + 1
//     });

// export const decVal = (old) => ({
//       passedVal: old.passedVal - 1
//     });

export default function Login(props){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (ev) => {
    ev.preventDefault();
    Api.login({
        username: username,
        password: password
      }, 
      (loadedList, revealDelay)=>{
        props.hideSelf(revealDelay);
      },
      (errMsg)=>{ console.log(errMsg);});
  };

  const logout = () => {
    Api.logout( 
      (err)=>{
        props.hideSelf(0);
      },
      (errMsg)=>{ console.log(errMsg);});
  };
 
  const updateUsername = (val) => {
    setUsername(val);
  };

  const updatePassword = (val) => {
    setPassword(val);
  };

  return ( 
    <div id = "loginModal">
      <form onSubmit = {login}>
        <input onChange = {(ev)=>updateUsername(ev.target.value)} placeholder = "Username"></input>
        <input onChange = {(ev)=>updatePassword(ev.target.value)} placeholder = "Password"></input>
        <input type="submit" value="Login"></input>
      </form>
      <button onClick = {()=>logout()} className = "logout">Logout</button>
    </div>
  );
}

Login.displayName = "Login component";
