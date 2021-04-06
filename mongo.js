
const mongoose = require("mongoose");
const {NODE_ENV, MONGO_DB_URI, MONGO_DB_URI_TEST}= process.env;
const connectionString=NODE_ENV==="test" ? MONGO_DB_URI_TEST : MONGO_DB_URI;
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
})
    .then(()=>console.log("Database connected"))
    .catch(err=>console.error(err));


// Note.find({})
//     .then(result=>{
//         console.log(result);
//         mongoose.connection.close();
//     });

// const note = new Note({
//     content: "MongoDB is amazing",
//     date: new Date(),
//     important: true
// });

// note.save()
//     .then(data=>{
//         console.log(data);
//         mongoose.connection.close();
//     })
//     .catch(err=>console.error(err));
