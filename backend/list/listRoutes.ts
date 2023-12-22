import e from "express";
import listController from "./listController";

const app = e();

app.post("/list/setList", (req, res)=>{ return listController.setList(req, res);});
app.post("/list/getList", (req, res)=>{ return listController.getList(req, res);});


export default app;