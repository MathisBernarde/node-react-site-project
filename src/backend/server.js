const express = require("express");
const cors = require("cors");
const { getConnection } = require("./lib/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bonjour ! L'API Recettes est en ligne et fonctionnelle.");
});
getConnection().then(() => {
    console.log("Database connected via Server");
    const User = require("./models/users");
    const ShoppingList = require("./models/shoppingList");

    User.hasMany(ShoppingList, { foreignKey: 'userId' });
    ShoppingList.belongsTo(User, { foreignKey: 'userId' });
    
    const userRouter = require("./routes/users");
    const securityRouter = require("./routes/security");
    const shoppingListRouter = require("./routes/shoppingList");

    app.use(userRouter);
    app.use(securityRouter);
    app.use(shoppingListRouter);
    app.listen(3000, () => {
        console.log("Server listening on port 3000");
    });

}).catch(err => {
    console.error("Failed to start server:", err);
});