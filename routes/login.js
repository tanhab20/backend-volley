"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../mock/user");
const util_jwt_1 = require("../util/util.jwt");
const router = express_1.default.Router();
router.post("/login", (req, res) => {
    const user = req.body;
    if (!user) {
        res.status(401).json({ message: "no user" });
    }
    const loggedUser = user_1.users.find((u) => u.username === user.username && u.password === user.password);
    if (!loggedUser) {
        res.status(401).json({ message: "no user" });
    }
    else {
        const accessToken = (0, util_jwt_1.generateToken)({ user: loggedUser });
        const roleToken = (0, util_jwt_1.generateToken)({ role: loggedUser.role }, { expiresIn: "1h" });
        res.status(201).send({ accessToken, roleToken });
    }
});
module.exports = router;
