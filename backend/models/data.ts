
import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    lot: {
        type: String,
        required: true,
    },
    camera: {
        type: String,
        required: true,
    },
    plateNumber: {
        type: String,
        required: true,
    },
    plate: {
        type: String,
        required: true,
    },
    vehicle: {
        type: String,
        required: true,
    },
    direction: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
},
    { timestamps: false }
);

const dataModel = mongoose.models.Data || mongoose.model("Data", dataSchema);
export default dataModel;