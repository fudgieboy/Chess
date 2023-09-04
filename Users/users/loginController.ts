// import * as UserData from "../dataAccess/users";
// import * as helper from "../utils/jwtHelper";
// // import {config} from "../../localconfig";
// import {config} from "../../apiKeys";
// import * as utils from "../utils/misc";
// import * as ListData from "../dataAccess/lists";

// const dev = (config.curEnv === "development");

// const loginController = () =>{
//   const login = async (req, res) =>{
//     const loginUser = {
//         username: req.body.username,
//         password: req.body.password
//     };

//     UserData.getUserByUsername(loginUser.username, (getUserError, resUser)=>{
//       if(utils.n(getUserError)){
//         if(!utils.n(resUser)){
//           UserData.comparePassword(loginUser.password, resUser.password, (compareErr, match)=>{
//             if(utils.n(compareErr)){
//               if(!utils.n(match)){
//                 if( match !== false ){
//                   utils.l("Login Success for user:");
//                   utils.l(resUser);
                  
//                   ListData.getListbyUserId(resUser.memberID, (getListError, resList)=>{ 
//                     if(utils.n(getListError)){
//                       const token = helper.getLoginToken(loginUser.username);
//                       const expiryTime = Date.now() + (dev?36000:3600000); 
                      
//                       res.cookie("expiryTime", 
//                         expiryTime, 
//                         {expires: new Date(expiryTime),
//                           secure: !dev,
//                           httpOnly: false,
//                         });

//                       res.cookie("token", 
//                         token, 
//                         {expires: new Date(expiryTime),
//                           secure: !dev,
//                           httpOnly: true,
//                         });

//                       res.cookie("loggedIn", 
//                         true, 
//                         {expires: new Date(expiryTime),
//                           secure: !dev,
//                           httpOnly: false,
//                         });
                      
//                       if(utils.n(resList)){
//                         res.status("200").send({data: {}});
//                       } else {
//                         res.status("200").send({data: resList.list});
//                       }
//                     }
//                   });

//                 } else {
//                   utils.l("Login Failed: Incorrect Password");
//                   res.status("404").send({data:"User not found"});
//                 }
//               } else {
//                 utils.l("comparePassword: Error comparing passwords");
//                 res.status("500").send({data:"Login Failed"});
//               } 
//             } else {
//               utils.l("compareErr Error");
//               utils.e(compareErr);
//               res.status("500").send({data:"Error"}); 
//             }
//           });
//         } else {
//           utils.l("getUserError Error, user not found");
//           res.status("404").send({data:"User not found"}); 
//         }
//       } else {
//         utils.l("getUserError Error");
//         res.status("500").send({data:"Error searching for user"});
//       }
//     });
//   };
  
//   const logout = async (req, res) =>{
//     res.clearCookie("token", "", {expires: Date.now()});
//     res.send({data: "logout"});
//   };

//   return {
//     login,
//     logout
//   };
// };

// export = loginController();
