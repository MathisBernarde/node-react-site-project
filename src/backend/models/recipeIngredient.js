const { DataTypes, Model } = require("sequelize");
const { connection } = require("../lib/db");

class RecipeIngredient extends Model {}

RecipeIngredient.init(
  {
    quantity: {
      type: DataTypes.FLOAT, 
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    tableName: "recipe_ingredients",
    underscored: true,
    timestamps: false 
  }
);

module.exports = RecipeIngredient;