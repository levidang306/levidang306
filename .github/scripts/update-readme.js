const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Config
const TEMPLATE_PATH = path.join(__dirname, 'README-template.md');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'README.md');
const USERNAME = 'levidang306';

// Enhanced logging with timestamps
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${emoji} [${timestamp}] ${message}`);
}

// Enhanced GitHub activity fetching with comprehensive tracking
async function fetchGitHubActivity() {
  try {
    log('Fetching GitHub activity and statistics...');
    
    // Fetch multiple endpoints for comprehensive data
    const [eventsRes, userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${USERNAME}/events?per_page=15`, {
        headers: { 
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'README-updater'
        }
      }),
      axios.get(`https://api.github.com/users/${USERNAME}`, {
        headers: { 
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'README-updater'
        }
      }),
      axios.get(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10`, {
        headers: { 
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'README-updater'
        }
      })
    ]);
    
    // Generate activity summary with enhanced details
    const events = eventsRes.data.slice(0, 8).map(event => {
      let desc = '';
      let emoji = '';
      const date = new Date(event.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      switch (event.type) {
        case 'PushEvent':
          emoji = '📝';
          const commits = event.payload.commits?.length || 0;
          const branch = event.payload.ref?.replace('refs/heads/', '') || 'main';
          desc = `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to \`${event.repo.name}\` (${branch})`;
          break;
        case 'PullRequestEvent':
          emoji = event.payload.action === 'opened' ? '🔀' : event.payload.action === 'merged' ? '✅' : '🔄';
          desc = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} PR [#${event.payload.pull_request.number}](${event.payload.pull_request.html_url}) in \`${event.repo.name}\``;
          break;
        case 'IssuesEvent':
          emoji = event.payload.action === 'opened' ? '🐛' : '✔️';
          desc = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} issue [#${event.payload.issue.number}](${event.payload.issue.html_url}) in \`${event.repo.name}\``;
          break;
        case 'CreateEvent':
          emoji = event.payload.ref_type === 'branch' ? '🌿' : event.payload.ref_type === 'tag' ? '🏷️' : '🌱';
          desc = `Created ${event.payload.ref_type}${event.payload.ref ? ` \`${event.payload.ref}\`` : ''} in \`${event.repo.name}\``;
          break;
        case 'StarEvent':
          emoji = '⭐';
          desc = `Starred [\`${event.repo.name}\`](https://github.com/${event.repo.name})`;
          break;
        case 'ForkEvent':
          emoji = '🍴';
          desc = `Forked [\`${event.repo.name}\`](https://github.com/${event.repo.name})`;
          break;
        case 'WatchEvent':
          emoji = '👀';
          desc = `Started watching [\`${event.repo.name}\`](https://github.com/${event.repo.name})`;
          break;
        case 'ReleaseEvent':
          emoji = '🚀';
          desc = `Released [\`${event.payload.release.tag_name}\`](${event.payload.release.html_url}) in \`${event.repo.name}\``;
          break;
        default:
          emoji = '🔄';
          desc = `${event.type.replace('Event', '')} in \`${event.repo.name}\``;
      }
      
      return `- ${emoji} **${desc}** *${date}*`;
    }).join('\n');

    // Add GitHub stats summary
    const user = userRes.data;
    const recentRepos = reposRes.data.slice(0, 3).map(repo => 
      `[\`${repo.name}\`](${repo.html_url})`
    ).join(', ');

    let activitySection = `### 🔔 Recent GitHub Activity\n\n`;
    activitySection += `📊 **Quick Stats**: ${user.public_repos} repos • ${user.followers} followers • ${user.following} following\n`;
    activitySection += `🔥 **Recently Active**: ${recentRepos}\n\n`;
    activitySection += `**Latest Activity:**\n${events || '- No recent activity'}\n`;
    
    log(`Fetched ${eventsRes.data.length} events and ${reposRes.data.length} repositories`, 'success');
    return activitySection;
  } catch (err) {
    log(`GitHub activity fetch failed: ${err.message}`, 'error');
    return `### 🔔 Recent GitHub Activity\n\n- 📊 Activity updates temporarily unavailable\n- 🔄 Last attempt: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n- ⚡ Will retry automatically on next update\n`;
  }
}

