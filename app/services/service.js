module.exports = {
  async create(Model, data) {
    try {
      const model = new Model(data);
      await model.save();
      return model;
    } catch (error) {
      throw error;
    }
  },

  async get(Model, id) {
    try {
      const model = await Model.findById(id);
      return model;
    } catch (error) {
      throw error;
    }
  },
  async getWithPopulation(Model, id, field) {
    try {
      const model = await Model.findById(id).populate(field);
      return model;
    } catch (error) {
      throw error;
    }
  },
  async getMany(Model, filter) {
    try {
      const models = await Model.find(filter);
      return models;
    } catch (error) {
      throw error;
    }
  },
  async getManyWithPopulation(Model, filter, field) {
    try {
      const models = await Model.find(filter).populate(field);
      return models;
    } catch (error) {
      throw error;
    }
  },

  async update(Model, id, data) {
    try {
      const model = await Model.findByIdAndUpdate(id, data, { new: true });
      return model;
    } catch (error) {
      throw error;
    }
  },

  async delete(Model, id) {
    try {
      await Model.findByIdAndDelete(id);
      return { message: "Item deleted successfully" };
    } catch (error) {
      throw error;
    }
  },
};  

/* 
const create = async (Model, data) => {
  try {
    const model = new Model(data);
    await model.save();
    return model;
  } catch (error) {
    throw error;
  }
};

const get = async (Model, id) => {
  try {
    const model = await Model.findById(id);
    return model;
  } catch (error) {
    throw error;
  }
};

const getMany = async (Model, filter) => {
  try {
    const models = await Model.find(filter);
    return models;
  } catch (error) {
    throw error;
  }
};

const update = async (Model, id, data) => {
  try {
    const model = await Model.findByIdAndUpdate(id, data, { new: true });
    return model;
  } catch (error) {
    throw error;
  }
};

const delete = async (Model, id) => {
  try {
    await Model.findByIdAndDelete(id);
    return { message: "Item deleted successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  get,
  getMany,
  update,
  delete
};

*/
