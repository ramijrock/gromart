const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    const { name, email, mobile, password, terms_and_conditions, role } = req.body;

    if (!name || !email || !mobile || !password || !terms_and_conditions) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const emailExist = await User.findOne({
            email: req.body.email
        });

        if (emailExist) {
            return res.status(400).json({
              message: "Email already exists",
              success: false
            });
        }

        const mobileExist = await User.findOne({
            mobile: req.body.mobile
        });

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
        res.status(500).json({ message: 'Server error' });
    }
}
