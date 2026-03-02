import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import {
  Github,
  ArrowRight,
  Database,
  CreditCard,
  Cloud,
  ShieldCheck,
  Layers,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Boxes,
  Code2,
  Wind,
  Terminal,
  Bot,
  BrainCircuit,
  Coins,
  TestTube,
  Key,
  FileText,
  ShieldAlert,
  Box,
  Activity,
  ScrollText,
  MessageSquare,
  Gamepad2,
} from 'lucide-react';

const themes = {
  biolum: {
    name: 'Deep Sea Bioluminescence',
    gradient: 'from-cyan-500 via-teal-400 to-emerald-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  plasma: {
    name: 'Cyber-Plasma',
    gradient: 'from-fuchsia-600 via-purple-500 to-orange-500',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/30',
    glow: 'rgba(192, 38, 211, 0.4)',
  },
  quantum: {
    name: 'Quantum Flare',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    text: 'text-orange-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
};

const GlowingBox = ({ children, themeDef, className = '' }) => (
  <div className="relative group h-full">
    <div
      className={`absolute -inset-[1.5px] bg-gradient-to-r ${themeDef.gradient} rounded-xl blur-[6px] opacity-20 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-100 transition duration-700`}
    >
      {' '}
    </div>
    <div
      className={`relative h-full bg-white dark:bg-zinc-950 rounded-xl p-6 flex flex-col border border-slate-200 dark:border-zinc-800/50 ${className}`}
    >
      {children}
    </div>
  </div>
);

const ThemeSwitcher = ({ currentTheme, setTheme }) => (
  <div className="fixed bottom-6 right-6 z-50 flex gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-full border border-slate-200 dark:border-zinc-800 shadow-2xl">
    {Object.entries(themes).map(([key, theme]) => (
      <button
        key={key}
        onClick={() => setTheme(key)}
        title={theme.name}
        className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradient} ${currentTheme === key ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-slate-50 dark:ring-offset-zinc-950' : 'opacity-40 hover:opacity-100'} transition-all`}
      />
    ))}
  </div>
);

// --- Components ---

const Navbar = ({ isDark, toggleDark }) => (
  <nav className="fixed top-0 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a
        href="#"
        className="flex items-center gap-2 text-slate-900 dark:text-white transition-colors cursor-pointer group hover:opacity-80"
      >
        <Boxes
          size={26}
          className="text-slate-900 dark:text-white stroke-[1.5] group-hover:scale-110 transition-transform duration-300"
        />
        <span className="font-bold text-xl tracking-tight"> tstack </span>
      </a>
      <div className="hidden md:flex gap-8 text-sm text-slate-500 dark:text-zinc-400 font-medium">
        <a
          href="#features"
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {' '}
          Features{' '}
        </a>
        <a
          href="#ecosystem"
          className="hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {' '}
          Ecosystem{' '}
        </a>
        <div
          className="flex items-center gap-1.5 cursor-not-allowed opacity-60"
          title="Coming soon"
        >
          <span>Docs </span>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            {' '}
            Soon{' '}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 cursor-not-allowed opacity-60"
          title="Coming soon"
        >
          <span>Blog </span>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            {' '}
            Soon{' '}
          </span>
        </div>
        <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {' '}
          Pre - order{' '}
        </a>
        <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {' '}
          FAQ{' '}
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="https://github.com/desingh-rajan/tstack-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <Github size={16} />
          <span className="hidden sm:inline"> Star on GitHub </span>
        </a>
      </div>
    </div>
  </nav>
);

const Hero = ({ themeDef }) => (
  <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative min-h-[90vh] flex items-center">
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-gradient-to-r ${themeDef.gradient} rounded-full blur-[150px] opacity-10 dark:opacity-15 pointer-events-none transition-all duration-1000`}
    >
      {' '}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
      {/* Left side: Copy */}
      <div className="text-left">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${themeDef.border} ${themeDef.bg} ${themeDef.text} text-xs font-semibold uppercase tracking-wider mb-8 transition-colors duration-500`}
        >
          <Zap size={14} className={themeDef.text} />
          <span>The Ultimate Deno + Hono Starter </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
          Zero Boilerplate.
          <br />
          <span className="text-slate-400 dark:text-zinc-500"> Maximum Velocity.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed">
          An aggressively opinionated Deno monolith built for speed.Hono, Fresh, Drizzle, and
          Postgres—surgically pre - wired and strictly typed.Stop wrestling with infrastructure and
          start shipping revenue - generating code today.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://github.com/desingh-rajan/tstack-kit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-black px-8 py-3.5 rounded-md font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
          >
            <Github size={18} />
            Clone tstack - kit
          </a>
          <a
            href="#pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-slate-900 dark:text-white border border-slate-300 dark:border-zinc-700 px-8 py-3.5 rounded-md font-bold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Pre - order Premium
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Right side: Storytelling Visual */}
      <div className="w-full relative hidden md:block">
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${themeDef.gradient} rounded-2xl blur-xl opacity-20 dark:opacity-30`}
        >
          {' '}
        </div>
        <div className="relative border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-900 dark:bg-[#0a0a0c] backdrop-blur-xl shadow-2xl overflow-hidden font-mono">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 dark:border-zinc-800/80 bg-slate-800 dark:bg-zinc-900/80">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"> </div>
              <div className="w-3 h-3 rounded-full bg-amber-500"> </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"> </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-zinc-500">
              <Terminal size={14} />
              <span> bash </span>
            </div>
          </div>
          {/* Mock CLI Output */}
          <div className="p-6 text-sm md:text-base overflow-x-auto text-slate-300 dark:text-zinc-300 leading-relaxed">
            <pre className="!bg-transparent !m-0 !p-0">
              <code>
                <span className="text-emerald-400 font-bold"> ~ ❯</span>{' '}
                <span className="text-white font-medium">tstack create workspace my-saas</span>{' '}
                <br />
                <br />
                <span className="text-cyan-400 font-bold"> tstack </span>{' '}
                <span className="text-slate-400">Provisioning full-stack workspace...</span> <br />
                <span className="text-fuchsia-400 font-bold"> [+] </span>{' '}
                <span className="text-slate-300">Scaffolding API (Hono + Drizzle + Postgres)</span>{' '}
                <br />
                <span className="text-fuchsia-400 font-bold"> [+] </span>{' '}
                <span className="text-slate-300">Building Admin Panel (Fresh + DaisyUI)</span>{' '}
                <br />
                <span className="text-fuchsia-400 font-bold"> [+] </span>{' '}
                <span className="text-slate-300">Generating Storefront (Fresh + Tailwind)</span>{' '}
                <br />
                <br />
                <span className="text-emerald-400 font-bold"> Success! </span>{' '}
                <span className="text-slate-400">3 services wired in 1.2s.</span> <br />
                <br />
                <span className="text-emerald-400 font-bold"> ~ ❯</span>{' '}
                <span className="text-white font-medium">
                  cd my-saas && tstack scaffold products
                </span>{' '}
                <br />
                <span className="text-fuchsia-400 font-bold"> [+] </span>{' '}
                <span className="text-slate-300">Generated Drizzle schema & Zod DTOs</span> <br />
                <span className="text-fuchsia-400 font-bold"> [+] </span>{' '}
                <span className="text-slate-300">Injected entity into Admin UI</span> <br />
                <br />
                <span className="text-emerald-400 font-bold"> ~ ❯</span>{' '}
                <span className="text-white font-medium">./start - dev.sh </span>
                <br />
                <span className="text-amber-400 font-medium">
                  {' '}
                  [Docker] Dev environment running.Logs at: 9999{' '}
                </span>
                <span className="animate-pulse font-bold text-white">_</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TrustedBy = () => (
  <section className="py-16 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition-colors duration-300 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-[0.2em] mb-10">
        Allies shipping to production with tstack
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
        {/* Surya's Cookware */}
        <a
          href="https://www.suryascookware.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-transform hover:scale-105 group"
        >
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-slate-300 dark:border-zinc-700 group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300">
            <span className="text-3xl font-serif font-bold text-slate-400 dark:text-zinc-600 group-hover:text-[#d4af37] italic mt-0.5 pr-0.5 transition-colors duration-300">
              {' '}
              S{' '}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-slate-400 dark:text-zinc-500 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#ff7e00] group-hover:to-[#800080] bg-clip-text leading-none mb-1 font-sans transition-all duration-300">
              {' '}
              SURYA'S
            </span>
            <span className="text-xs tracking-[0.25em] text-slate-400 dark:text-zinc-600 group-hover:text-[#1e3a8a] dark:group-hover:text-[#3b82f6] font-sans leading-none font-semibold transition-colors duration-300">
              {' '}
              COOKWARE{' '}
            </span>
          </div>
        </a>

        {/* Never Before Marketing */}
        <a
          href="https://neverbeforemarketing.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-transform hover:scale-105 group"
        >
          <div className="relative flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-zinc-800 group-hover:bg-[#168a83]/10 rounded-xl transition-colors duration-300">
            <Wind
              size={28}
              className="text-slate-400 dark:text-zinc-500 group-hover:text-[#168a83] transition-colors duration-300"
              strokeWidth={2.5}
            />
          </div>
          <span className="text-2xl font-bold text-slate-400 dark:text-zinc-500 font-sans transition-colors duration-300">
            Never Before{' '}
            <span className="text-slate-500 dark:text-zinc-600 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              {' '}
              Marketing{' '}
            </span>
          </span>
        </a>

        {/* Vega Tools & Hardwares */}
        <a
          href="https://vegatoolsandhardwares.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-transform hover:scale-105 group"
        >
          <div className="flex flex-col items-center justify-center">
            <Layers
              size={32}
              className="text-slate-400 dark:text-zinc-500 group-hover:text-[#519f35] mb-0.5 transition-colors duration-300"
              strokeWidth={2.5}
            />
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 tracking-widest font-sans transition-colors duration-300">
              {' '}
              VEGA{' '}
            </span>
          </div>
          <span className="text-2xl font-black text-slate-400 dark:text-zinc-500 group-hover:text-[#519f35] tracking-wide uppercase font-sans transition-colors duration-300">
            {' '}
            Tools & Hardwares{' '}
          </span>
        </a>
      </div>
    </div>
  </section>
);

const FeatureMatrix = ({ themeDef }) => {
  const features = [
    {
      icon: <Layers className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Deno Native',
      desc: 'No node_modules, no package.json complexity. Native TypeScript execution and built-in tooling for testing, formatting, and linting.',
    },
    {
      icon: <Zap className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Hono & Fresh',
      desc: 'Blazing fast API routing with Hono, paired with the Fresh framework for zero-JS-by-default, Preact-based frontend rendering.',
    },
    {
      icon: (
        <Database className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Drizzle ORM & Postgres',
      desc: 'Experience end-to-end type safety. Your database schema dictates your frontend types seamlessly without manual mapping.',
    },
    {
      icon: <Cloud className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Deploy Anywhere',
      desc: 'Perfectly optimized for edge deployments like Deno Deploy, or easily hostable on a single, low-cost VPS instance.',
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {' '}
            The Monolith Arsenal{' '}
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl">
            {' '}
            Stop wasting engineering cycles gluing tools together.We made the hard architectural
            decisions for you.A single, ruthlessly optimized codebase packing everything required to
            go from localhost to MRR.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <GlowingBox key={i} themeDef={themeDef}>
              <div className="mb-4 drop-shadow-sm"> {f.icon} </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2"> {f.title} </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                {' '}
                {f.desc}{' '}
              </p>
            </GlowingBox>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIAdvantage = ({ themeDef }) => (
  <section className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
    <div
      className={`absolute -left-64 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${themeDef.gradient} rounded-full blur-[150px] opacity-10 dark:opacity-15 pointer-events-none transition-all duration-1000`}
    >
      {' '}
    </div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${themeDef.border} ${themeDef.bg} ${themeDef.text} text-xs font-bold uppercase tracking-wider mb-6 transition-colors duration-500`}
          >
            <Bot size={14} className={themeDef.text} />
            <span>Who is this for? </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            Built for Architects.
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeDef.gradient}`}>
              {' '}
              Optimized for AI Agents.
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed font-sans">
            Whether you are a solo indie hacker shipping MVPs, an agency delivering client work, or
            an enterprise architect demanding stability, tstack - kit is designed to eliminate
            decision fatigue.It is strictly organized to make AI - assisted development flawless.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="mt-1">
                <div
                  className={`p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shadow-sm`}
                >
                  <BrainCircuit size={22} />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {' '}
                  Instant AI Context Loading{' '}
                </h4>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {' '}
                  Because tstack - kit uses highly predictable patterns, strict folder structures,
                  and heavily documented base abstractions, tools like Cursor, GitHub Copilot, and
                  Claude can ingest your entire architecture in seconds.They just "get" it.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1">
                <div
                  className={`p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shadow-sm`}
                >
                  <Coins size={22} />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {' '}
                  Slash AI Development Costs{' '}
                </h4>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {' '}
                  Stop burning expensive API tokens on generating boilerplate, fixing hallucinated
                  microservices, or writing standard CRUD.Our{' '}
                  <code className="text-sm bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-zinc-300">
                    {' '}
                    BaseService{' '}
                  </code>{' '}
                  and{' '}
                  <code className="text-sm bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-zinc-300">
                    BaseController
                  </code>{' '}
                  mean you only prompt the AI for pure business logic.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-full hidden lg:block">
          <GlowingBox themeDef={themeDef} className="!p-8 h-full flex flex-col justify-center">
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">01 </span>
                <span className="text-fuchsia-600 dark:text-fuchsia-400 italic">
                  {' '}
                  {'// Prompting Cursor...'}{' '}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">02 </span>
                <span className="text-slate-800 dark:text-zinc-200">
                  {' '}
                  "Scaffold a Subscription model using tstack-kit patterns. It needs to extend
                  BaseService and include Stripe webhook lifecycle hooks."{' '}
                </span>
              </div>
              <div className="flex items-start gap-3 mt-6">
                <span className="text-slate-400 dark:text-zinc-600">03 </span>
                <span className="text-cyan-600 dark:text-cyan-400 italic">
                  {' '}
                  {'// AI Output (Zero Hallucinations)'}{' '}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">04 </span>
                <span className="text-emerald-600 dark:text-emerald-400">export class </span>{' '}
                <span className="text-amber-600 dark:text-amber-300">SubscriptionService</span>{' '}
                <span className="text-emerald-600 dark:text-emerald-400">extends </span>{' '}
                <span className="text-cyan-600 dark:text-cyan-400">BaseService</span> {'{'}
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">05 </span>
                <span className="text-slate-800 dark:text-zinc-200 pl-4">
                  {' '}
                  protected override async{' '}
                  <span className="text-amber-600 dark:text-amber-300">
                    {' '}
                    beforeCreate{' '}
                  </span>(data) {'{'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">06 </span>
                <span className="text-slate-800 dark:text-zinc-200 pl-8">
                  return await stripe.
                  <span className="text-amber-600 dark:text-amber-300"> verify </span>(data);
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">07 </span>
                <span className="text-slate-800 dark:text-zinc-200 pl-4"> {'}'} </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 dark:text-zinc-600">08 </span>
                <span className="text-slate-800 dark:text-zinc-200"> {'}'} </span>
              </div>
            </div>
          </GlowingBox>
        </div>
      </div>
    </div>
  </section>
);

const BatteriesIncluded = ({ themeDef }) => {
  const features = [
    {
      icon: (
        <TestTube className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'TDD & 390+ Pre-written Tests',
      desc: 'Ships with massive test coverage across CLI (235), Admin (83), and API (50+). Scaffold a feature and integration tests are generated automatically.',
    },
    {
      icon: <Cloud className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Pre-wired AWS Ecosystem',
      desc: 'Stop reading SDK docs. S3 (File Uploads), SES (Transactional Emails), and SNS are natively integrated and ready to consume your API keys.',
    },
    {
      icon: <Key className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'OAuth & Strict Auth',
      desc: 'Secure JWT session management. Google and Facebook OAuth are pre-configured, alongside password reset flows and guest checkout capabilities.',
    },
    {
      icon: (
        <FileText className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Legal Pages Included',
      desc: "Don't waste time on boring compliance. Professional, beautifully formatted Terms of Service and Privacy Policy templates are included by default.",
    },
    {
      icon: (
        <ShieldAlert className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Hardened Security',
      desc: 'Production-grade security out of the box. Features rate limiting, scoped permissions, SQL injection guards, and strict JWT validation.',
    },
    {
      icon: <Box className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Docker Multi-Env',
      desc: 'Three Docker environments out of the box: ./start-dev.sh (hot-reload), ./start-test.sh (CI-ready), and ./start-prod.sh (Alpine production builds).',
    },
    {
      icon: (
        <Terminal className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'One Command, Full Stack',
      desc: 'Scaffold an API, Admin UI, Storefront, and Status Page with one command (tstack create workspace). Four connected services, completely pre-wired.',
    },
    {
      icon: (
        <CreditCard className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Guest Checkout & Tracking',
      desc: 'E-commerce ready with full purchase flows without account creation, and public order lookup by email + order number.',
    },
    {
      icon: (
        <Database className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Advanced Pagination',
      desc: 'Server-side filterable tables with date pickers, search, and sorting out of the box for your admin dashboards.',
    },
    {
      icon: (
        <ShieldCheck className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Open Redirect Guard',
      desc: 'Constant-time webhook signature verification and isSafeRedirect() on all auth redirects to prevent malicious routing.',
    },
    {
      icon: <Code2 className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Base Abstractions',
      desc: 'Write 80% less CRUD code. Entity services and controllers inherit heavily typed Base classes that instantly wire up rules and routing.',
    },
    {
      icon: <Cloud className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Zero-Config Deployment',
      desc: 'A single tstack infra command provisions a production Kamal deployment with Traefik, auto-SSL, and zero-downtime deploys to a low-cost VPS.',
    },
    {
      icon: (
        <Activity className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Built-in Status Page',
      desc: 'A dedicated status-starter package monitors health endpoints across all your services with a clean, real-time dashboard and light/dark theme.',
    },
    {
      icon: (
        <ScrollText className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />
      ),
      title: 'Dozzle Log Viewer',
      desc: 'Real-time Docker container logs in your browser at localhost:9999. No more ssh-ing into servers to tail logs — it is pre-wired into every workspace.',
    },
    {
      icon: <Layers className="text-slate-800 dark:text-white mb-4" size={28} strokeWidth={1.5} />,
      title: 'Netdata Metrics',
      desc: 'Production monitoring with Netdata for CPU, memory, disk, and network metrics. Pre-configured in the deployment guide with Kamal Accessories.',
    },
  ];

  return (
    <section
      id="deep-dive"
      className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {' '}
            Fully Charged & Ready to Ship{' '}
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-sans">
            {' '}
            A deep dive into the features that save you weeks of engineering time.Everything is
            configured, typed, and ready to be deployed to a single VPS.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <GlowingBox key={i} themeDef={themeDef} className="!bg-white dark:!bg-[#0a0a0c]">
              <div className="mb-4 drop-shadow-sm"> {f.icon} </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2"> {f.title} </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                {' '}
                {f.desc}{' '}
              </p>
            </GlowingBox>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutCreator = ({ themeDef }) => (
  <section
    id="about"
    className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition-colors duration-300"
  >
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start">
        {/* Left Column - Image & Cards */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="relative group rounded-2xl p-1 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden shadow-xl">
            <div
              className={`absolute inset-0 bg-gradient-to-b ${themeDef.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            >
              {' '}
            </div>
            <img
              src="https://github.com/desingh-rajan.png"
              alt="Desingh Rajan"
              className="w-full aspect-square object-cover rounded-xl transition-all duration-500"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                {' '}
                System Architect{' '}
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">
                {' '}
                16 + years building scalable, enterprise - grade digital solutions.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5"> Tech Consultant </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">
                {' '}
                Leading cross - functional teams & mentoring developers globally.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Copy */}
        <div className="w-full md:w-2/3 mt-4 md:mt-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
            Hi, I'm Desingh.
          </h2>

          <div className="space-y-6 text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-sans">
            <p className="font-bold text-xl text-slate-900 dark:text-white mb-8">
              Let's get one thing straight: this isn't another flimsy boilerplate.
            </p>

            <p>
              It is a production - deployable codeplate from day one.I'm talking full end-to-end
              test coverage and a multi-container Docker service ready to ship before you even write
              your first line of custom logic.
            </p>

            <p>
              For the last six months, I traded my weekend DOTA and Age of Empires matches for late
              nights architecting tstack - kit.The goal was simple: make it absolutely
              bulletproof.Today, that exact codebase is powering three incredible clients in
              production, handling real - world traffic and gaining serious traction across India.
            </p>

            <p>
              It all started when I decided to explore Deno.I just wanted to build a small side
              project, but I completely fell in love with the developer experience.That curiosity
              turned into an obsession, and today, here we are.Releasing the core{' '}
              <strong
                className={`text-transparent bg-clip-text bg-gradient-to-r ${themeDef.gradient}`}
              >
                {' '}
                tstack - kit{' '}
              </strong>{' '}
              for free is my way of giving back to the community that makes this all possible.
            </p>

            <div className="p-5 mt-8 bg-slate-50 dark:bg-zinc-900/50 border-l-4 border-slate-900 dark:border-white rounded-r-lg">
              <p className="text-base text-slate-600 dark:text-zinc-400 italic">
                "In these hard AI times, indie development is a grind. Buying the premium
                bundle—whether you deploy it tomorrow or just want to study the architecture—is the
                best way to keep me motivated and ensure this project thrives."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyPremium = ({ themeDef }) => (
  <section className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-[#0a0a0c] relative overflow-hidden transition-colors duration-300">
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
        Why is the Deno stack free, but the others aren't?
      </h2>
      <div className="space-y-6 text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-sans text-left md:text-center">
        <p>
          The tech industry has a short memory.In 2026, everyone is chasing the next shiny micro -
          framework, but veteran developers know a secret:{' '}
          <strong className="text-slate-900 dark:text-white">
            {' '}
            Ruby on Rails and Phoenix are still the undisputed kings of shipping.
          </strong>
        </p>
        <p>
          From small - scale bootstrapped businesses to high - traffic production environments,
          nothing beats the mature, battle - tested power of Rails, or the unmatched concurrent
          stability of Elixir's Phoenix. But mastering their ecosystems takes years of trial by
          fire. Only our generation of developers truly understands how to squeeze every ounce of
          performance out of them.
        </p>
        <p>
          I am giving away the Deno stack because I believe in the future of modern TypeScript.But{' '}
          <strong className={`text-transparent bg-clip-text bg-gradient-to-r ${themeDef.gradient}`}>
            {' '}
            rstack{' '}
          </strong>{' '}
          and{' '}
          <strong className={`text-transparent bg-clip-text bg-gradient-to-r ${themeDef.gradient}`}>
            pstack
          </strong>{' '}
          represent decades of collective architectural wisdom.When you buy premium, you aren't just
          buying code—you are buying the ability to instantly wield the weapons of senior engineers.
        </p>
      </div>
    </div>
  </section>
);

