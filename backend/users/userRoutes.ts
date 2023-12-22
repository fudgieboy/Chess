import e from "express";
import registerController from "./registerController";
import loginController from "./loginController";

const app = e();

app.post("/users/register", (req, res)=>{ return registerController.register(req, res);});
app.post("/users/finishAddFriend", (req, res)=>{ return loginController.finishAddFriend(req, res);});
app.post("/users/addFriend", (req, res)=>{ return loginController.createFriendRequest(req, res);});
app.post("/users/login", (req, res)=>{ return loginController.login(req, res);});
app.get("/users/user", (req, res)=>{ return loginController.getUserInfo(req, res);});
app.get("/users/logout", (req, res)=>{ return  loginController.logout(req, res);});

export default app;