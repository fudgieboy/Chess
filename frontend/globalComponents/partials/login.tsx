import React, { useState, ReactElement} from "react";
import LoginAPI from "../../API/loginAPI"; 

import FlashMessage from "react-flash-message";

interface LoginFunctionality {
  showSide: (delay:number, side: string) => void;
  updateLoggedInStatus: (delay:number) => void;
}

const Login: React.FC<LoginFunctionality> = (props:LoginFunctionality): ReactElement => {
  const [username, setUsername] = React.useState(""); 
  const [password, setPassword] = React.useState(""); 
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');

	const login = (ev) => {
    ev.preventDefault();
    LoginAPI.login({
        username: username,
        password: password
      }, 
      (loadedList)=>{
        //set the appropriate delay here based on the cookie age from the server

         console.log("loggedin");
        props.showSide(0, "account");
      },
      (errMsg)=>{ 
        console.log("login fail");
        setMessage(errMsg.data);
        setStatus(true);
      });
  };
    
  const getRegisterPage = () => {
    return props.showSide(0, "register");
  };
	
  return (
    <div id = "loginForm" style = {{marginLeft: "30px"}}  className="innerContainerForm">
      <div >
        <div>
          <h2 className="page-header">Login:</h2>
          <div id = "registerquery"><div className = "question">Not registered?</div> <button onClick = {()=>getRegisterPage()} type="submit" style = {{marginTop: '10px'}} className = "button registerButton" id = "actionSelect">Login!</button></div>
          <form id="submitForm" onSubmit = {(ev)=>{login(ev);}}>
            <div className="">
              <input maxLength={16} id = "username" type="text" className="rightField" name="username" placeholder="[username]" onChange = {(ev)=>{setUsername(ev.target.value);}}/>
            </div>
            <div className="">
              <input maxLength={32} id = "password" type="password" className="rightField" name="password" placeholder="[password]" onChange = {(ev)=>{setPassword(ev.target.value);}} />
            </div>
            <button type="submit" className="button">[submit]</button>
          </form>
        </div>
            {status && (
            <FlashMessage duration={5000}>
              <strong>{message}</strong>
            </FlashMessage>
          )}
      </div>
      <div id = "registerquery"><button >Logout</button></div>
    </div>
	);
};

export default Login;