import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck, PenTool, Camera, Palette, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function WhoIsThisForSection() {
  const personas = [
    {
      title: "Digital Illustrators",
      desc: "Secure your 2D artwork and characters before posting to social media or artist portfolios. Never let AI scrapers or thieves steal your distinct style without consequence.",
      icon: <PenTool className="w-8 h-8 text-neon-green" />
    },
    {
      title: "Photographers",
      desc: "Protect your RAW photos and final edits with a decentralized timestamp. Prove you were the original lens behind the shot, even if someone strips your EXIF data.",
      icon: <Camera className="w-8 h-8 text-neon-green" />
    },
    {
      title: "Graphic Designers",
      desc: "Protect your logos, branding mockups, and visual assets. Establish undeniable proof of creation before presenting concepts to clients or publishing them online.",
      icon: <Palette className="w-8 h-8 text-neon-green" />
    }
  ];

  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Who is <span className="text-neon-green">U_Design</span> For?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Built specifically for creators who refuse to let their digital identity be compromised.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="glass p-8 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-neon-green/40 hover:shadow-[0_10px_40px_rgba(0,255,163,0.15)] transition-all duration-300 bg-gradient-to-b from-white/5 to-transparent flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green/0 via-neon-green/50 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-neon-green/10 flex items-center justify-center mb-6 border border-neon-green/20 group-hover:scale-110 group-hover:bg-neon-green/20 transition-all duration-300">
                {persona.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-neon-green transition-colors duration-300">{persona.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                {persona.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}