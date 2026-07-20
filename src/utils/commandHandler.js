import portfolioData from '../data/portfolioData';

export function handleCommand(input) {
  const command = input.trim().toLowerCase();
  const parts = command.split(' ');
  const mainCommand = parts[0];
  const args = parts.slice(1);

  // Check if it's a recognized command
  const commands = {
    help: () => ({
      isCommand: true,
      output: portfolioData.help
    }),

    about: () => ({
      isCommand: true,
      output: portfolioData.about
    }),

    skills: () => {
      // Check if there's a specific skill query in args
      if (args.length > 0) {
        const skillQuery = args.join(' ').toLowerCase();
        return {
          isCommand: true,
          output: highlightSkill(portfolioData.skills, skillQuery)
        };
      }
      return {
        isCommand: true,
        output: portfolioData.skills
      };
    },

    projects: () => {
      if (args[0] === 'view' && args[1]) {
        const projectName = args.slice(1).join(' ').toLowerCase();
        
        // First try exact match
        let project = portfolioData.terminalProjects.find(
          p => p.name.toLowerCase() === projectName
        );
        
        // If no exact match, try partial match (fuzzy search)
        if (!project) {
          const matches = portfolioData.terminalProjects.filter(
            p => p.name.toLowerCase().includes(projectName) || 
                 projectName.includes(p.name.toLowerCase().split('-')[0])
          );
          
          if (matches.length === 1) {
            // Found exactly one partial match
            project = matches[0];
          } else if (matches.length > 1) {
            // Multiple matches, show them
            return {
              isCommand: true,
              output: `Multiple projects match "${projectName}":\n${matches.map(p => `  • ${p.name}`).join('\n')}\n\nPlease be more specific.`
            };
          }
        }

        if (project) {
          return {
            isCommand: true,
            output: formatProjectDetail(project)
          };
        } else {
          return {
            isCommand: true,
            output: `Project "${projectName}" not found.\nAvailable projects:\n${portfolioData.terminalProjects.map(p => `  • ${p.name}`).join('\n')}`
          };
        }
      } else {
        return {
          isCommand: true,
          output: formatProjectsList()
        };
      }
    },

    contact: () => ({
      isCommand: true,
      output: portfolioData.contact
    }),

    clear: () => ({
      isCommand: true,
      output: '' // Handled separately in Terminal component
    }),

    exit: () => ({
      isCommand: true,
      output: `
┌─────────────────────────────────────────────────────────────────┐
│  Nice try! But you can't escape that easily... 😏               │
│                                                                 │
│  (Hint: Close the browser tab if you really want to leave)     │
└─────────────────────────────────────────────────────────────────┘
`
    }),

    whoami: () => ({
      isCommand: true,
      output: 'b3ast'
    }),

    uname: () => ({
      isCommand: true,
      output: 'PortfolioOS 1.0.0 x86_64 GNU/React'
    }),

    pwd: () => ({
      isCommand: true,
      output: '/home/abhigyan/portfolio'
    }),

    ls: () => ({
      isCommand: true,
      output: `about.txt  skills.txt  projects/  contact.txt  README.md`
    }),

    date: () => ({
      isCommand: true,
      output: new Date().toString()
    }),

    echo: () => ({
      isCommand: true,
      output: args.join(' ')
    }),

    // ---- Hidden / easter-egg commands (brief §9.2) ----
    // Note: outputs are hardcoded strings; user input is never templated into
    // them (brief §18.7). `action` triggers a UI side-effect in the Terminal.

    matrix: () => ({ isCommand: true, output: 'entering the matrix...', action: 'matrix' }),

    xxd: () => ({ isCommand: true, output: 'dumping suspicious_daemon...', action: 'xxd' }),

    rootkit: () => {
      const unlocked = typeof sessionStorage !== 'undefined'
        && sessionStorage.getItem('rootkit_unlocked') === 'true';
      if (!unlocked) {
        return { isCommand: false, output: null }; // stays hidden until earned
      }
      return {
        isCommand: true,
        output: `
     .~~.   .~~.
    '. \\ ' ' / .'
     .~ .~~~..~.
    : .~.'~'.~. :
   ~ (   ) (   ) ~
  ( : '~'.~.'~' : )
   ~ .~ (   ) ~. ~
    (  : '~' :  )
     '~ .~~~. ~'
         '~'
nice try. but this isn't my main machine.`
      };
    },

    b3ast: () => ({
      isCommand: true,
      output: `
handle: B3ast
type:   CTF competitor (pwn/rev/web)
tools:  pwntools · Ghidra · Burp Suite · ffuf
flag count: [REDACTED]`
    }),

    vegavath: () => ({
      isCommand: true,
      output: `
   ___________
  /  VEGAVATH \\____
 |___ ___________ _|
   (O)         (O)

Team Vegavath - PESU ECC student motorsport club.
Tech Lead: Abhigyan Dutta`
    }),

    ctf: () => ({
      isCommand: true,
      output: `
>> CTF PROFILE <<
─────────────────
handle:      B3ast
specialties: pwn · rev · web
platforms:   CTFtime · HackTheBox · TryHackMe
toolchain:   pwntools · Ghidra · Burp Suite · ffuf · GDB · ROPgadget
recent:      binary exploitation, heap grooming, ROP chains`
    }),

    ping: () => ({
      isCommand: true,
      output: 'PING b3astos (127.0.0.1): 56 bytes // b3ast is alive.'
    }),

    neofetch: () => ({ isCommand: true, output: portfolioData.about }),
  };

  // uname -a
  if (mainCommand === 'uname') {
    return { isCommand: true, output: 'B3astOS 2.0.26-hyprland-CTF x86_64 GNU/Linux' };
  }

  // sudo <anything>
  if (mainCommand === 'sudo') {
    return {
      isCommand: true,
      output: 'Sorry, b3ast is not in the sudoers file. This incident will be reported.'
    };
  }

  // rm -rf / (fake dramatic deletion)
  if (mainCommand === 'rm' && (command.includes('-rf /') || command.includes('-fr /'))) {
    return { isCommand: true, output: 'deleting everything...', action: 'rmrf' };
  }

  // cat /etc/passwd (humorous fake passwd)
  if (command === 'cat /etc/passwd') {
    return {
      isCommand: true,
      output: `root:x:0:0:b3ast the omniscient:/root:/bin/zsh
daemon:x:1:1:suspicious_daemon:/usr/sbin:/usr/sbin/nologin
b3ast:x:1000:1000:Abhigyan Dutta:/home/b3ast:/bin/zsh
vegavath:x:1337:1337:motorsport:/home/vegavath:/bin/false`
    };
  }

  // Check if command exists
  if (commands[mainCommand]) {
    return commands[mainCommand]();
  }

  // Not a recognized command
  return {
    isCommand: false,
    output: null
  };
}

