import mongoose from "mongoose";
import { refreshToken } from "../controllers/auth.controllor.js";
const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    refreshTokenHash: {
        type: String,
        required :[true , "Refresh token hash is required"]
    },
       ip: {
        type: String,
        required :[true , "IP address hash is required"]
    },
        userAgent: {
        type: String,
        required :[true , "User agent hash is required"]
    },
        revoked: {
        type: Boolean,
       default: false
    },
}
,{
    timestamps: true
})

const sessionmodel = mongoose.model("sessions", sessionSchema)

export default sessionmodel;