import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Hammer, Github, Linkedin, Facebook, Instagram } from 'lucide-react';

// Custom X (formerly Twitter) logo component
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export const Placeholder: React.FC = () => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.main
      className="flex flex-col items-center justify-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Icon / Logo Area */}
      <motion.div variants={itemVariants} className="mb-8 relative">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md flex items-center justify-center shadow-2xl relative z-10">
            <Hammer className="w-10 h-10 text-indigo-400" />
        </div>
        {/* Decorative pulse behind the icon */}
        <motion.div 
            className="absolute inset-0 rounded-full bg-indigo-500/20 z-0"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main Headlines */}
      <motion.h1 
        variants={itemVariants} 
        className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-lg"
      >
        Jakub Prądzyński
      </motion.h1>
      
      <motion.h2 
        variants={itemVariants} 
        className="text-xl md:text-2xl text-slate-300 font-light mb-8 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Strona w budowie
      </motion.h2>

      <motion.p 
        variants={itemVariants} 
        className="text-slate-400 max-w-md mx-auto leading-relaxed mb-10"
      >
        Aktualnie pracuję nad nową wersją mojego portfolio. 
        Wkrótce pojawi się tutaj coś wyjątkowego. 
        W międzyczasie zapraszam do kontaktu.
      </motion.p>

      {/* Social Links */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-wrap gap-4 justify-center"
      >
        <SocialButton href="https://www.linkedin.com/in/jakubpradzynski/" icon={<Linkedin size={20} />} label="LinkedIn" />
        <SocialButton href="https://x.com/PradzynskiJakub" icon={<XIcon size={18} />} label="X" />
        <SocialButton href="https://www.facebook.com/jakub.pradzynski" icon={<Facebook size={20} />} label="Facebook" />
        <SocialButton href="https://www.instagram.com/jakubpradzynski/" icon={<Instagram size={20} />} label="Instagram" />
        <SocialButton href="https://github.com/jakubpradzynski" icon={<Github size={20} />} label="GitHub" />
      </motion.div>
      
      {/* Footer / Status */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 text-xs text-slate-600 font-mono uppercase tracking-widest"
      >
        &copy; {new Date().getFullYear()} Jakub Prądzyński
      </motion.div>
    </motion.main>
  );
};

interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Odwiedź mój profil na ${label}`}
      className="group relative px-6 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm 
                 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-indigo-500/50 transition-all duration-300
                 flex items-center gap-2 overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </span>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
};