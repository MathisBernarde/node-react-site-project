const jwt = require('jsonwebtoken');
const process = require('process');

module.exports = (req, res, next) => {
    // récupère le header "Authorization"
    const header = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!header) {
        return res.sendStatus(401); // not connected
    }

    const [type, token] = header.split(/\s+/);

    if (type !== 'Bearer') {
        return res.sendStatus(401); // bad format
    }

    try {
        // vérifie token avec clef secrète (doit être la même que dans security.js)
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = payload; // requete attacher au user
        next();
    } catch (e) {
        return res.sendStatus(401); // token invalide ou expiré
    }
};