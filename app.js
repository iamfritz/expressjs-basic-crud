//https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/

require("dotenv").config();

const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");

const router = express.Router();
var bodyParser = require("body-parser");

const post = require("./routes/post");
const user = require("./routes/user");
//const admin = require("./routes/admin");
const dbConnect = require("./app/db/dbConnect");

// execute database connection
dbConnect();
module.exports = router;

const app = express();

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());

app.use("/api", post);
app.use("/api/user", user);
//app.use("/admin", admin);

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});