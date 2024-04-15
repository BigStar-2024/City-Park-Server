
import mongoose from "mongoose";

const lotSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    siteCode: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    owners: [{
        type: String,
        required: true,
    }],
},
    { timestamps: true }
);

const lotModel = mongoose.models.Lot || mongoose.model("Lot", lotSchema);
export default lotModel;