// Portfolio content data - B3astOS.
// SOURCE OF TRUTH: Abhigyan's real resume (docs/Abhigyan_Resume_July26.pdf).
// The structured objects feed the windowed apps; the pre-formatted strings
// lower down keep the existing terminal commandHandler working.

export const portfolioData = {
  personal: {
    name: 'Abhigyan Dutta',
    handle: 'B3ast',
    title: 'Software Engineer · Systems & Open Source',
    subtitle: 'B.Tech CSE · PES University · 2024-Present',
    location: 'Bengaluru, India',
    tagline: 'I contribute to open-source infrastructure, harden Linux systems, and build full-stack tools. Right now I fix real bugs in OpenWISP and lead engineering at Vegavath.',
    email: 'dutta13abhigyan@gmail.com',
    github: 'https://github.com/UltraBot05',
    linkedin: 'https://linkedin.com/in/adutta05',
    os: 'EndeavourOS + Hyprland',
    shell: 'zsh + starship',
    editor: 'Neovim',
  },

  projects: [
    {
      id: 'network-media-controller',
      name: 'Self-Hosted Network & Media Controller',
      hook: 'A hardened home-lab: DNS sinkhole, GPU-accelerated transcoding, zero public ports.',
      tech: ['Linux', 'systemd', 'Networking', 'ZeroTier'],
      github: null,
      demo: null,
      highlights: [
        'Network-wide DNS sinkhole filtering telemetry at the protocol level, cutting client bandwidth by 15%',
        'Real-time transcoding pipeline on Intel Iris Xe iGPU, tuned scheduling to cut CPU load by 40%',
        'Hardened with SSH keys and a ZeroTier overlay, eliminating 100% of public-facing port exposure',
      ],
    },
    {
      id: 'pesu-content-automation',
      name: 'PESU Content Automation Suite',
      hook: 'Headless browser automation that scrapes and archives course material, cutting manual work 95%.',
      tech: ['Python', 'Playwright', 'PyInstaller', 'Regex'],
      github: null,
      demo: null,
      highlights: [
        'Headless browser pipeline to scrape and archive course materials, cutting manual archival time by 95%',
        'Regex-driven pipeline parsing 100+ proprietary PPT formats into PDFs error-free across malformed inputs',
        'Cross-platform executables (.exe, .dmg, .deb) via PyInstaller for non-technical users',
      ],
    },
    {
      id: 'semwork',
      name: 'SemWork - Academic Resource Planner',
      hook: 'Turns raw syllabus text into a synced, AI-assisted study planner.',
      tech: ['React', 'Firebase', 'AI Integration'],
      github: null,
      demo: null,
      highlights: [
        'Pipeline converting raw syllabus text into NoSQL-compatible JSON, cutting manual tracking time by 50%',
        'Idempotent sync protocol resolving concurrent conflicts with zero-loss user state preservation',
        'AI study assistant with sub-200ms response latency via prompt engineering',
      ],
    },
    {
      id: 'vegavath-site',
      name: 'Vegavath Club Website',
      hook: 'The full club platform for Team Vegavath, built and shipped as Tech Lead. Live at vegavath.live.',
      tech: ['Next.js', 'TypeScript', 'React Three Fiber', 'Neon Postgres', 'Cloudflare R2', 'Vercel'],
      github: null,
      demo: 'https://vegavath.live',
      highlights: [
        'Built and maintained the entire club platform end to end',
        'Architected CI/CD pipelines achieving 40% faster deploys',
        'Led and mentored a 10-person junior engineering team',
      ],
    },
    // Additional real projects - smaller systems/C work, not on the 1-page resume
    {
      id: 'tcp-auction-engine',
      name: 'TCP Auction Engine',
      hook: 'Multithreaded auction server in C over TLS, with server-side anti-sniping.',
      tech: ['C', 'POSIX threads', 'OpenSSL', 'TLS'],
      github: null,
      demo: null,
      highlights: [
        'Concurrent bidders over TLS with a per-lot mutex strategy',
        'Anti-sniping that auto-extends the timer on last-second bids',
        'Race-free bid ordering without a global lock',
      ],
    },
    {
      id: 'linux-container-runtime',
      name: 'Linux Container Runtime',
      hook: 'A container runtime built from clone() and namespaces, no Docker or runc.',
      tech: ['C', 'clone()', 'Linux namespaces', 'LKM', 'ioctl'],
      github: null,
      demo: null,
      highlights: [
        'PID, mount, UTS, network and IPC namespaces via clone() flags',
        'A custom kernel module exposing container stats through ioctl()',
        'CFS scheduler quota experiments with cgroups',
      ],
    },
    {
      id: 'pes-vcs',
      name: 'PES-VCS',
      hook: "A from-scratch reimplementation of Git's core object model in C.",
      tech: ['C', 'SHA-1', 'zlib', 'Git internals'],
      github: null,
      demo: null,
      highlights: [
        'Object store: blobs, trees, commits, SHA-1 addressed and zlib compressed',
        'Working index / staging area',
        'init, add, commit, log and diff commands',
      ],
    },
    {
      id: 'mehnat',
      name: 'Mehnat',
      hook: 'A native Android fitness app: GPS run tracking and gym logging, fully offline.',
      tech: ['Kotlin', 'Jetpack Compose', 'Room', 'Android'],
      github: null,
      demo: null,
      highlights: [
        'Live GPS run tracking with distance and pace',
        'Gym session logger for exercises, sets, reps and weight',
        'Room database for fully offline persistence',
      ],
    },
  ],

  experience: [
    {
      org: 'PGP Glass',
      role: 'Infrastructure & Cybersecurity Intern',
      period: 'June 2026',
      type: 'internship',
      notes: 'Infrastructure hardening and cybersecurity work in a production environment. Real-world exposure to network security, systems administration, and secure deployment pipelines.',
    },
    {
      org: 'GirlScript Summer of Code 2026 (GSSoC)',
      role: 'Open Source Mentor',
      period: 'May 2026 - Present',
      type: 'mentorship',
      notes: "Mentoring contributors on the Gitbun project. Reviewing pull requests, guiding newcomers through open-source workflows, and maintaining code quality across the contributor base.",
    },
    {
      org: 'Team Vegavath',
      role: 'Tech Lead & Club Lead',
      period: 'Nov 2025 - Present',
      type: 'technical',
      notes: 'Built and maintained the club platform, architected CI/CD for 40% faster deploys, and mentored a 10-person junior team. Leading a student motorsport innovation club at PESU ECC.',
    },
  ],

  skillGroups: {
    SYSTEMS:  ['C', 'Linux internals', 'clone() · namespaces · LKMs · ioctl', 'POSIX threads', 'socket programming', 'SSL/TLS', 'CFS scheduler'],
    SECURITY: ['CTF (pwn/rev/web)', 'pwntools', 'Ghidra', 'Burp Suite', 'ffuf', 'binary exploitation'],
    WEB:      ['Next.js', 'TypeScript', 'React', 'Tailwind', 'Node/Express', 'Neon Postgres', 'React Three Fiber', 'Framer Motion', 'Cloudflare R2'],
    TOOLS:    ['Docker', 'Git internals', 'GCP', 'Playwright', 'Kotlin', 'Jetpack Compose'],
  },

  education: {
    school: 'PES University',
    degree: 'B.Tech in Computer Science & Engineering',
    period: '2024 - Present',
    location: 'Bengaluru, India',
    coursework: ['Operating Systems', 'Linux Administration', 'Computer Networks', 'Data Structures & Algorithms', 'Database Management', 'Cloud Computing', 'Software Engineering', 'Information Security'],
  },

  system: {
    os: 'B3astOS 2.0.26-hyprland x86_64 GNU/Linux',
    cpu: 'AMD Ryzen 7',
    memory: '16G',
    hostname: 'b3astos',
    uptime: '42 days',
  },
};

