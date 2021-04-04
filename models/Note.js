const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const notesSchema = new Schema(
    {
        content: String,
        date: Date,
        important: Boolean
    });
notesSchema.set("toJSON", {
    transform: (document, returnedObject)=>{
        returnedObject.id=returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
} );
const Note = model("Note", notesSchema);

module.exports = Note;
