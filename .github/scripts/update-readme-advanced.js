const fs = require('fs');
const path = require('path');

// Read the current README
const readmePath = path.join(process.cwd(), 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Update timestamp
const now = new Date();
const timeString = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
});

// Replace timestamp in README
readmeContent = readmeContent.replace(
    /\*Last updated: .+\*/,
    `*Last updated: ${timeString} • Automated with ❤️ by GitHub Actions*`
);

// Add some dynamic quotes
const techQuotes = [
    { quote: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "Strategy" },
    { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "Quality" },
    { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "Clean Code" },
    { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs", category: "UX" },
    { quote: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine", category: "Learning" }
];

const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];

// Update the quote section
const quoteSection = `> *"${randomQuote.quote}"*  
> **— ${randomQuote.author}**

*🎯 ${randomQuote.category}*`;
};

// Enhanced GitHub Activity with detailed tracking
async function generateGitHubActivity() {
  try {
    console.log('📈 Generating comprehensive GitHub activity...');
    
    const activityFile = path.join(CONFIG.TEMP_DIR, 'github-activity.json');
    const userFile = path.join(CONFIG.TEMP_DIR, 'github-user.json');
    const reposFile = path.join(CONFIG.TEMP_DIR, 'github-repos.json');
    
    const activity = readJSON(activityFile) || [];
    const user = readJSON(userFile) || {};
    const repos = readJSON(reposFile) || [];
    
    let activityHTML = `### 🔔 Real-time GitHub Activity\n\n`;
    
    // User stats overview
    if (user.public_repos) {
      activityHTML += `📊 **Profile Stats**: ${user.public_repos} repos • ${user.followers} followers • ${user.following} following\n\n`;
    }
    
    // Recent activity with enhanced descriptions
    if (activity.length > 0) {
      const recentEvents = activity.slice(0, 8).map(event => {
        const date = formatTime(event.created_at);
        let desc = '';
        let emoji = '';
        
        switch (event.type) {
          case 'PushEvent':
            emoji = '📝';
            const commits = event.payload?.commits?.length || 0;
            const messages = event.payload?.commits?.map(c => c.message.split('\n')[0]).join(', ') || '';
            desc = `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to **${event.repo.name}**`;
            if (messages) desc += `\n    _${messages.substring(0, 60)}${messages.length > 60 ? '...' : ''}_`;
            break;
          case 'PullRequestEvent':
            emoji = event.payload?.action === 'opened' ? '🔀' : '✅';
            const pr = event.payload?.pull_request;
            desc = `${event.payload?.action} PR #${pr?.number} in **${event.repo.name}**`;
            if (pr?.title) desc += `\n    _${pr.title.substring(0, 60)}${pr.title.length > 60 ? '...' : ''}_`;
            break;
          case 'IssuesEvent':
            emoji = event.payload?.action === 'opened' ? '🐛' : '✔️';
            const issue = event.payload?.issue;
            desc = `${event.payload?.action} issue #${issue?.number} in **${event.repo.name}**`;
            if (issue?.title) desc += `\n    _${issue.title.substring(0, 60)}${issue.title.length > 60 ? '...' : ''}_`;
            break;
          case 'CreateEvent':
            emoji = '🌱';
            desc = `Created ${event.payload?.ref_type || 'repository'} in **${event.repo.name}**`;
            break;
          case 'StarEvent':
            emoji = '⭐';
            desc = `Starred **${event.repo.name}**`;
            break;
          case 'ForkEvent':
            emoji = '🍴';
            desc = `Forked **${event.repo.name}**`;
            break;
          case 'WatchEvent':
            emoji = '👀';
            desc = `Started watching **${event.repo.name}**`;
            break;
          default:
            emoji = '🔄';
            desc = `${event.type.replace('Event', '')} in **${event.repo.name}**`;
        }
        
        return `- ${emoji} **${desc}** *(${date})*`;
      }).join('\n');
      
      activityHTML += recentEvents;
    } else {
      activityHTML += '- 📊 Activity data temporarily unavailable';
    }
    
    // Repository diversity tracking
    if (repos.length > 0) {
      const languages = {};
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      const topLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => `${lang} (${count})`)
        .join(' • ');
      
      if (topLanguages) {
        activityHTML += `\n\n🎯 **Active Languages**: ${topLanguages}`;
      }
      
      const recentRepos = repos.slice(0, 3).map(repo => 
        `[${repo.name}](${repo.html_url}) ${repo.description ? '- ' + repo.description.substring(0, 50) + '...' : ''}`
      ).join('\n- ');
      
      if (recentRepos) {
        activityHTML += `\n\n🚀 **Recent Projects**:\n- ${recentRepos}`;
      }
    }
    
    return activityHTML + '\n';
    
  } catch (error) {
    console.error('❌ GitHub activity generation failed:', error.message);
    return `### 🔔 Real-time GitHub Activity\n\n- 📊 Activity updates temporarily unavailable\n`;
  }
}

