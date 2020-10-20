const express = require("express");
const flash = require("express-flash");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

//////////////////////////////////////////////
/////Setting Up middlewares for express///////
/////////////////////////////////////////////

app.use(flash());
app.use(
	session({
		secret: "secert",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("view engine", "ejs");

////////////////////////////////////////////
//Connecting to the MongoDB Altas Database//
////////////////////////////////////////////
const connURL =
	"mongodb+srv://" +
	"loneCoder" +
	":" +
	"QWERTY1234"+
	"@cluster0-avdpm.mongodb.net/" +
	"fortuneDB"+
	"?retryWrites=true&w=majority";

mongoose.connect(connURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

const con = mongoose.connection;
con.on("open", () => {
	console.log("Connected To Database");
});

///////////////////////////////////////////////
//////////////Setting up routes////////////////
//////////////////////////////////////////////
const routes = require("./routes/routes.js");
app.use("/", routes);

//If no routes responded
app.use("/", (req, res) => {
	res.render("error404", { url: req.url });
});
/////////////////////////////////////////////
//////////// Starting the Server ////////////
/////////////////////////////////////////////
app.listen(process.env.PORT || 9000, () => {
	console.log("SERVER STARTED ON PORT 9000 IN LOCALHOST...");
});
