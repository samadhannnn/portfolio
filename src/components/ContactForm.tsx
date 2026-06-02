"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { Github, Linkedin } from "@/components/icons";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Submit error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">Contact</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Let&apos;s Collaborate
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Left Column: Social Links / Info */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold font-heading text-foreground">Get in touch</h3>
            <p className="text-secondary leading-relaxed">
              If you have an open internship role, a freelance request, a startup opportunity, or just want to chat about AI/ML models or full-stack projects, feel free to fill out the form or write to me directly!
            </p>

            <div className="space-y-4">
              <a
                href="mailto:samadhanbodkhe222@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300"
              >
                <div className="p-2 bg-accent/5 rounded-lg text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">Email</div>
                  <div className="text-sm font-bold text-foreground">samadhanbodkhe222@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:+919309295922"
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300"
              >
                <div className="p-2 bg-accent/5 rounded-lg text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">Phone</div>
                  <div className="text-sm font-bold text-foreground">+91 9309295922</div>
                </div>
              </a>

              <div className="flex gap-4">
                <a
                  href="https://github.com/samadhannnn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-xs font-bold font-heading">GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/samadhan-bodkhe-766308270/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-xs font-bold font-heading">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden">
            {status === "success" ? (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-4 animate-bounce" />
                <h4 className="text-xl font-bold font-heading text-foreground mb-2">Message Sent!</h4>
                <p className="text-sm text-secondary max-w-sm">
                  Thank you for reaching out, Samadhan has received your message and will respond as soon as possible.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 px-5 py-2 text-xs font-bold bg-muted text-foreground border border-border hover:bg-background rounded-lg transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === "error" && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={status === "submitting"}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-65"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={status === "submitting"}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-65"
                    placeholder="jane@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    disabled={status === "submitting"}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-65"
                    placeholder="Tell me about your project, team, or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-3 rounded-lg bg-accent text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-65"
                >
                  {status === "submitting" ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
