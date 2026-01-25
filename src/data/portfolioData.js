// Portfolio content data
export const portfolioData = {
  username: "Abhigyan",
  version: "1.0.0",
  
  about: `
<div style="display: flex; align-items: center; gap: 25px; flex-wrap: wrap; margin-bottom: 25px;">
  <img src="/assets/profile.jpg" alt="Abhigyan" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 3px solid var(--blue); flex-shrink: 0;" />
  <div style="border: 2px solid var(--blue); padding: 15px 20px; display: inline-block;">
    <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 5px;">ABHIGYAN DUTTA</div>
    <div style="color: var(--blue);">Systems & AI Dev</div>
  </div>
</div>

Abhigyan@portfolio
──────────────────
OS: PortfolioOS (React-based)
Host: Vercel Cloud
Kernel: Linux / Node.js
Uptime: Always learning
Shell: bash (web-based)
Terminal: Custom React Terminal
Theme: Catppuccin Mocha

──────────────────
Hey there! 👋

I'm a systems enthusiast and AI-curious developer who doesn't 
just use technology—I build, break, and fix it.

My journey started with Linux system administration, where I 
learned that the best way to understand something is to 
customize it until it breaks, then fix it.

I believe in:
  • Building real solutions
  • Writing great docs
  • Automating the boring stuff
  • Learning by doing

Currently: AI integration, full-stack dev, and making tech 
accessible through docs.

Fun fact: This portfolio is AI-powered. Try asking questions! 🚀

──────────────────
Role: Full-Stack Developer
Focus: AI & Systems Engineering

──────────────────
CPU: Python, Bash, JavaScript
GPU: React, Node.js, Express
Memory: Linux SysAdmin, AI Agents
Disk: Full-Stack Web, Cloud

──────────────────
Packages:
  • Problem Solver (stable)
  • Documentation Writer (latest)
  • Automation Engineer (testing)
  • Community Builder (installed)

──────────────────
Status: Available for opportunities
Contact: Type 'contact' for info
</div>

──────────────────
Theme Colors (click to copy):
<span class="color-palette">
  <span class="color-dot" data-color="#89b4fa" style="background: #89b4fa;" title="Blue - #89b4fa">●</span>
  <span class="color-dot" data-color="#cba6f7" style="background: #cba6f7;" title="Mauve - #cba6f7">●</span>
  <span class="color-dot" data-color="#f38ba8" style="background: #f38ba8;" title="Red - #f38ba8">●</span>
  <span class="color-dot" data-color="#fab387" style="background: #fab387;" title="Peach - #fab387">●</span>
  <span class="color-dot" data-color="#f9e2af" style="background: #f9e2af;" title="Yellow - #f9e2af">●</span>
  <span class="color-dot" data-color="#a6e3a1" style="background: #a6e3a1;" title="Green - #a6e3a1">●</span>
  <span class="color-dot" data-color="#94e2d5" style="background: #94e2d5;" title="Teal - #94e2d5">●</span>
  <span class="color-dot" data-color="#74c7ec" style="background: #74c7ec;" title="Sapphire - #74c7ec">●</span>
</span>
`,

  skills: `
>> SYSTEMS & SCRIPTING <<
─────────────────────────

[ LINUX SYSTEM ADMIN ]
  • Distro-Hopping: Arch, EndeavourOS, Mint, Debian
  • Desktop Environments: KDE Plasma, Hyprland, X11, Wayland
  • Kernel-level troubleshooting & system recovery
  • Networking: ZeroTier, SSH Hardening, DNS/Pi-hole

[ AUTOMATION & SCRIPTING ]
  • Python (Primary Language for scripting & automation)
  • Bash Scripting (System tasks & cron jobs)
  • Systemd (Service management & auto-starts)

>> WEB & CLOUD ARCHITECTURE <<
──────────────────────────────

[ FULL-STACK DEVELOPMENT ]
  • React.js (Frontend Architecture)
  • Node.js & Express (Backend Logic)
  • Firebase & SQL (Database Management)
  • Vercel (CI/CD & Deployment)

[ CLOUD & DEVOPS ]
  • Google Cloud Platform (Vertex AI, Cloud Run)
  • Docker (Containerization Basics)
  • Server Hosting (Minecraft, Self-hosted VMs)

>> AI & FUTURE TECH <<
──────────────────────

[ GEN-AI CONCEPTS ]
  • RAG (Retrieval-Augmented Generation)
  • Agentic AI & LLM Orchestration
  • AI-Assisted Dev: Directed AI to build "fra-atlas-mvp"

[ TOOLS ]
  • Playwright (Headless Browser Automation)
  • Google Gemini API & Vertex AI Agents

>> LEADERSHIP & COMMUNITY <<
────────────────────────────

[ COMMUNITY MANAGEMENT ]
  • Building & managing Discord communities
  • Discord.js Bot Development (Automation bots)

[ SOFT SKILLS ]
  • Technical Documentation (High-quality docs)
  • Mentorship (Vegavath & Hackathon Leadership)
  • Problem Solving (The "Break it to fix it" mindset)

>> SPOKEN LANGUAGES <<
──────────────────────

  • English (Full Working Proficiency)
  • Hindi (Full Working Proficiency)
  • Bengali (Bilingual or Native Proficiency)
`,

  projects: [
    // --- NEW RESUME PROJECTS (Top Priority) ---
    {
      name: "pesu-content-automation",
      category: "Python / Playwright / PyInstaller",
      description: `
A robust automation suite designed to streamline the retrieval and 
archival of university course materials.

Tech Stack:
  • Python (Core Logic)
  • Playwright (Headless Browser Automation)
  • PyInstaller (Cross-platform Packaging)
  • Regex (Intelligent Parsing)

Role & Learning:
  • Architected headless browser navigation to handle portal instability
  • Built file pipelines processing 100+ files error-free
  • Packaged for Windows/Linux/macOS for non-technical peers
  • Reduced manual archival time by ~95%

Status: Deployed (v1.0)
`,
      github: "#", // Hidden until 100% complete
      highlights: [
        "95% Manual Time Reduction",
        "Headless Browser Automation",
        "Cross-Platform Executables"
      ]
    },
    {
      name: "network-media-controller",
      category: "Linux / systemd / Networking",
      description: `
A self-hosted infrastructure project focused on network optimization, 
ad-blocking, and hardware-accelerated media streaming.

Tech Stack:
  • Linux (Arch/Debian) & systemd
  • Intel QuickSync (Hardware Acceleration)
  • ZeroTier (Encrypted Tunneling)
  • DNS Sinkhole (Pi-hole)

Role & Learning:
  • Configured Intel Iris Xe iGPU for transcoding (40% less CPU load)
  • Hardened security via SSH Keys and ZeroTier tunneling
  • Eliminated 100% of public port exposure
  • Reduced network bandwidth usage by 15%

Status: Active / Self-Hosted
`,
      github: "#", // Hidden until 100% complete
      highlights: [
        "Hardware Acceleration (Iris Xe)",
        "ZeroTier Security",
        "40% CPU Load Reduction"
      ]
    },
    {
      name: "semwork-planner",
      category: "React / Firebase / AI",
      description: `
An intelligent academic planner that parses raw syllabus text into 
interactive, NoSQL-compatible tracking checklists.

Tech Stack:
  • React.js (Frontend)
  • Firebase (NoSQL Database & Auth)
  • Google Gemini API (AI Integration)
  • JSON (Data Structure)

Role & Learning:
  • Designed NoSQL schema for flexible course structures
  • Formulated idempotent sync protocols (Zero Data Loss)
  • Integrated AI Study Assistant with sub-200ms latency
  • Optimized for reducing manual tracking time by 50%

Status: Beta / User Testing
`,
      github: "#", // Hidden until 100% complete
      highlights: [
        "AI Study Assistant",
        "NoSQL Syllabus Parsing",
        "Idempotent Sync Protocol"
      ]
    },

    // --- EXISTING PORTFOLIO PROJECTS (Preserved) ---
    {
      name: "active-deception-lab",
      category: "Cybersecurity / Linux / Python",
      description: `
A sophisticated cybersecurity project focused on building active 
deception systems for threat detection and analysis.

Tech Stack:
  • Python for core logic and automation
  • Linux system-level integration
  • Bash scripting for deployment

Role & Learning:
  • Designed system architecture from scratch
  • Implemented kernel-level monitoring
  • Created comprehensive documentation
  • Learned advanced Linux security concepts

Status: Active Development
`,
      github: "https://github.com/UltraBot05/active-deception-lab",
      highlights: [
        "Custom honeypot implementation",
        "Real-time threat monitoring",
        "Automated response systems"
      ]
    },
    {
      name: "genai-agent-gcp",
      category: "GenAI / Google Cloud",
      description: `
Professional-grade AI agent built during Google Cloud GenAI bootcamp,
demonstrating advanced cloud-native AI development.

Tech Stack:
  • Google Cloud Vertex AI
  • Agent Builder
  • Cloud SQL
  • Cloud Run for deployment

Role & Learning:
  • Completed professional Google Cloud codelab
  • Built and deployed working AI agent
  • Integrated multiple cloud services
  • Learned RAG and agent orchestration concepts

Status: Deployed on GCP
`,
      github: "https://github.com/UltraBot05/genai-agent-gcp",
      highlights: [
        "Cloud-native AI agent",
        "RAG implementation",
        "Production deployment"
      ]
    },
    {
      name: "discord-bots",
      category: "Node.js / Automation",
      description: `
Collection of Discord bots for community management and automation,
built with Node.js and Discord.js.

Tech Stack:
  • Node.js runtime
  • Discord.js library
  • Custom command handlers
  • Event-driven architecture

Role & Learning:
  • Designed bot architecture
  • Implemented custom commands
  • Managed bot deployment and hosting
  • Learned async JavaScript patterns

Status: Active in multiple servers
`,
      github: "https://github.com/UltraBot05/discord-bots",
      highlights: [
        "Moderation automation",
        "Custom command system",
        "Multi-server deployment"
      ]
    }
  ],

  contact: `
>> GET IN TOUCH <<
──────────────────

I'm always open to discussing new opportunities, collaborations,
or just chatting about systems, Linux, or AI!

  📧 Email:       dutta13abhigyan@gmail.com
  🔗 LinkedIn:    linkedin.com/in/adutta05
  🐙 GitHub:      github.com/UltraBot05
  💬 Discord:     @ub05 (ID: 923189505631059979)

Feel free to reach out through any of these channels.
I typically respond within 24 hours.
`,

  socials: {
    github: "https://github.com/UltraBot05",
    linkedin: "https://www.linkedin.com/in/adutta05",
    discord: "https://discord.com/users/923189505631059979",
    email: "dutta13abhigyan@gmail.com"
  },

  help: `
>> AVAILABLE COMMANDS <<
────────────────────────

  about        Show information about me (System Specs)
  skills       Display my technical toolkit
  projects     List my engineering projects
  contact      Get my contact information
  clear        Clear the terminal screen
  help         Show this help message

>> AI ASSISTANT MODE <<
───────────────────────

You can also just type natural language questions!

Examples:
  • "What experience do you have with Linux?"
  • "Tell me about your automation projects."
  • "Do you know React?"
  • "How can I contact you?"

The AI assistant will understand your intent and show you the 
relevant information.

Type a command or ask a question to get started!
`
};

export default portfolioData;
