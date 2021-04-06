const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {server} = require("../index");
const User = require("../models/User");
const {api, getUsers} = require("./helpers");

describe("Creating a new user", ()=>{
    beforeEach(async()=>{
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash("pswd", 10);
        const user = new User({username: "joel", name: "test", passwordHash});
        await user.save();
    });
    test("Work as expected creating a fresh username", async()=>{
        const usersDB = await User.find({});
        const usersAtStart = usersDB.map(user=>user.toJSON());

        const newUser = {
            username: "joelesmith",
            name: "Edwin",
            password: "12345"
        };
        await api.post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await getUsers();

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        
        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test("creation fails with proper statuscode and message if username is already taken", async () => {
        const usersAtStart = await getUsers();
    
        const newUser = {
            username: "joel",
            name: "Miguel",
            password: "midutest"
        };
    
        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    
        console.log(result.body);
    
        expect(result.body.errors.username.message).toContain("expected `username` to be unique");
    
        const usersAtEnd = await getUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    afterAll(()=>{
        mongoose.connection.close();
        server.close();
    });
});