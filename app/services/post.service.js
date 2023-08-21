const Service = require("./service");
const Post = require("../models/post.model");

module.exports = {
  ...Service,
  async create(data) {
    return Service.create(Post, data);
  },

  async get(id) {
    return Service.get(Post, id);
  },
  async getWithPopulation(id, field) {
    return Service.getWithPopulation(Post, id, field);
  },
  async getMany(filter) {
    return Service.getMany(Post, filter);
  },
  async getManyWithPopulation(filter, field) {
    return Service.getManyWithPopulation(Post, filter, field);
  },

  async update(id, data) {
    return Service.update(Post, id, data);
  },

  async delete(id) {
    return Service.delete(Post, id);
  }  
};