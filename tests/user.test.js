const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

/* use to test view/update/delete */
let newItem_ID = '';

describe("POST /api/user", () => {
  it("should create a todo item", async () => {
    const res = await request(app).post("/api/user").send({
      password: "password",
      email: "test@demo.com",
      name: "Fritz",
      age: "23",
      position: "President",
      level: "Manager",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("New Todo 1");
    newItem_ID = res.body.data._id;
  });
});

describe("GET /api/user", () => {
  it("should return all todo items", async () => {
    const res = await request(app).get("/api/user");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});

describe("GET /api/user/:id", () => {
  it("should return a todo item", async () => {
    const res = await request(app).get(`/api/user/${newItem_ID}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("New Todo 1");
  });
});

describe("PUT /api/user/update/:id", () => {
  it("should update a todo", async () => {
    const res = await request(app)
      .patch(`/api/user/update/${newItem_ID}`)
      .send({
        password: "password",
        name: "Update Name",
        age: "23",
        position: "President",
        level: "Manager"        
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Update Todo 1");
  });
});

describe("DELETE /api/user/delete/:id", () => {
  it("should delete a todo", async () => {
    const res = await request(app).delete(`/api/user/delete/${newItem_ID}`);
    expect(res.statusCode).toBe(200);
  });
});