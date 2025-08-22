const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/sesion_jwt");
class AuthService {
  constructor(userModel) {
    this.User = userModel;
  }

  async register(userData) {
    const { name, email, password } = userData;

    const existingUser = await this.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.User.create({
      ...userData,
      password: hashedPassword,
    }); 

    return newUser.toJSON();
  }

  async login(credentials) {
    const { email, password } = credentials;
    const user = await this.User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found or invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    return user.toJSON();
  }

  createToken(user) {
    const token = jwt.sign({ id: user.id }, config.jwt.secret, {
      expiresIn: "1h",
    });
    return token;
  }
}

module.exports = AuthService;