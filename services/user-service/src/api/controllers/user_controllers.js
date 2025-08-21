const jwt = require('jsonwebtoken');

class UserController {
    constructor(userService) {
        this.userService = userService;
        // Ambil secret key dari environment variable untuk keamanan
        this.jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
    }

    // Fungsi untuk membuat token
    _createToken(user) {
        // Token berisi data user yang tidak sensitif dan berlaku selama 1 jam
        return jwt.sign({ id: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
    }

    register = async (req, res) => {
        try {
            const user = await this.userService.register(req.body);
            const token = this._createToken(user);
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const user = await this.userService.login(req.body);
            const token = this._createToken(user);
            res.status(200).json({ message: "Login successful", user, token });
        } catch (error) {
            res.status(401).json({ error: error.message }); // 401 Unauthorized
        }
    };
    
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };
}

module.exports = UserController;