const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log("Tentative de login pour :", email); 

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("Utilisateur INCONNU en base de données");
            return res.sendStatus(401);
        }

        console.log("Utilisateur trouvé. Hash en base :", user.password);
        console.log("Mot de passe envoyé :", password);

        // Comparaison
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            console.log("Mot de passe INCORRECT (bcrypt.compare a renvoyé false)");
            return res.sendStatus(401);
        }

        console.log("Mot de passe VALIDE. Génération du token...");
        
        // Génération du token
        const token = jwt.sign(
            { user_id: user.id, role: user.role, name: user.name, login: user.login }, // Payload
            process.env.JWT_SECRET, // Secret
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error("Erreur critique dans login :", error);
        res.status(500).json({ error: error.message });
    }
  },
};