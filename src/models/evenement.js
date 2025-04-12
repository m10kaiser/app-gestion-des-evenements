const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},    
    date: { type: Date, required: true },
    location: { type: String, required: true},
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Evenement', UserSchema);