require("dotenv").config();
require ("./mongo");
const express = require("express");
const cors = require("cors");
const app = express();

//Sentry
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
//Middlewares
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

//Controllers
const usersRouter = require("./controllers/users");
const notesRouter = require("./controllers/notes");
const loginRouter = require("./controllers/login");


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

app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/login", loginRouter);
if(process.env.NODE_ENV === "test"){
    const testingRouter = require("./controllers/testing");
    app.use("/api/testing", testingRouter);
}

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

const server = app.listen(process.env.PORT,()=>{
    console.log("server started at PORT "+ process.env.PORT);
});

module.exports = {app, server};