'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, MessageCircle, Lock, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-brand-purple/20 text-brand-purple-dark text-sm font-medium px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2 border border-brand-purple/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>The #1 Emotional Gift for 2025</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
        >
          Collect memories. <br />
          <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Unlock emotions.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed"
        >
          Create a digital memory vault where friends answer deep prompts, leave secret messages, and contribute to your AI-generated year wrap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full text-lg px-8 shadow-xl shadow-brand-pink/20 hover:shadow-brand-pink/40 transition-shadow">
              Create Your Wrap <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="rounded-full text-lg px-8">
            View Demo
          </Button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <MessageCircle className="w-6 h-6 text-brand-blue" />,
            title: "Emotional Prompts",
            desc: "Curated questions that dig deeper than 'Happy Birthday'. Discover what your friends really think.",
            color: "bg-brand-blue/20"
          },
          {
            icon: <Lock className="w-6 h-6 text-brand-pink" />,
            title: "Secret Messages",
            desc: "Friends can leave hidden notes that only unlock on a specific date. The ultimate surprise.",
            color: "bg-brand-pink/20"
          },
          {
            icon: <Sparkles className="w-6 h-6 text-brand-purple" />,
            title: "AI Vibe Report",
            desc: "We analyze every response to generate your 'Vibe Score', keywords, and friendship archetype.",
            color: "bg-brand-purple/20"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Use Cases */}
      <section className="w-full bg-white/50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Perfect for every moment</h2>
          <div className="flex flex-wrapjustify-center gap-4">
            {["Birthdays", "Farewells", "New Year", "Anniversaries", "College Batches"].map((tag, i) => (
              <span key={i} className="px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm text-gray-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
