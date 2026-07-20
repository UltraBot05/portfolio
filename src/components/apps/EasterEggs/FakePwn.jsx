// Fake CTF pwn challenge (brief §9.1). A hardcoded text adventure - NO real
// shell access. Security (brief §18.7): no eval/Function, user input is only
// used for command MATCHING and echoed via React text nodes (never templated
// into HTML), and the rootkit_unlocked sessionStorage flag only changes a
// terminal response string - it unlocks nothing real.
import { useEffect, useRef, useState } from 'react';
import './FakePwn.css';

const TROPHY = `
     ___________
    '._==_==_=_.'
    .-\\:      /-.
   | (|:.     |) |
    '-|:.     |-'
      \\::.    /
       '::. .'
         ) (
       _.' '._
      \`"""""""\``;

const CAR = `
   ___________
  /  VEGAVATH \\____
 |___ ___________ _|
   (O)         (O)`;

let flashTimer;

export default function FakePwn() {
  const [lines, setLines] = useState([
    { t: 'unauthorized access detected. identify yourself.', c: 'sys' },
  ]);
  const [stage, setStage] = useState('discovery'); // discovery → enum → done
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const outRef = useRef(null);

  useEffect(() => { outRef.current?.scrollTo(0, outRef.current.scrollHeight); }, [lines]);
  useEffect(() => () => clearTimeout(flashTimer), []);

  const push = (arr) => setLines(prev => [...prev, ...arr]);
  const doFlash = () => {
    setFlash(true);
    flashTimer = setTimeout(() => setFlash(false), 500);
  };

  const run = (raw) => {
    // collapse repeated spaces so "strings  suspicious_daemon" still matches
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    push([{ t: `root@b3astos:~# ${raw}`, c: 'echo' }]);

    // Stage 1 - discovery
    if (stage === 'discovery') {
      if (cmd === 'b3ast') {
        setStage('enum');
        push([
          { t: 'identity confirmed. scanning system...', c: 'sys' },
          { t: "target: /etc/shadow | layers: 3 | hint: 'look for what doesn't belong'", c: 'sys' },
          { t: "commands: ls, cat, ps, strings, file, whoami, id", c: 'win' },
        ]);
      } else {
        push([{ t: 'ACCESS DENIED - wrong credentials', c: 'err' }]);
      }
      return;
    }

    // Stage 3 unlocked - allow flag decode
    if (cmd === 'xor 0x42' || cmd === 'decode 0x42') {
      if (stage !== 'done') setStage('done');
      sessionStorage.setItem('rootkit_unlocked', 'true');
      doFlash();
      push([
        { t: 'decoding XOR 0x42...', c: 'sys' },
        { t: 'FLAG{b3ast_0wns_the_kernel}', c: 'win' },
        { t: TROPHY, c: 'win' },
        { t: '🏴 CTF flag captured. rootkit unlocked. try \'rootkit\' in the terminal.', c: 'win' },
        { t: CAR, c: 'sys' },
      ]);
      return;
    }

    // Stage 2 - enumeration (hardcoded responses)
    const enumResponses = {
      ls: { t: '.hidden_creds  suspicious_daemon  readme.txt  .bash_history', c: 'line' },
      'ls -la': { t: 'total 48\ndrwxr-xr-x  4 root root 4096 Jul 20 13:37 .\n-rwsr-sr-x  1 root root 8192 Jul 20 13:37 suspicious_daemon\n-rw-------  1 root root  128 Jul 20 13:37 .hidden_creds\n-rw-r--r--  1 root root   42 Jul 20 13:37 readme.txt\n-rw-------  1 root root  256 Jul 20 13:37 .bash_history\n-r--r--r--  1 root root    4 Jul 20 13:37 /proc/flag', c: 'line' },
      'cat .hidden_creds': { t: 'permission denied. try harder.', c: 'err' },
      'cat readme.txt': { t: 'nothing to see here. or is there?\n\nhint: try ls -la, then check /proc', c: 'line' },
      'cat /proc/flag': {
        t: 'FLAG{m3m0ry_1s_jus7_arr4ys}\n🏴 process memory never forgets.',
        c: 'win',
      },
      'cat /proc/self/maps': {
        t: '7f3a1000-7f3a2000 r--p 00000000 08:01 1234  /lib/x86_64-linux-gnu/libc.so.6\n7f3a2000-7f3b0000 r-xp 00001000 08:01 1234  /lib/x86_64-linux-gnu/libc.so.6\n7ffd4e33-7ffd4e55 r-xp 00000000 00:00 0    [FLAG{m3m0ry_1s_jus7_arr4ys}]\n7ffd4e55-7ffd4e80 r--p 00000000 00:00 0    [vvar]\n7ffd4e80-7ffd4e82 r-xp 00000000 00:00 0    [vdso]\nffffffff-ffffffff r-xp 00000000 00:00 0    [vsyscall]\n\nfound it? FLAG{m3m0ry_1s_jus7_arr4ys}\n🏴 address space is a treasure map.',
        c: 'win',
      },
      'ps aux': { t: 'USER  PID   CMD\nroot  1     /sbin/init\nroot  1337  suspicious_daemon', c: 'line' },
      ps: { t: 'PID   CMD\n1     /sbin/init\n1337  suspicious_daemon', c: 'line' },
      'strings suspicious_daemon': { t: '\\x7fELF..@..H..t$..\\nXOR_KEY=0x42\\n..__libc_start_main..puts..', c: 'line' },
      'file suspicious_daemon': { t: 'suspicious_daemon: ELF 64-bit LSB pie executable, x86-64, stripped', c: 'line' },
      whoami: { t: 'guest (uid=1000) - but root=1337 owns suspicious_daemon', c: 'line' },
      id: { t: 'uid=1000(guest) gid=1000(guest) groups=1000(guest)', c: 'line' },
    };

    if (enumResponses[cmd]) {
      push([enumResponses[cmd]]);
    } else if (cmd.startsWith('cat ')) {
      push([{ t: 'permission denied.', c: 'err' }]);
    } else {
      push([{ t: `${cmd}: command not found. (try: ls, ps aux, strings suspicious_daemon)`, c: 'err' }]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
  };

  return (
    <div className={`pwn-app${flash ? ' flash' : ''}`}>
      <div className="pwn-output" ref={outRef}>
        {lines.map((l, i) => <div key={i} className={`pwn-line ${l.c}`}>{l.t}</div>)}
      </div>
      <div className="pwn-input-row">
        <span className="pwn-prompt" aria-hidden="true">root@b3astos:~#</span>
        <input
          className="pwn-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={stage === 'discovery' ? 'identify yourself...' : 'enumerate the system...'}
          aria-label="Challenge terminal input"
          autoFocus
          spellCheck="false"
          autoComplete="off"
          data-cursor="text"
        />
      </div>
    </div>
  );
}
