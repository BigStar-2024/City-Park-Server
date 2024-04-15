import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
export const JWT_SIGN_KEY = 'aV2lvkQbG0VvgffhFiP64nqrd9I0AN5m';
export interface FilesObject {
    [fieldname: string]: Express.Multer.File[];
}
export interface CustomUserRequest extends Request {
    decodedToken?: DecodedIdToken;
}
export interface CustomSenderRequest extends Request {
    siteCode?: string;
}