const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Landing.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the Anti-Plagiarism Badge
const badgeRegex = /<motion\.div[\s\S]*?Web2\.5 Anti-Plagiarism Engine Active[\s\S]*?<\/motion\.div>/;
content = content.replace(badgeRegex, '');

// 2. Replace the imports
content = content.replace(
  "import WhoIsThisForSection from '../components/landing/WhoIsThisForSection';",
  "import HybridProtectionSection from '../components/landing/HybridProtectionSection';"
);

// 3. Replace the component usage
content = content.replace(
  "{/* NEW SECTION: Who Is This For */}\n      <WhoIsThisForSection />",
  "{/* NEW SECTION: Hybrid Protection */}\n      <HybridProtectionSection />"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated Landing.tsx');
