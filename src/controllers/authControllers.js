const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { json } = require("body-parser");
const { use } = require("../routes/auth");

exports.register = async (req, res) => {
    const { name, email, mobile, password, terms_and_conditions, role } = req.body;

    if (!name || !email || !mobile || !password || !terms_and_conditions) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {

        const emailExist = await User.findOne({email: email});
        if (emailExist) {
            return res.status(400).json({
            message: "Email already exists",
            success: false
            });
        }

        const mobileExist = await User.findOne({mobile: mobile});

        if (mobileExist) {
            return res.status(400).json({
            message: "Mobile already exists",
            success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            terms_and_conditions,
            role: role || 'customer'
        });

        const saveUser = await newUser.save();

        res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            data: saveUser
        });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
}

exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?\d{10,15}$/.test(identifier);

    if (!isEmail && !isPhone) {
        return res.status(400).json({ error: "Invalid email or phone number format" });
    }

    try {
        const query = isEmail ? { email: identifier } : { mobile: identifier };
        
        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.header("auth-token", token).status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                user: {
                    ...user.toObject(),
                    token
                }
            }
        })

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
}
