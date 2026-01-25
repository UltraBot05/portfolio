#!/usr/bin/env node

/**
 * Pre-deployment Security Validation Script
 * Run this before deploying to production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let errors = 0;
let warnings = 0;
let passed = 0;

console.log(`${BLUE}
╔════════════════════════════════════════════════════════════╗
║         SECURITY VALIDATION - PRE-DEPLOYMENT CHECK          ║
╚════════════════════════════════════════════════════════════╝
${RESET}`);

// Check 1: Verify .env is not committed
console.log('\n📋 Check 1: Environment file security...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log(`${YELLOW}⚠️  WARNING: .env file exists (make sure it's in .gitignore)${RESET}`);
  warnings++;
} else {
  console.log(`${GREEN}✅ PASS: No .env file in repository${RESET}`);
  passed++;
}

// Check 2: Verify .env.example exists
console.log('\n📋 Check 2: Environment template...');
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
  console.log(`${GREEN}✅ PASS: .env.example exists${RESET}`);
  passed++;
} else {
  console.log(`${RED}❌ ERROR: .env.example is missing${RESET}`);
  errors++;
}

// Check 3: Check for hardcoded API keys
console.log('\n📋 Check 3: Scanning for hardcoded secrets...');
const filesToCheck = [
  'src/utils/aiOrchestrator.js',
  'api/orchestrator.js',
  'src/components/Terminal.jsx'
];

let foundSecrets = false;
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.match(/AIza[0-9A-Za-z-_]{35}/g) || 
        content.match(/sk-[a-zA-Z0-9]{48}/g)) {
      console.log(`${RED}❌ ERROR: Found potential API key in ${file}${RESET}`);
      errors++;
      foundSecrets = true;
    }
  }
});

if (!foundSecrets) {
  console.log(`${GREEN}✅ PASS: No hardcoded API keys detected${RESET}`);
  passed++;
}

// Check 4: Verify contact info is updated
console.log('\n📋 Check 4: Contact information...');
const portfolioDataPath = path.join(__dirname, 'src/data/portfolioData.js');
const portfolioData = fs.readFileSync(portfolioDataPath, 'utf8');

if (portfolioData.includes('your.email@example.com') || 
    portfolioData.includes('yourusername') ||
    portfolioData.includes('yourprofile')) {
  console.log(`${RED}❌ ERROR: Placeholder contact info still present${RESET}`);
  errors++;
} else {
  console.log(`${GREEN}✅ PASS: Contact information updated${RESET}`);
  passed++;
}

// Check 5: Verify CORS configuration
console.log('\n📋 Check 5: CORS configuration...');
const orchestratorPath = path.join(__dirname, 'api/orchestrator.js');
const orchestrator = fs.readFileSync(orchestratorPath, 'utf8');

if (orchestrator.includes("app.use(cors())")) {
  console.log(`${RED}❌ ERROR: CORS is wide open (app.use(cors()))${RESET}`);
  errors++;
} else if (orchestrator.includes('corsOptions')) {
  console.log(`${GREEN}✅ PASS: CORS is properly configured${RESET}`);
  passed++;
} else {
  console.log(`${YELLOW}⚠️  WARNING: Could not verify CORS configuration${RESET}`);
  warnings++;
}

// Check 6: Verify rate limiting exists
console.log('\n📋 Check 6: Rate limiting...');
if (orchestrator.includes('rateLimit') && orchestrator.includes('RATE_LIMIT_MAX_REQUESTS')) {
  console.log(`${GREEN}✅ PASS: Rate limiting is configured${RESET}`);
  passed++;
} else {
  console.log(`${RED}❌ ERROR: Rate limiting not found${RESET}`);
  errors++;
}

// Check 7: Verify input sanitization
console.log('\n📋 Check 7: Input sanitization...');
if (orchestrator.includes('sanitizeInput')) {
  console.log(`${GREEN}✅ PASS: Input sanitization implemented${RESET}`);
  passed++;
} else {
  console.log(`${RED}❌ ERROR: Input sanitization not found${RESET}`);
  errors++;
}

// Check 8: Verify safe HTML rendering
console.log('\n📋 Check 8: XSS protection...');
const outputPath = path.join(__dirname, 'src/components/Output.jsx');
const output = fs.readFileSync(outputPath, 'utf8');

if (output.includes('dangerouslySetInnerHTML') && !output.includes('renderSafeHTML')) {
  console.log(`${RED}❌ ERROR: Unsafe dangerouslySetInnerHTML usage detected${RESET}`);
  errors++;
} else if (output.includes('renderSafeHTML')) {
  console.log(`${GREEN}✅ PASS: Safe HTML rendering implemented${RESET}`);
  passed++;
} else {
  console.log(`${YELLOW}⚠️  WARNING: Could not verify HTML rendering safety${RESET}`);
  warnings++;
}

// Check 9: Verify security headers
console.log('\n📋 Check 9: Security headers...');
if (orchestrator.includes('X-Content-Type-Options') && 
    orchestrator.includes('X-Frame-Options') &&
    orchestrator.includes('Strict-Transport-Security')) {
  console.log(`${GREEN}✅ PASS: Security headers are set${RESET}`);
  passed++;
} else {
  console.log(`${RED}❌ ERROR: Missing security headers${RESET}`);
  errors++;
}

// Check 10: Build test
console.log('\n📋 Check 10: Production build...');
console.log(`${BLUE}ℹ️  Run 'npm run build' to verify production build${RESET}`);

// Final Report
console.log(`\n${BLUE}
╔════════════════════════════════════════════════════════════╗
║                     VALIDATION RESULTS                      ║
╚════════════════════════════════════════════════════════════╝
${RESET}`);

console.log(`
${GREEN}✅ Passed: ${passed}${RESET}
${YELLOW}⚠️  Warnings: ${warnings}${RESET}
${RED}❌ Errors: ${errors}${RESET}
`);

if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}
╔════════════════════════════════════════════════════════════╗
║  🎉 ALL CHECKS PASSED - READY FOR PRODUCTION DEPLOYMENT!   ║
╚════════════════════════════════════════════════════════════╝
${RESET}`);
  process.exit(0);
} else if (errors === 0) {
  console.log(`${YELLOW}
╔════════════════════════════════════════════════════════════╗
║  ⚠️  WARNINGS FOUND - REVIEW BEFORE DEPLOYING              ║
╚════════════════════════════════════════════════════════════╝
${RESET}`);
  process.exit(0);
} else {
  console.log(`${RED}
╔════════════════════════════════════════════════════════════╗
║  ❌ ERRORS FOUND - FIX BEFORE DEPLOYING                    ║
╚════════════════════════════════════════════════════════════╝
${RESET}`);
  console.log('\nPlease fix the errors above before deploying to production.\n');
  process.exit(1);
}
