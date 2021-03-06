const mongoose = require("mongoose");
const {server} = require("../index");
const Note = require("../models/Note");
const User = require("../models/User");

const {
    api,
    initialNotes,
    getAllContentFromNotes
} = require("./helpers");

const firstUser = null;
beforeEach(async()=>{
    await Note.deleteMany({});
    await User.deleteMany({});
    const newUser = {
        "username": "esmith",
        "name": "Edwin Joel",
        "password": "123456"
        
    };

    //Create user
    await api.post("/api/users").send(newUser);
    
    //Login User
    try{
        delete newUser.name;
        const currentUser = await api.post("/api/login").send(newUser);
        console.clear();
        console.log("🚀 ~ file: notes.test.js ~ line 31 ~ beforeEach ~ userLogged", currentUser);
        for (const note of initialNotes) {
            const noteObject = new Note(note);
            await noteObject.save();
        }
    }catch(e){

    }

});
describe("Test All Notes", ()=>{
    test("notes are returned as json", async ()=>{
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type",/application\/json/);
    });
    test("there are two notes", async ()=>{
        const  response = await api.get("/api/notes");
        expect(response.body).toHaveLength(initialNotes.length);
    });
    test("the first note is Note 1", async ()=>{
        const  response = await api.get("/api/notes");
        const contents = response.body.map(note=>note.content);
        expect(contents).toContain("Aprendiendo FullStack JS con midudev");
    });
});

describe("Create a Note",()=>{

    test("is possible with a valid note", async () => {
        const newNote = {
            content: "Proximamente async/await",
            important: true
        };
    
        await api
            .post("/api/notes")
            .send(newNote)
            .expect(200)
            .expect("Content-Type", /application\/json/);
    
        const { contents, response } = await getAllContentFromNotes();
    
        expect(response.body).toHaveLength(initialNotes.length + 1);
        expect(contents).toContain(newNote.content);
    });
    
    test.skip("is not possible with an invalid note", async () => {
        const newNote = {
            important: true
        };
    
        await api
            .post("/api/notes")
            .send(newNote)
            .expect(400);
    
        const response = await api.get("/api/notes");
    
        expect(response.body).toHaveLength(initialNotes.length);
    });
});

// describe("Deleta a Note", ()=>{
//     test.skip("a note can be deleted", async () => {
//         const { response: firstResponse } = await getAllContentFromNotes();
//         const { body: notes } = firstResponse;
//         const noteToDelete = notes[0];
      
//         await api
//             .delete(`/api/notes/${noteToDelete.id}`)
//             .expect(204);
      
//         const { contents, response: secondResponse } = await getAllContentFromNotes();
      
//         expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
      
//         expect(contents).not.toContain(noteToDelete.content);
//     });
// });


afterAll(()=>{
    mongoose.connection.close();
    server.close();
});