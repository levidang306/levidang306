const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Config
const TEMPLATE_PATH = path.join(__dirname, 'README-template.md');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'README.md');
const USERNAME = 'levidang306';

// Enhanced GitHub activity fetching with better descriptions
async function fetchGitHubActivity() {
  try {
    console.log('Fetching GitHub activity...');
    const res = await axios.get(`https://api.github.com/users/${USERNAME}/events?per_page=10`, {
      headers: { 
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'README-updater'
      }
    });
    
    const events = res.data.slice(0, 5).map(event => {
      let desc = '';
      let emoji = '';
      const date = new Date(event.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      switch (event.type) {
        case 'PushEvent':
          emoji = '📝';
          const commits = event.payload.commits?.length || 0;
          desc = `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${event.repo.name}`;
          break;
        case 'PullRequestEvent':
          emoji = event.payload.action === 'opened' ? '🔀' : '✅';
          desc = `${event.payload.action} PR #${event.payload.pull_request.number} in ${event.repo.name}`;
          break;
        case 'IssuesEvent':
          emoji = event.payload.action === 'opened' ? '🐛' : '✔️';
          desc = `${event.payload.action} issue #${event.payload.issue.number} in ${event.repo.name}`;
          break;
        case 'CreateEvent':
          emoji = '🌱';
          desc = `Created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        case 'StarEvent':
          emoji = '⭐';
          desc = `Starred ${event.repo.name}`;
          break;
        case 'ForkEvent':
          emoji = '🍴';
          desc = `Forked ${event.repo.name}`;
          break;
        case 'WatchEvent':
          emoji = '👀';
          desc = `Started watching ${event.repo.name}`;
          break;
        default:
          emoji = '🔄';
          desc = `${event.type.replace('Event', '')} in ${event.repo.name}`;
      }
      
      return `- ${emoji} **${desc}** *(${date})*`;
    }).join('\n');
    
    return `### 🔔 Recent GitHub Activity\n\n${events || '- No recent activity'}\n`;
  } catch (err) {
    console.error('GitHub activity fetch failed:', err.message);
    return `### 🔔 Recent GitHub Activity\n\n- 📊 Activity updates temporarily unavailable\n`;
  }
}

// Enhanced WakaTime stats with better formatting
async function fetchWakaTimeStats() {
  if (!process.env.WAKATIME_API_KEY) {
    console.log('WakaTime API key not found, skipping stats...');
    return `### ⏰ This Week's Coding Time\n\n- 📊 WakaTime integration coming soon!\n- ⚡ Stay tuned for detailed coding statistics\n`;
  }

  try {
    console.log('Fetching WakaTime stats...');
    const res = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { 
        Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`,
        'User-Agent': 'README-updater'
      }
    });
    
    const data = res.data.data;
    let statsText = `### ⏰ This Week's Coding Time\n\n`;
    
    // Total time
    if (data.total_seconds) {
      const totalHours = (data.total_seconds / 3600).toFixed(1);
      statsText += `- ⏱️ **Total Time**: ${totalHours} hours\n`;
    }
    
    // Daily average
    if (data.daily_average && data.daily_average.total_seconds) {
      const dailyHours = (data.daily_average.total_seconds / 3600).toFixed(1);
      statsText += `- 📅 **Daily Average**: ${dailyHours} hours\n`;
    }
    
    // Top languages
    if (data.languages && data.languages.length > 0) {
      statsText += `- 💻 **Top Languages**:\n`;
      data.languages.slice(0, 3).forEach(lang => {
        statsText += `  - ${lang.name}: ${lang.percent.toFixed(1)}%\n`;
      });
    }
    
    // Top editors
    if (data.editors && data.editors.length > 0) {
      statsText += `- 🛠️ **Editors Used**:\n`;
      data.editors.slice(0, 2).forEach(editor => {
        const hours = (editor.total_seconds / 3600).toFixed(1);
        statsText += `  - ${editor.name}: ${hours}h\n`;
      });
    }
    
    return statsText;
  } catch (err) {
    console.error('WakaTime fetch failed:', err.message);
    return `### ⏰ This Week's Coding Time\n\n- 📊 Coding stats temporarily unavailable\n- 🔄 Will retry on next update\n`;
  }
}

// Enhanced quote fetching with fallbacks
async function fetchQuote() {
  try {
    console.log('Fetching inspirational quote...');
    const quotes = [
      // Fallback quotes in case API fails
      { content: "Code is like poetry; it's all about expressing complex ideas with elegance.", author: "Unknown" },
      { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { content: "Code never lies, comments sometimes do.", author: "Ron Jeffries" },
      { content: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
      { content: "The best error message is the one that never shows up.", author: "Thomas Fuchs" }
    ];
    
    try {
      const res = await axios.get('https://api.quotable.io/random?tags=technology,motivational&maxLength=120', {
        timeout: 5000
      });
      return `> *"${res.data.content}"*\n>\n> **— ${res.data.author}**`;
    } catch (apiErr) {
      // Use random fallback quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return `> *"${randomQuote.content}"*\n>\n> **— ${randomQuote.author}**`;
    }
  } catch (err) {
    console.error('Quote fetch failed:', err.message);
    return `> *"Code is like poetry; it's all about expressing complex ideas with elegance."*\n>\n> **— Unknown**`;
  }
}

// Get current time in different formats
function getCurrentTime() {
  const now = new Date();
  const utc = now.toLocaleString('en-US', { 
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${utc} UTC`;
}

// Main update function with enhanced error handling
async function updateREADME() {
  try {
    console.log('🚀 Starting README update...');
    
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Template file not found: ${TEMPLATE_PATH}`);
    }
    
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    console.log('📖 Template loaded successfully');

    // Fetch all data concurrently for better performance
    console.log('📡 Fetching dynamic content...');
    const [activity, wakaStats, quote] = await Promise.all([
      fetchGitHubActivity(),
      fetchWakaTimeStats(),
      fetchQuote()
    ]);

    // Replace placeholders with dynamic content
    template = template.replace('<!-- ACTIVITY_FEED -->', activity);
    template = template.replace('<!-- WAKATIME_STATS -->', wakaStats);
    template = template.replace('<!-- QUOTE -->', quote);
    template = template.replace('<!-- LAST_UPDATED -->', getCurrentTime());

    // Write updated content
    fs.writeFileSync(OUTPUT_PATH, template);
    console.log('✅ README updated successfully!');
    console.log(`📁 Output written to: ${OUTPUT_PATH}`);
    
    // Log file size for monitoring
    const stats = fs.statSync(OUTPUT_PATH);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (err) {
    console.error('💥 Update failed:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
}

// Run the update
console.log('🤖 README Auto-Updater Starting...');
console.log(`👤 Username: ${USERNAME}`);
console.log(`📅 Timestamp: ${new Date().toISOString()}`);

updateREADME().then(() => {
  console.log('🎉 All done! README has been updated.');
}).catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});