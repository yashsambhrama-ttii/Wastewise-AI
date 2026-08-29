import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Truck, 
  UserCheck, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Smartphone,
  ChevronDown,
  Layers,
  Cpu,
  Zap,
  Leaf
} from 'lucide-react';
import { UserRole } from '../types';
import { ElegantBackground } from './ElegantBackground';

interface LandingPageProps {
  onGetStarted: (preferredRole?: UserRole) => void;
  onOpenSignIn: (preferredRole?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenSignIn
}) => {
  const scrollToRoles = () => {
    const el = document.getElementById('roles-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0D0F] text-[#F1F3F4] flex flex-col selection:bg-emerald-500/30 relative overflow-x-hidden">
      {/* Interactive & Subtle Ambient Dynamic Background */}
      <ElegantBackground />

      {/* Top Welcome Bar */}
      <motion.header 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-16 border-b border-[#272D33]/80 bg-[#111417]/85 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#F1F3F4]">
              WasteWise <span className="text-emerald-500 font-extrabold">AI</span>
            </span>
            <span className="ml-2 text-[10px] bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded font-mono hidden sm:inline-block">
              Bengaluru Municipal Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenSignIn('admin')}
            className="text-xs font-bold text-[#9AA3AD] hover:text-[#F1F3F4] px-3 py-2 transition-colors hidden sm:block"
          >
            Municipal Officer Sign In
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToRoles}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm border border-emerald-500/40 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* Animated Pop-Up Headline */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F1F3F4] leading-[1.15]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block"
            >
              Intelligent Urban Waste &amp;
            </motion.span>
            <br />
            <motion.span 
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.25,
                type: 'spring',
                stiffness: 120,
                damping: 14 
              }}
              className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm font-black"
            >
              AI Fleet Route Dispatching
            </motion.span>
          </h1>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-6 text-base sm:text-lg text-[#9AA3AD] max-w-2xl leading-relaxed"
        >
          WasteWise AI connects smart IoT sensor bins, dynamic driver route optimization, 
          and community reporting to eliminate overflowing dumpsters and cut municipal fuel costs by up to 28%.
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3.5"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToRoles}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950/50 border border-emerald-500/40 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Explore Roles &amp; Get Started</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenSignIn()}
            className="w-full sm:w-auto bg-[#171B1F]/90 hover:bg-[#1C2126] text-[#F1F3F4] font-bold px-6 py-3.5 rounded-xl transition-all border border-[#272D33] text-sm backdrop-blur-sm cursor-pointer"
          >
            Sign In to Existing Account
          </motion.button>
        </motion.div>

        {/* Platform Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl relative z-10"
        >
          {[
            { label: 'Smart Telemetry Bins', val: '48+', sub: 'Real-time IoT Sensors' },
            { label: 'Carbon Reduction', val: '-28.4%', sub: 'Optimized Route Dispatch' },
            { label: 'Response Time', val: '< 35 min', sub: 'Critical Surge Triage' },
            { label: 'Citizen Reports Resolved', val: '99.2%', sub: 'Civic Community Verified' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.4)' }}
              className="bg-[#111417]/80 backdrop-blur-md p-4 rounded-2xl border border-[#272D33]/90 text-left transition-all shadow-sm"
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F1F3F4] tracking-tight">{stat.val}</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">{stat.label}</div>
              <div className="text-[10px] text-[#68717B] mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Walkthrough Showcase */}
      <section className="py-16 px-4 sm:px-8 border-t border-[#272D33]/80 bg-[#111417]/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Platform Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F1F3F4] mt-2">
              Three Pillars of Intelligent Waste Logistics
            </h2>
            <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
              Sign in with your role below to access the specific workflow tailored to your responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#111417]/80 backdrop-blur-md p-6 rounded-2xl border border-[#272D33]/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#F1F3F4]">1. IoT Sensor Telemetry &amp; Maps</h3>
                <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                  Ultrasound sensors continuously stream bin fill percentages, internal temperatures, and battery health to prevent overflows before they happen.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#272D33]/60 text-[11px] text-[#68717B]">
                Used by: <strong className="text-[#9AA3AD]">Municipal Ops &amp; Admins</strong>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-[#111417]/80 backdrop-blur-md p-6 rounded-2xl border border-[#272D33]/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#F1F3F4]">2. Dynamic Driver Route Optimization</h3>
                <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                  Sanitation trucks follow algorithmically sequenced stops prioritized by fill urgency, traffic corridors, and vehicle payload capacity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#272D33]/60 text-[11px] text-[#68717B]">
                Used by: <strong className="text-[#9AA3AD]">Sanitation Fleet Drivers</strong>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-[#111417]/80 backdrop-blur-md p-6 rounded-2xl border border-[#272D33]/80 hover:border-purple-500/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/80 text-purple-400 flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#F1F3F4]">3. Community Citizen Reporting</h3>
                <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                  Residents upload photos of street spills, earn civic eco-points, and trigger emergency municipal collection dispatches in real time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#272D33]/60 text-[11px] text-[#68717B]">
                Used by: <strong className="text-[#9AA3AD]">Neighborhood Residents &amp; Citizens</strong>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role Selection & Get Started Section */}
      <section id="roles-section" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Get Started</span>
          <h2 className="text-3xl font-extrabold text-[#F1F3F4] mt-2">
            Choose Your Profile to Enter
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA3AD] mt-2">
            Sign in or create an account to unlock your designated control terminal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Municipal Admin */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-[#111417]/85 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-[#272D33] hover:border-emerald-500/60 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#171B1F] border border-[#272D33] text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] rounded">
                  Full Access
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F1F3F4]">Municipal Admin Officer</h3>
              <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                Control room view with live Bengaluru map, AI route generator, sensor telemetry, predictive charts, and fleet telemetry.
              </p>

              <div className="my-3 px-2.5 py-1.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-[10px] text-emerald-300 font-mono">
                🔑 Requires Code: <span className="font-bold underline">admin@123</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-[#9AA3AD]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time IoT container status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>AI Route dispatch &amp; traffic analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Gemini Municipal Consultant AI</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#272D33]/80 space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenSignIn('admin')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Sign In as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Card 2: Fleet Driver */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-[#111417]/85 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-[#272D33] hover:border-cyan-500/60 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#171B1F] border border-[#272D33] text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] rounded">
                  Field Terminal
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F1F3F4]">Sanitation Fleet Driver</h3>
              <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                Clean mobile-optimized task list showing active stops in sequence, turn-by-turn map, and one-tap collection confirmation.
              </p>

              <div className="my-3 px-2.5 py-1.5 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-[10px] text-cyan-300 font-mono">
                🔑 Requires Code: <span className="font-bold underline">driver@123</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-[#9AA3AD]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Turn-by-turn stop sequence</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>One-tap &quot;Mark as Collected&quot;</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Real-time critical overflow alerts</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#272D33]/80 space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenSignIn('driver')}
                className="w-full bg-[#1C2126] hover:bg-[#272D33] text-[#F1F3F4] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-[#272D33] cursor-pointer"
              >
                <span>Sign In as Driver</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Card 3: Citizen / Resident */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-[#111417]/85 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-[#272D33] hover:border-purple-500/60 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#171B1F] border border-[#272D33] text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] rounded">
                  Public Citizen
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F1F3F4]">Resident / Citizen</h3>
              <p className="text-xs text-[#9AA3AD] mt-2 leading-relaxed">
                Report street trash, overflowing neighborhood bins, track resolution status, and earn civic eco-points.
              </p>

              <div className="my-3 px-2.5 py-1.5 bg-[#171B1F] border border-[#272D33] rounded-lg text-[10px] text-[#9AA3AD]">
                ✨ Open Access · <span className="text-emerald-400 font-bold">No code required</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-[#9AA3AD]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Photo spill upload &amp; geolocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Track municipal cleanup status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Civic eco-points &amp; leaderboard</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#272D33]/80 space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenSignIn('citizen')}
                className="w-full bg-[#1C2126] hover:bg-[#272D33] text-[#F1F3F4] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-[#272D33] cursor-pointer"
              >
                <span>Sign In as Citizen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#272D33]/80 py-8 px-4 sm:px-8 bg-[#111417]/90 backdrop-blur-md text-center text-xs text-[#68717B] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-[#9AA3AD]">WasteWise AI Platform</span>
            <span>· Built for Smart Municipalities</span>
          </div>
          <div>
            Bengaluru Urban Solid Waste Management Initiative
          </div>
        </div>
      </footer>
    </div>
  );
};
