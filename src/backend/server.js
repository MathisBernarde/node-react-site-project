const express = require("express");
const cors = require("cors");
const { getConnection } = require("./lib/db");

const User = require("./models/users");
const Recipe = require("./models/recipe");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API Recettes en ligne");
});

getConnection().then(() => {
  User.hasMany(Recipe, { as: 'recipes', foreignKey: 'userId' });
  Recipe.belongsTo(User, { as: 'author', foreignKey: 'userId' });
  
  const securityRouter = require("./routes/security");
  const userRouter = require("./routes/users");
  const recipeRouter = require("./routes/recipes");

  app.use(securityRouter);
  app.use(userRouter);
  app.use(recipeRouter);

  app.listen(3000, () => {
    console.log("Server listening on http://localhost:3000");
  });
}).catch(err => {
  console.error("Erreur critique au démarrage:", err);
});