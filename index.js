const express = require("express");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();
const app = express();
const port = process.env.PORT;

// App local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));


//routes
route(app);
routeAdmin(app);

app.listen(port, ()=>{
    console.log(`Lang nghe tai cong ${port}`);
})