const Ecosystem = ({ themeDef }) => (
  <section
    id="ecosystem"
    className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 relative transition-colors duration-300"
  >
    <div className="max-w-7xl mx-auto text-center relative z-10">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
        {' '}
        One Philosophy. Four Ecosystems.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlowingBox themeDef={themeDef}>
          <div
            className={`text-xs font-bold ${themeDef.text} uppercase tracking-widest mb-2 transition-colors duration-500`}
          >
            {' '}
            Available Now{' '}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1"> tstack - kit </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm"> Deno • TypeScript </p>
        </GlowingBox>
        <div className="p-6 border border-slate-300 dark:border-zinc-800 border-dashed rounded-xl opacity-80 dark:opacity-60 bg-white dark:bg-zinc-950">
          <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
            {' '}
            In Development{' '}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1"> nstack </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm"> Node / Bun • Express </p>
        </div>
        <div className="p-6 border border-slate-300 dark:border-zinc-800 border-dashed rounded-xl opacity-80 dark:opacity-60 bg-white dark:bg-zinc-950">
          <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
            {' '}
            In Development{' '}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1"> rstack </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm"> Ruby on Rails </p>
        </div>
        <div className="p-6 border border-slate-300 dark:border-zinc-800 border-dashed rounded-xl opacity-80 dark:opacity-60 bg-white dark:bg-zinc-950">
          <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
            {' '}
            In Development{' '}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1"> pstack </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm"> Phoenix • Elixir </p>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = ({ themeDef }) => (
  <section
    id="pricing"
    className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300"
  >
    <div
      className={`absolute -right-64 top-0 w-96 h-96 bg-gradient-to-l ${themeDef.gradient} rounded-full blur-[150px] opacity-10 dark:opacity-20 pointer-events-none transition-all duration-1000`}
    >
      {' '}
    </div>
    <div className="max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {' '}
          Choose Your Arsenal{' '}
        </h2>
        <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          {' '}
          Start for free with our open - source Deno kit, or lock in early adopter pricing for the
          entire upcoming premium ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Tier */}
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex flex-col h-full shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {' '}
            tstack - kit Open Source{' '}
          </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">
            {' '}
            The modern, opinionated Deno stack for rapid iteration.
          </p>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">
            {' '}
            Free{' '}
            <span className="text-lg font-medium text-slate-400 dark:text-zinc-500"> forever </span>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            {[
              'Full CLI: create, scaffold, destroy, infra',
              'Hono API + Fresh (Preact) frontends',
              'Drizzle ORM + PostgreSQL + Zod validation',
              '390+ tests (CLI, Admin, API)',
              'JWT + OAuth (Google, Facebook)',
              'Docker multi-env (dev / test / prod)',
              'Kamal deployment + Status page',
              'E-commerce: cart, orders, payments',
              'Security hardened (9-block audit)',
              'Community support via GitHub',
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-sm"
              >
                <Check size={18} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                <span>{item} </span>
              </li>
            ))}
          </ul>

          <a
            href="https://github.com/desingh-rajan/tstack-kit"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white py-3 rounded-md font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700"
          >
            <Github size={18} />
            Clone Repository
          </a>
        </div>

        {/* Premium Pre-order */}
        <GlowingBox themeDef={themeDef} className="!p-8 relative">
          <div
            className={`absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r ${themeDef.gradient} text-white font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-lg`}
          >
            Early Bird
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {' '}
            The Early Adopter Bundle{' '}
          </h3>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">
            {' '}
            Unlocks lifetime access to the upcoming premium stacks.
          </p>

          <div className="mb-8">
            <div className="flex items-end gap-3 mb-1">
              <span
                className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${themeDef.gradient}`}
              >
                {' '}
                $119{' '}
              </span>
              <span className="text-lg text-slate-400 dark:text-zinc-500 line-through mb-1">
                {' '}
                $299{' '}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider">
              {' '}
              Early bird pricing until June 19. One - time purchase.
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-grow">
            <li className={`flex items-start gap-3 ${themeDef.text} text-sm font-bold`}>
              <Check size={18} className="shrink-0" strokeWidth={3} />
              <span>Lifetime access to nstack, rstack & pstack </span>
            </li>
            {[
              'Private repository access on release',
              'Flutter mobile UI kit (upcoming)',
              'Priority email support',
              'Advanced SaaS templates & layouts',
              'Vote on upcoming feature roadmaps',
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-sm"
              >
                <Check size={18} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                <span>{item} </span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-sm pt-2 border-t border-slate-200 dark:border-zinc-800">
              <MessageSquare size={18} className="text-slate-400 dark:text-zinc-500 shrink-0" />
              <span>Private Discord community (20+ lead architects & principals) </span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-sm">
              <BrainCircuit size={18} className="text-slate-400 dark:text-zinc-500 shrink-0" />
              <span>On-demand architecture guidance via Discord chat </span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 dark:text-zinc-300 text-sm">
              <Gamepad2 size={18} className="text-slate-400 dark:text-zinc-500 shrink-0" />
              <span>Game nights — AOE2 DE & DOTA with the community </span>
            </li>
          </ul>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md mb-6">
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-white"> Transparent Pre - order: </strong>{' '}
              Development is underway. Secure a massive discount today and get access the moment the
              MVP drops.
            </p>
          </div>

          <button
            className={`w-full bg-gradient-to-r ${themeDef.gradient} text-white py-3 rounded-md font-bold hover:opacity-90 transition-opacity shadow-lg`}
          >
            Pre - order the Full Ecosystem
          </button>
        </GlowingBox>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const faqs = [
    {
      q: 'I already know Node, Rails, and Phoenix. Why learn Deno and Fresh?',
      a: "Because it fundamentally solves the deployment and maintenance overhead of Webpack/Node environments. Deno brings native TypeScript, out-of-the-box linting/testing, and a secure-by-default runtime without the node_modules black hole. Paired with Fresh's zero-JS-by-default SSR model, you're looking at Rails-like developer velocity but with a strictly typed ecosystem.",
    },
    {
      q: 'How does the database and ORM layer compare to Active Record or Ecto?',
      a: "TStack uses Drizzle ORM connected to PostgreSQL. It's closer to Ecto in philosophy: explicit, thin abstractions over SQL, rather than the implicit magic of Active Record. Drizzle gives you SQL-like syntax that is completely strictly typed from the database layer all the way to the frontend, preventing entire classes of runtime errors.",
    },
    {
      q: 'Is this built for Enterprise scale or just hobby projects?',
      a: 'Built for scaling. TStack utilizes architecture patterns proven at scale: Rate limiting, SQL injection prevention, strict JWT session management, per-request SSR API isolation, decoupled services (API/Store/Admin), and deterministic multi-stage Docker builds. You are getting production-hardened defaults.',
    },
    {
      q: 'Can I extend the existing authentication and providers?',
      a: 'Yes. Core Auth includes email/password, JWT strict mode, and Google/Facebook OAuth out of the box, cleanly abstracted. Adding SSO or Magic Links is straightforward using the built-in BaseController architecture without fighting proprietary vendor lock-in.',
    },
    {
      q: 'Is this a recurring subscription? How do updates work?',
      a: "No. It's a strict one-time payment for lifetime access to the monorepo codebase, upcoming templates, and the CLI. We actively maintain and push updates to the repository, which you can regularly pull or cherry-pick into your own workspaces.",
    },
    {
      q: 'How does deployment and infrastructure orchestration work?',
      a: 'TStack uses Kamal (from the creators of Rails) for zero-downtime, multi-region container orchestration anywhere—bypassing expensive PaaS lock-in. A single `tstack infra` command scaffolds your `deploy.yml`, GitHub Actions pipelines, Dockerfiles, and manages environment secrets across your VPS fleet.',
    },
    {
      q: 'Can I manage multiple distinct architectures or just monoliths?',
      a: 'TStack operates on a Workspace model managed by a local Deno KV database. Through the CLI, you can combine APIs, Admin panels, and Storefronts across different scopes (core, listing, commerce) or maintain completely isolated microservices without cluttering a single monolith.',
    },
    {
      q: 'How is routing and traffic managed at the edge?',
      a: "We utilize Traefik with automatic Let's Encrypt SSL. TStack enforces a path-prefix routing strategy (e.g., `/ts-be/api/`) instead of subdomains. This significantly reduces DNS record management, enables a single SSL certificate, and natively eliminates CORS headaches since everything shares the same origin.",
    },
    {
      q: 'Do I need to manually configure Docker registries and CI/CD?',
      a: 'No. The CLI interactively configures your preferred registry (GHCR, Docker Hub, or AWS ECR) and generates the corresponding GitHub Actions workflows. It automatically sets up push-to-deploy pipelines for both staging and production environments right out of the box.',
    },
    {
      q: 'What about database clustering and management on simple VPS setups?',
      a: "If you don't want to pay for managed external databases, TStack configures Kamal Postgres Accessories. It runs a fine-tuned Postgres 16 Alpine container with persistent host volumes alongside your application containers, allowing you to run the entire stack on a single $6 droplet.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="py-24 px-6 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-300"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
          {' '}
          Technical FAQ{' '}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-zinc-800 rounded-lg bg-white/50 dark:bg-zinc-900/50 overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="font-bold text-slate-900 dark:text-white"> {faq.q} </span>
                {openIndex === i ? (
                  <ChevronUp size={20} className="text-slate-400 dark:text-zinc-500" />
                ) : (
                  <ChevronDown size={20} className="text-slate-400 dark:text-zinc-500" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-slate-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-slate-100 dark:border-zinc-800/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-center transition-colors duration-300">
    <a
      href="#"
      className="flex items-center justify-center gap-2 text-slate-900 dark:text-white transition-colors cursor-pointer group hover:opacity-80 mb-4"
    >
      <Boxes
        size={24}
        className="stroke-[1.5] group-hover:scale-110 transition-transform duration-300"
      />
      <span className="font-bold text-xl tracking-tight"> tstack </span>
    </a>
    <p className="text-slate-500 dark:text-zinc-500 text-sm">
      {' '}
      Speed by default. Sleek by design. Simple by nature.
    </p>
    <div className="mt-6 text-slate-400 dark:text-zinc-600 text-xs">
      © {new Date().getFullYear()} tstack ecosystem. All rights reserved.
    </div>
  </footer>
);

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('plasma');
  const [isDark, setIsDark] = useState(true);
  const { scrollYProgress } = useScroll();

  const themeKeys = Object.keys(themes);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      // Divide scroll progress into equal segments based on number of themes
      const segmentSize = 1 / themeKeys.length;
      const index = Math.min(Math.floor(latest / segmentSize), themeKeys.length - 1);
      setCurrentTheme(themeKeys[index]);
    });
  }, [scrollYProgress, themeKeys]);

  const themeDef = themes[currentTheme];
  const toggleDark = () => setIsDark(!isDark);

  return (
    <div className={isDark ? 'dark min-h-screen' : 'min-h-screen'}>
      <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-800 dark:text-zinc-200 font-mono transition-colors duration-1000 selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-zinc-800 dark:selection:text-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap');
            body { font-family: 'JetBrains Mono', monospace; scroll-behavior: smooth; }
          `,
          }}
        />
        <Navbar isDark={isDark} toggleDark={toggleDark} />

        {/* Animated Background Gradient Tracker */}
        <motion.div
          className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r ${themeDef.gradient} z-[100] transition-colors duration-1000`}
          style={{
            scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }),
            transformOrigin: '0% 50%',
          }}
        />

        <main className="overflow-hidden">
          <FadeIn>
            <Hero themeDef={themeDef} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <TrustedBy />
          </FadeIn>
          <FadeIn>
            <FeatureMatrix themeDef={themeDef} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <AIAdvantage themeDef={themeDef} />
          </FadeIn>
          <FadeIn>
            <BatteriesIncluded themeDef={themeDef} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Pricing themeDef={themeDef} />
          </FadeIn>
          <FadeIn>
            <AboutCreator themeDef={themeDef} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <WhyPremium themeDef={themeDef} />
          </FadeIn>
          <FadeIn>
            <Ecosystem themeDef={themeDef} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <FAQ />
          </FadeIn>
        </main>
        <Footer />
      </div>
    </div>
  );
}
