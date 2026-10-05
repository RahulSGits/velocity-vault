import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, User, Send, Sparkles, Loader2, Globe, Command, Info } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { chatWithAI } from '../services/geminiService';
import { AdUnit } from '../components/AdUnit';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  groundingMetadata?: any;
}

interface ChatProps {
  onNavigate?: (page: string) => void;
}

export function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Protocol Initiated. I am Velocity AI, connected to global real-time indices. How can I augment your financial strategy today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages as any);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const aiResponse = await chatWithAI(chatHistory, userMessage, onNavigate);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.text,
        groundingMetadata: aiResponse.groundingMetadata
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection failure to real-time nodes. Retrying synchronization...' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 pt-24 md:pt-32 pb-12 gap-6 md:gap-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10">
        <div className="flex items-center gap-4 md:gap-6 text-center md:text-left flex-col md:flex-row">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/20 relative">
            <Bot size={28} className="md:text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 border-2 md:border-4 border-black rounded-full" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight mb-1">Velocity Terminal</h1>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Globe size={12} className="text-brand-primary animate-pulse" />
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Real-time Grounding Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
            <Command size={12} className="text-brand-primary" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">GPT-4 Omni</span>
          </div>
          <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
            <Sparkles size={12} className="text-cyan-400" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-50">Market Aware</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 h-[60vh] md:h-full md:min-h-[600px]">
        {/* Chat Main Area */}
        <div className="lg:col-span-3 flex flex-col glass rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden relative">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 md:gap-6",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                    msg.role === 'user' ? "bg-white/10 border border-white/10" : "bg-brand-primary/20 border border-brand-primary/20"
                  )}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-brand-primary" />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] md:max-w-[75%] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-sm md:text-base leading-relaxed relative shadow-2xl",
                    msg.role === 'user' 
                      ? "bg-brand-primary text-white rounded-tr-none" 
                      : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                  )}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.role === 'assistant' && msg.groundingMetadata?.searchEntryPoint && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 md:mb-3 flex items-center gap-2">
                          <Sparkles size={10} /> Research Validated
                        </p>
                        <div 
                          className="bg-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/5 text-[10px] md:text-xs text-brand-primary"
                          dangerouslySetInnerHTML={{ __html: msg.groundingMetadata.searchEntryPoint.renderedContent }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-3 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-primary/20 border border-brand-primary/20 flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin text-brand-primary" />
                </div>
                <div className="bg-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] rounded-tl-none border border-white/5">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-brand-primary animate-bounce shadow-glow" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s] shadow-glow" />
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s] shadow-glow" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-8 border-t border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="relative flex items-center gap-2 md:gap-4 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query market trends..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-8 py-3 md:py-5 text-sm md:text-base focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-brand-primary text-white shadow-2xl shadow-brand-primary/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Sidebar */}
        <div className="hidden lg:flex flex-col gap-8">
          <div className="glass p-8 rounded-[3rem] border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
              <Info size={14} /> Intelligence Info
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Context Window</p>
                <p className="text-sm text-white/70">128k Tokens Optimized</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Latency</p>
                <p className="text-sm text-white/70">~1.2s Real-time Sweep</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                <p className="text-[10px] font-bold text-brand-primary uppercase mb-1">Source Graph</p>
                <p className="text-sm text-white/70">Google Index v3.1</p>
              </div>
            </div>
          </div>

          <AdUnit slot="chat_sidebar" className="my-0" />
          
          <div className="glass p-8 rounded-[3rem] border border-white/10 flex-1 bg-gradient-to-br from-brand-primary/10 to-transparent">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Command Tips</h3>
            <ul className="space-y-3 text-xs text-white/60">
              <li className="flex gap-2">
                <span className="text-brand-primary">•</span>
                "How is the Nifty 50 performing today?"
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary">•</span>
                "Take me to the SIP calculator."
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary">•</span>
                "What are the latest tax changes?"
              </li>
              <li className="flex gap-2">
                <span className="text-brand-primary">•</span>
                "Analyze a 50k monthly SIP for 10 years."
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
