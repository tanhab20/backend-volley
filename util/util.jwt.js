"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.extractToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_AUTH_SECRET || "AEIOU";
const generateToken = (payLoad, option) => {
    if (option) {
        return jsonwebtoken_1.default.sign(payLoad, secret, option);
    }
    else {
        return jsonwebtoken_1.default.sign(payLoad, secret);
    }
};
exports.generateToken = generateToken;
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const tokens = authHeader.split(",");
    const accessToken = tokens[0].trim().split(" ")[1];
    const roleToken = tokens[1].trim().split(" ")[1];
    return { accessToken, roleToken };
};
exports.extractToken = extractToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
