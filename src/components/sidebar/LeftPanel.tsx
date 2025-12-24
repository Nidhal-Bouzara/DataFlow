"use client";

import { cn } from "@/lib/utils";
import { Home, Workflow, Database, Settings, HelpCircle, Mail, Linkedin, Github, Instagram, Youtube, PhoneCall } from "lucide-react";
import { AppLogo } from "@/components/icons/BrandIcons";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", isActive: true },
  { icon: <Workflow className="w-5 h-5" />, label: "Workflows" },
  { icon: <Database className="w-5 h-5" />, label: "Assets" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

export function LeftPanel() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHelpHovered, setIsHelpHovered] = useState(false);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);

  return (
    <aside className="w-16 bg-neutral-900 flex flex-col items-center py-4 gap-1">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4">
        <AppLogo size={24} className="text-neutral-900" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item, index) => (
          <motion.div key={index} className="relative" onHoverStart={() => setHoveredNavIndex(index)} onHoverEnd={() => setHoveredNavIndex(null)}>
            <button
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                item.isActive ? "bg-neutral-700 text-white hover:bg-neutral-600" : "text-neutral-600 cursor-not-allowed opacity-50"
              )}
              title={item.label}
              disabled={!item.isActive}
            >
              {item.icon}
            </button>

            {/* Under Construction Tooltip */}
            <AnimatePresence>
              {!item.isActive && hoveredNavIndex === index && (
                <motion.div
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50"
                  initial={{ opacity: 0, x: -10, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: -10,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap"
                    initial={{ rotateY: -15 }}
                    animate={{
                      rotateY: 0,
                      transition: { duration: 0.3 },
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.p className="text-neutral-300 text-xs font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      🚧 Under Construction 🏗️
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col items-center gap-1">
        <motion.div className="relative" onHoverStart={() => setIsHelpHovered(true)} onHoverEnd={() => setIsHelpHovered(false)}>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Help Tooltip */}
          <AnimatePresence>
            {isHelpHovered && (
              <motion.div
                className="absolute left-full ml-2 bottom-0 z-50"
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl min-w-[250px] max-w-[300px]"
                  initial={{ rotateY: -15 }}
                  animate={{
                    rotateY: 0,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.h3 className="text-white text-sm font-bold mb-2" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    🚀 DataFlow Builder
                  </motion.h3>
                  <motion.p className="text-neutral-300 text-xs leading-relaxed" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    A visual workflow editor for building data processing pipelines. Drag and drop nodes to extract, process, and transform data with ease.
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Creator Section */}
        <motion.div
          className="relative flex flex-col items-center gap-2 pt-2 border-t border-neutral-800"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className="w-10 h-10 rounded-full cursor-pointer relative"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: {
                rotate: { duration: 0.5, ease: "easeInOut" },
                scale: { duration: 0.2 },
              },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full p-[2px]"
              animate={{
                background: [
                  "linear-gradient(0deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(60deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(120deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(180deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(240deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(300deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                  "linear-gradient(360deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)",
                ],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              style={{
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src="/nidhal.png" alt="Creator - Nidhal" width={40} height={40} className="object-cover" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute left-full ml-2 bottom-0 z-50"
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                  scale: 0.9,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.div
                  className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl min-w-[200px]"
                  initial={{ rotateY: -15 }}
                  animate={{
                    rotateY: 0,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.p className="text-white text-sm font-medium mb-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    Created by{" "}
                    <motion.a
                      href="https://anis.codes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer font-bold"
                      whileHover="hover"
                      initial="initial"
                    >
                      <span className="mr-1">🔗</span>
                      {["A", "n", "i", "s"].map((letter, index) => (
                        <motion.span
                          key={index}
                          variants={{
                            initial: { color: "#ffffff" },
                            hover: {
                              color: [
                                "#ef4444", // red
                                "#f59e0b", // orange
                                "#10b981", // green
                                "#3b82f6", // blue
                                "#8b5cf6", // purple
                                "#ec4899", // pink
                                "#ef4444", // red
                              ],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: index * 0.1,
                              },
                            },
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.a>
                  </motion.p>
                  <motion.p className="text-neutral-400 text-xs mb-3" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    Get in touch
                  </motion.p>
                  <motion.div className="grid grid-cols-3 gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    {[
                      { href: "mailto:nidhalanis.bouzara@icloud.com", icon: Mail, title: "Email" },
                      { href: "https://www.linkedin.com/in/nidhal-bouzara/", icon: Linkedin, title: "LinkedIn" },
                      { href: "https://github.com/Nidhal-Bouzara", icon: Github, title: "GitHub" },
                      { href: "https://www.instagram.com/nidhal.bouzara/", icon: Instagram, title: "Instagram" },
                      { href: "https://www.youtube.com/@NidhalAB", icon: Youtube, title: "YouTube" },
                      { href: "tel:+213771274081", icon: PhoneCall, title: "Phone" },
                    ].map((link, index) => (
                      <motion.a
                        key={link.title}
                        href={link.href}
                        className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors"
                        title={link.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.25 + index * 0.05 },
                        }}
                        whileHover={{
                          scale: 1.15,
                          backgroundColor: "rgb(59, 130, 246)",
                          color: "rgb(255, 255, 255)",
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 },
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <link.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </aside>
  );
}
