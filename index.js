require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./src/DB/connection');
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


app.listen(PORT,()=>{
    console.log(`server running ${PORT}`)
})