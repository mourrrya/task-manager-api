const express = require("express");
const routeTask = require("./routers/tasks");
const routeUser=require('./routers/users')
require("./db/mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(routeUser)
app.use(routeTask)


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
