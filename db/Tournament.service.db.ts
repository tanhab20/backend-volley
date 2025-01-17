import mongoose from "mongoose";
import {TournamentModel} from "./Tournaments.model.db";
import {mockTournaments} from "../mock/turnier_mock";

const DB_URL = 'mongodb://admin:admin@localhost:27017/volley_master?authSource=admin';



export const initializeDB = async () => {
    try {
        // Clear the existing tournaments and insert mock data
        await mongoose.connect(DB_URL);
        await TournamentModel.deleteMany();
        await TournamentModel.insertMany(mockTournaments);
        console.log('Database initialized with mock tournaments.');
    } catch (error) {
        console.error('Error initializing the database:', error);
        throw error;
    }
};

