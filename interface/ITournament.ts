import {Document} from "mongoose";

export interface ITournament{
    name: string;
    date: Date;
    location: string;
    duration: string;
    description: string;
}