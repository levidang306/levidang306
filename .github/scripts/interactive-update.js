const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Enhanced Interactive README Updater
const USERNAME = 'levidang306';
const README_PATH = path.join(__dirname, '..', '..', 'README.md');

// Interactive Game Scores (stored in file)
const SCORES_FILE = path.join(__dirname, 'game-scores.json');

// Load or create game scores
function loadGameScores() {
  try {
    if (fs.existsSync(SCORES_FILE)) {
      return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
    }
  } catch (err) {
    console.log('Creating new scores file...');
  }
  
  return {
    snake: Math.floor(Math.random() * 1000) + 500,
    tictactoe: Math.floor(Math.random() * 50) + 25,
    puzzle: Math.floor(Math.random() * 200) + 100,
    memory: Math.floor(Math.random() * 10) + 5,
    visitors: 0,
    gamesPlayed: Math.floor(Math.random() * 500) + 300,
    puzzlesSolved: Math.floor(Math.random() * 100) + 50,
    connections: Math.floor(Math.random() * 100) + 50
  };
}

// Save game scores
function saveGameScores(scores) {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch (err) {
    console.error('Failed to save scores:', err.message);
  }
}

// Generate random tech facts
function getRandomTechFact() {
  const facts = [
    "The first computer bug was an actual bug! In 1947, Grace Hopper found a moth stuck in a Harvard Mark II computer's relay.",
    "The term 'debugging' was coined by Admiral Grace Hopper in the 1940s.",
    "The first 1GB hard drive in 1980 weighed over 500 pounds and cost $40,000!",
    "JavaScript was created in just 10 days by Brendan Eich in 1995.",
    "The '@' symbol was used in email addresses for the first time in 1971.",
    "Python was named after the British comedy group Monty Python, not the snake!",
    "The first computer programmer was Ada Lovelace in 1843, 100 years before the first computer!",
    "Google's name comes from 'googol' - a mathematical term for 1 followed by 100 zeros.",
    "The first computer virus was created in 1983 and was called 'Elk Cloner'.",
    "WiFi doesn't stand for anything - it's just a play on 'Hi-Fi'!"
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

// Generate interactive coding puzzle
function generateCodingPuzzle() {
  const puzzles = [
    {
      code: "function mystery(x) {\n  return x * 2 + 3;\n}\n// What makes mystery(5) return 13?",
      answer: "It's already correct! 5*2+3=13 ✅"
    },
    {
      code: "function puzzle(a, b) {\n  return (a + b) * 2;\n}\n// What does puzzle(3, 4) return?",
      answer: "14 (3+4=7, 7*2=14) ✅"
    },
    {
      code: "function brain_teaser(n) {\n  return n % 2 === 0 ? n/2 : n*3+1;\n}\n// What's brain_teaser(6)?",
      answer: "3 (6 is even, so 6/2=3) ✅"
    },
    {
      code: "function magic(x, y) {\n  return x ^ y;\n}\n// What does magic(5, 3) return?",
      answer: "6 (XOR operation: 5^3=6) ✅"
    }
  ];
  
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

// Generate interactive constellation
function generateConstellation() {
  const skills = ['JavaScript', 'Python', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'AWS', 'Docker'];
  const shuffled = skills.sort(() => 0.5 - Math.random());
  
  return `
    ⭐ ${shuffled[0]}          ⭐ ${shuffled[1]}
      \\                  /
       \\                /
        ⭐ ${shuffled[2]} ⭐ 
           /        \\
          /          \\
    ⭐ ${shuffled[3]}      ⭐ ${shuffled[4]}
         |            |
         |            |
    ⭐ ${shuffled[5]}    ⭐ ${shuffled[6]} ⭐
  `;
}

// Fetch enhanced GitHub activity
async function fetchEnhancedActivity() {
  try {
    console.log('🔍 Fetching enhanced GitHub activity...');
    const res = await axios.get(`https://api.github.com/users/${USERNAME}/events?per_page=8`, {
      headers: { 
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Interactive-README-Updater'
      }
    });
    
    const activities = res.data.slice(0, 8).map((event, index) => {
      const icons = ['🔄', '🚀', '✅', '🐛', '⭐', '🍴', '👀', '🔥'];
      const statusLabels = ['ACTIVITY', 'FRESH CODE', 'COLLABORATION', 'PROBLEM SOLVER', 'STAR GAZER', 'FORKER', 'WATCHER', 'HOT'];
      
      let desc = '';
      let emoji = icons[index % icons.length];
      let status = statusLabels[index % statusLabels.length];
      
      const date = new Date(event.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      switch (event.type) {
        case 'PushEvent':
          const commits = event.payload.commits?.length || 1;
          desc = `Launched ${commits} commit${commits !== 1 ? 's' : ''} to orbit in **${event.repo.name}**`;
          emoji = '🚀';
          status = 'FRESH CODE';
          break;
        case 'PullRequestEvent':
          desc = `${event.payload.action} PR #${event.payload.pull_request.number} in **${event.repo.name}**`;
          emoji = event.payload.action === 'opened' ? '🔀' : '✅';
          status = 'COLLABORATION';
          break;
        case 'IssuesEvent':
          desc = `${event.payload.action === 'opened' ? 'Discovered' : 'Resolved'} issue #${event.payload.issue.number} in **${event.repo.name}**`;
          emoji = event.payload.action === 'opened' ? '🐛' : '✔️';
          status = 'PROBLEM SOLVER';
          break;
        case 'PullRequestReviewEvent':
          desc = `PullRequestReview activity in **${event.repo.name}**`;
          emoji = '🔄';
          status = 'ACTIVITY';
          break;
        default:
          desc = `${event.type.replace('Event', '')} activity in **${event.repo.name}**`;
      }
      
      return `${emoji}\n${desc}\n📅 ${date} ${status}`;
    }).join('\n\n');
    
    return activities || '🔄 Exploring new coding galaxies...';
  } catch (err) {
    console.error('GitHub activity fetch failed:', err.message);
    return '🔄 Activity updates temporarily offline - Back online soon!';
  }
}

// Update interactive elements in README
async function updateInteractiveReadme() {
  try {
    console.log('🎮 Starting Interactive README Update...');
    
    // Load current scores and update them
    const scores = loadGameScores();
    scores.gamesPlayed += Math.floor(Math.random() * 5) + 1;
    scores.puzzlesSolved += Math.floor(Math.random() * 3);
    scores.connections += Math.floor(Math.random() * 2);
    
    let readme = fs.readFileSync(README_PATH, 'utf8');
    
    // Update random tech fact
    const techFact = getRandomTechFact();
    readme = readme.replace(
      /\*\*Random Tech Fact #\d+\*\*: [^>]+/,
      `**Random Tech Fact #${Math.floor(Math.random() * 100) + 1}**: ${techFact}`
    );
    
    // Update coding puzzle
    const puzzle = generateCodingPuzzle();
    const puzzleSection = `**🧩 CODE PUZZLE OF THE DAY**
\`\`\`javascript
${puzzle.code}
// Answer: ${puzzle.answer}
\`\`\``;
    
    readme = readme.replace(
      /\*\*🧩 CODE PUZZLE OF THE DAY\*\*[\s\S]*?\`\`\`/,
      puzzleSection
    );
    
    // Update constellation
    const constellation = generateConstellation();
    readme = readme.replace(
      /```\n    ⭐ [\s\S]*?```/,
      '```' + constellation + '\n         \n🌌 Navigate my coding universe! 🌌\nEach star represents mastery in that technology\n```'
    );
    
    // Update GitHub activity
    const activity = await fetchEnhancedActivity();
    readme = readme.replace(
      /Real-time updates from the coding universe! ✨[\s\S]*?(?=---)/,
      `Real-time updates from the coding universe! ✨\n\n${activity}\n\n`
    );
    
    // Update challenge tracker
    const trackerSection = `\`\`\`
🏆 Achievements Unlocked: ${Math.floor(Math.random() * 5) + 15}/20
🎮 Games Played: ${scores.gamesPlayed}
🧩 Puzzles Solved: ${scores.puzzlesSolved}  
🤝 Connections Made: ${scores.connections}
📚 Articles Read: ${Math.floor(Math.random() * 100) + 1200}
\`\`\``;
    
    readme = readme.replace(
      /```\n🏆 Achievements Unlocked:[\s\S]*?```/,
      trackerSection
    );
    
    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', { 
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' UTC';
    
    readme = readme.replace(
      /\*🚀 Last Updated: [^🚀]+🚀\*/,
      `*🚀 Last Updated: ${timestamp} 🚀*`
    );
    
    // Save updated scores
    saveGameScores(scores);
    
    // Write updated README
    fs.writeFileSync(README_PATH, readme);
    
    console.log('✅ Interactive README updated successfully!');
    console.log(`🎯 Games played: ${scores.gamesPlayed}`);
    console.log(`🧩 Puzzles solved: ${scores.puzzlesSolved}`);
    console.log(`🤝 Connections: ${scores.connections}`);
    
  } catch (err) {
    console.error('💥 Interactive update failed:', err.message);
    process.exit(1);
  }
}

// Run the interactive update
console.log('🎮 Interactive README Updater Starting...');
updateInteractiveReadme().then(() => {
  console.log('🎉 Interactive README has been updated with fresh content!');
}).catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});