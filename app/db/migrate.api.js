require("dotenv").config();

const dbConnect = require("./dbconnect");
dbConnect();
const Apikey = require("../models/apikey.model");


async function runMigration() {
  try {

    let api_key = await Apikey.findOne({ api_key: "abc123" });
    if (api_key) {
        console.log("Sample API Key is already migrated.");
        console.log(api_key);
    } else {
        // Example migration: Insert a new document
        const data = new Apikey({
          api_key: "abc123",
          username: "fritz"          
        });
    
        const newApi = await data.save();
        if (newApi) {
            console.log("New entry migrated successfully.");
            console.log(newApi);
        } else {
          console.error("Migration Failed.");
        }
    }    
  } catch (error) {
    console.log("Error during migration");
    console.error(error.message);
  }
}

runMigration();