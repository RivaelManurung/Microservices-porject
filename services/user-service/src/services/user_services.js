const bcrypt = require('bcrypt');

class UserService {
    constructor(userModel) {
        this.User = userModel;
    }

    async getAllUsers() {
        return await this.User.findAll({
            // Jangan tampilkan password di list user
            attributes: { exclude: ['password'] }
        });
    }

    async register(userData) {
        const { email, password } = userData;

        // 1. Cek apakah email sudah terdaftar
        const existingUser = await this.User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // 2. Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10); // Angka 10 adalah salt rounds

        // 3. Buat user baru dengan password yang sudah di-hash
        const newUser = await this.User.create({
            ...userData,
            password: hashedPassword,
        });

        // 4. Hapus password dari objek sebelum dikembalikan
        const userJson = newUser.toJSON();
        delete userJson.password;
        
        return userJson;
    }

    async login(credentials) {
        const { email, password } = credentials;

        // 1. Cari user berdasarkan email
        const user = await this.User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials'); // Pesan error generik untuk keamanan
        }

        // 2. Bandingkan password yang diinput dengan hash di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        
        // 3. Jika valid, kembalikan data user tanpa password
        const userJson = user.toJSON();
        delete userJson.password;
        
        return userJson;
    }
}

module.exports = UserService;