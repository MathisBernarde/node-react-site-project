const { DataTypes, Model } = require("sequelize");
const db = require("../lib/db");

class RecipeIngredient extends Model {}

RecipeIngredient.init(
  {
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: db.connection,
    modelName: "RecipeIngredient",
    tableName: "recipe_ingredients",
    underscored: true,
    timestamps: false
  }
);

module.exports = RecipeIngredient;