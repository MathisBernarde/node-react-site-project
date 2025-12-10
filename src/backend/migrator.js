const { getConnection } = require("./lib/db");

const User = require("./models/users");
const Recipe = require("./models/recipe");

getConnection()
  .then(async (connection) => {
    console.log("Connexion BDD établie pour la migration.");
    User.hasMany(Recipe, { as: 'recipes', foreignKey: 'userId' });
    Recipe.belongsTo(User, { as: 'author', foreignKey: 'userId' });

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