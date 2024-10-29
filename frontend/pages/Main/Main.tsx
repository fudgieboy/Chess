import React, {ReactElement, Component, useEffect, useState} from "react";
import { Route, Routes } from 'react-router-dom';
import Chessboard from "../../globalComponents/Chessboard"; 
import Login from "../../globalComponents/Login";
import Register from "../../globalComponents/Register";
import LocalStore from "../../stores/LocalStore";

const Main: React.FC = () : ReactElement => {
  const [loggedIn, setLoggedIn] = useState<boolean>(LocalStore.store.getLoggedIn());
  const [unmountLoginForms, setUnmountLoginForms] = useState<boolean>(LocalStore.store.getLoggedIn());
                 
  const updateLoggedInStatus = (loggedIn:boolean):void=>{
    setLoggedIn(loggedIn);
  };

  const updateMountStatus = (mount:boolean):void =>{
    setUnmountLoginForms(mount);
  };

  const revealLoginForms = (delay:number):void => { 
    setTimeout(()=>{
      updateLoggedInStatus(false);
      updateMountStatus(false);
    }, delay);
  };

  const hideLoginForms = (showDelayTime:number):void=>{
    updateLoggedInStatus(true);

    setTimeout(()=>{
      updateMountStatus(true);
    }, 1000); //1000 is the scss animation time

    revealLoginForms(showDelayTime);
  };

  useEffect(()=>{
    if(LocalStore.store.getLoggedIn()){
      revealLoginForms(LocalStore.store.getLoginExpiryTime());
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      document.title = `Time is: ${new Date()}`;
    }, 1000);
 
    return () => {
      document.title = "Time stopped.";
      clearInterval(intervalId);
    };
  }, []);

  const loginInnerContainerClasses = (loggedIn ?"hidden": "") + " anim innerContainer";


  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    // console.log(e);
    if(e.target.id === "loginFormsInnerContainer"){
      setCoord({ x: e.pageX, y: e.pageY });
    }
  };

  let lerp = {
    identity: function(t){
        t = Math.max(0,Math.min(1,t));
        return t;
    },
    cubic: function(t){
        t = Math.max(0,Math.min(1,t));
        if(2*t<<0){
            return 4*(t-1)*(t-1)*(t-1)+1;
        } else {
            return 4*t*t*t;
        }
    },
    elastic: function(t){
        t = Math.max(0,Math.min(1,t));
        const range = 10.5 * Math.PI;
        return (range - Math.sin(range*t)/t)/(range - 1);
    }
  };
  
  return (
    // <Router>
      <div id = "main">
          {/* <div id="mousetracker" onMouseMove={(e)=>{handleMouseMove(e);}}>
            <h1>
              Mouse coordinates: {coord.x} {coord.y}
            </h1>
          </div> */}
          <div id = "header">
            <h1>ChessRTS</h1>
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
                <li><a href= "#" className="tooltip anim">New Online Game<span className = "tooltiptext">Start a new random match-made game</span></a></li>
                <li><a className="tooltip anim2" >Watch<span className = "tooltiptext">Spectate any public game</span></a></li>
                <li><a className="tooltip anim2" >Old games<span className = "tooltiptext">Review your old games move by move!</span></a></li>
                <li><a className="tooltip anim2" >Change Mode</a></li>
                  <ul>
                    <li><a className="tooltip anim2">Classic<span className = "tooltiptext">Classic Chess with standard rules</span></a></li>
                    <li><a className="tooltip anim2">Custom<span className = "tooltiptext">Custom game</span></a></li>
                    <li><a className="tooltip anim2">5 Second Moves<span className = "tooltiptext">5 seconds maximum to make a move</span></a></li>
                    <li><a className="tooltip anim2">Tag Team<span className = "tooltiptext">Switch turns with a teammate who will assist in moving your pieces</span></a></li>
                    <li><a className="tooltip anim2">Tag Team 5 Sec<span className = "tooltiptext">Alternating turns with a teammate, but with maximum 5 second turns</span></a></li>
                    <li><a className="tooltip anim2">Battle Royale<span className = "tooltiptext">Open world multiplayer combat</span></a></li>
                    <li><a className="tooltip anim2">RTS Royale<span className = "tooltiptext">Open world multiplayer combat with resources to fight over</span></a></li>
                    <li><a className="tooltip anim2">Practice<span className = "tooltiptext">Practice against training or other players</span></a></li>
                    <li><a className="tooltip anim2">Puzzles<span className = "tooltiptext">Hone your skills using constructed puzzles</span></a></li>
                  </ul>

                {/* <li><a>Famous Games</a></li> */}
                {/* <li><a>Puzzles</a></li> */}
                {/* <li><a>Play a bot</a></li> */}
                {/* <li><a>Build a Bot</a></li> */}
                {/* <li><a>Custom Rules</a></li> */}
              </ul>
            {/* </Routes> */}
          </div>
          <Chessboard />
          {/* <div id = "loginFormsContainer" style={{display: (loggedIn?"none":"block")}}  onClick = {()=>{ console.log(LocalStore.store.getLoggedIn(), LocalStore.store.getLoginExpiryTime());}} > */}
          <div id = "loginFormsContainer"  >
            <div id = "loginFormsInnerContainer" onMouseMove={(e)=>{handleMouseMove(e);}} style={{paddingTop: coord.y + "px"}} >
              <div className = {loginInnerContainerClasses}>
                {!unmountLoginForms ? <Register hideSelf = {hideLoginForms} showSelf = {revealLoginForms} /> :<></>}
                {!unmountLoginForms ? <Login  hideSelf = {hideLoginForms} showSelf = {revealLoginForms} /> :<></>}
              </div>
            </div>
          </div> 
      </div>
    // </Router>
  );
};

Main.displayName = "Main";

export default Main;