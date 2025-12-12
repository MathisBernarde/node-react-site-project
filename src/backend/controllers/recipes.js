const Recipe = require("../models/recipe");
const User = require("../models/users");
const { Op } = require("sequelize");

module.exports = {
  // GET
  cget: async (req, res, next) => {
    try {
      let whereClause = {};

      // Si l'utilisateur n'est PAS admin, on filtre
      if (req.user.role !== 'ADMIN') {
        whereClause = {
          [Op.or]: [
            { userId: req.user.id }, // mes recettes
            { isPublic: true }       // les recettes publiques
          ]
        };
      }

      const recipes = await Recipe.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'email', 'username']
          }
        ],
        order: [['createdAt', 'DESC']] // les recents en premier
      });

      res.json(recipes);
    } catch (error) {
      console.error("Erreur récupération recettes:", error);
      next(error);
    }
  },

  // POST
  create: async (req, res, next) => {
    try {
      const recipe = await Recipe.create({
        ...req.body,
        userId: req.user.id // On force l'auteur a etre celui du token
      });
      res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // GET
  get: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id, {
        include: [{ 
            model: User, 
            as: 'author', 
            attributes: ['id', 'email', 'username'] 
        }]
      });

      if (!recipe) return res.sendStatus(404);

      // Vérification droits lecture
      const isAdmin = req.user.role === 'ADMIN';
      const isAuthor = recipe.userId === req.user.id;
      const isPublic = recipe.isPublic;

      if (!isAdmin && !isAuthor && !isPublic) {
        return res.sendStatus(403); // Interdit
      }

      res.json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // PATCH
  update: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.sendStatus(404);

      // Seul l'auteur ou l'admin peut modifier
      if (req.user.role !== 'ADMIN' && recipe.userId !== req.user.id) {
        return res.sendStatus(403);
      }

      await recipe.update(req.body);
      res.json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // DELETE
  delete: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.sendStatus(404);

      // Seul l'auteur ou l'admin peut supprimer
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