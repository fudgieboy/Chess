import React, {ReactElement, Component, useEffect, useState} from "react";
import { Route, Routes } from 'react-router-dom';
// import LocalStore from "../../stores/LocalStore";
import Chessboard from "../../globalComponents/Chessboard"; 

const Main: React.FC = () : ReactElement => {
  // const [loggedIn, setLoggedIn] = useState<boolean>(LocalStore.store.getLoggedIn());
  // const [unmountLoginForms, setUnmountLoginForms] = useState<boolean>(LocalStore.store.getLoggedIn());
                 
  // const updateLoggedInStatus = (loggedIn:boolean):void=>{
  //   setLoggedIn(loggedIn);
  // };

  // const updateMountStatus = (mount:boolean):void =>{
  //   setUnmountLoginForms(mount);
  // };

  // const revealLoginForms = (delay:number):void => { 
  //   setTimeout(()=>{
  //     updateLoggedInStatus(false);
  //     updateMountStatus(false);
  //   }, delay);
  // };

  // const hideLoginForms = (showDelayTime:number):void=>{
  //   updateLoggedInStatus(true);

  //   setTimeout(()=>{
  //     updateMountStatus(true);
  //   }, 1000); //1000 is the scss animation time

  //   revealLoginForms(showDelayTime);
  // };

  // useEffect(()=>{
  //   if(LocalStore.store.getLoggedIn()){
  //     revealLoginForms(LocalStore.store.getLoginExpiryTime());
  //   }
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     document.title = `Time is: ${new Date()}`;
  //   }, 1000);
 
  //   return () => {
  //     document.title = "Time stopped.";
  //     clearInterval(intervalId);
  //   };
  // }, []);

  // var loginInnerContainerClasses = ( loggedIn ?"hidden": "") + " anim";

  return (
    // <Router>
      <div id = "main">
          <div id = "header">
            <h1>Chess</h1>
          </div>
          <div id = "leftBar">
            {/* <Routes> */}
              {/* <Route path = "/newgame"  element = {<Chessboard/>}>New Game</Route>
              <Route path = "/watch">Watch</Route>
              <Route path = "/chat">Chat</Route>
              <Route path = "/famousgames">Famous Games</Route>
              <Route path = "/puzzles">Puzzles</Route>
              <Route path = "/playbot">Play a bot</Route>
              <Route path = "/petbot">Build a Bot</Route>
              <Route path = "/custom">Custom Rules</Route> */}
              {/* <Route path = "/newgame"  element = {<Chessboard/>}>New Game</Route>
              <Route path = "/watch">Watch</Route>
              <Route path = "/chat">Chat</Route>
              <Route path = "/famousgames">Famous Games</Route>
              <Route path = "/puzzles">Puzzles</Route>
              <Route path = "/playbot">Play a bot</Route>
              <Route path = "/petbot">Build a Bot</Route>
              <Route path = "/custom">Custom Rules</Route> */}

              <ul>
                <li><a href= "#">New Game</a></li>
                <li><a>Watch</a></li>
                <li><a>Chat</a></li>
                <li><a>Famous Games</a></li>
                <li><a>Puzzles</a></li>
                <li><a>Play a bot</a></li>
                <li><a>Build a Bot</a></li>
                <li><a>Custom Rules</a></li>
              </ul>
            {/* </Routes> */}
          </div>
          <Chessboard />
          {/* <div id = "loginFormsContainer">
            <div className = {loginInnerContainerClasses} >
              {!unmountLoginForms ? <Register hideSelf = {hideLoginForms} showSelf = {revealLoginForms} /> :null}
              {!unmountLoginForms ? <Login  hideSelf = {hideLoginForms} showSelf = {revealLoginForms}/> :null}
            </div>
          </div>  */}
      </div>
    // </Router>
  );
};

Main.displayName = "Main";

export default Main;