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

        const userData = await User.findOne({ email });
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
        const { password: _, ...userWithoutPassword } = userDataWithoutPassword;

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


export const allUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query.q || "";
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 5);
        const skip = (page - 1) * limit;

        // Define filters
        const searchCriteria = {
            $and: [
                {
                    $or: [
                        { name: { $regex: query, $options: "i" } }, // Case-insensitive match
                        { email: { $regex: query, $options: "i" } },
                    ],
                },
                // { role: "customer" },
            ],
        };

        // Fetch user count
        const totalUsers = await User.countDocuments(searchCriteria);

        // Fetch paginated users
        const users: IUser[] = await User.find(searchCriteria)
            .skip(skip)
            .limit(limit);

        // Send response
        res.status(200).json({
            message: "Customer list fetched successfully!",
            data: users,
            total_count: totalUsers,
            page,
        });
    } catch (error) {
        next(error);
    }
}