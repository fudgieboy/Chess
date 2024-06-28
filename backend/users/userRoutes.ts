import e from "express";
import registerController from "./registerController";
import loginController from "./loginController";

const app = e();

app.post("/users/register", (req, res)=>{ return registerController.register(req, res);});
app.post("/users/login", (req, res)=>{ return loginController.login(req, res);});
app.get("/users/logout", (req, res)=>{ return  loginController.logout(req, res);});

export default app;