const { DataTypes, Model } = require("sequelize");
const db = require("../lib/db"); 

class ShoppingList extends Model {}

ShoppingList.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("OPEN", "COMPLETED", "ARCHIVED"),
      defaultValue: "OPEN",
      allowNull: false,
    },
  },
  {
    sequelize: db.connection,
    modelName: "ShoppingList",
    tableName: "shopping_lists",
    underscored: true,
  }
);

module.exports = ShoppingList;