const { DataTypes, Model } = require("sequelize");
const db = require("../lib/db");

class Ingredient extends Model {}

Ingredient.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "g",
    },
  },
  {
    sequelize: db.connection,
    modelName: "Ingredient",
    tableName: "ingredients",
    underscored: true
  }
);

module.exports = Ingredient;