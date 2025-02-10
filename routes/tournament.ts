import express from 'express';
import { Request, Response } from 'express';
import { TournamentModel } from "../db/Tournaments.model.db";
import {ITournament} from "../interface/ITournament";

const router = express.Router();


router.get('/', async (req: Request, res: Response) => {
    try {
        const { locations, durations, search } = req.query;

        let query: any = {};

        // Locations filtern (nur die Stadt berücksichtigen)
        if (locations) {
            const locationArray = (locations as string)
                .split(',')
                .map(location => location.trim());  // Leerzeichen entfernen
            query.location = { $in: locationArray.map(location => location.split(',')[0].trim()) };
        }

        // Durations filtern
        if (durations) {
            const durationArray = (durations as string)
                .split(',')
                .map(duration => duration.trim());  // Leerzeichen entfernen
            query.duration = { $in: durationArray };
        }

        // Search-Filter (name durchsuchen)
        if (search) {
            query.name = { $regex: new RegExp(search, 'i') };  // Regulärer Ausdruck für den Suchbegriff
        }

        const tournaments = await TournamentModel.find(query);
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Turniere' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const tournamentId = req.params.id;

    try {
        const tournament = await TournamentModel.findById(tournamentId);

        if (tournament) {
            res.status(200).json(tournament);
        } else {
            res.status(404).json({ error: 'Turnier nicht gefunden' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Turniers' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { name, date, location, duration, description }: ITournament = req.body;

    try {
        const newTournament = new TournamentModel({
            name,
            date: new Date(date),
            location,
            duration,
            description
        });

        const savedTournament = await newTournament.save();
        res.status(201).json(savedTournament);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Turniers' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedTournament = await TournamentModel.findByIdAndDelete(id);

        if (!deletedTournament) {
            res.status(404).json({ message: 'Turnier nicht gefunden' });
        } else {
            res.status(200).json({ message: 'Turnier erfolgreich gelöscht', deletedTournament });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen des Turniers' });
    }
});

router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { name, date, location, duration, description } = req.body;
        const updatedTournament = await TournamentModel.findByIdAndUpdate(
            req.params.id,
            { name, date: new Date(date), location, duration, description },
            { new: true, runValidators: true }
        );

        if (!updatedTournament) {
            return res.status(404).json({ message: 'Turnier nicht gefunden' });
        }

        res.status(200).json({ message: 'Turnier erfolgreich aktualisiert', updatedTournament });
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Turniers' });
    }
});

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
