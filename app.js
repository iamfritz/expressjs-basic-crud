//https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/

require("dotenv").config();

const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");

const router = express.Router();
const user = require("./routes/user");

module.exports = router;

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
var bodyParser = require("body-parser");

database.on("error", (error) => {
  console.log('DB error');
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());

app.use("/api", user);

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});