const Recipe = require("../models/recipe");
const User = require("../models/users"); // used to showuser name
const { Op } = require("sequelize"); // conditions OU

module.exports = {
  cget: async (req, res, next) => {
    try {
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
      res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // see une seule recette
  get: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
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
  update: async (req, res, next) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.sendStatus(404);

      // SECU : seul adm ou le propriétaire peut modifier
      if (req.user.role !== 'ADMIN' && recipe.userId !== req.user.id) {
        return res.sendStatus(403);
      }

      await recipe.update(req.body);
      res.json(recipe);
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