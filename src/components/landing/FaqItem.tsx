import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck, PenTool, Camera, Palette, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FaqItem({ question, answer, isOpen, onToggle }: { question: string, answer: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div 
      className={cn(
        "glass border rounded-xl overflow-hidden transition-[border-color,box-shadow] duration-300 transform-gpu",
        isOpen 
          ? "border-neon-green/50 shadow-[0_0_15px_rgba(0,255,163,0.2)]" 
          : "border-white/5 hover:border-neon-green/30 hover:shadow-[0_0_10px_rgba(0,255,163,0.1)]"
      )}
    >
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent cursor-pointer"
      >
        <span className="font-medium text-lg pr-8">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-neon-green transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
      </button>
      <div 
        className={cn(
          "px-6 text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300",
          isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {answer}
      </div>
    </div>
  );
}