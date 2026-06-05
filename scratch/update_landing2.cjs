const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/Landing.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the Anti-Plagiarism Badge exactly
const badgeExact = `          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(0,255,163,0.2)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
            Web2.5 Anti-Plagiarism Engine Active
          </motion.div>
          `;
content = content.replace(badgeExact, '');

// 2. Replace the imports exactly
const importOld = "import WhoIsThisForSection from '../components/landing/WhoIsThisForSection';";
const importNew = "import HybridProtectionSection from '../components/landing/HybridProtectionSection';";
content = content.replace(importOld, importNew);

// 3. Replace the component usage exactly
const compOld = `{/* NEW SECTION: Who Is This For */}
      <WhoIsThisForSection />`;
const compNew = `{/* NEW SECTION: Hybrid Protection */}
      <HybridProtectionSection />`;
content = content.replace(compOld, compNew);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Landing.tsx');
