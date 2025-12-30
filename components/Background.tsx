import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  // Creating a few floating elements for a nice ambient effect
  const orbs = [
    { id: 1, width: 400, height: 400, color: 'bg-indigo-600', initialX: -100, initialY: -100, duration: 20 },
    { id: 2, width: 300, height: 300, color: 'bg-purple-600', initialX: '80vw', initialY: '10vh', duration: 25 },
    { id: 3, width: 500, height: 500, color: 'bg-blue-600', initialX: '20vw', initialY: '80vh', duration: 30 },
    { id: 4, width: 200, height: 200, color: 'bg-cyan-500', initialX: '60vw', initialY: '60vh', duration: 18 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radial Gradient Overlay for vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-0 pointer-events-none" />

      {/* Animated Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full mix-blend-screen filter blur-[80px] opacity-30 ${orb.color}`}
          style={{
            width: orb.width,
            height: orb.height,
            left: 0,
            top: 0,
          }}
          initial={{ x: orb.initialX, y: orb.initialY }}
          animate={{
            x: [orb.initialX, `calc(${Math.random() * 100}vw)`, orb.initialX],
            y: [orb.initialY, `calc(${Math.random() * 100}vh)`, orb.initialY],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};