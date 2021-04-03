const express = require("express");

const app = express();

app.use(express.json());
app.use((req,res, next)=>{
    console.log(req.method);
    console.log(req.path);
    console.log(req.body);
    next();

});

let notes =   [
    {id: 1,
        content: "test", 
        important: false},
    {id: 2,
        content: "test2", 
        important: false},
];

app.get("/api/notes", (request,response)=>{
    response.status(200).send({data: notes});
});
app.get("/api/notes/:id", (request,response)=>{
    response.status(200).send({ notes});
});
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("server started at PORT "+ port);
});