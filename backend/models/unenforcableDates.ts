
import mongoose from "mongoose";

const unenforcableDatesSchema = new mongoose.Schema({
    siteCode: {
        type: String,
        required: true,
    },
    dates: [{
        start: Date,
        end: Date
    }]
},
    { timestamps: false }
);

const unenforcableDatesModel = mongoose.models.Unenforcabledate || mongoose.model("Unenforcabledate", unenforcableDatesSchema);
export default unenforcableDatesModel;