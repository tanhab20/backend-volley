import express from "express";
import {IUser} from "../models/IUser";
import {users} from "../mock/user";
import {generateToken} from "../util/util.jwt";

const router = express.Router();

router.post("/login", (req, res) =>{
    const user:IUser = req.body;

    if (!user){
        res.status(401).json({message:"no user"});
    }

    const loggedUser = users.find((u:IUser) => u.username === user.username && u.password === user.password);

    if (!loggedUser){
        res.status(401).json({message:"no user"});
    }
    else {
        const accessToken = generateToken({user:loggedUser});
        const roleToken = generateToken({role:loggedUser.role}, {expiresIn:"1h"});
        res.status(201).send({accessToken, roleToken});
    }
})

module.exports = router;
