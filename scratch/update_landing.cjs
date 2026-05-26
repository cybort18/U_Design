const fs = require('fs');

const filePath = 'c:\\\\Users\\\\HP\\\\Documents\\\\GDG Juara\\\\JuaraVibeCoding\\\\U_Design\\\\src\\\\pages\\\\Landing.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "import WhoIsThisForSection from '../components/landing/WhoIsThisForSection';",
  "import LiveLedgerSection from '../components/landing/LiveLedgerSection';"
);

content = content.replace(
  "{/* NEW SECTION: Who Is This For */}\\n      <WhoIsThisForSection />",
  "{/* NEW SECTION: Live Ledger */}\\n      <LiveLedgerSection />"
);

// We know the exact POWERED BY section text from the clean checkout
const startMarker = "{/* 2.5 Tech Stack / Powered By */}";
const endMarker = "{/* Global CSS adjustments for Landing */}";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newPoweredBy = `{/* 2.5 Tech Stack / Powered By */}
      <section className="pt-12 pb-20 relative z-10 w-full mt-auto bg-transparent flex flex-col items-center justify-center overflow-hidden">
        {/* Smooth glow / border arc effect at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 max-w-xs h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[1px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-xl h-24 bg-white/10 blur-[80px] rounded-[100%] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <p className="text-center text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-slate-300 mb-8">
            POWERED BY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-16">
            
            {/* Gemini */}
            <div className="group flex items-center transition-all duration-500 cursor-default">
              <div 
                className="h-5 md:h-[22px] aspect-[3.04] bg-slate-400 opacity-60 group-hover:opacity-100 group-hover:bg-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300"
                style={{
                  maskImage: 'url(https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url(https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center'
                }}
              />
            </div>

            {/* Google Cloud */}
            <div className="group flex items-center transition-all duration-500 cursor-default">
              <div 
                className="h-5 md:h-[22px] aspect-[6.24] bg-slate-400 opacity-60 group-hover:opacity-100 group-hover:bg-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300"
                style={{
                  maskImage: 'url(https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url(https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center'
                }}
              />
            </div>

            <div className="group flex items-center transition-all duration-500 cursor-default">
              <span className="text-base md:text-lg font-bold tracking-tight text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300">IPFS</span>
            </div>
            
            <div className="group flex items-center transition-all duration-500 cursor-default">
              <span className="text-base md:text-lg font-bold tracking-tight text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300">Pinata</span>
            </div>
            
            <div className="group flex items-center transition-all duration-500 cursor-default">
              <span className="text-base md:text-lg font-bold tracking-tight text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300">React</span>
            </div>
            
            <div className="group flex items-center transition-all duration-500 cursor-default">
              <span className="text-base md:text-lg font-bold tracking-tight text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-neon-green group-hover:drop-shadow-[0_0_12px_rgba(0,255,163,0.6)] transition-all duration-300">Tailwind CSS</span>
            </div>

          </div>
        </div>
      </section>

      `;
  
  content = content.substring(0, startIndex) + newPoweredBy + content.substring(endIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Update complete.');
} else {
  console.log('Markers not found!');
}
