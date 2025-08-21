const express = require('express');
const router = express.Router();

// Di sini kita mengekspor sebuah FUNGSI, bukan objek
module.exports = (userController) => {
    router.get('/', userController.getAllUsers);
    router.post('/register', userController.register);
    router.post('/login', userController.login);
    
    // Fungsi ini MENGEMBALIKAN router yang sudah dikonfigurasi
    return router;
};