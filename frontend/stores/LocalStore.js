import EventEmitter from "events";
import dispatcher from "./Dispatcher";

class LocalStore extends EventEmitter {
    // getLoginToken=()=>{ return loginToken;}
    loginList = [];
    requests = window.friendRequests;
    friendList = window.friendList;
    
    getFriendList=()=>{
        return window.friendList;
    };

    getLoggedIn=()=>{ 
        var loggedInCookie = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        
        if(loggedInCookie !== undefined && (loggedInCookie == true || loggedInCookie == "true")){
            return true;
        } else {
            return false;
        }
    }

    getLoginExpiryTime(){
        var loggedInCookieExpiry = document.cookie.replace(/(?:(?:^|.*;\s*)expiryTime\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if(loggedInCookieExpiry !== undefined && loggedInCookieExpiry == true){
            return parseInt(loggedInCookieExpiry) - new Date().getTime();
        } else {
            return 0;
        }
    }

    getFriendRequests(){
        return this.requests;
    } 

    setLogin(action){
        var delay = this.getLoginExpiryTime();

        this.loginList = action.payload.lists;
        this.requests = action.payload.requests;

        action.payload.callback(this.loginList, delay);
    }

    getLoginList=()=>{
        return this.loginList;
    }

    setLogout(action){
        action.payload();
    }

    handleActions = (action) => {
        switch(action.type){          
            case "LOGIN_USER_STATUS":
                this.setLogin(action);
                this.emit("update_login_status");
                break;
        }

        switch(action.type){          
            case "LOGOUT_USER_STATUS":
                this.setLogout(action);
                this.emit("update_logout_status");
                break;
        }
    }
}

class LoginActions {
    loginUser(lists, requests, callback, error){
        
        dispatcher.dispatch({
            type: "LOGIN_USER_STATUS",
            payload: {lists, requests, callback},
            errors: error,
        });
    }

    logoutUser(data, callback, error){
        dispatcher.dispatch({
            type: "LOGOUT_USER_STATUS",
            payload: callback,
            errors: error,
        });
    }
}

const localStore = new LocalStore;
const localActions = new LoginActions;
dispatcher.register(localStore.handleActions);

export default {
    store: localStore, 
    actions: localActions
};