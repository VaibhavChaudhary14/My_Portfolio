"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Copy, Check, Instagram, Linkedin, Twitter, Github, BookOpen } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "14vaibhav2002@gmail.com";
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-paper-blue/20 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full border-2 border-black" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className={`text-4xl md:text-5xl font-black mb-8 inline-block border-2 px-8 py-3 shadow-neobrutalism rotate-1 ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime shadow-[4px_4px_0px_0px_white]' : 'bg-white border-black text-black'}`}
          initial={{ rotate: -5, scale: 0.9 }}
          whileInView={{ rotate: 1, scale: 1 }}
        >
          {theme === 'venom' ? "Summon Us 🕸️" : "Send Me a Note! 📝"}
        </motion.h2>

        <p className={`text-xl font-hand mb-12 max-w-lg mx-auto ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-700'}`}>
          {theme === 'venom'
            ? "We are listening. Speak, or be consumed."
            : "Got a project? A question? Or just want to say hi? My inbox is always open."}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Contact Card */}
          <motion.div
            className={`p-8 border-4 shadow-neobrutalism rounded-sm -rotate-2 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white' : 'bg-white border-black text-black'}`}
            whileHover={{ rotate: 0, scale: 1.02 }}
          >
            <div className={`border-b-2 pb-4 mb-4 flex justify-center ${theme === 'venom' ? 'border-venom-slime' : 'border-black'}`}>
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-gray-200 border-black text-black'}`}>
                <Mail size={32} />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{theme === 'venom' ? "Signal Us At:" : "Email Me At:"}</h3>
            <div className={`p-4 border-2 font-mono text-sm break-all mb-4 relative ${theme === 'venom' ? 'bg-black border-venom-slime text-gray-300' : 'bg-paper-yellow border-black text-black'}`}>
              {email}
              <button
                onClick={handleCopy}
                className={`absolute -top-3 -right-3 p-2 rounded-full hover:scale-110 transition-transform ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <a
              href={`mailto:${email}`}
              className={`block w-full py-3 font-bold border-2 shadow-neobrutalism-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${theme === 'venom' ? 'bg-venom-slime border-venom-slime text-black' : 'bg-purple-500 border-black text-white'}`}
            >
              {theme === 'venom' ? "Initiate Link" : "Send Mail"}
            </a>
          </motion.div>

          {/* Socials Card */}
          <motion.div
            className={`p-8 border-4 shadow-neobrutalism rounded-sm rotate-2 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white' : 'bg-white border-black text-black'}`}
            whileHover={{ rotate: 0, scale: 1.02 }}
          >
            <h3 className="font-bold text-2xl mb-6">{theme === 'venom' ? "The Web" : "Find me on the web"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="https://github.com/VaibhavChaudhary14" target="_blank" className={`flex flex-col items-center gap-2 p-4 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-gray-100 border-black hover:bg-gray-200'}`}>
                <Github size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-black'} />
                <span className="font-bold text-sm">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/vaibhavchaudhary14" target="_blank" className={`flex flex-col items-center gap-2 p-4 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-blue-100 border-black hover:bg-blue-200'}`}>
                <Linkedin size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-blue-700'} />
                <span className="font-bold text-sm">LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/bepvt.vaibhav/" target="_blank" className={`flex flex-col items-center gap-2 p-4 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-pink-100 border-black hover:bg-pink-200'}`}>
                <Instagram size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-pink-600'} />
                <span className="font-bold text-sm">Instagram</span>
              </a>
              <a href="https://x.com/Vaibhav_14ry " target="_blank" className={`flex flex-col items-center gap-2 p-4 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-sky-100 border-black hover:bg-sky-200'}`}>
                <Twitter size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-sky-500'} />
                <span className="font-bold text-sm">Twitter</span>
              </a>
              <a href="https://medium.com/@vaibhav_14ry" target="_blank" className={`flex flex-col items-center gap-2 p-4 border-2 col-span-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-yellow-100 border-black hover:bg-yellow-200'}`}>
                <BookOpen size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-black'} />
                <span className="font-bold text-sm">Medium (Blog)</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
