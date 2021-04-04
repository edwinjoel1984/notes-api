module.exports = (error, req, resp, next)=>{
    console.error(error.name, "----");
    if(error.name === "CastError") 
        resp.status(400).end();
    else
        resp.status(500).end();
};