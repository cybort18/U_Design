const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Landing.tsx');
let content = fs.readFileSync(file, 'utf8');

// Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

// 1. Remove the Anti-Plagiarism Badge
const badgeRegex = /          <motion\.div \n            initial={{ opacity: 0, scale: 0\.9 }}\n            whileInView={{ opacity: 1, scale: 1 }}\n            viewport={{ once: false }}\n            transition={{ duration: 0\.8, ease: "easeOut" }}\n            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green\/30 bg-neon-green\/5 text-neon-green text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-\[0_0_15px_rgba\(0,255,163,0\.2\)\]"\n          >\n            <div className="w-1\.5 h-1\.5 rounded-full bg-neon-green animate-pulse"><\/div>\n            Web2\.5 Anti-Plagiarism Engine Active\n          <\/motion\.div>\n          /;

content = content.replace(badgeRegex, '');

// 2. Replace imports
content = content.replace(
  "import WhoIsThisForSection from '../components/landing/WhoIsThisForSection';",
  "import HybridProtectionSection from '../components/landing/HybridProtectionSection';"
);

// 3. Replace component usage
content = content.replace(
  "{/* NEW SECTION: Who Is This For */}\n      <WhoIsThisForSection />",
  "{/* NEW SECTION: Hybrid Protection */}\n      <HybridProtectionSection />"
);

// Convert back to CRLF just in case (optional, but good practice)
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(file, content, 'utf8');
console.log('Landing.tsx fixed properly!');
