import * as helper from "../utils/jwtHelper";
import {config} from "../../apiKeys";
import utils from "../utils/misc";
import {ListData} from "../dataAccess/usergames";
import {UserData} from "../dataAccess/users";
import sanitize from 'mongo-sanitize';

const {l, n} = utils;

//clear the login token on logout. user can log in with token after logging out

const dev = (config.curEnv === "development");

const loginController = () =>{
  
  const getUserInfo = async (req, res) =>{
    res.send({});
  };
  
  const finishAddFriend = (req, res) =>{
    console.log("finishAddFriend");
    if(req.userToken != undefined && req.userToken !=null && !n(req.body.friendAccepted)){ 
        req.userToken = sanitize(req.userToken);
        // req.body.username = "bleh";
        
        UserData.removeFriendRequestFromQueue( sanitize(req.userToken), req.body.username, (updateError, resUpdate)=>{
          if(n(updateError) && !n(resUpdate && req.body.friendAccepted)){
            if(req.body.friendAccepted){
              UserData.completeFriendRequest(req.userToken, req.body.username, (completeErrOne, newFriendOne) => {
                if(n(completeErrOne) && !n(newFriendOne)){
                  UserData.completeFriendRequest( req.body.username, req.userToken, (completeErrTwo, newFriendTwo) => {
                    if(n(completeErrTwo) && !n(newFriendTwo)){
                      UserData.removeOutgoingFriendRequest(req.body.username, req.userToken, (completeErrThree, finalResut)=>{
                        if(n(completeErrThree)){
                          res.status(200).send({data: "New Friend Added"});
                        } else {
                          
                        }
                      });
                    }
                  });
                } else {
                  res.status(500).send({data: "Failed to complete friend request approval"});
                }
              });
            } else {
              res.status(200).send({data: "Request Rejected"});
            }
            
          //   // res.status(200).send({data: resUpdate});
          }
        });
    }
  };

  const createFriendRequest = (req, res) =>{
    if(req.userToken != undefined){

      const username = req.body.username;
       
      const requester = sanitize(req.userToken);

      UserData.insertUserFriendRequest(username, requester, (getFriendError, resFriend)=>{
        req.userToken = sanitize(req.userToken);
        if(n(getFriendError) && resFriend != null){
          UserData.getUserByUsername(req.userToken, (getLoggedInUserError, loggedinUser)=>{
              if(n(getLoggedInUserError) && loggedinUser!= null){
                UserData.insertOutgoingFriendRequest(req.userToken, req.body.username, (completeErrThree, finalResut)=>{
                  if(n(getLoggedInUserError) && loggedinUser!= null){
                      res.status(200).send({data: "Request sent"});
                  } else {
                    res.status(500).send({data: "Failed to send request"});
                  }
                });
              } else {
              //   usertoken invalid can't add friend login
              // return error;
              }
          }); 
        } else {
          // return error;
        }
      });

    } else {
      //not logged in failed to add user
    }

    /*get login token and get username of person logged in
      get user by username
      add the user to the friends list
      return the other user's userlist
    */

    // await UserData.comparePassword(loginUser.password, resUser.password);
    // await ListData.getListbyUserId(resUser.memberID, (getListError, resList)=>
            
  };
  
  const login = async (req, res) =>{
    const loginUser = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      token: ""
    };

    console.log("loginUser");

    UserData.getUserByUsername(loginUser.username, (getUserError, resUser)=>{
      if(n(getUserError)){
        if(!n(resUser)){
          UserData.comparePassword(loginUser.password, resUser.password, (compareErr, match)=>{
            if(n(compareErr)){
              if(!n(match)){
                if( match !== false ){

                  const token = helper.getLoginToken(loginUser.username);
                  const expiryTime = Date.now() + (dev?360000:3600000); 
                  
                  res.cookie("expiryTime", 
                    expiryTime, 
                    {expires: new Date(expiryTime),
                      secure: !dev,
                      httpOnly: false,
                    });

                  res.cookie("token", 
                    token, 
                    {expires: new Date(expiryTime),
                      secure: !dev,
                      httpOnly: true,
                    });

                  res.cookie("loggedIn", 
                    true, 
                    {expires: new Date(expiryTime),
                      secure: !dev,
                      httpOnly: false,
                    });
                  
                  ListData.getListbyUserId(resUser.memberID, (getListError, resListData)=>{ 
                    if(!(resListData == null || resListData == undefined)){
                      let list;
                      let requests;

                      if(n(getListError)){

                        if(n(resListData)){
                          res.status(404).send({data: "User not found."});
                        } else {
                          res.status(200).send({data: {list, requests}});
                        }
                      } else {
                        l("getListError Error");
                        l(getListError);
                      }
                    } else {
                      let requests;
                      !n(resUser)? requests =  resUser.friendRequests: "[]";

                      res.status(200).send({data: {list: [], requests}});
                    }
                  });
                } else {
                  l("Login Failed: Incorrect Password");
                  res.status(401).send({data:"Incorrect Password"});
                }
              } else {
                l("No matching password");
                res.status(401).send({data:"Login Failed"});
              } 
            } else {
              l("Error comparing passwords");
              res.status(401).send({data:"Error"}); 
            }
          });
        } else {
          l("GetUserError Error, user not found");
          res.status(404).send({data:"User not found"}); 
        }
      } else {
        l("GetUserError Error");
        res.status(500).send({data:"Error searching for user"});
      }
    });
  };
  
  const logout = async (req, res) =>{
    res.clearCookie("token", "", {expires: Date.now()});
    res.send({data: "logout"});
  };

  return {
    login,
    logout,
    createFriendRequest,
    finishAddFriend,
    getUserInfo
  };
};

export default loginController();
