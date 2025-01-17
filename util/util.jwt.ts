import jwt from "jsonwebtoken"
import {IAccessTokenPayload} from "../models/IAuthTokenPayload";
import {IRoleTokenPayload} from "../models/IRoleTokenPayload";
import {IDecodedAuthToken} from "../models/IDecodedAuthToken";

const secret = process.env.JWT_AUTH_SECRET||"AEIOU";

export const generateToken = (payLoad:IAccessTokenPayload|IRoleTokenPayload, option?:{expiresIn:string}) =>{
    if (option){
        return jwt.sign(payLoad, secret, option);
    }
    else {
        return jwt.sign(payLoad, secret);
    }
};

export const extractToken = (req:Request) =>{
    const authHeader:string = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return null;
    }

    const tokens:string[] = authHeader.split(",");
    const accessToken:string = tokens[0].trim().split(" ")[1];
    const roleToken:string = tokens[1].trim().split(" ")[1];

    return {accessToken, roleToken};
}

export const verifyToken = (token:string) =>{
    return jwt.verify(token, secret) as IDecodedAuthToken;
}
