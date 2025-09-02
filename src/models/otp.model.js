const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true,
            unique: true,
            index: true
        },
        otp: { 
            type: String, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now, 
            index: { expires: 600 } 
        }
    }
)

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;