// Enhanced WakaTime stats with comprehensive tracking
async function generateWakaTimeStats() {
  if (!process.env.WAKATIME_API_KEY) {
    return `### ⏰ Development Time Tracking\n\n- 📊 **WakaTime Integration**: Add your API key to enable detailed coding statistics\n- ⚡ **Coming Soon**: Coding time, languages, editors, and productivity insights\n`;
  }

  try {
    console.log('📊 Fetching comprehensive WakaTime statistics...');
    
    const [weekStats, allTimeStats] = await Promise.all([
      axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
        headers: { Authorization: `Bearer ${process.env.WAKATIME_API_KEY}` }
      }),
      axios.get('https://wakatime.com/api/v1/users/current/all_time_since_today', {
        headers: { Authorization: `Bearer ${process.env.WAKATIME_API_KEY}` }
      }).catch(() => null)
    ]);
    
    const weekData = weekStats.data.data;
    const allTimeData = allTimeStats?.data?.data;
    
    let statsHTML = `### ⏰ Development Time Tracking\n\n`;
    
    // Time overview
    if (weekData.total_seconds) {
      const weekHours = (weekData.total_seconds / 3600).toFixed(1);
      const dailyAvg = weekData.daily_average ? (weekData.daily_average.total_seconds / 3600).toFixed(1) : '0';
      
      statsHTML += `🕒 **This Week**: ${weekHours}h • **Daily Average**: ${dailyAvg}h\n`;
      
      if (allTimeData?.total_seconds) {
        const allTimeHours = (allTimeData.total_seconds / 3600).toFixed(0);
        statsHTML += `📈 **All Time**: ${allTimeHours}h of coding\n`;
      }
    }
    
    // Languages breakdown
    if (weekData.languages && weekData.languages.length > 0) {
      const languages = weekData.languages.slice(0, 5).map(lang => 
        `${lang.name} ${lang.percent.toFixed(1)}%`
      ).join(' • ');
      statsHTML += `\n💻 **Languages**: ${languages}\n`;
    }
    
    // Editors and OS
    if (weekData.editors && weekData.editors.length > 0) {
      const editors = weekData.editors.slice(0, 3).map(editor => 
        `${editor.name} ${(editor.total_seconds / 3600).toFixed(1)}h`
      ).join(' • ');
      statsHTML += `🛠️ **Editors**: ${editors}\n`;
    }
    
    if (weekData.operating_systems && weekData.operating_systems.length > 0) {
      const os = weekData.operating_systems.slice(0, 2).map(os => 
        `${os.name} ${os.percent.toFixed(1)}%`
      ).join(' • ');
      statsHTML += `💾 **OS**: ${os}\n`;
    }
    
    // Best day
    if (weekData.days && weekData.days.length > 0) {
      const bestDay = weekData.days.reduce((max, day) => 
        day.total_seconds > max.total_seconds ? day : max
      );
      const bestDayHours = (bestDay.total_seconds / 3600).toFixed(1);
      statsHTML += `\n🎯 **Most Productive**: ${bestDay.date} (${bestDayHours}h)\n`;
    }
    
    return statsHTML;
    
  } catch (error) {
    console.error('❌ WakaTime stats failed:', error.message);
    return `### ⏰ Development Time Tracking\n\n- 📊 Coding statistics temporarily unavailable\n- 🔄 Will retry on next update\n`;
  }
}

