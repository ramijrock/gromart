import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, mobile, password, role } = req.body;

        console.log("mobile", mobile);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
        const newUser: IUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: role ?? "Customer",
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
