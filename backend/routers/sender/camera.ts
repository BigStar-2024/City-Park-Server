
import express from "express";
import cameraModel from "../../models/camera";
import { CustomSenderRequest } from "../../types";
const cameraRouter = express.Router();

cameraRouter
    .route("/")
    .post(async (req: CustomSenderRequest, res) => {
        const { cameras } = req.body;
        try {
            const lot = req.siteCode
            if (!lot) throw new Error("token doesn't contain lot info!")
            const lotCamera = await cameraModel.find({ lot });
            let data
            if (lotCamera.length === 0) {
                data = await cameraModel.create({
                    lot, cameras
                })
            } else {
                data = await cameraModel.updateOne({ lot }, {
                    lot, cameras
                })
            }

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

export default cameraRouter;