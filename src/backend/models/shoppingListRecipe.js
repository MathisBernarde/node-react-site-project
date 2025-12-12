const { DataTypes, Model } = require("sequelize");
const db = require("../lib/db");

class ShoppingListRecipe extends Model {}

ShoppingListRecipe.init( {},
  {
    sequelize: db.connection,
    modelName: "ShoppingListRecipe",
    tableName: "shopping_list_recipes",
    underscored: true,
    timestamps: false
  }
);

module.exports = ShoppingListRecipe;