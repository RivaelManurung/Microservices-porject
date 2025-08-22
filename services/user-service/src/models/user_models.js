const { DataTypes } = require('sequelize');

// File ini mengekspor sebuah fungsi
module.exports = (sequelize) => {
    // Fungsi ini mendefinisikan model 'User'
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 1000.00
        }
    }, { timestamps: true });

    return User; 
};