const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 1000.00
        }
    }, { timestamps: true });

    return { User };
};