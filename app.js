const express = require("express");
const routes = require("./routes");
const path = require("path");
const port = process.env.PORT || 5000;

const app = express();
// Set the default views directory to html folder
app.set("views", path.join(__dirname, "html"));
// Set the folder for css
app.use(express.static(path.join(__dirname, "css")));
// Set the folder for java script
app.use(express.static(path.join(__dirname, "js")));
// Set the folder for assets
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "node_modules")));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.use("/", routes);


const server = app.listen(port, () => {
	console.log("Server is running at port " + port);
});









