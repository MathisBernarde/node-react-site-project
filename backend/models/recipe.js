const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Recipe = sequelize.define('Recipe', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // recette privée !!
        }
    });
    return Recipe;
};