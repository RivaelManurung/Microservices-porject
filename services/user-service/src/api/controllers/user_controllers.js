const jwt = require("jsonwebtoken");

class UserController {
  constructor(userService, authService) {
    this.userService = userService;
    this.authService = authService;
  }
  register = async (req, res) => {
    try {
      const user = await this.userService.register(req.body);
      const token = this.authService.createToken(user);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const user = await this.userService.login(req.body);
      const token = this.authService.createToken(user);
      res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
      res.status(401).json({ error: error.message }); 
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };
}

module.exports = UserController;
