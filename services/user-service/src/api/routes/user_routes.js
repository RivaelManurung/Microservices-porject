const express = require('express');
const router = express.Router();

module.exports = (userController) => {
    // Rute yang sudah ada
    router.get('/', userController.getAllUsers);

    // Rute baru untuk registrasi dan login
    router.post('/register', userController.register);
    router.post('/login', userController.login);
    
    return router;
};