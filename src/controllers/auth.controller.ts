import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/hash";
import jwt from "jsonwebtoken";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, mobile, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists" });
            return;
        }

        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            res.status(400).json({ message: "User with this mobile already exists" });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const newUser: IUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: role || "customer",
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful",
            user: newUser
        });
    } catch (error) {
        next(error);
    }
};

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({email});
        if (!userData) {
            res.status(400).json({
                message: "No user found",
                success: false
            });
            return;
        }

        const validPass = await comparePassword(password, userData.password);
        if (!validPass) {
            res.status(400).json({
                message: "Wrong password!",
                success: false
            });
            return;
        }

        const token = jwt.sign({
            _id: userData._id
        }, process.env.JWT_SECRET!);

        const userDataWithoutPassword = userData.toObject();
        const {password: _, ...userWithoutPassword} = userDataWithoutPassword;
        
        res.header("auth-token", token).status(200).json({
            success: true,
            message: "Successfully login",
            user: userWithoutPassword,
            token: token
          });
    } catch (error) {
        next(error);
    }
}
