class BaseService {
  constructor(Model) {
    this.Model = Model;
  }
  async create(data) {
    try {
      const model = new this.Model(data);
      await model.save();
      return model;
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const model = await this.Model.findById(id);
      return model;
    } catch (error) {
      throw error;
    }
  }

  async getWithPopulation(id, field) {
    try {
      const model = await this.Model.findById(id).populate(field);
      return model;
    } catch (error) {
      throw error;
    }
  }

  async getMany(filter) {
    try {
      const models = await this.Model.find(filter);
      return models;
    } catch (error) {
      throw error;
    }
  }

  async getManyWithPopulation(filter, field) {
    try {
      const models = await this.Model.find(filter).populate(field);
      return models;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data, options) {
    try {
      const model = await this.Model.findByIdAndUpdate(id, data, options);
      return model;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const model = await this.Model.findByIdAndDelete(id);
      return model;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BaseService;
