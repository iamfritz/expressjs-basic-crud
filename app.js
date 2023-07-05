require("dotenv").config();

const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const bodyParser = require("body-parser");

const router = express.Router();

const post = require("./app/routes/post");
const user = require("./app/routes/user");
const demo = require("./app/routes/demo");
//const admin = require("./routes/admin");
const dbConnect = require("./app/db/dbConnect");

// execute database connection
module.exports = router;
const app = express();

dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* routes */
app.get('/', (req,res) => {
  res
    .json({ status: "success", message: "Online" });
})
app.use("/api", post);
app.use("/api/user", user);
app.use("/demo", demo);
//app.use("/admin", admin);

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});

const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});