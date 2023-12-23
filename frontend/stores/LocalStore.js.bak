import EventEmitter from "events";
import dispatcher from "./Dispatcher";

class LocalStore extends EventEmitter {
    // getLoginToken=()=>{ return loginToken;}

    loginList = [];
    
    getLoggedIn=()=>{ 
        var loggedInCookie = document.cookie.replace(/(?:(?:^|.*;\s*)loggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(loggedInCookie !== undefined && loggedInCookie == true){
            return true;
        } else {
            return false;
        }
    }

    getLoginExpiryTime(){
        var loggedInCookieExpiry = document.cookie.replace(/(?:(?:^|.*;\s*)expiryTime\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        if(loggedInCookie !== undefined && loggedInCookie == true){
            return parseInt(loggedInCookieExpiry) - new Date().getTime();
        } else {
            return 0;
        }
    }

    setLogin(action){
        var delay = this.getLoginExpiryTime();

        this.loginList = action.payload;
        action.payload.callback(action.payload, delay);
    }

    getLoginList=()=>{
        return this.loginList;
    }

    setLogout(action){
        action.payload.callback();
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
    loginUser(data, callback, error){
        data.callback = callback;
        dispatcher.dispatch({
            type: "LOGIN_USER_STATUS",
            payload: data,
            errors: error,
        });
    }

    logoutUser(data, callback, error){
        data.callback = callback;
        dispatcher.dispatch({
            type: "LOGOUT_USER_STATUS",
            payload: data,
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