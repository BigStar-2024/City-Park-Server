
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { verifyIdToken } from '../firebase';
import { CustomSenderRequest, CustomUserRequest, JWT_SIGN_KEY } from '../types';
import lotModel from '../models/lot';


export const authEndUserMiddleware = (req: CustomUserRequest, res: Response, next: NextFunction) => {
    if (req.path.includes('/public/')) {
        next()
    } else {
        const idToken = req.get("token") || ""
        verifyIdToken(
            idToken,
            function (decodedToken) {
                req.decodedToken = decodedToken
                next()
            },
            function (error) {
                console.error("error.code", error.code);
                res.status(403).send(error.code)
            })
    }
}
export const authSenderMiddleware = async (req: CustomSenderRequest, res: Response, next: NextFunction) => {
    const idToken = req.get("token")
    if (!idToken) {
        res.status(401).send("header should contain token")
        return
    }
    try {
        const decodedToken = jwt.verify(idToken, JWT_SIGN_KEY) as { siteCode?: string };
        req.siteCode = decodedToken.siteCode
        if (req.siteCode) {
            const lot = await lotModel.find({ siteCode: req.siteCode });
            if (lot.length > 0) {
                next()
            } else {
                res.status(401).send("You are not authorized to send data")
            }
        } else {
            res.status(403).send("403 Forbidden")
        }
    } catch (error) {
        console.log("API error", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: "Server error",
            });
        }
    }
}
export const authSuperMiddleware = (req: CustomUserRequest, res: Response, next: NextFunction) => {
    if (req.decodedToken?.admin) {
        next()
    } else {
        res.status(403).send("403 Forbidden")
    }
}
export const authReadOnlyMiddleware = (req: CustomUserRequest, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
        next()
        return
    }
    if (req.decodedToken?.admin) {
        next()
    } else {
        res.status(403).send("403 Forbidden")
    }
}
