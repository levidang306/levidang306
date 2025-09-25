const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Config
const TEMPLATE_PATH = path.join(__dirname, 'README-template.md');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'README.md');
const USERNAME = 'levidang306';

// Fetch recent GitHub activity
async function fetchGitHubActivity() {
  try {
    const res = await axios.get(`https://api.github.com/users/${USERNAME}/events?per_page=5`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
    const events = res.data.map(event => {
      let desc = '';
      if (event.type === 'PushEvent') desc = `Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`;
      else if (event.type === 'PullRequestEvent') desc = `${event.payload.action} PR #${event.payload.pull_request.number} in ${event.repo.name}`;
      else if (event.type === 'IssuesEvent') desc = `${event.payload.action} issue #${event.payload.issue.number} in ${event.repo.name}`;
      else desc = `${event.type} in ${event.repo.name}`;
      return `- [${desc}](${event.repo.url}) (${new Date(event.created_at).toLocaleDateString()})`;
    }).join('\n');
    return `### 🔔 Recent GitHub Activity\n\n${events || 'No recent activity'}\n`;
  } catch (err) {
    console.error('GitHub activity fetch failed:', err.message);
    return '<!-- Activity fetch failed -->';
  }
}

// Fetch WakaTime coding stats
async function fetchWakaTimeStats() {
  try {
    const res = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      headers: { Authorization: `Basic ${Buffer.from(process.env.WAKA_API_KEY + ':').toString('base64')}` }
    });
    const data = res.data.data;
    const editors = data.editors.slice(0, 3).map(e => `${e.name}: ${(e.total_seconds / 3600).toFixed(1)} hrs`).join('\n- ');
    const languages = data.languages.slice(0, 3).map(l => `${l.name}: ${l.percent}%`).join('\n- ');
    const days = data.daily_average ? `${(data.daily_average.total_seconds / 3600).toFixed(1)} hrs/day` : 'N/A';
    return `### 📊 Coding Stats (Last 7 Days)\n\n- Daily Average: ${days}\n- Editors:\n- ${editors}\n- Languages:\n- ${languages}\n`;
  } catch (err) {
    console.error('WakaTime fetch failed:', err.message);
    return '<!-- WakaTime stats unavailable -->';
  }
}

// Fetch random tech quote
async function fetchQuote() {
  try {
    const res = await axios.get('https://api.quotable.io/random?tags=technology');
    return `> "${res.data.content}" - ${res.data.author}`;
  } catch (err) {
    console.error('Quote fetch failed:', err.message);
    return '> "Code is like poetry; it’s all about expressing complex ideas with elegance." - Unknown';
  }
}

// Main update function
async function updateREADME() {
  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Replace placeholders with dynamic content
  template = template.replace('<!-- ACTIVITY_FEED -->', await fetchGitHubActivity());
  template = template.replace('<!-- WAKATIME_STATS -->', await fetchWakaTimeStats());
  template = template.replace('<!-- QUOTE -->', await fetchQuote());
  template = template.replace('<!-- LAST_UPDATED -->', new Date().toLocaleString('en-GB', { timeZone: 'UTC' }));

  // Write to README.md
  fs.writeFileSync(OUTPUT_PATH, template);
  console.log('README updated successfully!');
}

updateREADME().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});
