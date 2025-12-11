const { DataTypes, Model } = require("sequelize");
const db = require("../lib/db");

class Recipe extends Model {}

Recipe.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    steps: {
      type: DataTypes.TEXT, // stocker étapes JSON
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false // défaut, recette = privée
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize: db.connection,
    modelName: "Recipe",
    tableName: "recipes",
    underscored: true // cree colonnes created_at + updated_at
  }
);

module.exports = Recipe;