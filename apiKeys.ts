const tryRequire = require("try-require");

var config;

if(process.env.HEROKU || process.env.AWS ){
    console.log("Anybody home?");
    
    var env = process.env; 
    config = {
        cookieSecret: env.COOKIE_SECRET,
        curEnv: "production",
        aes:{
            secret: env.AES_SECRET,
            pass: env.AES_PASS
        },
        user:{
            secret: env.JWT_SECRET
        },
        dbCreds: env.MONGODB_URI
    };

} else {
    var url = __dirname + "/localconfig";
    if(tryRequire.resolve(url)){
        config = require(url);
    }

    // console.log(tryRequire.lastError());
}

export {config};