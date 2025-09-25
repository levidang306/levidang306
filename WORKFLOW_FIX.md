# GitHub Actions Fix Guide

## 🚨 Current Issue: WakaTime Permission Error

The error occurs because the WakaTime action needs more permissions than the default `GITHUB_TOKEN` provides.

### Error Message:
```
403 {"message": "Resource not accessible by integration", "documentation_url": "https://docs.github.com/rest/users/users#get-the-authenticated-user", "status": "403"}
```

## ✅ Solutions

### Option 1: Use Without WakaTime (Current Setup)
The current workflow in `update-readme.yml` works without WakaTime and provides:
- ✅ Dynamic quote updates
- ✅ Timestamp updates
- ✅ Automatic commits
- ✅ No permission issues

### Option 2: Add Personal Access Token for WakaTime

1. **Create Personal Access Token:**
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Generate new token (classic) with these permissions:
     - `repo` (Full control of private repositories)
     - `user` (Update ALL user data)
     - `admin:repo_hook` (Full control of repository hooks)

2. **Add Secrets:**
   - Go to your repository → Settings → Secrets and Variables → Actions
   - Add these secrets:
     - `PERSONAL_ACCESS_TOKEN` - Your GitHub PAT
     - `WAKATIME_API_KEY` - Your WakaTime API key

3. **Use the WakaTime Workflow:**
   ```bash
   # Replace current workflow with WakaTime version
   cp .github/workflows/update-readme-wakatime.yml .github/workflows/update-readme.yml
   ```

### Option 3: Alternative WakaTime Setup

Use a different WakaTime action that's more compatible:

```yaml
- name: ⏰ Update WakaTime Stats
  uses: athul/waka-readme@master
  with:
    WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SHOW_PROJECTS: "False"
    SHOW_EDITORS: "False"
    SHOW_TIMEZONE: "False"
    SHOW_LANGUAGE: "True"
    SHOW_OS: "False"
```

## 🛠️ How to Get WakaTime API Key

1. Sign up at [wakatime.com](https://wakatime.com)
2. Install WakaTime extension in VS Code
3. Go to [WakaTime Settings](https://wakatime.com/settings/account)
4. Copy your Secret API Key
5. Add it as `WAKATIME_API_KEY` in GitHub repository secrets

## 🎯 Current Working Features

Even without WakaTime, your profile still has:
- ✅ Dynamic GitHub stats (via external services)
- ✅ Rotating tech quotes
- ✅ Interactive portfolio server
- ✅ Real games and activities
- ✅ Auto-updating timestamps

## 🚀 Test the Current Setup

The current workflow should work fine. Test it by:

```bash
# Trigger the workflow manually
gh workflow run update-readme.yml
```

Or just push changes to main branch and it will auto-run.

## 📊 Monitoring

Check workflow status:
- Go to your repo → Actions tab
- Look for "Update Dynamic README Profile" runs
- Green = success, Red = failed

If you see the quote and timestamp updating in your README, everything is working! 🎉