function formatProjectsList() {
  let output = `
┌─────────────────────────────────────────────────────────────────┐
│                      MY PROJECTS                                │
└─────────────────────────────────────────────────────────────────┘

Here are my featured projects.
Type 'projects view <name>' to learn more.

`;

  portfolioData.terminalProjects.forEach(project => {
    output += `\n▓ ${project.name}\n`;
    output += `  ${project.category}\n`;
  });

  output += `\n\nExample: projects view ${portfolioData.terminalProjects[0].name}`;

  return output;
}

function formatProjectDetail(project) {
  let output = `
┌─────────────────────────────────────────────────────────────────┐
│  ${project.name.toUpperCase().padEnd(61)}  │
│  ${project.category.padEnd(61)}  │
└─────────────────────────────────────────────────────────────────┘

${project.description}

`;

  if (project.highlights && project.highlights.length > 0) {
    output += `Key Highlights:\n`;
    project.highlights.forEach(highlight => {
      output += `  ✓ ${highlight}\n`;
    });
    output += '\n';
  }

  if (project.github) {
    output += `GitHub: ${project.github}\n`;
  }

  return output;
}

// Function to highlight specific skills
function highlightSkill(skillsText, query) {
  // Define skill keywords and their variations
  const skillMap = {
    'python': ['python'],
    'bash': ['bash', 'shell'],
    'linux': ['linux', 'system admin', 'sysadmin'],
    'server': ['server', 'hosting', 'deployment'],
    'documentation': ['documentation', 'docs', 'technical writing'],
    'fullstack': ['fullstack', 'full-stack', 'full stack', 'mern'],
    'react': ['react', 'reactjs', 'react.js'],
    'nodejs': ['nodejs', 'node.js', 'express'],
    'ai': ['ai', 'genai', 'artificial intelligence', 'llm', 'rag', 'agentic'],
    'cloud': ['cloud', 'gcp', 'google cloud', 'vercel'],
    'community': ['community', 'discord', 'management'],
    'bot': ['bot', 'discord.js', 'automation'],
    'spokenlanguages': ['▓ LANGUAGES']  // Match the section header exactly
  }

  // Find matching skill category
  let matchedSkill = null;
  for (const [skill, keywords] of Object.entries(skillMap)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      matchedSkill = skill;
      break;
    }
  }

  if (!matchedSkill) {
    return skillsText; // No match, return original
  }

  // Split into lines and highlight the matching skill
  const lines = skillsText.split('\n');
  let highlighted = '';
  let inMatchedSection = false;
  let matchCount = 0;
  let highlightEntireSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Check if this line contains the matched skill
    const isMatch = skillMap[matchedSkill].some(keyword => 
      line.includes(keyword) || lowerLine.includes(keyword.toLowerCase())
    );

    // Check if we're matching a section header (for spokenlanguages)
    if (isMatch && line.includes('│') && line.includes('▓')) {
      highlightEntireSection = true;
      inMatchedSection = true;
      matchCount++;
      highlighted += `<span style="color: var(--peach); font-weight: bold;">${line}</span>\n`;
    } else if (highlightEntireSection && (line.includes('└─') || line.includes('┌─') || line.includes('│'))) {
      // Highlight the section box
      highlighted += `<span style="color: var(--peach);">${line}</span>\n`;
      if (line.includes('└─')) {
        // End of section header box
        inMatchedSection = true;
      }
    } else if (isMatch && line.trim().startsWith('•')) {
      // Found a matching skill entry
      matchCount++;
      inMatchedSection = true;
      // Add highlight with arrow and color
      highlighted += `<span style="color: var(--peach); font-weight: bold;">➜ ${line}</span>\n`;
    } else if (inMatchedSection && line.trim().startsWith('└─')) {
      // Continue highlighting sub-items
      highlighted += `<span style="color: var(--peach);">${line}</span>\n`;
    } else if (inMatchedSection && line.trim().startsWith('├─')) {
      // Continue highlighting sub-items
      highlighted += `<span style="color: var(--peach);">${line}</span>\n`;
    } else {
      // Reset section flag if we hit a new bullet or section
      if (line.trim().startsWith('•') || (line.trim().startsWith('┌') && !highlightEntireSection)) {
        inMatchedSection = false;
        highlightEntireSection = false;
      }
      highlighted += line + '\n';
    }
  }

  if (matchCount === 0) {
    return skillsText; // No highlighting done
  }

  return highlighted.trimEnd();
}

export default handleCommand;
