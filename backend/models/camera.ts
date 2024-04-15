
import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
    lot: {
        type: String,
        required: true,
    },
    cameras: [{
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    }]
},
    { timestamps: true }
);

const cameraModel = mongoose.models.Camera || mongoose.model("Camera", cameraSchema);
export default cameraModel;