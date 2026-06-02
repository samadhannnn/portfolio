"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface SamAIProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function SamAI({ isOpen, onClose, onOpen }: SamAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am **SAM AI**, Samadhan's virtual assistant. Ask me anything about his skills, experience, blockchain projects, or why you should hire him!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Who is Samadhan?",
    "What projects has he built?",
    "What technologies does he know?",
    "What is his experience?",
    "Why should I hire him?",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await response.json();
      const botMsg: Message = {
        sender: "bot",
        text: data.answer || "Sorry, I encountered an issue. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        sender: "bot",
        text: "I could not reach the server. Please verify your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse basic bold markdown
  const parseMarkdown = (text: string) => {
    // Split by lines
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const content = line;
      
      // Bold syntax: **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-foreground">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const parsedLine = parts.length > 0 ? parts : content;

      // Unordered lists: * text or - text
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-sm my-1 text-secondary">
            {parsedLine.length ? (Array.isArray(parsedLine) ? parsedLine.slice(0) : line.substring(2)) : line.substring(2)}
          </li>
        );
      }

      // Headers: ### text or ## text
      if (line.startsWith("### ")) {
        return <h4 key={lIdx} className="text-sm font-bold font-heading text-foreground mt-3 mb-1">{line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={lIdx} className="text-md font-bold font-heading text-foreground mt-4 mb-2">{line.substring(3)}</h3>;
      }
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
        return (
          <li key={lIdx} className="ml-4 list-decimal text-sm my-1 text-secondary">
            {line.substring(3)}
          </li>
        );
      }

      return <p key={lIdx} className="text-sm my-1 leading-relaxed text-secondary">{parsedLine}</p>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isOpen ? onClose : onOpen}
          className="p-4 rounded-full bg-accent text-white shadow-xl shadow-accent/25 flex items-center justify-center border border-accent/20 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-foreground">SAM AI</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Responder
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-secondary hover:text-foreground p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      msg.sender === "user"
                        ? "bg-accent text-white"
                        : "bg-muted text-secondary border border-border"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  
                  <div
                    className={`p-3 rounded-xl border text-sm ${
                      msg.sender === "user"
                        ? "bg-accent/5 border-accent/20 text-foreground rounded-tr-none"
                        : "bg-card border-border rounded-tl-none"
                    }`}
                  >
                    {parseMarkdown(msg.text)}
                  </div>
                </div>
              ))}

              {/* Typing indicator bubble */}
              {loading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-muted text-secondary border border-border flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-card rounded-tl-none flex items-center justify-center h-9">
                    <div className="typing-dots flex gap-1">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Chips (Only visible if the convo is empty or at the start) */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 border-t border-border/40 bg-muted/20">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-accent" /> Suggested Questions
                </span>
                <div className="flex flex-col gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left text-xs font-medium py-1.5 px-3 rounded-lg border border-border bg-card text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent/5 flex items-center justify-between group transition-all duration-200"
                    >
                      {q}
                      <ArrowRight className="w-3 h-3 text-secondary group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border bg-card flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about project, experience..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-grow text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-accent text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-accent transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
