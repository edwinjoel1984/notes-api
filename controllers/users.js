const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
usersRouter.get("/", async(request, response, next)=>{
    const users = await User.find({}).populate("notes",{content:1, date: 1, _id: 0});
    response.json(users);
});
usersRouter.post("/", async(request, response, next)=>{
    try{
        const { body } = request;
        const { username, name, password } = body;
    
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
    
        const user = new User({
            username,
            name,
            passwordHash
        });
    
        const savedUser = await user.save();
    
        response.status(201).json(savedUser);

    }catch(error){
        console.log("🚀 ~ file: users.js ~ line 24 ~ usersRouter.post ~ error", error);
        response.status(400).json(error);
    }
});


module.exports = usersRouter;