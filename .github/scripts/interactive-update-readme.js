const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Config
const TEMPLATE_PATH = path.join(__dirname, 'interactive-readme-template.md');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'README.md');
const USERNAME = 'levidang306';

// Fetch Spotify Currently Playing
async function fetchSpotifyNowPlaying() {
  try {
    // This would require Spotify API setup
    return `🎵 **Currently Jamming To**: Lofi Hip Hop - Perfect for coding! 🎧`;
  } catch (err) {
    return `🎵 **Music**: Coding in silence mode 🤫`;
  }
}

// Enhanced GitHub activity with more interactive elements
async function fetchGitHubActivity() {
  try {
    console.log('🔍 Fetching interactive GitHub activity...');
    const res = await axios.get(`https://api.github.com/users/${USERNAME}/events?per_page=15`, {
      headers: { 
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Interactive-README-updater'
      }
    });
    
    const events = res.data.slice(0, 8).map((event, index) => {
      let desc = '';
      let emoji = '';
      let interactiveElement = '';
      const date = new Date(event.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      switch (event.type) {
        case 'PushEvent':
          emoji = '🚀';
          const commits = event.payload.commits?.length || 0;
          desc = `Launched ${commits} commit${commits !== 1 ? 's' : ''} to orbit in **${event.repo.name}**`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4); padding: 2px 8px; border-radius: 10px; font-size: 10px;">FRESH CODE</span>`;
          break;
        case 'PullRequestEvent':
          emoji = event.payload.action === 'opened' ? '🔀' : '✅';
          desc = `${event.payload.action === 'opened' ? 'Opened' : 'Merged'} PR #${event.payload.pull_request.number} in **${event.repo.name}**`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #4ECDC4, #96CEB4); padding: 2px 8px; border-radius: 10px; font-size: 10px;">COLLABORATION</span>`;
          break;
        case 'IssuesEvent':
          emoji = event.payload.action === 'opened' ? '🐛' : '✔️';
          desc = `${event.payload.action === 'opened' ? 'Discovered' : 'Resolved'} issue #${event.payload.issue.number} in **${event.repo.name}**`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #FFD700, #FECA57); padding: 2px 8px; border-radius: 10px; font-size: 10px;">PROBLEM SOLVER</span>`;
          break;
        case 'CreateEvent':
          emoji = '🌱';
          desc = `Created new ${event.payload.ref_type} in **${event.repo.name}**`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #96CEB4, #FECA57); padding: 2px 8px; border-radius: 10px; font-size: 10px;">INNOVATION</span>`;
          break;
        case 'StarEvent':
          emoji = '⭐';
          desc = `Starred **${event.repo.name}** - Found something amazing!`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #FFD700, #FF6B6B); padding: 2px 8px; border-radius: 10px; font-size: 10px;">APPRECIATION</span>`;
          break;
        case 'ForkEvent':
          emoji = '🍴';
          desc = `Forked **${event.repo.name}** - Ready to contribute!`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #4ECDC4, #45B7D1); padding: 2px 8px; border-radius: 10px; font-size: 10px;">OPEN SOURCE</span>`;
          break;
        case 'WatchEvent':
          emoji = '👀';
          desc = `Started watching **${event.repo.name}** - Keeping an eye on innovation!`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #45B7D1, #96CEB4); padding: 2px 8px; border-radius: 10px; font-size: 10px;">LEARNING</span>`;
          break;
        default:
          emoji = '🔄';
          desc = `${event.type.replace('Event', '')} activity in **${event.repo.name}**`;
          interactiveElement = `<span style="background: linear-gradient(45deg, #666, #999); padding: 2px 8px; border-radius: 10px; font-size: 10px;">ACTIVITY</span>`;
      }
      
      // Add interactive progress bar for recent activities
      const hoursAgo = Math.floor((Date.now() - new Date(event.created_at).getTime()) / (1000 * 60 * 60));
      const progressWidth = Math.max(10, 100 - hoursAgo * 2);
      
      return `
<div style="display: flex; align-items: center; margin: 8px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4ECDC4;">
  <span style="font-size: 20px; margin-right: 10px;">${emoji}</span>
  <div style="flex: 1;">
    <div style="font-weight: bold; color: #4ECDC4;">${desc}</div>
    <div style="font-size: 12px; color: #888; margin-top: 5px;">
      <span style="margin-right: 10px;">📅 ${date}</span>
      ${interactiveElement}
    </div>
    <div style="width: 100%; background: rgba(255,255,255,0.1); height: 2px; border-radius: 1px; margin-top: 5px;">
      <div style="width: ${progressWidth}%; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); height: 100%; border-radius: 1px; transition: width 0.3s ease;"></div>
    </div>
  </div>
</div>`;
    }).join('\n');
    
    const activityHeader = `
<div style="text-align: center; margin: 20px 0;">
  <h3 style="color: #FF6B6B; margin-bottom: 10px;">🔥 Live Activity Feed</h3>
  <p style="color: #4ECDC4; font-size: 14px;">Real-time updates from the coding universe! ✨</p>
</div>`;
    
    return `${activityHeader}\n<div style="max-width: 600px; margin: 0 auto;">\n${events || '<p style="text-align: center; color: #888;">🌙 Quiet moment in the coding universe...</p>'}\n</div>\n`;
  } catch (err) {
    console.error('GitHub activity fetch failed:', err.message);
    return `
<div style="text-align: center; margin: 20px 0; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 10px; border: 2px solid rgba(255,107,107,0.3);">
  <h3 style="color: #FF6B6B;">🔄 Activity Feed Temporarily Offline</h3>
  <p style="color: #4ECDC4;">The GitHub API is taking a coffee break! ☕</p>
  <p style="font-size: 12px; color: #888;">Will be back online soon with fresh updates!</p>
</div>`;
  }
}

