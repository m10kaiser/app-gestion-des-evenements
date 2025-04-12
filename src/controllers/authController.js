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
        const { email, password } = req.body;
        const Utilisateur = await Utilisateur.findOne({ email });
        if (!Utilisateur) return res.status(400).json({ error: 'Utilisateur introuvable' });
        const isPasswordValid = await bcrypt.compare(password, Utilisateur.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Mot de passe incorrect' });
        const token = jwt.sign({ UtilisateurId: Utilisateur._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, Utilisateur: { _id: Utilisateur._id, utilisateur: Utilisateur.username, email:
        Utilisateur.email } });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};