const express = require("express");
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();
const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce'))); 
// End Tiny MCE

//Flash
app.use(cookieParser('anhtuan220903'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


// App local Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//routes
route(app);
routeAdmin(app);

app.listen(port, ()=>{
    console.log(`Lang nghe tai cong ${port}`);
})