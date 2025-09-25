# Interactive Portfolio Server

A Node.js server that provides dynamic SVG endpoints for GitHub README and an interactive web portfolio.

## Features

### Dynamic GitHub README Components

- **Activity SVG**: `/api/recent-activity.svg` - Dynamic GitHub activity display
- **Quote SVG**: `/api/quote.svg` - Random tech quotes with no caching
- **Visitor Counter**: `/api/visitors` - Simple visitor counting API

### Interactive Web Portfolio

- **Games**: Tic-tac-toe, Memory game, Code puzzles
- **Dynamic Content**: Real-time quotes, activity feeds
- **Responsive Design**: Works on all devices

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install express
   ```

2. **Run the Server**

   ```bash
   node server.js
   ```

3. **Access the Portfolio**
   - Web Interface: `http://localhost:3000`
   - GitHub Activity SVG: `http://localhost:3000/api/recent-activity.svg`
   - Quote SVG: `http://localhost:3000/api/quote.svg`

## GitHub README Integration

Add these to your README.md for dynamic content:

```markdown
<!-- Dynamic Activity -->

[![Recent Activity](https://yourserver.com/api/recent-activity.svg)](https://github.com/yourusername)

<!-- Dynamic Quote -->

[![Daily Quote](https://yourserver.com/api/quote.svg)](https://yourserver.com)
```

## Deployment Options

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

### Heroku

1. Create app: `heroku create your-portfolio`
2. Deploy: `git push heroku main`

### Railway

1. Connect GitHub repo to Railway
2. Deploy automatically on push

## No-Cache Headers

All SVG endpoints use proper cache-control headers to ensure GitHub refreshes the content:

```javascript
'Cache-Control': 'no-cache, no-store, must-revalidate'
```

## Customization

- **Quotes**: Edit the quotes array in `server.js`
- **Activities**: Connect to GitHub API for real activity data
- **Styling**: Modify CSS in `interactive/index.html`
- **Games**: Add new interactive elements

## API Endpoints

| Endpoint                   | Description             | Response  |
| -------------------------- | ----------------------- | --------- |
| `/api/recent-activity.svg` | Dynamic GitHub activity | SVG Image |
| `/api/quote.svg`           | Random tech quote       | SVG Image |
| `/api/visitors`            | Visitor count           | JSON      |
| `/api/health`              | Server health check     | JSON      |

## Technologies Used

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Dynamic Content**: SVG generation
- **Styling**: CSS Grid + Flexbox + Animations

Perfect for creating engaging GitHub profiles with real interactivity!
