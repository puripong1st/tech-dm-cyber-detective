const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Force Vercel Node File Trace (NFT) to bundle cases_data.js in Lambda package
try { require('./cases_data.js'); } catch(e) {}

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & JSON Body Parser
app.use(cors());
app.use(express.json());

// Serve Static Directories with explicit caching
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '1d' }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));

// Explicit Static File Route for cases_data.js (Guarantees HTTP 200 on Vercel)
app.get('/cases_data.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'cases_data.js'));
});

// Explicit Static Route for Assets (Guarantees HTTP 200 on Vercel)
app.get('/assets/*', (req, res) => {
    const assetPath = path.join(__dirname, req.path);
    res.sendFile(assetPath, (err) => {
        if (err) res.status(404).send('Asset not found');
    });
});

// Secure API Endpoint: Expose Public Supabase Environment Variables to Frontend
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    });
});

// Secure API Endpoint: Verify Teacher Passcode Server-side
app.post('/api/verify-passcode', (req, res) => {
    const { passcode } = req.body || {};
    const validPasscodes = ['admin123', 'teacher123'];
    if (process.env.TEACHER_PASSCODE) {
        validPasscodes.push(process.env.TEACHER_PASSCODE);
    }
    const isValid = passcode && validPasscodes.includes(passcode.trim());
    res.json({ success: isValid });
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Page Routes (Clean URLs)
app.get('/detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_detective.html'));
});
app.get('/cyber_detective', (req, res) => {
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
app.get('/teacher_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_dashboard.html'));
});

app.get('/presentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'presentation.html'));
});

app.get('/cases', (req, res) => {
    res.sendFile(path.join(__dirname, 'cases_reference.html'));
});
app.get('/cases_reference', (req, res) => {
    res.sendFile(path.join(__dirname, 'cases_reference.html'));
});

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Default Fallback Route for Single Page Apps & Clean URLs
app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        return res.sendFile(path.join(__dirname, req.path), (err) => {
            if (err) res.status(404).send('File not found');
        });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen locally (Exported for Vercel Serverless Function)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running cleanly using .env settings at http://localhost:${PORT}`);
    });
}

module.exports = app;
