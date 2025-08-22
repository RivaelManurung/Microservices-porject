const bcrypt = require("bcrypt");

class UserService {
  constructor(userModel) {
    this.User = userModel;
  }

  async getAllUsers() {
    return await this.User.findAll({
      attributes: { exclude: ["password"] },
    });
  }
}

module.exports = UserService;
