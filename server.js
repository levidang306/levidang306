const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('interactive'));
app.use(express.json());

// Dynamic SVG endpoint for GitHub README
app.get('/api/recent-activity.svg', (req, res) => {
    // This would fetch real GitHub activity in a production app
    const activities = [
        { type: '🚀', desc: 'Pushed commits to levidang306/levidang306', time: '2 hours ago' },
        { type: '✅', desc: 'Merged PR #1 in training-backend', time: '4 hours ago' },
        { type: '🐛', desc: 'Opened issue in test-repository', time: '6 hours ago' },
        { type: '🔄', desc: 'Reviewed PR in SGroup_Advanced_BE', time: '8 hours ago' }
    ];
    
    res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    const svg = `
    <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0D1117"/>
                <stop offset="100%" style="stop-color:#21262D"/>
            </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#bg)" rx="10"/>
        
        <text x="20" y="30" fill="#00D9FF" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
            📊 Recent GitHub Activity
        </text>
        
        ${activities.map((activity, index) => `
            <text x="30" y="${60 + index * 25}" fill="#F0F6FC" font-family="Arial, sans-serif" font-size="12">
                ${activity.type} ${activity.desc}
            </text>
            <text x="30" y="${75 + index * 25}" fill="#8B949E" font-family="Arial, sans-serif" font-size="10">
                ${activity.time}
            </text>
        `).join('')}
        
        <text x="20" y="190" fill="#8B949E" font-family="Arial, sans-serif" font-size="10">
            🔄 Updates every hour • Generated at ${new Date().toLocaleString()}
        </text>
    </svg>`;
    
    res.send(svg);
});

// Dynamic quote SVG
app.get('/api/quote.svg', (req, res) => {
    const quotes = [
        { text: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
        { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    const svg = `
    <svg width="600" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="quoteBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:0.1"/>
                <stop offset="100%" style="stop-color:#4ECDC4;stop-opacity:0.1"/>
            </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#quoteBg)" rx="15"/>
        <rect x="0" y="0" width="5" height="100%" fill="#FF6B6B"/>
        
        <text x="25" y="35" fill="#F0F6FC" font-family="Arial, sans-serif" font-size="14" font-style="italic">
            "${randomQuote.text}"
        </text>
        
        <text x="25" y="70" fill="#FFD700" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
            — ${randomQuote.author}
        </text>
        
        <text x="25" y="100" fill="#8B949E" font-family="Arial, sans-serif" font-size="10">
            💭 Inspirational Tech Quote • Updated: ${new Date().toLocaleString()}
        </text>
    </svg>`;
    
    res.send(svg);
});

// API to get visitor count (simple file-based counter)
app.get('/api/visitors', (req, res) => {
    const counterFile = path.join(__dirname, 'visitor-count.txt');
    let count = 0;
    
    try {
        if (fs.existsSync(counterFile)) {
            count = parseInt(fs.readFileSync(counterFile, 'utf8')) || 0;
        }
        count++;
        fs.writeFileSync(counterFile, count.toString());
    } catch (error) {
        console.error('Error updating visitor count:', error);
    }
    
    res.json({ count });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime() 
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interactive', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Interactive Portfolio Server running on http://localhost:${PORT}`);
    console.log(`📊 GitHub Activity SVG: http://localhost:${PORT}/api/recent-activity.svg`);
    console.log(`💭 Quote SVG: http://localhost:${PORT}/api/quote.svg`);
});

module.exports = app;