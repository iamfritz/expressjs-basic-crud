# expressjs-basic-crud

## Dependences
- [Express](https://www.npmjs.com/package/express)
- [Node](http://nodejs.org/)
- [DotENV](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [mongoose](https://mongoosejs.com/docs/)
- [mongodb](https://www.mongodb.com/cloud/atlas)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)


### Language & Framework Used:
1. Node version

### Architecture Used:
1. Typescript
1. ExpressJS
1. auth JWT(jsonwebtoken)
1. auth Api Key
1. express mongoose nodemon dotenv body-parser jsonwebtoken bcrypt


### API List:
##### Authentication Module
1. [x] Register User with API Key
1. [x] Login  with API Key to generate token
1. [x] Authenticated User Profile
1. [x] Refresh Data
1. [x] Logout
1. [x] Post
1. [ ] Category
1. [ ] User
1. [] Todo

##### Post API Module
1. [x] Post List
1. [x] Post List [Public] <!-- except not working -->
1. [x] Create Post
1. [x] Create Post - findorcreate category field by title
1. [x] Edit Post
1. [x] View Post
1. [x] Delete Post
1. [ ] Post custom field - pending

##### Category Module
1. [ ] Category List
1. [ ] Category List [Public]
1. [ ] Create Category
1. [ ] Edit Category
1. [ ] View Category
1. [ ] Delete Category

##### Todo Module
1. [ ] Todo List
1. [ ] Create Todo
1. [ ] Edit Todo
1. [ ] View Todo by User Auth
1. [ ] Delete Todo
1. [ ] Permission CRUD, Status Change
1. [ ] Assign Task


## SETTING UP 
- Clone the repositury to your machine
- Open up a terminal
- Navigate into the project directory
- Run <code>npm install</code> to install all needed dependencies
- Run <code>nodemon index</code> to spin up the server
- The server runs on port 3000 <code>http://localhost:3000/</code>

## Migration
```
npm run migrateApi
```
npm run migrateRoles
```
npm start
```

## REFERENCE
https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/