import type { Request, Response } from "express";
import userRepositories from "../repositories/user-repositories";
import { createUserSchema, loginSchema } from "../validators/user-validator";
import User from "../models/user-model";
import bcrypt from "bcrypt"
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

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
