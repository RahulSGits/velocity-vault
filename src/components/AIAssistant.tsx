import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ExternalLink, Globe } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { chatWithAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  groundingMetadata?: any;
}

interface AIAssistantProps {
  onNavigate?: (page: string) => void;
}

export function AIAssistant({ onNavigate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Velocity AI. I have real-time access to global markets and can help you navigate this platform. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages as any);
    setIsLoading(true);

    try {
      // Map messages for Gemini (simple conversion)
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error connecting to my real-time data nodes. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] glass overflow-hidden rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl shadow-brand-primary/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-brand-primary/20 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center relative">
                  <Bot size={28} className="text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-4 border-black rounded-full" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg tracking-tight">Velocity AI</h3>
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-brand-primary animate-pulse" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Real-time Grounding Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                      msg.role === 'user' ? "bg-white/10" : "bg-brand-primary/20"
                    )}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-brand-primary" />}
                    </div>
                    <div className={cn(
                      "max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed relative",
                      msg.role === 'user' 
                        ? "bg-brand-primary text-white rounded-tr-none shadow-xl shadow-brand-primary/20" 
                        : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                    )}>
                      {msg.content}
                      {msg.role === 'assistant' && msg.groundingMetadata?.searchEntryPoint && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 flex items-center gap-2">
                            <Sparkles size={10} /> Research Sources
                          </p>
                          <div 
                            className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
                            dangerouslySetInnerHTML={{ __html: msg.groundingMetadata.searchEntryPoint.renderedContent }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-brand-primary" />
                  </div>
                  <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for site navigation or market trends..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-4 rounded-2xl bg-brand-primary text-white shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-2xl shadow-brand-primary/40 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -inset-2 bg-brand-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
        {isOpen ? (
          <X className="text-white relative z-10 w-8 h-8" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <Bot className="text-white w-8 h-8" />
            <Sparkles className="absolute -top-3 -right-3 text-cyan-300 animate-glow" size={16} />
          </div>
        )}
      </motion.button>
    </div>
  );
}

