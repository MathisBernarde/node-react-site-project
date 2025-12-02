const { Recipe, User } = require('../migrator');

module.exports = {
    // takeall ricepes (Publiques + perso)
    cget: async (req, res) => {
        try {
            const recipes = await Recipe.findAll({
                where: {
                    //public ou moi
                    [require('sequelize').Op.or]: [
                        { isPublic: true },
                        { UserId: req.user.id }
                    ]
                },
                include: [User] // voir qui a cree recette
            });
            res.json(recipes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // creer recette
    post: async (req, res) => {
        try {
            const newRecipe = await Recipe.create({
                ...req.body,
                UserId: req.user.id // force id créateur a etre celui du user connecte
            });
            res.status(201).json(newRecipe);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // modifier recette + vérif
    patch: async (req, res) => {
        try {
            const id = req.params.id;
            const recipe = await Recipe.findByPk(id);

            if (!recipe) return res.sendStatus(404);

            //si pas proprio ou pas adm -> not allowed
            if (recipe.UserId !== req.user.id && req.user.role !== 'admin') {
                return res.sendStatus(403);
            }

            Object.assign(recipe, req.body);
            await recipe.save();
            res.json(recipe);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // delete + vérif
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const recipe = await Recipe.findByPk(id);
            if (!recipe) return res.sendStatus(404);

            if (recipe.UserId !== req.user.id && req.user.role !== 'admin') {
                return res.sendStatus(403);
            }

            await recipe.destroy();
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};