import * as dotenv from "dotenv";
dotenv.config();
const DATABASE_URL = "mongodb://localhost:27017";
const port = process.env.PORT || 8000;
import connection from "../db/conn.js";
import Register from "../models/registers.js";
import express from "express";
import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
import hbs from "hbs";
const app = express();
const static_path = "/Volumes/Nitish/Express_js/Auth_Website/templates/";
const templates_path =
  "/Volumes/Nitish/Express_js/Auth_Website/templates/views";
const partials_path =
  "/Volumes/Nitish/Express_js/Auth_Website/templates/partials";

// Database Connectivity.....
connection(DATABASE_URL);

app.use("/assets", express.static("assets")); //this is for add style in hbs....
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Create a new user in our database...
app.post("/register", async (req, res) => {
  try {
    const pwd = req.body.txtpwd;
    const cpwd = req.body.txtcpwd;
    var hashPassword = bcrypt.hashSync(pwd, salt);

    if (pwd === cpwd) {
      const registerEmployee = new Register({
        fullname: req.body.txtname,
        username: req.body.txtuname,
        email: req.body.txtemail,
        phone: req.body.txtmno,
        password: hashPassword,
        // cpassword: cpwd,
        gender: req.body.gender,
      });
      console.log("The success part " + registerEmployee);
      const token = await registerEmployee.generatAuthToken();

      const register = await registerEmployee.save();
      res.status(200).render("index");
    } else {
      res.send("Password are not matching....");
    }
  } catch (error) {
    res.status(404).send("Error : " + error);
  }
});

//Login user...
app.post("/login", async (req, res) => {
  try {
    const username = req.body.txtuname;
    const loginPwd = req.body.txtpwd;

    const uname = await Register.findOne({ username: username });
    const isMatch = await bcrypt.compare(loginPwd, uname.password);

    console.log(isMatch);

    const token = await uname.generatAuthToken();
    console.log("The token part " + token);

    if (isMatch) {
      res.render("index");
    } else {
      console.log("Please Enter Valide Username and Password");
    }
  } catch (error) {
    console.log("Invalid login Details : " + error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
