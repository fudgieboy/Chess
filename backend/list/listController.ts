// import UserData from"../dataAccess/users";
// import ListData from "../dataAccess/lists";
// import * as utils from "../utils/misc";

// const listController = ()=> {
//   const getList = (req, res) => {
//     res.send({test: "test"});
//   };

//   const setList = (req, res) => {
//     let username = req.userToken;
    
//     utils.l("Decoded username: " + username);

//     if(!utils.n(username)){
//       UserData.getUserByUsername(username, (getUserError, resUser)=>{
//         if(utils.n(getUserError)){
//           if(!utils.n(resUser)){
//             utils.l(resUser); 
            
//             const newList = {
//               creationDate: new Date().getTime(),
//               memberID: resUser.memberID,
//               name: "",
//               list: req.body.list
//             };

//             ListData.updateList(resUser.memberID, newList, (saveListErr, savedList)=>{
//               if(utils.n(saveListErr)){ 
//                 if(!utils.n(savedList)){
//                   utils.l("savedList");
//                   utils.l(savedList);
//                   let {list, creationDate} = savedList;
//                   res.status("200").send({list, creationDate});
//                 } else {
//                   res.status("204").send({data: "List not saved"});
//                 }
//               } else {
//                 res.status("500").send({data: "Error creating new list"});
//               }
//             });
//           } else { 
//             res.status("404").send({data: "No user found"});
//           }
//         } else {
//           res.status("500").send({data: "Error"});
//         }
//       });
//     } else {
//       utils.l("User not logged in");
//       res.status("204").send({data: "User not logged in"});
//     }
//   };

//   return {
//     getList,
//     setList
//   };
// };

// export = listController();