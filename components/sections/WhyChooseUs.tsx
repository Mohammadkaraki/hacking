'use client';

import { motion } from 'framer-motion';
import { features } from '@/data/features';
import SectionContainer from '@/components/ui/SectionContainer';
import SectionHeading from '@/components/ui/SectionHeading';

export default function WhyChooseUs() {
  return (
    <SectionContainer id="why-choose-us" className="bg-gradient-to-b from-black via-primary-dark/80 to-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <SectionHeading
        preheading="⚡ ARSENAL UNLOCKED"
        heading="Built for Domination"
        subheading="Everything you need to breach, exploit, and own any target in your path"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan rounded-2xl opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-500"></div>

            <div className="relative bg-gradient-to-br from-black/90 via-primary-dark/80 to-black/90 border-2 border-accent-cyan/20 rounded-2xl p-8 h-full backdrop-blur-xl transition-all duration-500 hover:border-accent-cyan overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-16 h-16">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-accent-cyan to-transparent"></div>
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-accent-cyan to-transparent"></div>
              </div>

              {/* Icon with animated glow */}
              <motion.div
                className="relative mb-6"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_25px_rgba(0,255,65,0.8)]">
                  {feature.icon}
                </div>
                {/* Pulse effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-accent-cyan/30 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-heading font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-cyan group-hover:to-accent-blue transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Progress bar animation */}
              <div className="mt-6 h-1 bg-primary-dark/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                ></motion.div>
              </div>

              {/* Hover scan line */}
              <motion.div
                className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-accent-cyan/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100"
                animate={{
                  y: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>

              {/* Status indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                ></motion.div>
                <span className="text-xs font-mono text-green-500 opacity-70">ACTIVE</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
