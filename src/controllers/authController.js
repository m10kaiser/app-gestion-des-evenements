const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// Inscription
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const utlisateurExistant = await Utilisateur.findOne({ email });
        if (utlisateurExistant) return res.status(400).json({ error: 'Email déjà utilisé' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const nouvUtilisateur = new Utilisateur({ username, email, password: hashedPassword });
        await nouvUtilisateur.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// Connexion
exports.login = async (req, res) => {
    try {
        const { email, mdp } = req.body;

        const User = await Utilisateur.findOne({ email });
        if (!User) return res.status(400).json({ error: 'Utilisateur introuvable' });
        console.log("User from DB:", User);
        console.log("Password from DB:", User.password);
        console.log("Password from req.body (mdp):", mdp);
        const isPasswordValid = await bcrypt.compare(mdp, User.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Mot de passe incorrect' });

        const token = jwt.sign({ UtilisateurId: User._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            utilisateur: {
                _id: User._id,
                username: User.username,
                email: User.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

