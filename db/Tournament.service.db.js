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
exports.initializeDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Tournaments_model_db_1 = require("./Tournaments.model.db");
const turnier_mock_1 = require("../mock/turnier_mock");
const DB_URL = 'mongodb://admin:admin@localhost:27017/volley_master?authSource=admin';
const initializeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the existing tournaments and insert mock data
        yield mongoose_1.default.connect(DB_URL);
        yield Tournaments_model_db_1.TournamentModel.deleteMany();
        yield Tournaments_model_db_1.TournamentModel.insertMany(turnier_mock_1.mockTournaments);
        console.log('Database initialized with mock tournaments.');
    }
    catch (error) {
        console.error('Error initializing the database:', error);
        throw error;
    }
});
exports.initializeDB = initializeDB;
