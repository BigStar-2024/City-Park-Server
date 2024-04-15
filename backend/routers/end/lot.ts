
import express from "express";
import multer from "multer";
import { CustomUserRequest, FilesObject, JWT_SIGN_KEY } from "../../types";
import lotModel from "../../models/lot";
import jwt from 'jsonwebtoken'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored
        cb(null, 'public/img/');
    },
    filename: async function (req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        const originalExtension = file.originalname.split('.').pop();
        const newFileName = file.fieldname + '-' + uniqueSuffix + '.' + originalExtension;
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB in bytes
    },
});
const lotRouter = express.Router();

lotRouter
    .route("/")
    .post(upload.fields([{ name: 'cover', maxCount: 1 },]),
        async (req, res) => {
            const { url, siteCode, owners } = req.body;
            const files = req.files as FilesObject;
            const coverImage = files['cover'] ? files['cover'][0] : null
            try {
                const token = jwt.sign({ siteCode }, JWT_SIGN_KEY, { expiresIn: "10y" });
                const data = await lotModel.create({
                    token, url, siteCode, owners,
                    cover: "img/" + (coverImage as any).filename
                })
                res.status(200).json({
                    success: true,
                    data: data,
                });
            } catch (error) {
                console.log("API error", error);
                if (!res.headersSent) {
                    res.send(500).json({
                        success: false,
                        error: "Server error",
                    });
                }
            }
        })
    .get(async (req: CustomUserRequest, res) => {
        const lot = await lotModel.find(req.decodedToken?.admin ? {} : { owners: req.decodedToken?.email });
        res.status(200).json(lot);
    })

lotRouter.route("/:_id/")
    .delete(async (req, res) => {
        const { _id } = req.params
        try {
            await lotModel.deleteOne({ _id })
            res.status(200).json({ success: true });
        } catch (e) {
            res.send(500).json({
                success: false,
                error: "Server error",
            });
        }
    })

export default lotRouter;