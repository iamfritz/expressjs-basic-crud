require("dotenv").config();

const dbConnect = require("./dbconnect");
dbConnect();
const Role = require("../models/role.model");


async function runMigration(request, response, next) {
  try {

    const roleNames = ["admin", "user", "editor", "author"];
    let i = 0;
    while (i < roleNames.length) {
      let newRole = roleNames[i];
      i++;
      const dataRole = new Role({
        name: newRole,
      });

      const newApi = await dataRole.save();
    }

    console.log("New entry migrated successfully.");
  } catch (error) {
    console.log("Error during migration");
    console.error(error.message);
  }
  process.exit(0);

}

runMigration();