require('dotenv').config();
const express = require('express');
const app = express();

const dbConnect = require('./src/DB/connection');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(express.json())
app.use(cors())

// All routes import here
const authRoutes = require("./src/routes/auth");

// All routes import here
app.use('/api/auth', authRoutes);

// Base route use here
app.get('/', (req, res) => {
    res.json({ 
        status: true,
        message: 'Welcome to GroMart application. Created by Ramij'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!' 
    });
});

app.listen(PORT,(err)=>{
    if (err) {
        console.error('Server error:', err);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
})