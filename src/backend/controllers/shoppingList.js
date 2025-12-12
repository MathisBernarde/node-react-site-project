const ShoppingList = require("../models/shoppingList");
const Recipe = require("../models/recipe");
const Ingredient = require("../models/ingredient");
const User = require("../models/users");

module.exports = {
  cget: async (req, res, next) => {
    try {
      const options = {
        include: [
            { 
                model: User, 
                attributes: ["id", "login", "email"]
            },
            { 
                model: Recipe, 
                include: [
                    { 
                        model: Ingredient, 
                        through: { attributes: ['quantity', 'unit'] } 
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']]
      };
      if (req.user.role !== 'ADMIN') {
        options.where = { userId: req.user.id };
      }
      const lists = await ShoppingList.findAll(options);
      res.json(lists);
    } catch (e) {
      next(e);
    }
  },
  create: async (req, res, next) => {
    try {
      const list = await ShoppingList.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(list);
    } catch (error) { next(error); }
  },

  addRecipe: async (req, res, next) => {
    try {
        const listId = parseInt(req.params.id);
        const recipeId = parseInt(req.body.recipeId);
        const list = await ShoppingList.findByPk(listId);
        if (!list) return res.sendStatus(404);
        if (req.user.role !== 'ADMIN' && list.userId !== req.user.id) {
            return res.sendStatus(403);
        }
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) return res.status(404).json({message: "Recette introuvable"});
        await list.addRecipe(recipe);
        
        res.json({ success: true, message: "Recette ajoutée à la liste" });
    } catch(e) { next(e); }
  },
  update: async (req, res, next) => {
    try {
      const list = await ShoppingList.findByPk(req.params.id);
      if (!list) return res.sendStatus(404);
      if (req.user.role !== 'ADMIN' && list.userId !== req.user.id) {
        return res.sendStatus(403);
      }
      await list.update(req.body);
      res.json(list);
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      const list = await ShoppingList.findByPk(req.params.id);
      if (!list) return res.sendStatus(404);
      if (req.user.role !== 'ADMIN' && list.userId !== req.user.id) return res.sendStatus(403);

      await list.destroy();
      res.sendStatus(204);
    } catch (error) { next(error); }
  }
};