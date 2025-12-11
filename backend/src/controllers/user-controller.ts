import type { Request, Response } from "express";
import userRepositories from "../repositories/user-repositories";
import { createUserSchema, loginSchema } from "../validators/user-validator";
import User from "../models/user-model";
import bcrypt from "bcrypt"
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { updateUserSchema } from "../validators/updateUser-validator";
import cloudinary from "../config/cloudinary";
import { changePasswordSchema } from "../validators/change_password-validator";
import { forgotPasswordSchema } from "../validators/forgot_password-validator";
import { sendEmail } from "../utils/emailService";
import crypto from "crypto";
import { resetPasswordSchema } from "../validators/reset_password-validator";



export const createUser = async (req:Request,res:Response) => {
    try {
        const validateData = createUserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.issues[0].message });
        }
        const { name, email, password,isAdmin } = validateData.data;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "email already exist..." });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userRepositories.createUser({
            name,
            email,
            password: hashPassword,
            isAdmin
        });
        res.status(201).json({message:"User created...",user:{
            id: user._id,
            name: user.name,
        }});
    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({message: error instanceof ZodError? error.issues[0].message: "Internal Server Error"});
    }

}

export const loginUser = async (req: Request, res: Response) => {
        try {
            const validateData = loginSchema.safeParse(req.body);
            if(!validateData.success){
                return res.status(400).json({message:validateData.error.issues[0].message});
            }
            const {email,password} = validateData.data; 
            const user = await User.findOne({email});
            if (!user) {
                return res.status(404).json({ message: "invalid email or User not found..." });
            }
            const isMatching = await bcrypt.compare(password,user.password);
            if(!isMatching){
                return res.status(404).json({ message: "Invalid Password..." });
            }
            const secret = process.env.JWT_SECRET;
            if(!secret){
                return res.status(404).json({ message: "missing secret" });
            }
            const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, secret, { expiresIn: "1d" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // only true in prod
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({message:"Login successfull",user:{
                id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin
            }});

        } catch (error) {
            return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message:"Internal server error..."});
        }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "Loggedout successfully" });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });

    }
}

export const getUserProfile = async (req: Request, res: Response) => {
     try {
         const userId = (req as any).user.id;
         const user = await User.findById(userId).select("name email profilePic createdAt");
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }
         const createdAtFormatted = new Date(user.createdAt).toLocaleDateString("en-US", {
             month: "2-digit",
             day: "2-digit",
             year: "numeric", 
         });

         res.json({
             name: user.name,
             email: user.email,
             profilePic: user.profilePic,
             joinDate: createdAtFormatted

         });

     } catch (error) {
         return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
}

export const updateUser = async (req: Request, res: Response) => {
   try {
       const userId = (req as any).user.id;
       const validateData = updateUserSchema.safeParse(req.body);
       if (!validateData.success) {
           return res.status(400).json({ message: validateData.error.issues[0].message });
       }
       const updatedUser = await userRepositories.updateUser(userId, validateData.data);
       if (!updatedUser) {
           return res.status(404).json({ message: "User not found" });
       }
       res.json({ message: "Profile updated successfully", user: updatedUser });
   } catch (error) {
       return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
}

export const updateProfilePic = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const base64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "profile_pics",
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: result.secure_url },
            { new: true }
        ).select("profilePic");

        return res.json({
            message: "Profile picture updated",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const validateData = changePasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.issues[0].message });
        }
        const { Password, newPassword } = validateData.data;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(Password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password and new password not matched..." });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ message: "Password Update successfully..." });
    } catch (error) {
        console.error(error);
        return res.status(error instanceof ZodError ? 400 : 500).json({ message: error instanceof ZodError ? error.issues[0].message : "Internal server error..." });
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const validateData = forgotPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.issues[0].message });
        }
        const { email } = validateData.data;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 4 min expire
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to reset:</p>
            <a href="${resetUrl}" target="_blank" 
                style="background:#4f46e5;color:white;padding:10px 15px;border-radius:6px;text-decoration:none;">
                Reset Password
            </a>
            <p>This link will expire in 4 minutes.</p>
        `;
        await sendEmail(user.email,"Reset Your Password - E-mart",html);
        return res.json({ message: "Reset link sent successfully!" });
    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const validateData = resetPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.issues[0].message });
        }
        const {token} = req.params;
        if(!token){
            return res.status(404).json({message:"token not found..."});
        }
        const {password} = validateData.data;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() }});
        if (!user)
            return res.status(400).json({ message: "Token invalid or expired" });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
    
}


