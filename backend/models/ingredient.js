const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Ingredient = sequelize.define('Ingredient', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING, // ex: "grams", "litres"
        }
    });
    return Ingredient;
};