const { Router } = require('express');
const RecipeController = require('../controllers/recipes');
const checkAuth = require('../middlewares/checkAuth');

router.get('/', checkAuth, RecipeController.cget);
router.post('/', checkAuth, RecipeController.post);
router.patch('/:id', checkAuth, RecipeController.patch);
router.delete('/:id', checkAuth, RecipeController.delete);

module.exports = router;