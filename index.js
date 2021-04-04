require("dotenv").config();
require ("./mongo");

const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/Note");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

app.use(express.json());
app.use(cors());

Sentry.init({
    dsn: "https://1df88d3f622b4453899b67d0ab168b71@o140451.ingest.sentry.io/5704977",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


app.get("/api/notes", (request,response)=>{
    Note.find({})
        .then(result=>{
            console.log(result);
            // mongoose.connection.close();
            response.json(result);
        })
        .catch(err=>{
            console.error(err);
            response.status(400).send({error: "Algo anda mal"});
        });

});
app.get("/api/notes/:id", (request,response, next)=>{
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
app.delete("/api/notes/:id", (request,response, next)=>{
    Note.findByIdAndDelete(request.params.id)
        .then(result=>{
            if(result)
                response.status(204).json(result);
            else	
                response.status(404).send({error: "Not Found"});
        })
        .catch(err=>{
            console.log("errr");
            next(err);
        });
});
app.post("/api/notes/", (request,response)=>{
    const note = request.body;
    if(!note.content){
        return response.status(400).json({error: "content field is missing"});
    }
    const newNote= new Note ({
        content: note.content,
        date: new Date(),
        important: note.important || false
    });
    newNote.save()
        .then(result=>{
            response.json(result);
        })
        .catch(err=>{
            console.error(err);
            response.status(400).send({error: "Algo anda mal creando la Nota"});
        });
});
app.put("/api/notes/:id", (request,response)=>{
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

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

app.listen(process.env.PORT,()=>{
    console.log("server started at PORT "+ process.env.PORT);
});