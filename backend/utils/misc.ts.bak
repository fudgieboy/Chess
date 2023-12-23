// import * as  stackTrace from "stack-trace";
// import {config} from "../../localconfig";
import {config} from "../../apiKeys";

// const env = config.curEnv;
const curEnv = config.curEnv;
const dev = (curEnv === "development");

let l, e, tr, n;

if(dev){
  // const prima = require('esprima');
  // var scan = require('scope-analyzer');
  l = console.log;
  e = (msg, code)=>{
    throw `error, ${msg + " " + code}`;
  };
  
  // tr = (depth)=>{
  //   var t = stackTrace.get();
  //   var spacer = "";
  //   if(!depth){depth = t.length;}
  //   for(var i = 1; i<depth;i++){ //set to one to skip the reference to this file
  //     const l = t[i];
  //     console.log(spacer + l.getLineNumber() + " " + l.getFunctionName() + " " + l.getFileName() + " ");
  //     spacer = spacer + " ";
  //   }
  // };
} else {
  tr = l = e = console.log = ()=>{};
}

n = (val)=>{
  return (val === undefined || val === null);
};

export {
  l,
  e,
  tr,
  n,
};