// Repository statistics
async function generateRepoStats() {
  try {
    const statsFile = path.join(CONFIG.TEMP_DIR, 'repo-stats.json');
    const stats = readJSON(statsFile);
    
    if (!stats) {
      return `### 📊 Repository Statistics\n\n- 📈 Statistics generation in progress...\n`;
    }
    
    return `### 📊 Repository Statistics\n\n` +
           `📝 **Commits**: ${stats.commits} • ` +
           `🌿 **Branches**: ${stats.branches} • ` +
           `👥 **Contributors**: ${stats.contributors}\n` +
           `📁 **Code Files**: ${stats.files} • ` +
           `📏 **Lines of Code**: ${stats.lines}\n`;
           
  } catch (error) {
    console.error('❌ Repository stats failed:', error.message);
    return `### 📊 Repository Statistics\n\n- 📈 Statistics temporarily unavailable\n`;
  }
}

// Enhanced motivational quotes with tech focus
async function generateQuote() {
  try {
    const techQuotes = [
      { content: "Code is like poetry; it's all about expressing complex ideas with elegance.", author: "Unknown" },
      { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { content: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
      { content: "The best code is no code at all.", author: "Jeff Atwood" },
      { content: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" }
    ];
    
    try {
      const response = await axios.get('https://api.quotable.io/random?tags=technology,motivational&maxLength=100', {
        timeout: 5000
      });
      return `> *"${response.data.content}"*\n>\n> **— ${response.data.author}**`;
    } catch {
      const quote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
      return `> *"${quote.content}"*\n>\n> **— ${quote.author}**`;
    }
  } catch (error) {
    return `> *"Code never lies, comments sometimes do."*\n>\n> **— Ron Jeffries**`;
  }
}

// Main update function
async function updateREADME() {
  try {
    console.log('🚀 Starting comprehensive README update...');
    console.log(`📋 Update type: ${CONFIG.UPDATE_TYPE}`);
    
    if (!fs.existsSync(CONFIG.TEMPLATE_PATH)) {
      throw new Error(`Template not found: ${CONFIG.TEMPLATE_PATH}`);
    }
    
    let template = fs.readFileSync(CONFIG.TEMPLATE_PATH, 'utf8');
    console.log('📖 Template loaded');
    
    // Generate content based on update type
    const updates = {};
    
    if (CONFIG.UPDATE_TYPE === 'full' || CONFIG.UPDATE_TYPE === 'activity_only') {
      updates.activity = await generateGitHubActivity();
      updates.repoStats = await generateRepoStats();
    }
    
    if (CONFIG.UPDATE_TYPE === 'full' || CONFIG.UPDATE_TYPE === 'stats_only') {
      updates.wakaTime = await generateWakaTimeStats();
      updates.quote = await generateQuote();
    }
    
    // Replace placeholders
    if (updates.activity) {
      template = template.replace('<!-- ACTIVITY_FEED -->', updates.activity);
    }
    if (updates.wakaTime) {
      template = template.replace('<!-- WAKATIME_STATS -->', updates.wakaTime);
    }
    if (updates.repoStats) {
      template = template.replace('<!-- REPO_STATS -->', updates.repoStats);
    }
    if (updates.quote) {
      template = template.replace('<!-- QUOTE -->', updates.quote);
    }
    
    // Update timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' UTC';
    
    template = template.replace('<!-- LAST_UPDATED -->', timestamp);
    
    // Write updated README
    fs.writeFileSync(CONFIG.OUTPUT_PATH, template);
    
    const stats = fs.statSync(CONFIG.OUTPUT_PATH);
    console.log('✅ README updated successfully!');
    console.log(`📁 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`🕒 Last updated: ${timestamp}`);
    
  } catch (error) {
    console.error('💥 Update failed:', error.message);
    process.exit(1);
  }
}

// Execute update
console.log('🤖 Advanced README Updater Starting...');
console.log(`👤 User: ${CONFIG.USERNAME}`);
console.log(`📅 Timestamp: ${new Date().toISOString()}`);

updateREADME().then(() => {
  console.log('🎉 Comprehensive README update completed!');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});