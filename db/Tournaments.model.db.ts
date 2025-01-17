import mongoose, { Schema, Document } from "mongoose";
import {ITournament} from "../interface/ITournament";


// Define the schema for the Tournament model
const tournamentSchema = new Schema<ITournament>({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String }
});

// Create and export the model
const TournamentModel = mongoose.model<ITournament>('Tournament', tournamentSchema);
export { TournamentModel };
