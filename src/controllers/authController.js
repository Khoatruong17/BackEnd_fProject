const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const userModel = require('../models/userModel');



const Login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            res.status(401).json({message: "email and password required"});
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!compareSync(req.body.password, user.hashedPassword)){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            id: user._id,
            username: user.username
        }
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})

        return res.status(200).json({ 
            success: true,
            message: 'Login successful',
            user: user
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'server has a problem',
            error: error.message,
        })
    }
}

const Register = async (req, res) => {
    try {
        const { email, username, password } = req.body;  // Include username
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Please provide email, username, and password' });
        }

        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if the username already exists
        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user with both username and email
        let user = new userModel({
            email: email,
            username: username, // Save username
            passwordHash: hashedPassword
        });

        await user.save();

        res.status(200).json({
            message: 'User registered successfully',
            ec: 0,
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server encountered a problem',
            ec: 1,
            error: error.message,
        });
    }
};

const Protected = (req, res) => {
    if(req.isAuthenticated()){
        res.send("get Protected")
    }
    else{
        res.status(401).send("Unauthorized")
    }
    console.log(req.session)
}

const Logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); } // Xử lý lỗi nếu có
        res.redirect('/'); // Đăng xuất thành công, chuyển hướng đến trang chủ
    });
}


module.exports = {
    Login,
    Register,
    Logout,
    Protected
}
