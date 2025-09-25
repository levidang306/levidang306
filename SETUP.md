# README Auto-Updater Setup Guide

## 🚀 Overview

This project automatically updates your GitHub profile README every 5 hours with:
- Recent GitHub activity
- WakaTime coding statistics (optional)
- Random inspirational tech quotes
- Last updated timestamp

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

You need to set up the following secrets in your GitHub repository:

#### Required:
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions (no setup needed)

#### Optional (for WakaTime integration):
- `WAKATIME_API_KEY` - Your WakaTime API key for coding time stats

### 2. Setting up WakaTime (Optional but Recommended)

1. **Create WakaTime Account**: 
   - Go to [wakatime.com](https://wakatime.com) and create an account

2. **Install WakaTime Plugin**:
   - Install WakaTime plugin for your IDE (VS Code, JetBrains, etc.)
   - Follow the setup instructions to connect your IDE

3. **Get API Key**:
   - Go to [WakaTime Settings](https://wakatime.com/settings/account)
   - Copy your "Secret API Key"

4. **Add to GitHub Secrets**:
   - Go to your repository on GitHub
   - Navigate to `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Name: `WAKATIME_API_KEY`
   - Value: Your WakaTime API key
   - Click `Add secret`

### 3. Manual Testing

You can manually trigger the workflow:
- Go to the `Actions` tab in your repository
- Click on "Update README with Dynamic Content"
- Click "Run workflow" → "Run workflow"

## 📊 Features

### ✅ What's Working:
- ✅ Every 5-hour automatic updates
- ✅ Manual trigger support
- ✅ Recent GitHub activity tracking
- ✅ Inspirational quotes
- ✅ Graceful error handling
- ✅ Smart change detection (only commits when there are changes)
- ✅ Beautiful emojis and formatting

### 🔄 WakaTime Integration:
- ⏰ Weekly coding time statistics
- 💻 Top programming languages
- 🛠️ Editor usage statistics
- 📅 Daily average coding time

## 🕐 Schedule

The action runs:
- **Every 5 hours**: `0 */5 * * *` (00:00, 05:00, 10:00, 15:00, 20:00 UTC)
- **On push**: When you push to the main branch
- **Manual trigger**: Anytime you want via GitHub Actions tab

## 🐛 Troubleshooting

### Common Issues:

1. **No WakaTime stats showing up**:
   - Make sure you've added the `WAKATIME_API_KEY` secret
   - Ensure you have at least some coding activity tracked by WakaTime

2. **GitHub activity not updating**:
   - Check if the `GITHUB_TOKEN` has proper permissions
   - Verify the repository is public or the token has access

3. **Workflow not running**:
   - Check the Actions tab for any failed runs
   - Ensure the workflow file is in `.github/workflows/`

### Manual Local Testing:

```bash
# Install dependencies
npm install

# Run the script locally (for testing)
npm run update
```

## 📝 Customization

### Modify Update Frequency:
Edit `.github/workflows/update-readme.yml`:
```yaml
schedule:
  - cron: '0 */3 * * *'  # Every 3 hours
  - cron: '0 */6 * * *'  # Every 6 hours
  - cron: '0 9 * * *'    # Daily at 9 AM UTC
```

### Customize Template:
Edit `.github/scripts/README-template.md` to modify the layout and content.

### Add More Data Sources:
Edit `.github/scripts/update-readme.js` to add new API integrations.

## 📈 Current Configuration

- **Update Frequency**: Every 5 hours
- **Timeout**: 10 minutes max per run
- **Dependencies**: axios (for HTTP requests)
- **Node.js Version**: 20.x
- **Template**: Dynamic with placeholders

## 🎯 Next Steps

1. ✅ Set up WakaTime API key for coding stats
2. ✅ Watch for the first automated update (next scheduled time)
3. ✅ Customize the template if needed
4. ✅ Enjoy your auto-updating profile! 🎉