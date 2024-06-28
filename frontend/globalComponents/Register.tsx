import React, {Component, useState} from "react";
import Api from "../API/loginAPI";
export default function Register(){
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const register = (event) => {
    event.preventDefault();
    Api.register({
      username: username,
      password: password,
      email: email
    });
  };

  const updateUsername = (val) => {
    setUsername(val);
  };

  const updateEmail = (val) => {
    setEmail(val);
  };

  const updatePassword = (val) => {
    setPassword(val);
  };

  return ( 
    <div id = "registerModal">
      <form onSubmit={register}>
        <input onChange = {(ev)=> updateUsername(ev.target.value)} placeholder = "Username"></input>
        <input onChange = {(ev)=> updatePassword(ev.target.value)} placeholder = "Password"></input>
        <input onChange = {(ev)=> updateEmail(ev.target.value)} placeholder = "EmailAddress"></input>
        <input type="submit" value="Register"></input>
      </form>
    </div>
  );
}

Register.displayName = "Register component";