/* ============================================================
   Terminal-formatted strings - consumed by commandHandler.js.
   Same field names as before so the terminal keeps working.
   ============================================================ */

portfolioData.about = `
abhigyan@b3astos
----------------
OS       EndeavourOS (Hyprland wm)
Shell    zsh + starship
Role     Software Engineer, Systems & Open Source
Study    B.Tech CSE, PES University (2024-Present)
Now      Open Source Contributor @ OpenWISP
Lead     Technical Lead, Team Vegavath
GitHub   UltraBot05

Languages  C, C++, Python, JavaScript, SQL, Bash
Systems    Linux, systemd, SSH, ZeroTier, TCP/IP, DNS
Tools      Git, Pytest, Playwright, CI/CD, Vercel
Concepts   DSA, distributed systems, concurrency, caching

"I break things to understand them, then fix them for good."

Type 'projects' to see what I build, or just ask a question.
# Zm1nLWItYjM0c3QtYjZ0
`;

portfolioData.skills = `
>> LANGUAGES <<
---------------
  C, C++, Python, JavaScript, SQL, Bash

>> SYSTEMS & INFRASTRUCTURE <<
------------------------------
  Linux (Debian/Ubuntu), systemd, SSH, ZeroTier, TCP/IP, DNS

>> TOOLS <<
-----------
  Git, Pytest, Playwright, REST APIs, CI/CD, Vercel/Netlify

>> CONCEPTS <<
--------------
  DSA, distributed systems, system architecture,
  cloud (AWS/GCP), concurrency and caching, software design
`;

portfolioData.contact = `
>> GET IN TOUCH <<
------------------

  email:     dutta13abhigyan@gmail.com
  github:    github.com/UltraBot05
  linkedin:  linkedin.com/in/adutta05

best for internship inquiries, collaboration, or a good bug to chase.
`;

portfolioData.socials = {
  github: 'https://github.com/UltraBot05',
  linkedin: 'https://www.linkedin.com/in/adutta05',
  email: 'dutta13abhigyan@gmail.com',
};

portfolioData.help = `
>> AVAILABLE COMMANDS <<
------------------------

  about        whoami and system specs
  skills       languages, systems, tools, concepts
  projects     list my engineering projects
  contact      how to reach me
  clear        clear the terminal screen
  help         show this help message

>> AI ASSISTANT MODE <<
-----------------------

You can also just type a natural-language question, for example:
  "What did you do at OpenWISP?"
  "Tell me about the media controller project."
  "What languages do you know?"
  "How can I contact you?"

There may also be... undocumented commands. Explorers welcome.
`;

// Terminal `projects` command format (name/category/description/highlights)
portfolioData.terminalProjects = portfolioData.projects.map(p => ({
  name: p.id,
  category: p.tech.slice(0, 4).join(' / '),
  description: `\n${p.hook}\n\n${p.highlights.map(h => `  - ${h}`).join('\n')}\n`,
  github: p.github && p.github !== '#' ? p.github : null,
  highlights: p.highlights,
}));

export default portfolioData;
