"use client";

import Link from "next/link";
import { ShieldAlert, ArrowRight, Activity, MapPin, Cpu, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden flex flex-col justify-between">
      
      {/* Background Gradients & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_50%)]"></div>
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-950/15 blur-[100px]"></div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Header / Brand */}
      <header className="relative z-10 w-full px-6 py-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">AegisAI</span>
            <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mt-0.5">Crisis Intelligence</span>
          </div>
        </div>
        <div className="text-xs font-semibold text-gray-400 border border-gray-800 rounded-full px-4 py-1.5 bg-gray-900/40 backdrop-blur-md">
          v1.0.0 Stable Node
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 my-auto">
        
        {/* Top Feature Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold text-blue-400 mb-6"
        >
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          Crisis Intelligence & Strategy Engine
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent"
        >
          Predict. Plan. Respond.
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-medium"
        >
          AI-powered disaster intelligence for emergency decision-makers. Streamline resource logistics, assess risk, and generate stakeholder briefing plans.
        </motion.p>

        {/* Call-to-action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/35 transition-all duration-200 cursor-pointer text-sm"
          >
            Generate Response Plan
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/analytics"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-md px-7 py-4 font-bold text-gray-300 hover:bg-gray-900/60 hover:text-white transition-all cursor-pointer text-sm"
          >
            Review Operations
          </Link>
        </motion.div>

        {/* Palantir Gotham-Style Technical Grid Details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full border-t border-gray-800/80 pt-10 text-left px-4"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
              <Cpu className="h-4 w-4" />
              Gemini AI Integration
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
              Synthesizing situational summaries & action items.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
              <Database className="h-4 w-4" />
              Logistics Scoring
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
              Exact calculations for water, shelters, food, and emergency medical teams.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
              <MapPin className="h-4 w-4" />
              GIS Coordinates Mapping
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
              Interactive Leaflet maps detailing crisis centers & shelters.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Activity className="h-4 w-4" />
              McKinsey Consulting Format
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
              One-click PDF reporting suitable for federal agencies & boards.
            </p>
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-xs text-gray-600 font-medium border-t border-gray-900/60 bg-gray-950/40">
        © {new Date().getFullYear()} AegisAI crisis command software. Designed for HKS, McKinsey analytics, and public sector innovation.
      </footer>

    </div>
  );
}
