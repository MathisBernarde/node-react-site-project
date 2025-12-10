const { DataTypes, Model } = require("sequelize");
const { connection } = require("../lib/db");

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
    sequelize: connection,
    tableName: "ingredients",
    underscored: true
  }
);

module.exports = Ingredient;