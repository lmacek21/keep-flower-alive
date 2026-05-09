const User = require("../models/user.model");

const UserDao = {
  create: (data) => User.create(data),
  deleteById: (id) => User.findByIdAndDelete(id),
  getByEmail: (email) => User.findOne({ email }),
};

module.exports = UserDao;
