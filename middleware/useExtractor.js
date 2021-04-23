const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = (request, response, next)=>{
    
    const authorization = request.get("authorization");
    
    let token="";
    if(authorization && authorization.toLowerCase().startsWith("bearer")){
        token= authorization.substring(7);
    }
    let decodeToken = "";
    try{
        decodeToken = jwt.verify(token, process.env.AUTH_TOKEN);
    }catch(e){
        console.log(e);
    }

    if(!token || !decodeToken.id){
        return response.status(401).json({error: "token is missing"});
    }
    request.userId = decodeToken.id;
    next();
};