// Enhanced WakaTime stats with comprehensive tracking
async function fetchWakaTimeStats() {
  if (!process.env.WAKATIME_API_KEY) {
    log('WakaTime API key not found, showing integration info...', 'warning');
    return `### ⏰ This Week's Coding Time\n\n- 📊 **WakaTime Integration**: Set up your API key for real-time coding stats!\n- ⚡ **Features**: Track languages, editors, projects, and coding time\n- 🔗 **Setup**: Add \`WAKATIME_API_KEY\` to repository secrets\n- 📈 **Coming Soon**: Detailed weekly coding statistics and trends\n`;
  }

  try {
    log('Fetching comprehensive WakaTime statistics...');
    // Fetch multiple WakaTime endpoints for comprehensive stats
    const [weeklyRes, todayRes] = await Promise.all([
      axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
        headers: { 
          Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`,
          'User-Agent': 'README-updater'
        }
      }),
      axios.get('https://wakatime.com/api/v1/users/current/summaries?start=today&end=today', {
        headers: { 
          Authorization: `Bearer ${process.env.WAKATIME_API_KEY}`,
          'User-Agent': 'README-updater'
        }
      })
    ]);
    
    const weeklyData = weeklyRes.data.data;
    const todayData = todayRes.data.data[0];
    
    let statsText = `### ⏰ This Week's Coding Time\n\n`;
    
    // Today's coding time
    if (todayData && todayData.grand_total.total_seconds > 0) {
      const todayHours = (todayData.grand_total.total_seconds / 3600).toFixed(1);
      statsText += `- 🔥 **Today**: ${todayHours} hours\n`;
    }
    
    // Total weekly time
    if (weeklyData.total_seconds) {
      const totalHours = (weeklyData.total_seconds / 3600).toFixed(1);
      const totalMinutes = Math.round(weeklyData.total_seconds / 60);
      statsText += `- ⏱️ **This Week**: ${totalHours} hours (${totalMinutes} minutes)\n`;
    }
    
    // Daily average
    if (weeklyData.daily_average && weeklyData.daily_average.total_seconds) {
      const dailyHours = (weeklyData.daily_average.total_seconds / 3600).toFixed(1);
      statsText += `- 📅 **Daily Average**: ${dailyHours} hours\n`;
    }
    
    // Productivity insights
    if (weeklyData.total_seconds > 0) {
      const productivity = weeklyData.total_seconds > 25200 ? '🚀 High' : weeklyData.total_seconds > 14400 ? '⚡ Good' : '📈 Building';
      statsText += `- 📊 **Productivity**: ${productivity}\n`;
    }
    
    // Top languages with visual bars
    if (weeklyData.languages && weeklyData.languages.length > 0) {
      statsText += `\n**🔥 Top Languages This Week:**\n`;
      weeklyData.languages.slice(0, 5).forEach(lang => {
        const percentage = lang.percent.toFixed(1);
        const hours = (lang.total_seconds / 3600).toFixed(1);
        const barLength = Math.round(percentage / 5);
        const bar = '█'.repeat(barLength) + '░'.repeat(Math.max(0, 20 - barLength));
        statsText += `\`${lang.name.padEnd(12)}\` ${bar} ${percentage}% (${hours}h)\n`;
      });
    }
    
    // Development environment
    if (weeklyData.editors && weeklyData.editors.length > 0) {
      statsText += `\n**🛠️ Development Environment:**\n`;
      weeklyData.editors.slice(0, 3).forEach(editor => {
        const hours = (editor.total_seconds / 3600).toFixed(1);
        const percentage = editor.percent.toFixed(1);
        statsText += `- **${editor.name}**: ${hours}h (${percentage}%)\n`;
      });
    }
    
    // Operating systems
    if (weeklyData.operating_systems && weeklyData.operating_systems.length > 0) {
      const os = weeklyData.operating_systems[0];
      statsText += `- **OS**: ${os.name} (${os.percent.toFixed(1)}%)\n`;
    }
    
    log(`WakaTime stats: ${(weeklyData.total_seconds / 3600).toFixed(1)}h this week`, 'success');
    return statsText;
  } catch (err) {
    log(`WakaTime fetch failed: ${err.message}`, 'error');
    return `### ⏰ This Week's Coding Time\n\n- 📊 **Status**: Coding stats temporarily unavailable\n- ⚠️ **Error**: ${err.response?.status || 'Network'} - ${err.message}\n- 🔄 **Next Retry**: Next scheduled update\n- 💡 **Tip**: Verify WakaTime API key in repository secrets\n`;
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

// Main update function with comprehensive error handling and monitoring
async function updateREADME() {
  const startTime = Date.now();
  
  try {
    log('🚀 Starting enhanced README update process...');
    
    // Environment checks
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Template file not found: ${TEMPLATE_PATH}`);
    }
    
    // Load template with validation
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    log('📖 Template loaded successfully');
    
    // Validate template has required placeholders
    const requiredPlaceholders = ['<!-- ACTIVITY_FEED -->', '<!-- WAKATIME_STATS -->', '<!-- QUOTE -->', '<!-- LAST_UPDATED -->'];
    const missingPlaceholders = requiredPlaceholders.filter(placeholder => !template.includes(placeholder));
    
    if (missingPlaceholders.length > 0) {
      log(`Missing placeholders: ${missingPlaceholders.join(', ')}`, 'warning');
    }

    // Fetch all data concurrently with timeout
    log('📡 Fetching comprehensive dynamic content...');
    const fetchPromises = [
      fetchGitHubActivity(),
      fetchWakaTimeStats(),
      fetchQuote()
    ];
    
    const [activity, wakaStats, quote] = await Promise.all(
      fetchPromises.map(promise => 
        Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 30000)
          )
        ])
      )
    );

    log('✅ All data fetched successfully');

    // Replace placeholders with enhanced content
    const replacements = [
      { placeholder: '<!-- ACTIVITY_FEED -->', content: activity },
      { placeholder: '<!-- WAKATIME_STATS -->', content: wakaStats },
      { placeholder: '<!-- QUOTE -->', content: quote },
      { placeholder: '<!-- LAST_UPDATED -->', content: getCurrentTime() }
    ];
    
    replacements.forEach(({ placeholder, content }) => {
      if (template.includes(placeholder)) {
        template = template.replace(placeholder, content);
        log(`✅ Replaced ${placeholder}`);
      } else {
        log(`⚠️ Placeholder ${placeholder} not found in template`, 'warning');
      }
    });

    // Create backup if file exists
    if (fs.existsSync(OUTPUT_PATH)) {
      const backupPath = `${OUTPUT_PATH}.backup`;
      fs.copyFileSync(OUTPUT_PATH, backupPath);
      log(`📋 Created backup: ${backupPath}`);
    }

    // Write updated content with error handling
    fs.writeFileSync(OUTPUT_PATH, template, 'utf8');
    
    // Validate output file
    const stats = fs.statSync(OUTPUT_PATH);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log(`✅ README updated successfully!`, 'success');
    log(`📁 Output: ${OUTPUT_PATH}`);
    log(`📊 File size: ${fileSizeKB} KB`);
    log(`⏱️ Processing time: ${processingTime}s`);
    
    // Verify content quality
    const lines = template.split('\n').length;
    const words = template.split(/\s+/).length;
    log(`� Content: ${lines} lines, ${words} words`);
    
    // Environment-specific logging
    if (process.env.DEBUG_MODE === 'true') {
      log('🔍 Debug mode enabled - detailed logs written');
    }
    
  } catch (err) {
    log(`💥 Update failed after ${((Date.now() - startTime) / 1000).toFixed(2)}s`, 'error');
    log(`Error: ${err.message}`, 'error');
    
    if (process.env.DEBUG_MODE === 'true') {
      log(`Stack trace: ${err.stack}`, 'error');
    }
    
    process.exit(1);
  }
}

// Enhanced startup logging and execution
const startupTime = new Date();
log('🤖 Professional README Auto-Updater v2.0');
log(`👤 Target User: ${USERNAME}`);
log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
log(`📅 Started: ${startupTime.toISOString()}`);
log(`🚀 Node.js: ${process.version}`);

// Add process monitoring
process.on('uncaughtException', (err) => {
  log(`💥 Uncaught Exception: ${err.message}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

// Execute with comprehensive error handling
updateREADME().then(() => {
  const duration = ((Date.now() - startupTime.getTime()) / 1000).toFixed(2);
  log(`🎉 README update completed successfully in ${duration}s!`, 'success');
  log('📈 Next update: Every 2 hours (automatic) or manual via workflow_dispatch');
  process.exit(0);
}).catch(err => {
  log(`❌ Fatal error in main execution: ${err.message}`, 'error');
  process.exit(1);
});