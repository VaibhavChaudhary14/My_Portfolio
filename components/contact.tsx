"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Copy, Check, Github, Linkedin, Twitter, BookOpen, Instagram, Loader2 } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useForm } from "react-hook-form";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "14vaibhav2002@gmail.com";
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-paper-blue/20 relative overflow-hidden dark:bg-black">
      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-20">
        <div className="w-full h-full border-2 border-black dark:border-venom-slime" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className={`text-4xl md:text-5xl font-black mb-8 inline-block border-2 px-8 py-3 shadow-neobrutalism rotate-1 ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime shadow-[4px_4px_0px_0px_white]' : 'bg-white border-black text-black'}`}
            initial={{ rotate: -5, scale: 0.9 }}
            whileInView={{ rotate: 1, scale: 1 }}
          >
            {theme === 'venom' ? "Summon Us 🕸️" : "Send Me a Note! 📝"}
          </motion.h2>

          <p className={`text-xl font-hand mb-6 max-w-lg mx-auto ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-700'}`}>
            {theme === 'venom'
              ? "We are listening. Speak, or be consumed."
              : "Got a project? A question? Or just want to say hi? My inbox is always open."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          {/* Form Section */}
          <motion.div
            className={`p-8 border-4 shadow-neobrutalism rounded-lg ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black'}`}
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
          >
            <h3 className={`text-2xl font-black mb-6 ${theme === "venom" ? "text-white" : "text-black"}`}>
              {status === "success" ? "Message Received! 🚀" : "Drop a Message"}
            </h3>

            {status === "success" ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                <p className="font-bold">Thanks for reaching out!</p>
                <p>I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Name</label>
                  <input
                    {...register("name", { required: true })}
                    className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${theme === "venom" ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]" : "bg-gray-50 border-black focus:shadow-neobrutalism"}`}
                    placeholder="Jon Doe"
                  />
                </div>
                <div>
                  <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Email</label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${theme === "venom" ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]" : "bg-gray-50 border-black focus:shadow-neobrutalism"}`}
                    placeholder="jon@example.com"
                  />
                </div>
                <div>
                  <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Message</label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${theme === "venom" ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]" : "bg-gray-50 border-black focus:shadow-neobrutalism"}`}
                    placeholder="Let's build something awesome..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`w-full py-4 font-black text-lg border-2 shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${theme === "venom" ? "bg-venom-slime border-venom-slime text-black" : "bg-black border-black text-white"}`}
                >
                  {status === "submitting" ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
                {status === "error" && <p className="text-red-500 font-bold text-sm mt-2">Something went wrong. Please try again.</p>}
              </form>
            )}
          </motion.div>

          {/* Socials & Info */}
          <div className="flex flex-col gap-6">
            <motion.div
              className={`p-6 border-4 shadow-neobrutalism rounded-lg ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white' : 'bg-white border-black text-black'}`}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Direct Email
              </h3>
              <div className={`p-4 border-2 font-mono text-sm break-all relative group ${theme === 'venom' ? 'bg-black border-venom-slime text-gray-300' : 'bg-paper-yellow border-black text-black'}`}>
                {email}
                <button
                  onClick={handleCopy}
                  className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full hover:scale-110 transition-transform ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className={`p-6 border-4 shadow-neobrutalism rounded-lg flex-1 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white' : 'bg-white border-black text-black'}`}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-lg mb-4">Socials</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="https://github.com/VaibhavChaudhary14" target="_blank" className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-gray-100 border-black hover:bg-gray-200'}`}>
                  <Github size={20} className={theme === 'venom' ? 'text-venom-slime' : 'text-black'} />
                  <span className="font-bold text-xs">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/vaibhavchaudhary14" target="_blank" className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-blue-100 border-black hover:bg-blue-200'}`}>
                  <Linkedin size={20} className={theme === 'venom' ? 'text-venom-slime' : 'text-blue-700'} />
                  <span className="font-bold text-xs">LinkedIn</span>
                </a>
                <a href="https://x.com/Vaibhav_14ry" target="_blank" className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-sky-100 border-black hover:bg-sky-200'}`}>
                  <Twitter size={20} className={theme === 'venom' ? 'text-venom-slime' : 'text-sky-500'} />
                  <span className="font-bold text-xs">Twitter</span>
                </a>
                <a href="https://medium.com/@vaibhav_14ry" target="_blank" className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-yellow-100 border-black hover:bg-yellow-200'}`}>
                  <BookOpen size={20} className={theme === 'venom' ? 'text-venom-slime' : 'text-black'} />
                  <span className="font-bold text-xs">Medium</span>
                </a>
                <a href="https://www.instagram.com/bepvt.vaibhav/" target="_blank" className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${theme === 'venom' ? 'bg-black border-venom-slime hover:bg-venom-slime/10' : 'bg-pink-100 border-black hover:bg-pink-200'}`}>
                  <Instagram size={20} className={theme === 'venom' ? 'text-venom-slime' : 'text-pink-600'} />
                  <span className="font-bold text-xs">Instagram</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
