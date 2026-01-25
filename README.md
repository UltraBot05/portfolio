# 🚀 Terminal Portfolio

A unique, interactive terminal-based portfolio website that showcases skills through an actual working Linux-style terminal interface powered by AI.

![Portfolio Preview](preview.png)

## ✨ Features

- **🖥️ Authentic Terminal Experience**: Boot sequence, command line interface, and real terminal aesthetics
- **🤖 AI-Powered Natural Language Processing**: Ask questions in plain English, powered by Google's Gemini API
- **⚡ Lightning Fast**: Built with React + Vite for blazing-fast performance
- **🎨 Beautiful Design**: Catppuccin Mocha color theme with Fira Code font
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **🔧 Interactive Commands**: Type commands like a real terminal or ask natural questions

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Styling**: Pure CSS with custom terminal theme
- **Deployment**: Vercel (with serverless functions)
- **Font**: Fira Code

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Get your free API key from: https://makersuite.google.com/app/apikey

4. **Run the development servers**
   
   Terminal 1 - Frontend:
   ```bash
   npm run dev
   ```
   
   Terminal 2 - Backend (AI Orchestrator):
   ```bash
   npm run server
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎮 Available Commands

Type any of these commands in the terminal:

- `help` - Show all available commands
- `about` - Learn about me
- `skills` - View my technical skills
- `projects` - List all projects
- `projects view <name>` - View detailed project information
- `contact` - Get contact information
- `clear` - Clear the terminal screen
- `exit` - Try to exit (spoiler: you can't 😏)

**Or just ask questions naturally!**
- "What are your skills?"
- "Tell me about your projects"
- "How can I contact you?"

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variable**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

The app can be deployed to any platform that supports:
- Static site hosting (for the React frontend)
- Serverless functions or Node.js hosting (for the AI backend)

## 📝 Customization

### Update Your Information

Edit `src/data/portfolioData.js` to customize:
- Your name and username
- About section
- Skills list
- Projects
- Contact information

### Change Theme

Edit CSS variables in `src/index.css`:
```css
:root {
  --base: #1e1e2e;
  --text: #cdd6f4;
  --green: #a6e3a1;
  /* ... more colors */
}
```

### Modify Commands

Add or modify commands in `src/utils/commandHandler.js`

## 🔧 Configuration

### AI Orchestrator

The AI orchestrator maps natural language to commands. Configure it in `api/orchestrator.js`:

- Adjust the system prompt
- Modify the fallback keyword matching
- Change the AI model or provider

### Terminal Behavior

Customize terminal behavior in `src/components/Terminal.jsx`:

- Boot sequence duration
- Command history size
- Auto-scroll behavior

## 📱 Mobile Support

The terminal is fully responsive and works on mobile devices. Special considerations:

- Touch-optimized input
- Responsive font sizes
- Adjusted layout for small screens

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

- Color scheme: [Catppuccin](https://github.com/catppuccin/catppuccin)
- Font: [Fira Code](https://github.com/tonsky/FiraCode)
- AI: [Google Gemini](https://ai.google.dev/)

---

**Built with ❤️ by ultrabot**

*This portfolio itself demonstrates the skills it describes - it's a full-stack React app with AI orchestration!*
