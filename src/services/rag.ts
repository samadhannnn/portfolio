export interface KnowledgeChunk {
  id: string;
  category: "about" | "projects" | "skills" | "experience" | "education" | "certifications" | "contact" | "general";
  title: string;
  content: string;
  tags: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "about-1",
    category: "about",
    title: "About Samadhan Bodkhe",
    content: "Samadhan Bodkhe is an AI & Machine Learning Engineer, Software Engineer, and Full Stack Developer. Currently, he is a Computer Science (AIML) student at Deogiri Institute of Engineering and Management Studies, Chhatrapati Sambhajinagar, expected to graduate in 2027. He has a solid foundation in building scalable full-stack web applications, machine learning workflows, and deep learning neural networks. He is passionate about solving complex real-world engineering problems and is looking for a Full Stack Developer Intern or AI/ML Engineer Intern position.",
    tags: ["who", "samadhan", "bodkhe", "about", "bio", "profile", "engineer", "student", "role", "hire"]
  },
  {
    id: "about-2",
    category: "about",
    title: "Engineering Philosophy & Vision",
    content: "Samadhan believes in combining robust software engineering principles with cutting-edge AI and Machine Learning technologies. His career vision is to develop AI-powered applications that improve daily human life, optimize processes, and provide high security. He is particularly interested in Deep Learning, Blockchain, Computer Vision, and Generative AI, aiming to bridge the gap between complex research and production-ready applications.",
    tags: ["philosophy", "vision", "interests", "ai", "machine learning", "blockchain", "goals"]
  },
  {
    id: "skills-1",
    category: "skills",
    title: "Programming Languages",
    content: "Samadhan is proficient in multiple programming languages, including: Java, Python (for AI/ML and scripting), C, C++, and JavaScript/TypeScript (for full-stack development). According to GitHub data, Python and JavaScript/TypeScript represent his most frequently used and deep-dive languages.",
    tags: ["languages", "programming", "python", "javascript", "typescript", "java", "c", "c++"]
  },
  {
    id: "skills-2",
    category: "skills",
    title: "Frontend Technologies",
    content: "For client-side development, Samadhan uses React.js, Next.js (App Router), Tailwind CSS, Framer Motion, HTML5, CSS3, and Bootstrap. He focuses on modern, premium, glassmorphic, and highly interactive user interfaces that deliver exceptional UX.",
    tags: ["frontend", "react", "next.js", "tailwind", "framer motion", "html", "css", "bootstrap", "ui", "ux"]
  },
  {
    id: "skills-3",
    category: "skills",
    title: "Backend & Databases",
    content: "Samadhan's backend capabilities include Node.js, REST APIs, PHP, and Laravel. For databases, he is experienced with PostgreSQL, Supabase, and MySQL. He excels at writing secure database queries, building verification layers, and managing relational databases.",
    tags: ["backend", "database", "node.js", "php", "laravel", "apis", "rest", "mysql", "postgresql", "supabase"]
  },
  {
    id: "skills-4",
    category: "skills",
    title: "AI & Tools",
    content: "His AI/ML toolkit includes Keras, TensorFlow, Scikit-learn, CNN (Convolutional Neural Networks), data preprocessing, and data augmentation. His toolset also comprises Git, GitHub, VS Code, Figma, XAMPP, and Docker. He has exposure to blockchain development using Solidity, Hardhat, and Ethers.js.",
    tags: ["ai", "machine learning", "deep learning", "keras", "tensorflow", "cnn", "git", "docker", "solidity", "hardhat", "ethers.js", "tools"]
  },
  {
    id: "experience-1",
    category: "experience",
    title: "Work Experience - Angel Infotech",
    content: "Samadhan worked as a Web Development Intern at Angel Infotech from June 2023 to July 2023. During this internship, he developed web applications using HTML, CSS, JavaScript, PHP, Laravel, and Bootstrap. He built a watch-themed commerce project, collaborated in a team environment, and substantially improved his problem-solving, debugging, and team communication skills.",
    tags: ["experience", "internship", "angel infotech", "web development", "php", "laravel", "work"]
  },
  {
    id: "projects-1",
    category: "projects",
    title: "Plant Disease Detection System",
    content: "A Deep Learning project built using Python, Keras, and TensorFlow. Samadhan implemented a Convolutional Neural Network (CNN) model for image-based plant disease classification. The project incorporates advanced image preprocessing and data augmentation techniques to enhance accuracy and robustness in detecting agricultural diseases. Check it out on GitHub: https://github.com/samadhannnn/Plant_Disease_Detection",
    tags: ["projects", "plant disease", "deep learning", "keras", "tensorflow", "python", "cnn", "image classification"]
  },
  {
    id: "projects-2",
    category: "projects",
    title: "Real Estate (Blockchain DApp)",
    content: "A secure, decentralized Web3 application built using Solidity (Smart Contracts), Hardhat, React.js, and Ethers.js. It facilitates tamper-proof property transactions, enables smart contract testing, and links digital wallets to verify land ownership. Check it out on GitHub: https://github.com/samadhannnn/ReaLEstate",
    tags: ["projects", "real estate", "blockchain", "solidity", "hardhat", "react", "ethers.js", "dapp", "web3"]
  },
  {
    id: "projects-3",
    category: "projects",
    title: "E-Voting System (Blockchain)",
    content: "A decentralized E-Voting system designed to prevent voter tampering and ensure election integrity. Developed using Solidity, Hardhat, React.js, and Ethers.js, it implements robust cryptographic voting tokens, secure smart contract operations, and automated test coverages. Check it out on GitHub: https://github.com/samadhannnn/Evoting",
    tags: ["projects", "voting", "e-voting", "blockchain", "solidity", "hardhat", "react", "ethers.js"]
  },
  {
    id: "projects-4",
    category: "projects",
    title: "Scholarship Portal",
    content: "A comprehensive multi-level verification system for student academic scholarships. Built using PHP, MySQL, HTML, CSS, JavaScript, and Bootstrap. The application enforces role-based authentication for students, college administrators, and government authorities to streamline and verify application approvals. Check it out on GitHub: https://github.com/samadhannnn/Scholorship_Website",
    tags: ["projects", "scholarship", "php", "mysql", "bootstrap", "portal", "verification"]
  },
  {
    id: "projects-5",
    category: "projects",
    title: "Other GitHub Repositories",
    content: "Samadhan has built several other projects visible on GitHub: \n1. Car_model: Machine learning simulation model in Python.\n2. ipl-match-predictor: Predicts cricket matches using Python/ML algorithms and an HTML interface.\n3. Online_cheating_Protector: Web security tool using JavaScript to monitor browser tab-switching and window focus during online exams.\n4. Animated_website: Beautiful web design using advanced CSS and GSAP animations.",
    tags: ["projects", "github", "car model", "ipl", "cheating protector", "animated website"]
  },
  {
    id: "education-1",
    category: "education",
    title: "Education & Academic Details",
    content: "1. Bachelor of Engineering (B.E.) in Artificial Intelligence & Machine Learning at Deogiri Institute of Engineering and Management Studies (Expected graduation: 2027). Undergoing coursework in advanced data structures, machine learning theory, algorithms, and databases.\n2. Diploma in Computer Engineering at CSMSS College of Polytechnic, Chhatrapati Sambhajinagar. Graduated with an outstanding score of 90.71%.",
    tags: ["education", "college", "university", "degree", "diploma", "be", "btech", "marks", "gpa", "deogiri", "csmss"]
  },
  {
    id: "certifications-1",
    category: "certifications",
    title: "Professional Certifications",
    content: "Samadhan has completed multiple professional certifications from leading industry organizations:\n- Artificial Intelligence Foundations: Machine Learning (LinkedIn/Microsoft)\n- Career Essentials in Software Development (Microsoft & LinkedIn)\n- JavaScript Foundations Professional Certificate (Mozilla)\n- JavaScript Essential Training (LinkedIn)\n- HTML, CSS, and Generative AI (LinkedIn)\n- Data Analytics: ChatGPT with Power BI\n- Programming Foundations: Fundamentals & Beyond (LinkedIn)",
    tags: ["certifications", "certificates", "linkedin", "microsoft", "mozilla", "javascript", "ml", "power bi"]
  },
  {
    id: "contact-1",
    category: "contact",
    title: "Contact Details & Links",
    content: "Samadhan can be reached directly via:\n- Email: samadhanbodkhe222@gmail.com\n- Phone: +91 9309295922\n- LinkedIn: https://www.linkedin.com/in/samadhan-bodkhe-766308270/\n- GitHub: https://github.com/samadhannnn\n- Portfolio: Portfolio/ directory on his local machine. You can send a message using the Contact Form on this site, which goes straight to his Admin Dashboard.",
    tags: ["contact", "email", "phone", "linkedin", "github", "hire", "message", "write", "call"]
  },
  {
    id: "general-1",
    category: "general",
    title: "Why Hire Samadhan Bodkhe?",
    content: "You should hire Samadhan because he possesses a unique combination of AI/ML engineering skills (TensorFlow, CNNs, image processing) and solid, full-stack software development experience (Next.js, React, Node.js, PHP, PostgreSQL). As an AIML major, he understands the math and modeling of machine learning algorithms, but also knows how to containerize, host, deploy, and build beautiful UI wrappers around those models. He is self-driven, adaptable, has proven internship experience at Angel Infotech, and graduated with 90.71% in his engineering diploma.",
    tags: ["why", "hire", "recruiter", "skills", "reason", "benefits", "strength"]
  },
  {
    id: "coding-1",
    category: "skills",
    title: "Competitive Programming Profiles",
    content: "Samadhan is active in competitive coding to keep his algorithms sharp. His profiles are:\n- LeetCode: solved 58+ problems (29 Easy, 17 Medium, 12 Hard). Profile: https://leetcode.com/u/Samadhannnnn/\n- HackerRank: earned 5-star proficiency badges in Java and Python, and a 4-star proficiency badge in C. Profile: https://www.hackerrank.com/profile/samadhan_bodkhe",
    tags: ["leetcode", "hackerrank", "competitive coding", "solving", "stars", "badges", "problems"]
  }
];

