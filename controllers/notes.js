const notesRouter = require("express").Router();
const Note = require("../models/Note");
const User = require("../models/User");


notesRouter.get("", async (request,response)=>{
    const notes = await Note.find({}).populate("user", { name:1, _id: 0});
    response.json(notes);
});
notesRouter.get("/:id", (request,response, next)=>{
    Note.findById(request.params.id)
        .then(result=>{
            if(result)
                response.json(result);
            else	
                response.status(404).send({error: "Not Found"});
        })
        .catch(err=>{
            next(err);
        });
});
notesRouter.delete("/:id", async (request,response, next)=>{
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
        
});
notesRouter.post("/", async (request,response, next)=>{
    const {content, important =  false, userId} = request.body;

    const user = await User.findById(userId);
    if(!content){
        return response.status(400).json({error: "content field is missing"});
    }
    const newNote= new Note ({
        content,
        date: new Date(),
        important,
        user: user._id
    });
    
    try{
        const result = await newNote.save();
        user.notes = user.notes.concat(result._id);
        await user.save();
        response.json(result);
    }catch(e){
        next(e);
    }
});
notesRouter.put("/:id", (request,response)=>{
    const {content, important} = request.body;
    const newNoteInfo= {
        content,
        important
    };
    Note.findByIdAndUpdate(request.params.id,newNoteInfo, {new: true} )
        .then(result=>{
            response.json(result);
        })
        .catch(err=>{
            console.error(err);
            response.status(400).send({error: "Algo anda mal creando la Nota"});
        });
});

module.exports = notesRouter;