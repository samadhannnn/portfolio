"use client";

import { GraduationCap, Briefcase, Calendar, Award } from "lucide-react";

export default function AboutSection() {
  const education = [
    {
      institution: "Deogiri Institute of Engineering and Management Studies",
      degree: "Bachelor of Engineering (B.E.) in Artificial Intelligence & Machine Learning",
      duration: "2023 - 2027 (Expected)",
      details: "Pursuing deep knowledge in neural networks, computer vision, data structures, analysis of algorithms, database management, and mathematical foundations for Machine Learning models.",
    },
    {
      institution: "CSMSS College of Polytechnic, Chhatrapati Sambhajinagar",
      degree: "Diploma in Computer Engineering",
      duration: "2020 - 2023",
      details: "Graduated with a stellar aggregate score of 90.71%. Mastered fundamental computing concepts, object-oriented programming, data structures, and database principles.",
    },
  ];

  const experience = [
    {
      company: "Angel Infotech",
      role: "Web Development Intern",
      duration: "June 2023 - July 2023",
      details: "Engineered web products using PHP, Laravel, HTML, CSS, JavaScript, and Bootstrap. Collaborated in a 4-person team to debug issues and build a responsive watch-themed commerce system.",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-accent font-extrabold">About Me</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            My Journey & Background
          </p>
          <div className="h-1 w-12 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold font-heading text-foreground">
              Bridging Software Engineering & Machine Learning
            </h3>
            
            <p className="text-secondary leading-relaxed">
              I am a Computer Science student majoring in **Artificial Intelligence and Machine Learning**. My journey started with full-stack web development, where I fell in love with creating clean interfaces and scalable server code. Over time, my curiosity led me to explore the intelligence layers driving modern applications, leading me to delve deeply into **Deep Learning, Neural Architectures, and Decentralized Networks**.
            </p>

            <p className="text-secondary leading-relaxed">
              My engineering philosophy centers on **usability and accuracy**. I believe machine learning algorithms shouldn&apos;t live in isolation. They need robust, responsive interfaces, reliable data pipelines, and scalable APIs to truly make a business or user impact. I build models using TensorFlow and Keras, but I also build their production deployment shells using Next.js, Node.js, and databases like PostgreSQL.
            </p>

            <div className="p-5 rounded-lg border border-border bg-card/60">
              <h4 className="font-bold font-heading text-foreground mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" /> Professional Goals
              </h4>
              <p className="text-sm text-secondary leading-relaxed">
                I am actively seeking internship opportunities where I can apply my skills in full-stack engineering, Python ML pipelines, or decentralized Solidity smart contracts. I thrive in agile teams, love debugging hard problems, and enjoy contributing to open-source software.
              </p>
            </div>
          </div>

          {/* Right Column: Timelines */}
          <div className="lg:col-span-6 space-y-10">
            
            {/* Experience Timeline */}
            <div id="experience" className="scroll-mt-20">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold font-heading text-foreground">Experience</h3>
              </div>
              <div className="space-y-6 border-l border-border pl-6 ml-2 relative">
                {experience.map((exp, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background group-hover:scale-125 transition-transform duration-200" />
                    <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mt-1">{exp.role}</h4>
                    <span className="text-xs text-accent font-semibold">{exp.company}</span>
                    <p className="text-sm text-secondary mt-2 leading-relaxed">{exp.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold font-heading text-foreground">Education</h3>
              </div>
              <div className="space-y-8 border-l border-border pl-6 ml-2 relative">
                {education.map((edu, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background group-hover:scale-125 transition-transform duration-200" />
                    <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.duration}</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground mt-1">{edu.degree}</h4>
                    <span className="text-xs text-accent font-semibold">{edu.institution}</span>
                    <p className="text-sm text-secondary mt-2 leading-relaxed">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
