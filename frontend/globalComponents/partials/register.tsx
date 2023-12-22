import React, { ReactElement, useState} from "react";
import LocalStore from "../../stores/LocalStore";
import LoginAPI from "../../API/loginAPI";
import FlashMessage from "react-flash-message";

interface RegisterFunctionality {
  showSide: (delay:number, side: string) => void;
  updateLoggedInStatus: (delay:number) => void;
}

const Register: React.FC<RegisterFunctionality> = (props:RegisterFunctionality): ReactElement => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState('');
  
    const registerUser = (event) => {
      event.preventDefault();
      LoginAPI.register({
        username: username,
        password: password,
        email: email
      }, (registerInfo)=>{
      }, (errMsg)=>{
        setMessage(errMsg.data);
        setStatus(true);
      });
    };
  
    const updateUsername = (ev) => {
      setUsername(ev.target.value);
    };
  
    const updateEmail = (ev) => {
      setEmail(ev.target.value);
    };
  
    const updatePassword = (ev) => {
      setPassword(ev.target.value);
    };

    const getLoginPage = (ev) => {
      return props.showSide(0, "login");
    };

  return (
      <div id = "registerForm"  className="innerContainerForm" >
        <h2 className="">Register:</h2> 
				<div id = "registerquery"><div className = "question">Already Registered?</div> <button onClick = {(ev)=>getLoginPage(ev)} type="submit" style = {{marginTop: '10px'}} className = "button registerButton" id = "actionSelect">Register!</button></div>
        <form id = "submitForm" >
            <input type ="text" maxLength={50} className="rightField" placeholder="[name]" name="name" onChange = {(ev)=>{updateEmail(ev);}}/>
            <input type ="text" maxLength={16} className="rightField" placeholder="[username]" name="username" onChange = {(ev)=>{updateUsername(ev);}}/>
            <input type ="email"  className="rightField" placeholder="[email]" name="email" onChange = {(ev)=>{updateEmail(ev);}}/>
            <input type ="password" maxLength={32} className="rightField" placeholder="[password]" name="password" onChange = {(ev)=>{updatePassword(ev);}}/>
            <input type ="password" maxLength={32} className="rightField" placeholder="[password]" name="password2"/>
            <button type ="submit" className ="button btn btn-default"  onClick = {(ev)=>{registerUser(ev);}}>[submit]</button>
        </form>

          <FlashMessage duration={5000}>
                <strong>{message}</strong>
          </FlashMessage>
        </div>
  );
};

export default Register;