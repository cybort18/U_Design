import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck, PenTool, Camera, Palette, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

import WorkflowDemo from './WorkflowDemo';
import WorkflowPhasesGrid from './WorkflowPhasesGrid';

export default function TechDemoSection() {
  return (
    <section className="py-24 px-4 relative z-10 overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Powering the Next Wave of Evolution</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">U_Design's hybrid architecture combines the intelligence of AI with the immutability of decentralized networks.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <WorkflowDemo />
        </motion.div>
        
        <WorkflowPhasesGrid />
      </div>
    </section>
  );
}