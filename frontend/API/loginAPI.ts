import LocalStore from "../stores/LocalStore";

const login = (params, callback, fail) => {
    fetch("/users/login", { 
        method: "POST",
        body: JSON.stringify(params),
        headers:{
            "Content-Type": "application/json",
        }}).then((response)=>{
            const reader = response.body.getReader();
            reader.read().then((res)=>{

                let token = String.fromCharCode.apply(null, res.value);
                token = JSON.parse(token); 
                
                console.log(token);
                 
                if(response.status == 200){
                    LocalStore.actions.loginUser(token.data.list, token.data.requests, callback, fail);
                } else if (response.status == 500){
                    fail(token);
                } else if (response.status == 404){
                    fail(token);
                } else if (response.status == 401){
                    fail(token);
                }
        });
    });
};

const addFriend = (params, callback, fail) => {

    fetch("/users/addFriend", { 
        method: "POST",
        body: JSON.stringify(params),
        headers:{
            "Content-Type": "application/json",
        }}).then((response)=>{
            if(response.status === 200){
                const reader = response.body.getReader();
                reader.read().then((res)=>{
                    let token = String.fromCharCode.apply(null, res.value);
                    token = JSON.parse(token); 
                    
                    console.log(token);

                    console.log("login");
                    console.log(token.data.list);
                    
                    // LocalStore.actions.loginUser(token.data.list, callback, fail);
                });
            } else if (response.status === 500){
                console.log(response);
                console.log(callback);
            }
        });
};


const finishAddFriend = (params, callback, fail) => {
    fetch("/users/finishAddFriend", { 
        method: "POST",
        body: JSON.stringify(params),
        headers:{
            "Content-Type": "application/json",
        }}).then((response)=>{
            if(response.status === 200){
                const reader = response.body.getReader();
                reader.read().then((res)=>{
                    let token = String.fromCharCode.apply(null, res.value);
                    token = JSON.parse(token); 

                    console.log("finish add friend");
                    console.log(token); 
                });
            } else if (response.status === 500){
                console.log(response);
                console.log(callback);
            }
        });
};

const logout = (callback, fail) => {
    fetch("/users/logout", {
        method: "GET",
        headers:{
            // "Content-Type": "application/x-www-form-urlencoded",
        }}).then((response)=>{
            if(response.status === 200){
                const reader = response.body.getReader();
                reader.read().then((res)=>{
                    let token = String.fromCharCode.apply(null, res.value);
                    LocalStore.actions.logoutUser(token, callback, fail);
                });
            } else {
                console.log(response);
            }
        });
};



const register = (params) => {

    console.log("register");
    
    fetch("/users/register", {
        method: "POST",
        body: JSON.stringify(params),
        headers:{
            "Content-Type": "application/json",
        }}).then((response)=>{
            if(response.status === 200){
                const reader = response.body.getReader();
                reader.read().then((res)=>{
                    let s = String.fromCharCode.apply(null, res.value);
                    console.log(JSON.parse(s));
                });
            } else if (response.status === 500){
                console.log(response);
                console.log(callback);
            }
        });
};

export default {
    register,
    login,
    finishAddFriend,
    addFriend,
    logout
};
