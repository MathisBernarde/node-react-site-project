const { getConnection } = require("./lib/db");

const User = require("./models/users");
const Recipe = require("./models/recipe");

getConnection()
  .then(async (connection) => {
    console.log("Migration en cours...");

    User.hasMany(Recipe, { as: 'recipes', foreignKey: 'userId' });
    Recipe.belongsTo(User, { as: 'author', foreignKey: 'userId' });

    await connection.sync({ alter: true });
    
    return connection;
  })
  .then((connection) => {
    console.log("Migration terminée avec succès !");
    connection.close();
  })
  .catch((error) => {
    console.error("Erreur durant la migration:", error);
  });