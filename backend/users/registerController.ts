import {UserData} from "../dataAccess/users";
import * as helper from "../utils/jwtHelper";
// import {config} from "../../localconfig";
import {config} from "../../apiKeys";
import utils from "../utils/misc";
import validator from "validator";

const {l, n} = utils;

const curEnv = config.curEnv;
const dev = (curEnv === "development");

const registerController = ()=>{
    const register = async (req, res) =>{
      const newUser = {
            name: req.body.username,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            token: ""
        };
        
      // const passwordStrength = validator.isStrongPassword(newUser.password, {minLength: 8, 
      //   minNumbers: 1, 
      //   minSymbols: 1, 
      //   minLowercase: 1, 
      //   minUppercase: 1
      // });

      // const validEmail = validator.isEmail(newUser.email, {
      //    allow_display_name: false,
      //    require_display_name: false,
      //    allow_ip_domain: false,
      //    allow_underscores: false,
      //    domain_specific_validation: false,
      //    blacklisted_chars: '',
      //    host_blacklist: [] 
      //   });

      // console.log(passwordStrength);
      // console.log(validEmail);

      // !validator.isFloat(newUser.name);
      // newUser.name.length < 13;
      // newUser.name.length > 2;
      
      // !validator.isFloat(newUser.username);
      // newUser.username.length < 13;
      // newUser.username.length > 4;
      
      UserData.getUserByEmail(newUser.email, (getUserErr, resUser)=>{
        UserData.checkExistingUser(newUser.email, newUser.username, (getUserErr, resUser)=>{
          if(n(getUserErr)){
            if(n(resUser)) {
              UserData.registerUser(newUser, (registerErr, registeredUser)=>{
                if(n(registerErr)){
                  if(!n(registeredUser)){
                    const token = helper.getLoginToken(newUser.username);
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

                    res.status(200).send({data: "Register success"});
                  } else {
                    res.status(500).send({ data: "Registration failed"});
                  }
                } else {
                    res.status(500).send({ data: "Registration failed" });
                }
              });
            } else {
              l("User already defined");
              res.status(204).send({data:"User is already defined"});
            }
          } else {
            res.status(500).send({data:"Error getting user"});
          }
        });
      });
    };

    return {
      register
    };
};


export default registerController();