// Helper to retrieve context using keywords similarity
export function retrieveContext(query: string, limit = 4): string {
  const words = query.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) {
    // Fallback: return default info
    return KNOWLEDGE_BASE.slice(0, limit).map(c => c.content).join("\n\n");
  }

  const scored = KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    // Check tag matches (weight = 3)
    chunk.tags.forEach(tag => {
      words.forEach(word => {
        if (tag.includes(word) || word.includes(tag)) {
          score += 3;
        }
      });
    });
    // Check content matches (weight = 1)
    const contentLower = chunk.content.toLowerCase();
    words.forEach(word => {
      const regex = new RegExp("\\b" + word + "\\b", "g");
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    return { chunk, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return joined text of top matches
  return scored
    .slice(0, limit)
    .filter(item => item.score > 0)
    .map(item => item.chunk.content)
    .join("\n\n") || KNOWLEDGE_BASE.slice(0, 2).map(c => c.content).join("\n\n");
}

// Emulated Local Chatbot Generator
export function getLocalResponse(query: string): string {
  const q = query.toLowerCase().trim();
  
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "yo", "sup"];
  const isGreeting = greetings.some(g => q === g || q.startsWith(g + " ") || q.includes(" " + g + " ") || q.endsWith(" " + g));
  
  if (isGreeting) {
    return `### **Hello & Welcome!** 👋\n\nI am **SAM AI**, the virtual assistant representing **Samadhan Bodkhe**.\n\nI am here to tell you all about his work and credentials. Here is what you can ask me about:\n\n* 🚀 **Technical Projects** (e.g., Deep Learning Leaf Disease Classifiers, Blockchain Web3 DApps)\n* 🛠️ **Skills & Stack** (e.g., Python, Next.js, React, Node.js, Solidity, PostgreSQL)\n* 💼 **Professional Experience** (Angel Infotech Web Development Internship)\n* 🎓 **Education & Timeline** (B.E. in AI & Machine Learning student)\n\n*What can I help you find out about Samadhan today? Feel free to write a question or click one of the suggested prompts!*`;
  }
  
  if (q.includes("who is") || q.includes("about") || q.includes("introduce")) {
    return `### **Who is Samadhan Bodkhe?**\n\nSamadhan is an **AI & Machine Learning Engineer** and **Full Stack Developer** based in India. He is currently pursuing his **B.E. in Artificial Intelligence & Machine Learning** (expected 2027) at Deogiri Institute of Engineering and Management Studies.\n\nHe has a strong academic foundation (90.71% in his Computer Engineering Diploma) and real-world experience as a **Web Development Intern** at Angel Infotech. He bridges the gap between machine learning research (CNNs, Computer Vision) and robust production-ready web development (React, Next.js, Solidity).`;
  }
  
  if (q.includes("project") || q.includes("built") || q.includes("code") || q.includes("repo")) {
    return `### **Samadhan's Technical Projects**\n\nSamadhan has built several complex applications utilizing AI, Blockchain, and Full Stack Tech:\n\n1. **Plant Disease Detection System (AI/DL)**: A neural network built in **Python/TensorFlow/Keras** that uses CNNs to identify diseases in plant leaves from image datasets.\n2. **Real Estate DApp (Blockchain)**: A decentralized land registry built using **Solidity, Hardhat, React, and Ethers.js** for secure and tamper-proof real estate transactions.\n3. **E-Voting System (Blockchain)**: A secure voting application built on Ethereum using **Solidity** and **React** with comprehensive contract testing.\n4. **Scholarship Verification Portal (Full Stack)**: A multi-role PHP & MySQL portal featuring document verification and workflow authorization.\n5. **Online Cheating Protector**: A tab-monitoring and browser window focus tracking tool built in JavaScript for online test security.`;
  }
  
  if (q.includes("skill") || q.includes("language") || q.includes("stack") || q.includes("technology") || q.includes("know")) {
    return `### **Technical Skills & Stack**\n\nHere is a summary of Samadhan's technical capabilities:\n\n* **Programming Languages**: Python, Java, C++, C, JavaScript, TypeScript, Solidity\n* **AI/ML & Data Science**: Deep Learning (CNNs), TensorFlow, Keras, Scikit-learn, Data Augmentation & Preprocessing\n* **Frontend Web**: React.js, Next.js (App Router), Tailwind CSS, Framer Motion, HTML5, CSS3, Bootstrap\n* **Backend & API**: Node.js, REST APIs, PHP, Laravel\n* **Databases**: PostgreSQL, Supabase, MySQL\n* **Developer Tools**: Git, GitHub, VS Code, Docker, Figma, XAMPP`;
  }
  
  if (q.includes("experience") || q.includes("work") || q.includes("intern")) {
    return `### **Professional Experience**\n\n* **Web Development Intern** at **Angel Infotech** *(June 2023 – July 2023)*\n  * Developed applications using **PHP, Laravel, HTML, CSS, JavaScript, and Bootstrap**.\n  * Collaborated in team sprints to design and build a responsive watch-themed e-commerce project.\n  * Significantly improved skills in code debugging, API integrations, and team-based version control (Git).`;
  }
  
  if (q.includes("hire") || q.includes("why should") || q.includes("recruit")) {
    return `### **Why You Should Hire Samadhan Bodkhe**\n\n* **Versatile Skillset**: He is not just an ML modeler; he is a developer who can write the frontend (Next.js/React), backend (Node/PHP), database (PostgreSQL), and smart contracts (Solidity).\n* **Strong AI/ML Focus**: Currently majoring in AI/ML, he understands the underlying math of Deep Learning models and how to build them.\n* **Proven Academic Excellence**: Maintained a **90.71%** aggregate in his Computer Engineering Diploma.\n* **Fast Learner & Adaptable**: Proven by his transition across multiple tech stacks—from web development (PHP/Laravel) to decentralized apps (Blockchain/Solidity) and AI/ML (TensorFlow/Keras).`;
  }

  if (q.includes("education") || q.includes("degree") || q.includes("college") || q.includes("study")) {
    return `### **Education**\n\n* **B.E. in Artificial Intelligence & Machine Learning** *(2023 - Expected 2027)*\n  * Deogiri Institute of Engineering and Management Studies\n* **Diploma in Computer Engineering**\n  * CSMSS College of Polytechnic, Chhatrapati Sambhajinagar\n  * Graduated with **90.71%**`;
  }

  if (q.includes("certif") || q.includes("credential")) {
    return `### **Professional Certifications**\n\nSamadhan holds several certifications in Software and AI:\n* **Artificial Intelligence Foundations: Machine Learning** (LinkedIn/Microsoft)\n* **Career Essentials in Software Development** (Microsoft/LinkedIn)\n* **JavaScript Foundations Professional Certificate** (Mozilla)\n* **Data Analytics: ChatGPT with Power BI**`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach")) {
    return `### **How to Contact Samadhan**\n\nYou can reach out directly:\n* **Email**: [samadhanbodkhe222@gmail.com](mailto:samadhanbodkhe222@gmail.com)\n* **Phone**: +91 9309295922\n* **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/samadhan-bodkhe-766308270/)\n* **GitHub**: [GitHub Profile](https://github.com/samadhannnn)`;
  }

  if (q.includes("leetcode") || q.includes("hackerrank") || q.includes("coding profile") || q.includes("solve") || q.includes("competitive")) {
    return `### **Competitive Programming & Coding Profiles**\n\nSamadhan actively solves algorithmic challenges to hone his problem-solving skills:\n\n* **LeetCode Profile**: @[Samadhannnnn](https://leetcode.com/u/Samadhannnnn/)\n  * **Problems Solved**: 58+\n  * **Difficulty Split**: 29 Easy, 17 Medium, 12 Hard\n* **HackerRank Profile**: @[samadhan_bodkhe](https://www.hackerrank.com/profile/samadhan_bodkhe)\n  * **Java Domain**: ⭐⭐⭐⭐⭐ (5 Stars - Gold level)\n  * **Python Domain**: ⭐⭐⭐⭐⭐ (5 Stars - Gold level)\n  * **C Domain**: ⭐⭐⭐⭐ (4 Stars)`;
  }

  // Generic fallback using retrieved context
  const context = retrieveContext(query, 2);
  return `### **Response**\n\nBased on Samadhan's records:\n\n${context}\n\n*For more specific info, feel free to ask about his **skills**, **experience**, **projects**, or **why you should hire him**!*`;
}

// RAG Generative Pipeline Route
export async function getRAGResponse(query: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // If no OpenAI API Key, fallback to our smart local emulator
    return getLocalResponse(query);
  }

  const context = retrieveContext(query, 3);
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are SAM AI, the premium virtual assistant representing Samadhan Bodkhe.
Your role is to answer recruiter, employer, and collaborator questions about Samadhan's skills, experience, projects, education, and career goals.
Use the following retrieved context about Samadhan to construct a natural, professional, and persuasive response. 
Format your responses using Markdown. Be concise, engaging, and professional. 

CONTEXT ABOUT SAMADHAN:
${context}`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    
    throw new Error("Invalid response format from OpenAI API");
  } catch (err) {
    console.error("Error fetching from OpenAI, falling back to local responder:", err);
    return getLocalResponse(query);
  }
}
