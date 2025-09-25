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

        readmeContent = readmeContent.replace(
            /> \*"[^"]+"\*\s+> \*\*— [^*]+\*\*\s+\*🎯 [^*]+\*/,
            quoteSection
        );

        // Write back to file
        fs.writeFileSync(readmePath, readmeContent);

        console.log('✅ README updated successfully!');
        console.log(`🕒 Updated at: ${timeString}`);
        console.log(`💭 New quote: "${randomQuote.quote}" - ${randomQuote.author}`);

    } catch (error) {
        console.error('❌ Error updating README:', error);
        process.exit(1);
    }
}

// Run the update
updateReadme();