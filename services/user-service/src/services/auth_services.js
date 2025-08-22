const { use } = require("react");

class AuthService {
  constructor(userModel) {
    this.User = userModel;
  }

  async register(userData) {
    const { name, email } = userData;

    const existingUser = await this.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already use");
    }

    const existingNameUser = await this.User.findOne({ where: { name } });
    if (existingNameUser) {
      throw new Error("Name already use");
    }

    //password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.User.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser.toJSON();
  }

  async login(credentials) {
    const { email, password } = credentials;
    const user = await this.User.findOne({ where: { name, email } });
    if (!user) {
      throw new Error("User not found / Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    return user.toJSON();
  }

  createToken(user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
}
