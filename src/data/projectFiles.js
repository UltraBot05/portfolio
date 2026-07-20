// Project "files" shown in the FileExplorer app.
// SOURCE OF TRUTH: Abhigyan's real resume. github: null => render NO link
// (never a fabricated URL). demo is a real live URL only where one exists.
export const projectFiles = {
  'network-media-controller': {
    filename: 'network-media-controller.md',
    title: 'Self-Hosted Network & Media Controller',
    tech: ['Linux', 'systemd', 'Networking', 'ZeroTier', 'Intel QuickSync'],
    github: null,
    demo: null,
    content: `# Self-Hosted Network & Media Controller

A hardened home-lab that handles DNS-level ad/telemetry filtering and hardware-accelerated media streaming, reachable only over an encrypted overlay.

## What it does

- Network-wide DNS sinkhole filtering telemetry at the protocol level, cutting client bandwidth by 15%
- Real-time transcoding pipeline on an Intel Iris Xe iGPU, with process scheduling tuned to cut CPU load by 40%
- SSH keys plus a ZeroTier overlay network, eliminating 100% of public-facing port exposure

## Why it exists

To run my own media and network services without renting a cloud box, and to learn where the real bottlenecks are: DNS, transcoding, and the security surface of anything you expose.

## Stack

Linux (Arch/Debian) · systemd · Intel QuickSync · ZeroTier · Pi-hole style DNS sinkhole
`,
  },

  'pesu-content-automation': {
    filename: 'pesu-content-automation.md',
    title: 'PESU Content Automation Suite',
    tech: ['Python', 'Playwright', 'PyInstaller', 'Regex'],
    github: null,
    demo: null,
    content: `# PESU Content Automation Suite

Automation that logs into an unstable university portal, scrapes course materials, and archives them, cutting a tedious manual job by 95%.

## What it does

- Headless browser automation (Playwright) to navigate portal instability and pull course files
- A Regex-driven pipeline that parses and converts 100+ proprietary PPT formats into PDFs, error-free across malformed inputs
- Packaged as cross-platform executables (.exe, .dmg, .deb) via PyInstaller for non-technical peers

## The hard part

The portal was flaky and the file formats were inconsistent. Most of the work was making the pipeline resilient: retries, format detection, and never crashing on a bad input.

## Stack

Python · Playwright · PyInstaller · Regex
`,
  },

  'semwork': {
    filename: 'semwork.md',
    title: 'SemWork - Academic Resource Planner',
    tech: ['React', 'Firebase', 'AI Integration', 'NoSQL'],
    github: null,
    demo: null,
    content: `# SemWork - Academic Resource Planner

An intelligent planner that turns raw syllabus text into interactive, synced tracking checklists with an AI study assistant.

## What it does

- A pipeline that converts raw syllabus text into NoSQL-compatible JSON structures, cutting manual tracking time by 50%
- An idempotent sync protocol that resolves concurrent data conflicts across clients with zero-loss state preservation
- An AI study assistant with sub-200ms response latency, built with prompt engineering for context-aware help

## Why

Tracking coursework by hand is error-prone. The interesting engineering was the sync protocol: making concurrent edits safe without ever losing a user's state.

## Stack

React · Firebase (NoSQL + Auth) · AI Integration
`,
  },

  'vegavath-site': {
    filename: 'vegavath-site.md',
    title: 'Vegavath Club Website',
    tech: ['React', 'Full-stack', 'CI/CD', 'Vercel'],
    github: null,
    demo: 'https://vegavath.live',
    content: `# Vegavath Club Website

The full platform for Team Vegavath, built and shipped end to end as Technical Lead. Live at [vegavath.live](https://vegavath.live).

## What I owned

- Built and maintained the entire club platform
- Architected CI/CD pipelines that achieved 40% faster deploys
- Led and mentored a 10-person junior engineering team

## Live

The site is in production at vegavath.live.
`,
  },

  'tcp-auction-engine': {
    filename: 'tcp-auction-engine.md',
    title: 'TCP Auction Engine',
    tech: ['C', 'POSIX threads', 'OpenSSL', 'TLS', 'Tkinter'],
    github: null,
    demo: null,
    content: `# TCP Auction Engine

A multithreaded auction server written in C. It handles concurrent bidders over TLS with server-side anti-sniping that auto-extends lot timers on last-second bids.

## The hard part

Race-free bid ordering across threads without a global lock choking throughput. I used a per-lot mutex strategy with a lock hierarchy to avoid deadlocks under concurrent bid storms.

## Architecture

- Bidders connect over TCP, authenticated via TLS (OpenSSL)
- Each lot runs in its own thread; bids are queued and processed atomically
- Anti-sniping: a bid in the final 30s extends the timer by 60s
- Tkinter front end for the auctioneer

## Stack

C · POSIX threads · OpenSSL/TLS · UNIX sockets · Tkinter
`,
  },

  'linux-container-runtime': {
    filename: 'linux-container-runtime.md',
    title: 'Linux Container Runtime',
    tech: ['C', 'Linux namespaces', 'clone()', 'LKM', 'ioctl', 'CFS'],
    github: null,
    demo: null,
    content: `# Linux Container Runtime

A minimal container runtime in C that isolates processes using Linux kernel primitives, no Docker and no runc, just \`clone()\` and namespaces.

## What it does

- PID, mount, UTS, network and IPC namespaces via \`clone()\` flags
- A UNIX-socket CLI for container lifecycle (create, run, exec, rm)
- A custom kernel module (LKM) exposing container stats via \`ioctl()\`
- CFS scheduler experiments: cgroup CPU quotas and measuring fairness

## Why it exists

To understand what Docker actually does at the kernel level, and to prove you can build a workable runtime in a few hundred lines of C without pulling in libraries.
`,
  },

  'pes-vcs': {
    filename: 'pes-vcs.md',
    title: 'PES-VCS',
    tech: ['C', 'SHA-1', 'zlib', 'file I/O', 'Git internals'],
    github: null,
    demo: null,
    content: `# PES-VCS

A from-scratch reimplementation of Git's core internals in C. Not a wrapper around Git, a reimplementation of the object model.

## What is implemented

- Object store: blobs, trees, commits (SHA-1 addressed, zlib compressed)
- Index / staging area
- \`init\`, \`add\`, \`commit\`, \`log\`, \`diff\` commands
- Branch refs and HEAD pointer

## Why

I wanted to know why \`git add\` is fast on a file that has not changed. The answer is in how the object store works, and writing this made that concrete.
`,
  },

  'mehnat': {
    filename: 'mehnat.md',
    title: 'Mehnat',
    tech: ['Kotlin', 'Jetpack Compose', 'Room', 'GPS', 'Android'],
    github: null,
    demo: null,
    content: `# Mehnat

A native Android fitness app. It tracks outdoor runs with GPS and logs gym sessions, both in one app, for people who do both.

## Features

- Live GPS run tracking with distance, pace and route
- Gym session logger: exercises, sets, reps, weight
- Room database for fully offline persistence
- Material You theming via Jetpack Compose

## Stack

Kotlin · Jetpack Compose · Room · Google Maps SDK · Android Location API
`,
  },
};

export const projectFileOrder = [
  'network-media-controller',
  'pesu-content-automation',
  'semwork',
  'vegavath-site',
  'tcp-auction-engine',
  'linux-container-runtime',
  'pes-vcs',
  'mehnat',
];
