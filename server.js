const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & JSON Body Parser
app.use(cors());
app.use(express.json());

// Serve Static Files from Root Directory
app.use(express.static(__dirname));

// Secure API Endpoint: Expose Environment Variables from .env to Frontend
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        teacherPasscode: process.env.TEACHER_PASSCODE || ''
    });
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Page Routes
app.get('/detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_detective.html'));
});

app.get('/defense', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_defense_city.html'));
});

app.get('/survivor', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_survivor_game.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_dashboard.html'));
});

// Default Fallback Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen locally (Exported for Vercel Serverless Function)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running cleanly using .env settings at http://localhost:${PORT}`);
    });
}

module.exports = app;
