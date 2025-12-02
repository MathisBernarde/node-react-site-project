const db = require('./lib/db');
const User = require('./models/users')(db);
const Recipe = require('./models/recipe')(db);
const Ingredient = require('./models/ingredient')(db);

User.hasMany(Recipe);
Recipe.belongsTo(User);

// recette = plusieurs ingrédients (et inversement)
Recipe.belongsToMany(Ingredient, { through: 'RecipeIngredients' });
Ingredient.belongsToMany(Recipe, { through: 'RecipeIngredients' });

console.log('Syncing database...');
db.sync({ alter: true })
    .then(() => {
        console.log('Database synced!');
    })
    .catch(console.error);

module.exports = { User, Recipe, Ingredient };