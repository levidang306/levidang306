const fs = require('fs');
const path = require('path');

async function updateReadme() {
    try {
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
        const timestampRegex = /Last updated: .*/;
        if (timestampRegex.test(readmeContent)) {
            readmeContent = readmeContent.replace(
                timestampRegex,
                `Last updated: ${timeString}`
            );
            console.log(`✅ Updated timestamp: ${timeString}`);
        } else {
            console.log('⚠️ Timestamp pattern not found in README');
        }

        // Add a simple activity update (if there's a placeholder)
        const activityRegex = /<!-- GITHUB-ACTIVITY:START -->([\s\S]*?)<!-- GITHUB-ACTIVITY:END -->/;
        if (activityRegex.test(readmeContent)) {
            const newActivity = `<!-- GITHUB-ACTIVITY:START -->
- 🚀 Updated README automatically
- 🎯 Refreshed dynamic content  
- ⚡ Workflow running successfully
- 📊 Stats updated: ${now.toLocaleDateString()}
- 🔄 Next update in 2 hours
<!-- GITHUB-ACTIVITY:END -->`;
            
            readmeContent = readmeContent.replace(activityRegex, newActivity);
            console.log('✅ Updated activity section');
        }

        // Write back to file
        fs.writeFileSync(readmePath, readmeContent);

        console.log('🎉 README updated successfully!');
        console.log(`🕒 Updated at: ${timeString}`);

    } catch (error) {
        console.error('❌ Error updating README:', error);
        process.exit(1);
    }
}

// Run the update
if (require.main === module) {
    updateReadme();
}

module.exports = updateReadme;