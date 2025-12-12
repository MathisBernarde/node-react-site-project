const Recipe = require("../models/recipe");
const User = require("../models/users"); // used to showuser name
const Ingredient = require("../models/ingredient");
const RecipeIngredient = require("../models/recipeIngredient");
const { Op } = require("sequelize"); // conditions OU

module.exports = {
  cget: async (req, res, next) => {
    try {
      const options = {
        include: [
            { 
              model: User, 
              as: 'author', 
              attributes: ['login', 'email']
            },
            // 👇 ON INCLUT LES INGRÉDIENTS
            { 
              model: Ingredient, 
              through: { attributes: ['quantity', 'unit'] } 
            }
        ]
      };
      // Si adm = see all
      if (req.user.role === 'ADMIN') {
        const recipes = await Recipe.findAll();
        return res.json(recipes);
      }

      // Si user = vois ces recette ou les bublique
      const recipes = await Recipe.findAll({
        where: {
          [Op.or]: [
            { userId: req.user.id }, // c'est à moi
            { isPublic: true }       // c'est public
          ]
        },
        include: [{ 
            model: User, 
            as: 'author', 
            attributes: ['email']
        }]
      });
      res.json(recipes);
    } catch (error) {
      next(error);
    }
  },

  // cree recettes
  create: async (req, res, next) => {
    try {
      const recipe = await Recipe.create({
        ...req.body,
        userId: req.user.id
      });
      if (req.body.ingredients && req.body.ingredients.length > 0) {
        for (const item of req.body.ingredients) {
            await recipe.addIngredient(item.id, { 
                through: { quantity: item.quantity, unit: item.unit } 
            });
        }
      }
      res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // see une seule recette
  get: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id, {
        include: [
            { model: User, as: 'author', attributes: ['login'] },
            { model: Ingredient, through: { attributes: ['quantity', 'unit'] } }
        ]
      });
      if (!recipe) return res.sendStatus(404);

      // VERIF : if adm OU Auteur OU Recette publique = OK
      if (req.user.role === 'ADMIN' || recipe.userId === req.user.id || recipe.isPublic) {
        return res.json(recipe);
      }
      
      // else : nop
      return res.sendStatus(403);
    } catch (error) {
      next(error);
    }
  },

  // modifier
  // modifier
  update: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.sendStatus(404);

      // SECU
      if (req.user.role !== 'ADMIN' && recipe.userId !== req.user.id) {
        return res.sendStatus(403);
      }

      // 1. Mise à jour des textes (Titre, description...)
      await recipe.update(req.body);

      // 2. Mise à jour des ingrédients (Le plus important !)
      if (req.body.ingredients) {
        // Étape A : On enlève tous les anciens ingrédients de cette recette
        // (Cela vide la table de liaison pour cette recette)
        await recipe.setIngredients([]); 

        // Étape B : On remet les nouveaux (comme dans le Create)
        for (const item of req.body.ingredients) {
            await recipe.addIngredient(item.id, { 
                through: { quantity: item.quantity, unit: item.unit } 
            });
        }
      }

      // 3. On renvoie la recette fraîchement mise à jour
      const updatedRecipe = await Recipe.findByPk(recipe.id, {
          include: [
            { model: User, as: 'author', attributes: ['login'] },
            { model: Ingredient, through: { attributes: ['quantity', 'unit'] } }
          ]
      });

      res.json(updatedRecipe);
    } catch (error) {
      next(error);
    }
  },

  // supprimer
  delete: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.sendStatus(404);

      // SECU : Seul l'Admin ou le Propriétaire peut supprimer
      if (req.user.role !== 'ADMIN' && recipe.userId !== req.user.id) {
        return res.sendStatus(403);
      }

      await recipe.destroy();
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
};