
import express from "express";
import multer from "multer";
import { CustomSenderRequest, FilesObject } from "../../types";
import dataModel from "../../models/data";
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
const dataRouter = express.Router();

dataRouter
    .route("/")
    .post(upload.fields([
        { name: 'plate', maxCount: 1 },
        { name: 'vehicle', maxCount: 1 }
    ]), async (req: CustomSenderRequest, res: any) => {
        const lot = req.siteCode
        const { camera, plateNumber, direction, time } = req.body;
        console.log(camera)
        console.log(plateNumber)
        console.log(direction)
        console.log(time)
        const files = req.files as FilesObject;

        try {
            if (files) {
                const plate = files['plate'] ? files['plate'][0] : null
                const vehicle = files['vehicle'] ? files['vehicle'][0] : null
                const data = await dataModel.create({
                    lot, camera, plateNumber, direction, time,
                    vehicle: "img/" + (vehicle as any).filename,
                    plate: "img/" + (plate as any).filename
                })
                
                res.status(200).json({
                    success: true,
                    data: data,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Image file is missing."
                });
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
    })

export default dataRouter;