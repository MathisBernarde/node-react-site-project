const Ingredient = require("../models/ingredient");

// 1. Récupérer tous les ingrédients
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 2. Créer un nouvel ingrédient
exports.createIngredient = async (req, res) => {
  try {
    const { name, unit } = req.body;
    // Vérification simple
    if (!name) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }
    const newIngredient = await Ingredient.create({ name, unit });
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création", error });
  }
};

// 3. Modifier un ingrédient
exports.updateIngredient = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, unit } = req.body;
        
        const [updated] = await Ingredient.update({ name, unit }, { where: { id: id } });
        
        if (updated) {
            const updatedIngredient = await Ingredient.findByPk(id);
            res.json(updatedIngredient);
        } else {
            res.status(404).json({ message: "Ingrédient non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};