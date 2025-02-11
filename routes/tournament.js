"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tournaments_model_db_1 = require("../db/Tournaments.model.db");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locations, durations, search } = req.query;
        let query = {};
        // Locations filtern (nur die Stadt berücksichtigen)
        if (locations) {
            const locationArray = locations
                .split(',')
                .map(location => location.trim()); // Leerzeichen entfernen
            query.location = { $in: locationArray.map(location => location.split(',')[0].trim()) };
        }
        // Durations filtern
        if (durations) {
            const durationArray = durations
                .split(',')
                .map(duration => duration.trim()); // Leerzeichen entfernen
            query.duration = { $in: durationArray };
        }
        // Search-Filter (name durchsuchen)
        if (search) {
            query.name = { $regex: new RegExp(search, 'i') }; // Regulärer Ausdruck für den Suchbegriff
        }
        const tournaments = yield Tournaments_model_db_1.TournamentModel.find(query);
        res.status(200).json(tournaments);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Turniere' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tournamentId = req.params.id;
    try {
        const tournament = yield Tournaments_model_db_1.TournamentModel.findById(tournamentId);
        if (tournament) {
            res.status(200).json(tournament);
        }
        else {
            res.status(404).json({ error: 'Turnier nicht gefunden' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Turniers' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, date, location, duration, description } = req.body;
    try {
        const newTournament = new Tournaments_model_db_1.TournamentModel({
            name,
            date: new Date(date),
            location,
            duration,
            description
        });
        const savedTournament = yield newTournament.save();
        res.status(201).json(savedTournament);
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Turniers' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTournament = yield Tournaments_model_db_1.TournamentModel.findByIdAndDelete(id);
        if (!deletedTournament) {
            res.status(404).json({ message: 'Turnier nicht gefunden' });
        }
        else {
            res.status(200).json({ message: 'Turnier erfolgreich gelöscht', deletedTournament });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen des Turniers' });
    }
}));
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, date, location, duration, description } = req.body;
        const updatedTournament = yield Tournaments_model_db_1.TournamentModel.findByIdAndUpdate(req.params.id, { name, date: new Date(date), location, duration, description }, { new: true, runValidators: true });
        if (!updatedTournament) {
            return res.status(404).json({ message: 'Turnier nicht gefunden' });
        }
        res.status(200).json({ message: 'Turnier erfolgreich aktualisiert', updatedTournament });
    }
    catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Turniers' });
    }
}));
//router.patch('/:id', async (req: Request, res: Response) => {
//    const { id } = req.params;
//    const { name, date, location, duration, description } = req.body;
//
//    try {
//        // Führe die Aktualisierung durch
//        const updatedTournament = await TournamentModel.findByIdAndUpdate(
//            id,
//            { name, date: new Date(date), location, duration, description },
//            { new: true, runValidators: true } // `new: true` gibt das aktualisierte Dokument zurück
//        );
//
//        // Überprüfe, ob das Turnier existiert und aktualisiert wurde
//        if (!updatedTournament) {
//            return res.status(404).json({ message: 'Turnier nicht gefunden' });
//        }
//
//        // Erfolgreiche Antwort mit dem aktualisierten Turnier
//        res.status(200).json({ message: 'Turnier erfolgreich aktualisiert', updatedTournament });
//    } catch (error) {
//        // Fehlerbehandlung
//        console.error('Fehler beim Aktualisieren des Turniers:', error);
//        return res.status(500).json({ error: 'Fehler beim Aktualisieren des Turniers' });
//    }
//});
module.exports = router;