// Enhanced WakaTime stats with interactive charts
async function fetchWakaTimeStats() {
  if (!process.env.WAKATIME_API_KEY) {
    console.log('⚡ WakaTime API key not found, creating interactive placeholder...');
    return `
<div style="text-align: center; margin: 30px 0;">
  <h3 style="color: #4ECDC4; margin-bottom: 20px;">⚡ Real-time Coding Analytics</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
    
    <!-- Coding Time Widget -->
    <div style="background: linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(78,205,196,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">⏱️</div>
      <div style="color: #4ECDC4; font-weight: bold; font-size: 18px;">This Week</div>
      <div style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 10px 0;">∞ hrs</div>
      <div style="color: #888; font-size: 12px;">Non-stop coding mode! 🚀</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: 95%; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); height: 100%; border-radius: 2px; animation: pulse 2s infinite;"></div>
      </div>
    </div>
    
    <!-- Most Used Language -->
    <div style="background: linear-gradient(45deg, rgba(78,205,196,0.1), rgba(69,183,209,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(69,183,209,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">🐍</div>
      <div style="color: #45B7D1; font-weight: bold; font-size: 18px;">Top Language</div>
      <div style="color: #FFD700; font-size: 20px; font-weight: bold; margin: 10px 0;">Python</div>
      <div style="color: #888; font-size: 12px;">AI & Backend Magic ✨</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: 87%; background: linear-gradient(45deg, #4ECDC4, #45B7D1); height: 100%; border-radius: 2px;"></div>
      </div>
    </div>
    
    <!-- Productivity Score -->
    <div style="background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(254,202,87,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(255,215,0,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">🎯</div>
      <div style="color: #FFD700; font-weight: bold; font-size: 18px;">Focus Score</div>
      <div style="color: #4ECDC4; font-size: 24px; font-weight: bold; margin: 10px 0;">98%</div>
      <div style="color: #888; font-size: 12px;">In the zone! 🔥</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: 98%; background: linear-gradient(45deg, #FFD700, #FECA57); height: 100%; border-radius: 2px;"></div>
      </div>
    </div>
    
  </div>
  
  <div style="margin: 20px 0; padding: 15px; background: rgba(150,206,180,0.1); border-radius: 10px; border: 2px solid rgba(150,206,180,0.3);">
    <p style="color: #96CEB4; font-size: 14px; margin: 0;">
      🚀 <strong>WakaTime Integration:</strong> Connect your WakaTime API for real-time coding statistics!<br>
      ⚡ Add <code>WAKATIME_API_KEY</code> to repository secrets for live data visualization.
    </p>
  </div>
  
</div>

<style>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>`;
  }

  try {
    console.log('📊 Fetching WakaTime interactive stats...');
    const res = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { 
        Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`,
        'User-Agent': 'Interactive-README-updater'
      }
    });
    
    const data = res.data.data;
    
    // Create interactive WakaTime visualization
    let statsHTML = `
<div style="text-align: center; margin: 30px 0;">
  <h3 style="color: #4ECDC4; margin-bottom: 20px;">⚡ Live Coding Analytics</h3>
  
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">`;
    
    // Total time widget
    if (data.total_seconds) {
      const totalHours = (data.total_seconds / 3600).toFixed(1);
      const dailyAvg = data.daily_average ? (data.daily_average.total_seconds / 3600).toFixed(1) : '0';
      
      statsHTML += `
    <div style="background: linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(78,205,196,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">⏱️</div>
      <div style="color: #4ECDC4; font-weight: bold; font-size: 18px;">This Week</div>
      <div style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 10px 0;">${totalHours}h</div>
      <div style="color: #888; font-size: 12px;">Avg: ${dailyAvg}h/day 🚀</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: ${Math.min(100, totalHours * 2)}%; background: linear-gradient(45deg, #FF6B6B, #4ECDC4); height: 100%; border-radius: 2px; animation: pulse 2s infinite;"></div>
      </div>
    </div>`;
    }
    
    // Top language widget
    if (data.languages && data.languages.length > 0) {
      const topLang = data.languages[0];
      const langEmoji = {
        'Python': '🐍',
        'JavaScript': '🟨',
        'TypeScript': '🔷',
        'Java': '☕',
        'C++': '⚡',
        'Go': '🐹',
        'Rust': '🦀'
      };
      
      statsHTML += `
    <div style="background: linear-gradient(45deg, rgba(78,205,196,0.1), rgba(69,183,209,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(69,183,209,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">${langEmoji[topLang.name] || '💻'}</div>
      <div style="color: #45B7D1; font-weight: bold; font-size: 18px;">Top Language</div>
      <div style="color: #FFD700; font-size: 20px; font-weight: bold; margin: 10px 0;">${topLang.name}</div>
      <div style="color: #888; font-size: 12px;">${topLang.percent.toFixed(1)}% this week ✨</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: ${topLang.percent}%; background: linear-gradient(45deg, #4ECDC4, #45B7D1); height: 100%; border-radius: 2px;"></div>
      </div>
    </div>`;
    }
    
    // Editor widget
    if (data.editors && data.editors.length > 0) {
      const topEditor = data.editors[0];
      const editorHours = (topEditor.total_seconds / 3600).toFixed(1);
      
      statsHTML += `
    <div style="background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(254,202,87,0.1)); padding: 20px; border-radius: 15px; border: 2px solid rgba(255,215,0,0.3); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 10px;">⚙️</div>
      <div style="color: #FFD700; font-weight: bold; font-size: 18px;">Favorite Editor</div>
      <div style="color: #4ECDC4; font-size: 20px; font-weight: bold; margin: 10px 0;">${topEditor.name}</div>
      <div style="color: #888; font-size: 12px;">${editorHours}h coding time 🔥</div>
      <div style="width: 100%; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; margin-top: 10px;">
        <div style="width: ${topEditor.percent}%; background: linear-gradient(45deg, #FFD700, #FECA57); height: 100%; border-radius: 2px;"></div>
      </div>
    </div>`;
    }
    
    statsHTML += `
  </div>
  
  <!-- Language breakdown chart -->
  <div style="margin: 30px 0;">
    <h4 style="color: #96CEB4; margin-bottom: 15px;">📊 Language Breakdown</h4>
    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">`;
    
    if (data.languages) {
      data.languages.slice(0, 5).forEach((lang, index) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD700', '#96CEB4', '#45B7D1'];
        statsHTML += `
      <div style="display: flex; align-items: center; margin: 10px 0;">
        <div style="width: 15px; height: 15px; background: ${colors[index]}; border-radius: 50%; margin-right: 10px;"></div>
        <div style="flex: 1; color: #fff; font-size: 14px;">${lang.name}</div>
        <div style="color: ${colors[index]}; font-weight: bold; margin-right: 10px;">${lang.percent.toFixed(1)}%</div>
        <div style="width: 100px; background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px;">
          <div style="width: ${lang.percent}%; background: ${colors[index]}; height: 100%; border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
      </div>`;
      });
    }
    
    statsHTML += `
    </div>
  </div>
</div>

<style>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>`;
    
    return statsHTML;
    
  } catch (err) {
    console.error('WakaTime fetch failed:', err.message);
    return `
<div style="text-align: center; margin: 20px 0; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 10px; border: 2px solid rgba(255,107,107,0.3);">
  <h3 style="color: #FF6B6B;">📊 WakaTime Stats Temporarily Offline</h3>
  <p style="color: #4ECDC4;">The coding analytics are recharging! ⚡</p>
  <p style="font-size: 12px; color: #888;">Will be back online soon with fresh insights!</p>
</div>`;
  }
}

