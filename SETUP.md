# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Google Gemini API key (free tier available)

## Setup Steps

### 1. Install Dependencies ✅
Already done! All packages are installed.

### 2. Configure Your API Key 🔑

**Option A: Use Gemini API (Recommended for AI features)**

1. Get a free API key from: https://makersuite.google.com/app/apikey
2. Open the `.env` file in the root directory
3. Add your key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Option B: Use Without AI (Fallback mode)**

If you don't add an API key, the app will work but use simple keyword matching instead of intelligent AI interpretation.

### 3. Customize Your Content 📝

Edit `src/data/portfolioData.js` to add your information:

- **Line 3**: Change username from "ultrabot" to yours
- **Lines 7-25**: Update the "About Me" section
- **Lines 27-85**: Customize your skills
- **Lines 87-190**: Update your projects with real GitHub links
- **Lines 192-210**: Add your actual contact information (email, LinkedIn, GitHub, Discord)

**Important**: Replace placeholder links and contact info with your real details!

### 4. Run the Application 🎮

You need TWO terminal windows:

**Terminal 1 - Frontend (React)**
```bash
npm run dev
```
This starts the React app on http://localhost:3000

**Terminal 2 - Backend (AI Orchestrator)**
```bash
npm run server
```
This starts the AI backend on http://localhost:3001

### 5. Test It Out 🧪

Open http://localhost:3000 in your browser and try:

1. Wait for the boot sequence (it's cool!)
2. Type commands:
   - `help`
   - `about`
   - `skills`
   - `projects`
   - `contact`

3. Try natural language:
   - "What are your skills?"
   - "Tell me about your projects"
   - "How can I contact you?"

### 6. Deploy to Vercel 🚀

When you're ready to deploy:

1. Create a GitHub repository and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Terminal Portfolio"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to https://vercel.com and sign in with GitHub

3. Import your repository

4. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual API key

5. Deploy!

## Troubleshooting 🔧

### Issue: "Cannot find module"
**Solution**: Make sure you ran `npm install` in the project root

### Issue: AI not working
**Solution**: 
- Check if `GEMINI_API_KEY` is set in `.env`
- Restart the backend server after adding the key
- The app will work with keyword fallback if AI fails

### Issue: Port already in use
**Solution**: 
- Kill the process using that port
- Or change the port in `package.json` and `vite.config.js`

### Issue: CORS errors
**Solution**: Make sure both frontend (port 3000) and backend (port 3001) are running

## File Structure 📁

```
portfolio/
├── api/
│   └── orchestrator.js          # AI backend API
├── public/
│   └── terminal-icon.svg        # Favicon
├── src/
│   ├── components/
│   │   ├── Terminal.jsx         # Main terminal component
│   │   ├── BootSequence.jsx     # Cool boot animation
│   │   ├── CommandLine.jsx      # Input handling
│   │   └── Output.jsx           # Display output
│   ├── data/
│   │   └── portfolioData.js     # YOUR CONTENT HERE! ⭐
│   ├── utils/
│   │   ├── commandHandler.js    # Command logic
│   │   └── aiOrchestrator.js    # AI integration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Beautiful Catppuccin theme
├── .env                         # Your API keys
├── package.json
├── vite.config.js
├── vercel.json                  # Vercel deployment config
└── README.md

```

## Next Steps 🎯

1. ✅ Dependencies installed
2. 🔑 Add your Gemini API key to `.env`
3. 📝 Customize `src/data/portfolioData.js` with YOUR info
4. 🎮 Run both servers and test
5. 🚀 Deploy to Vercel

## Tips for Customization 💡

- **Change colors**: Edit CSS variables in `src/index.css`
- **Add commands**: Update `src/utils/commandHandler.js`
- **Modify AI behavior**: Edit system prompt in `api/orchestrator.js`
- **Change boot sequence**: Edit `src/components/BootSequence.jsx`

---

**Need help?** Check the main README.md or the comments in the code!
