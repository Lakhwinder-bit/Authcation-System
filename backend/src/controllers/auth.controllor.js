import userModel from "../models/user.model.js ";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import { sendEmail } from "../services/email.service.js";
import sessionmodel from "../models/session.model.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


export async function register(req, res) {

    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isAlreadyRegistered) {
       return res.status(409).json({
            message: "Username or email already exists"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        },
    })


}
export async function OtpGenerate(req, res) {
    try {
        const { email } = req.body;

        // 1. Find the user first
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Check if already verified
        // if (user.verified) return res.status(400).json({ message: "User already verified" });

        // 3. Generate OTP
        const otp = generateOtp();
        const html = getOtpHtml(otp, user.username);

        // 4. Hash and store (delete old OTP first)
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        await otpModel.deleteOne({ email }); // remove old OTP if exists
        await otpModel.create({
            email,
            user: user._id,
            otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min expiry
        });

        // 5. Send email
        await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

        res.status(201).json({
            message: "OTP sent successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            },
        });

    } catch (error) {
        console.error("OTP Generate Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logIn(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    // if (!user.verified) {
    //     return res.status(401).json({
    //         message: "Email not verified"
    //     });
    // }

    const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const refreshToken = jwt.sign(
        { id: user._id },
        config.JWT_SECERT,
        { expiresIn: "7d" }
    );

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const session = await sessionmodel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    const accessToken = jwt.sign(
        { id: user._id, sessionId: session._id },
        config.JWT_SECERT,
        { expiresIn: "15m" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Logged in successfully",
        accessToken, // ✅ FIX
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified  // ✅ add this line
        }
    });
}
export async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[ 1 ];
    if(!token){
       return res.status(401).json({
        message:"token not found"
       })
    }

    const deccoded = jwt.verify(token, config.JWT_SECERT);
    
    const user = await userModel.findById(deccoded.id)

    res.status(202).json({
        message:"user fetched succesfully",
        user:{
            username:user.username,
            email:user.email,
        }
    })
} 

export async function refreshToken(req , res){
    // console.log("Cookies:", req.cookies);
const refreshToken = req.cookies.refreshToken;

if(!refreshToken){
    return res.status(401).json({
        message: "Refresh token not found"
    })
}

const deccoded = jwt.verify(refreshToken, config.JWT_SECERT)

const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

const session = await sessionmodel.findOne({
    refreshTokenHash,
    revoked: false
})

if(!session){
    res.status(401).json({
        message:"Invalid refesh token"
    })
}


const accessToken = jwt.sign({
    id: deccoded.id
}, config.JWT_SECERT, 
{
    expiresIn:"15m"
}
)



const newrefreshtoken = jwt.sign({
    id: deccoded.id
}, config.JWT_SECERT,{
    expiresIn:"7d"
})

const newRefreshtokenHash = crypto.createHash("sha256").update(newrefreshtoken).destroy("hax");
session.refreshTokenHash = newRefreshtokenHash;
await session.save();

res.cookie("refreshToken",newrefreshtoken,{
    httpOnly: true,
    secure: true,
    satisfies: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 //7day

})
res.status(202).json({
    message: "Acces token refeshed successfully",
    accessToken
})

}

export async function logOut(req, res){

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
       return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionmodel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if(!session){
        return res.status(400).json({
            message:"Invalid refresh token"
        })
    }
    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken")
    
    res.status(200).json({
        message:"Logged out succesfully"
    })
}


export async function allLogOut(req, res) {
     const refreshToken = req.cookies.refreshToken;

     if(!refreshToken){
        res.status(400).json({
            message:"Refresh tokrn is not found"
        })
     }
    
     const deccoded = jwt.verify(refreshToken, config.JWT_SECERT)

     await sessionmodel.updateMany({
        user: deccoded.id,
        revoked: false
     },{
        revoked:true
     })

     res.clearCookie("refreshToken")

     res.status(200).json({
        message: "Logged out from all devices succesfully"
     })
}

export async function verifyEmail(req, res) {
    const { otp, email } = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user, {
        verified: true
    },{ new: true })

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message: "Email verified successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })
}


export async function verifyOtpForReset(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // OTP hash ਕਰੋ
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        // OTP ਲੱਭੋ
        const otpDoc = await otpModel.findOne({ email, otpHash });

        if (!otpDoc) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Expiry ਚੈੱਕ ਕਰੋ
        if (otpDoc.expiresAt < Date.now()) {
            await otpModel.deleteOne({ _id: otpDoc._id });
            return res.status(400).json({ message: "OTP expired ਹੋ ਗਿਆ ਹੈ" });
        }

        // ✅ ਇੱਕ resetToken ਬਣਾਓ (5 ਮਿੰਟ ਵਾਲਾ)
        const resetToken = jwt.sign(
            { email },
            config.JWT_SECERT,
            { expiresIn: "5m" }
        );

        // OTP delete ਕਰੋ (ਇੱਕ ਵਾਰ use ਹੋ ਗਿਆ)
        await otpModel.deleteOne({ _id: otpDoc._id });

        return res.status(200).json({
            message: "OTP verified, ਹੁਣ password reset ਕਰੋ",
            resetToken  // Frontend ਨੂੰ ਇਹ ਭੇਜੋ
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function resetPassword(req, res) {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ resetToken verify ਕਰੋ
        let decoded;
        try {
            decoded = jwt.verify(resetToken, config.JWT_SECERT);
        } catch (err) {
            return res.status(400).json({ message: "Reset token invalid ਜਾਂ expire ਹੋ ਗਿਆ ਹੈ" });
        }

        // Email ਤੋਂ user ਲੱਭੋ
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Password hash ਕਰੋ ਅਤੇ save ਕਰੋ
        const hashedPassword = crypto
            .createHash("sha256")
            .update(newPassword)
            .digest("hex");

        user.password = hashedPassword;
        await user.save();

        // ਸਾਰੇ sessions ਹਟਾਓ
        await sessionmodel.deleteMany({ user: user._id });

        res.status(200).json({
            success: true,
            message: "Password reset ਸਫਲ ਹੋ ਗਿਆ"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}