// Enhanced quote system with interactive elements
async function fetchInteractiveQuote() {
  try {
    console.log('💭 Fetching inspirational interactive quote...');
    
    const techQuotes = [
      { content: "Code is like poetry; it's all about expressing complex ideas with elegance.", author: "Unknown Poet", category: "✨ Poetry" },
      { content: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "🎯 Strategy" },
      { content: "The best programs are written when the programmer is supposed to be working on something else.", author: "Melinda Varian", category: "😄 Humor" },
      { content: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine", category: "🧠 Learning" },
      { content: "The most important property of a program is whether it accomplishes the intention of its user.", author: "C.A.R. Hoare", category: "🎪 Purpose" },
      { content: "Code never lies, comments sometimes do.", author: "Ron Jeffries", category: "🔍 Truth" },
      { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "👥 Humanity" },
      { content: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", category: "📚 Wisdom" }
    ];
    
    try {
      // Try to get quote from API first
      const res = await axios.get('https://api.quotable.io/random?tags=technology,motivational&maxLength=150', {
        timeout: 5000
      });
      
      return `
<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1), rgba(255,215,0,0.1)); border-radius: 20px; border: 2px solid rgba(78,205,196,0.3); margin: 20px 0; position: relative; overflow: hidden;">
  
  <!-- Animated background elements -->
  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 50%); animation: rotate 20s linear infinite; z-index: 1;"></div>
  
  <div style="position: relative; z-index: 2;">
    <div style="font-size: 28px; margin-bottom: 15px; animation: float 3s ease-in-out infinite;">💭</div>
    
    <blockquote style="font-size: 20px; font-style: italic; color: #4ECDC4; margin: 20px 0; line-height: 1.6; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      "${res.data.content}"
    </blockquote>
    
    <div style="font-size: 16px; color: #FFD700; font-weight: bold; margin-top: 15px;">
      — ${res.data.author}
    </div>
    
    <div style="margin-top: 20px;">
      <span style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4); padding: 5px 15px; border-radius: 20px; font-size: 12px; color: white; font-weight: bold;">
        🌟 DAILY INSPIRATION
      </span>
    </div>
  </div>
  
</div>

<style>
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>`;
      
    } catch (apiErr) {
      // Use random fallback quote with same styling
      const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
      
      return `
<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1), rgba(255,215,0,0.1)); border-radius: 20px; border: 2px solid rgba(78,205,196,0.3); margin: 20px 0; position: relative; overflow: hidden;">
  
  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 50%); animation: rotate 20s linear infinite; z-index: 1;"></div>
  
  <div style="position: relative; z-index: 2;">
    <div style="font-size: 28px; margin-bottom: 15px; animation: float 3s ease-in-out infinite;">💭</div>
    
    <blockquote style="font-size: 20px; font-style: italic; color: #4ECDC4; margin: 20px 0; line-height: 1.6; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      "${randomQuote.content}"
    </blockquote>
    
    <div style="font-size: 16px; color: #FFD700; font-weight: bold; margin-top: 15px;">
      — ${randomQuote.author}
    </div>
    
    <div style="margin-top: 20px;">
      <span style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4); padding: 5px 15px; border-radius: 20px; font-size: 12px; color: white; font-weight: bold;">
        ${randomQuote.category}
      </span>
    </div>
  </div>
  
</div>

<style>
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>`;
    }
    
  } catch (err) {
    console.error('Quote fetch failed:', err.message);
    return `
<div style="text-align: center; padding: 25px; background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1)); border-radius: 20px; border: 2px solid rgba(255,107,107,0.3); margin: 20px 0;">
  <div style="font-size: 28px; margin-bottom: 15px;">💭</div>
  <blockquote style="font-size: 20px; font-style: italic; color: #4ECDC4; margin: 20px 0; line-height: 1.6;">
    "In a world of code, be the one who brings magic to life!"
  </blockquote>
  <div style="font-size: 16px; color: #FFD700; font-weight: bold;">— Interactive README</div>
</div>`;
  }
}

// Get enhanced current time with multiple formats
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
  
  const local = now.toLocaleString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  return `**${utc} UTC** *(${local})*`;
}

// Main interactive update function
async function updateInteractiveREADME() {
  try {
    console.log('🚀 Starting Interactive README update...');
    console.log('🎨 Preparing 3D animations and interactive elements...');
    
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Interactive template file not found: ${TEMPLATE_PATH}`);
    }
    
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    console.log('📖 Interactive template loaded successfully');

    // Fetch all data concurrently for better performance
    console.log('📡 Fetching interactive dynamic content...');
    const [activity, wakaStats, quote, spotify] = await Promise.all([
      fetchGitHubActivity(),
      fetchWakaTimeStats(),
      fetchInteractiveQuote(),
      fetchSpotifyNowPlaying()
    ]);

    // Replace placeholders with dynamic interactive content
    template = template.replace('<!-- ACTIVITY_FEED -->', activity);
    template = template.replace('<!-- WAKATIME_STATS -->', wakaStats);
    template = template.replace('<!-- QUOTE -->', quote);
    template = template.replace('<!-- SPOTIFY_PLAYING -->', spotify);
    template = template.replace('<!-- LAST_UPDATED -->', getCurrentTime());

    // Write updated content
    fs.writeFileSync(OUTPUT_PATH, template);
    console.log('✅ Interactive README updated successfully!');
    console.log(`📁 Output written to: ${OUTPUT_PATH}`);
    
    // Log file size for monitoring
    const stats = fs.statSync(OUTPUT_PATH);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('🎮 Interactive elements activated!');
    console.log('🌌 3D animations ready!');
    console.log('✨ Games and quizzes loaded!');
    
  } catch (err) {
    console.error('💥 Interactive update failed:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
}

// Run the interactive update
console.log('🎮 Interactive README Auto-Updater Starting...');
console.log('🌌 Loading 3D universe and interactive elements...');
console.log(`👤 Profile: ${USERNAME}`);
console.log(`📅 Timestamp: ${new Date().toISOString()}`);
console.log('🎨 Preparing holographic displays...');

updateInteractiveREADME().then(() => {
  console.log('🎉 Interactive README universe is now live!');
  console.log('🕹️ Games activated, 3D animations running!');
  console.log('✨ Welcome to the most interactive GitHub profile!');
}).catch(err => {
  console.error('❌ Fatal error in interactive update:', err);
  process.exit(1);
});