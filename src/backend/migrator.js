const { getConnection } = require("./lib/db");

getConnection()
  .then(async (connection) => {
    console.log("Connexion BDD Ã©tablie pour la migration.");
    const User = require("./models/users");
    const ShoppingList = require("./models/shoppingList");
    const Recipe = require("./models/recipe");
    const Ingredient = require("./models/ingredient");
    const RecipeIngredient = require("./models/recipeIngredient");
    const ShoppingListRecipe = require("./models/shoppingListRecipe");

    User.hasMany(ShoppingList, { foreignKey: "userId" });
    ShoppingList.belongsTo(User, { foreignKey: "userId" });

    User.hasMany(Recipe, { as: 'recipes', foreignKey: 'userId' });
    Recipe.belongsTo(User, { as: 'author', foreignKey: 'userId' });

    Recipe.belongsToMany(Ingredient, { through: RecipeIngredient });
    Ingredient.belongsToMany(Recipe, { through: RecipeIngredient });

    ShoppingList.belongsToMany(Recipe, { through: ShoppingListRecipe });
    Recipe.belongsToMany(ShoppingList, { through: ShoppingListRecipe });

    await connection.sync({ alter: true });
    
    return connection;
  })
  .then((connection) => {
    console.log("All models were synchronized successfully.");
    connection.close();
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });