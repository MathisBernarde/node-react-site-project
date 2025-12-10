const { getConnection } = require("./lib/db");

getConnection()
  .then(async (connection) => {
    console.log("Migrator connected.");

    // 1. On charge les modèles
    // Comme getConnection a fini, db.connection est rempli.
    // Les require ci-dessous vont donc réussir leur User.init() et ShoppingList.init()
    const User = require("./models/users");
    const ShoppingList = require("./models/shoppingList");

    // 2. On définit les relations
    // Maintenant que les modèles sont initialisés, hasMany fonctionne
    User.hasMany(ShoppingList, { foreignKey: "userId" });
    ShoppingList.belongsTo(User, { foreignKey: "userId" });

    // 3. On synchronise
    await connection.sync({ alter: true });
    console.log("Database synchronized successfully.");
    
    await connection.close();
  })
  .catch((error) => {
    console.error("Migration failed:", error);
  });