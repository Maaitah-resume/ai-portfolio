export const profile = {
  name: 'Mohammad Maaitah',
  role: 'AI/ML Engineer',
  headline: 'AI/ML Engineer · Generative AI & RAG Systems · Machine Learning',
  focus: 'Generative AI, RAG systems and machine learning',
  location: 'Amman, Jordan',
  email: 'maaitah2004@gmail.com',
  phone: '+962 79 214 8465',
  github: 'https://github.com/Maaitah-resume',
  linkedin: 'https://www.linkedin.com/in/mohammad-maaitah-2b0351390',
  lede:
    'I build AI systems that companies can trust in production: retrieval-augmented assistants that answer from your own documents, teams of agents that automate real business workflows, and deep learning models that read medical images. I take each one from the first experiment to a deployed, tested service.',
  summary: [
    'I’m an AI/ML engineer with hands-on experience designing and deploying machine learning and generative AI systems. My work spans retrieval-augmented generation (RAG) pipelines, multi-agent orchestration, and deep learning models for computer vision and medical image segmentation.',
    'Day to day I work in Python, PyTorch, Scikit-learn and FastAPI. I handle the full model lifecycle: data preprocessing, training and evaluation, then MLOps with Docker, CI/CD and Git, vector databases, and cloud deployment on AWS.',
    'I also bring a strong QA and UAT background. I plan and run test cycles, write the technical reports, and explain system architecture and performance to stakeholders, so what I build is understood and adopted, not just shipped.',
  ],
}

// Headline numbers for the hero; each comes straight from the CV.
export const stats = [
  { value: '5', label: 'agents orchestrated in one production pipeline' },
  { value: '6', label: 'AI projects built and published' },
  { value: '4', label: 'professional certifications' },
  { value: '0.873', label: 'Dice score on leukemia cell segmentation' },
]

// What I do, grouped the way a hiring manager would scan it.
export const capabilities = [
  {
    title: 'Generative AI and RAG',
    text: 'Retrieval-augmented assistants that answer from company knowledge, with vector search in Qdrant, GPT-4o and Gemini, prompt engineering, and guard rails that reduce hallucinations and block prompt injection.',
    tags: ['RAG', 'LangChain', 'LangGraph', 'Qdrant', 'GPT-4o', 'Gemini'],
  },
  {
    title: 'Multi-agent automation',
    text: 'Teams of specialised agents that plan and act across real tools: CRM, Google Workspace and web search, connected securely through OAuth2 and the Model Context Protocol (MCP).',
    tags: ['Multi-agent systems', 'MCP', 'OAuth2', 'Zoho CRM', 'Google Workspace'],
  },
  {
    title: 'Machine learning and computer vision',
    text: 'Deep learning for images and data: segmentation with U-Net, federated learning that keeps data private, anomaly detection, and explainable predictions with SHAP and LIME.',
    tags: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'U-Net', 'Federated learning'],
  },
  {
    title: 'Backend, MLOps and delivery',
    text: 'Production APIs and services around the models, with FastAPI, PostgreSQL and Redis, containerised with Docker, shipped through CI/CD and deployed on AWS, then tested end to end.',
    tags: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'CI/CD', 'AWS'],
  },
]

export const experience = [
  {
    title: 'AI Developer',
    org: 'Al-Bayanat',
    note: 'Amman, Jordan · through HTU’s apprenticeship program',
    period: 'Feb 2026 – Present',
    intro:
      'I design and build the company’s AI platform: retrieval-augmented services that answer and generate documents from company data, and a team of agents that automates work across the CRM and Google Workspace.',
    points: [
      'Built an MCP-enabled File Generation Service on FastAPI, PostgreSQL, Qdrant and Redis, integrating GPT-4o for retrieval-augmented Q&A and automated document generation.',
      'Designed a five-agent orchestration pipeline in LangGraph that integrates Zoho CRM and Google Workspace APIs through OAuth2 to automate business workflows.',
      'Implemented a hallucination-prevention layer that combines RAG retrieval with confidence scoring, improving the reliability of LLM-generated answers.',
      'Built a SearXNG-based web search microservice that gives agents access to real-time external information.',
      'Established a version-controlled, externalized prompt management system with caching, so prompts stay maintainable across services.',
      'Led end-to-end QA/UAT testing cycles, and wrote technical documentation and stakeholder reports on system architecture and performance.',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Qdrant', 'Redis', 'GPT-4o', 'LangGraph', 'MCP', 'OAuth2', 'Zoho CRM', 'Google Workspace', 'SearXNG'],
  },
]

export type Project = {
  name: string
  kind: string
  blurb: string
  points: string[]
  stack: string[]
  metric?: { value: string; label: string }
  links: { label: string; href: string }[]
  featured?: boolean
}

const gh = (r: string) => `https://github.com/Maaitah-resume/${r}`

export const projects: Project[] = [
  {
    name: 'Federated Learning IDS',
    kind: 'Privacy-preserving security',
    blurb:
      'A production-style intrusion detection system where many participants train one shared model together without ever sharing their raw network data.',
    points: [
      'Designed as phased, modular microservices: a FastAPI/PyTorch ML service, a React/Vite front end, and a Node.js/Express back end with Socket.IO for live training rounds.',
      'Training runs inside each participant’s browser with TensorFlow.js; the server only coordinates rounds and never sees raw data.',
      'Implemented secure masked meta-aggregation for privacy-preserving model updates, benchmarked against standard FedAvg weighted averaging.',
      'JWT authentication and MongoDB for secure, scalable data handling. Deployed live on Railway.',
    ],
    stack: ['PyTorch', 'TensorFlow.js', 'FastAPI', 'React', 'Node.js', 'Socket.IO', 'MongoDB', 'JWT'],
    links: [
      { label: 'Platform repo', href: gh('Federated-Learning-System') },
      { label: 'Research repo', href: gh('FL-IDS') },
    ],
    featured: true,
  },
  {
    name: 'Guard Layer',
    kind: 'LLM safety',
    blurb:
      'A prompt-injection gate for an enterprise AI agent platform. It checks email, Excel, SharePoint, CRM records and web pages before their content is allowed into an agent’s context.',
    points: [
      'Four-stage pipeline: tag every untrusted source, run a fast heuristic pre-filter, call an LLM judge only when needed, then make the gate decision.',
      'The first pass uses injection patterns stored in Postgres plus a scan for hidden and zero-width Unicode tricks.',
      'A Redis cache and Qdrant near-match lookup sit in front of a forced-JSON Claude Haiku verdict, so repeated content costs nothing to re-check.',
      'Packaged as a reusable library with a mock MCP server, ready to drop into the production platform.',
    ],
    stack: ['Python', 'MCP', 'PostgreSQL', 'Redis', 'Qdrant', 'Claude Haiku'],
    links: [{ label: 'Repo', href: gh('Gaurd-Layer') }],
    featured: true,
  },
  {
    name: 'Leukemia Cell Segmentation',
    kind: 'Medical imaging',
    blurb:
      'A deep learning system that detects and outlines leukemia cells in microscopic blood smear images, to support earlier diagnosis.',
    points: [
      'Trained and compared U-Net, FPN, PSPNet and DeepLabV3 on a ResNet50 encoder with Adam, SGD and RMSProp; U-Net with SGD performed best.',
      'Delivers a binary mask, an overlay and a confidence heatmap, plus automatic cell count and area estimation.',
      'Preprocessing with resizing, normalization and augmentation; evaluated with IoU and Dice score. Deployed on Hugging Face.',
    ],
    stack: ['PyTorch', 'U-Net', 'ResNet50', 'OpenCV', 'Dice + CE loss'],
    metric: { value: '0.873', label: 'Dice score · IoU 0.775' },
    links: [{ label: 'Repo', href: gh('Leukemia-') }],
  },
  {
    name: 'Velocity Charging Portal',
    kind: 'Explainable ML',
    blurb:
      'A portal for electric-vehicle charging that predicts the cost and duration of each session and flags unusual charging behaviour.',
    points: [
      'Flask-based machine learning models predict charging cost and session duration.',
      'Isolation Forests detect anomalies and flag irregular charging behaviour.',
      'SHAP and LIME explain every prediction, and fuzzy logic with reinforcement learning drives personalised recommendations.',
    ],
    stack: ['Scikit-learn', 'Flask', 'Isolation Forest', 'SHAP', 'LIME', 'Fuzzy logic', 'RL'],
    links: [{ label: 'Repo', href: gh('voltcity_charging_portal---Copy') }],
  },
  {
    name: 'Fitness AI Assistant',
    kind: 'Conversational AI',
    blurb:
      'A conversational coach that learns about you, then gives personalised fitness and nutrition guidance.',
    points: [
      'FastAPI system that combines rule-based profile building with generative responses from Google Gemini.',
      'SQLite persistence for user profiles and full chat history, with a Jupyter pipeline for post-conversation analytics and visualisation.',
      'Lightweight HTML/CSS/JavaScript front end served directly by FastAPI, so it runs on a single server.',
    ],
    stack: ['FastAPI', 'Google Gemini', 'SQLite', 'Jupyter', 'JavaScript'],
    links: [{ label: 'Repo', href: gh('Fitness-AI-Assistant') }],
  },
  {
    name: 'NLP Foundations',
    kind: 'Language modeling',
    blurb:
      'Notebooks that walk through the natural-language pipeline, from cleaning raw words to training sequence models.',
    points: [
      'Text normalisation and stemming to prepare raw text.',
      'Word embeddings that turn words into vectors a model can learn from.',
      'LSTM sequence models built on those embeddings.',
    ],
    stack: ['Python', 'Jupyter', 'LSTM', 'Word embeddings'],
    links: [{ label: 'Repo', href: gh('NLP') }],
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Generative AI & LLMs', items: ['Retrieval-augmented generation (RAG)', 'Large language models', 'LangChain', 'LangGraph', 'Multi-agent systems', 'Prompt engineering', 'OpenAI GPT-4o', 'Google Gemini API', 'Vector databases (Qdrant)'] },
  { group: 'Machine & deep learning', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Model training', 'Model evaluation', 'Feature engineering', 'Computer vision', 'Neural networks', 'Reinforcement learning', 'Fuzzy logic'] },
  { group: 'Backend & APIs', items: ['FastAPI', 'Flask', 'REST APIs', 'PostgreSQL', 'Redis', 'OAuth2', 'Docker'] },
  { group: 'Programming languages', items: ['Python', 'Java', 'SQL', 'Node.js'] },
  { group: 'Data & visualisation', items: ['Matplotlib', 'Seaborn', 'Power BI', 'Excel', 'Statistical analysis', 'Data preprocessing'] },
  { group: 'Cloud & tools', items: ['AWS', 'Nutanix Prism Element', 'Git', 'CI/CD', 'Jira', 'Postman', 'Hadoop'] },
  { group: 'Platforms', items: ['PyCharm', 'Jupyter Notebook', 'Visual Studio Code', 'Cursor'] },
  { group: 'Professional', items: ['Project management', 'Stakeholder communication', 'QA / UAT', 'Technical reporting', 'Research & development', 'Agile collaboration'] },
]

// How I work, from the soft skills on the CV.
export const approach = [
  { title: 'Plan with the business', text: 'I start from the workflow people actually run, agree on what success looks like with stakeholders, and manage the work in agile steps.' },
  { title: 'Build for production', text: 'Models ship inside real services, with APIs, caching, version-controlled prompts, containers and CI/CD, not as one-off notebooks.' },
  { title: 'Test like a QA engineer', text: 'I design and lead QA/UAT cycles, so every release is checked end to end against the cases users care about.' },
  { title: 'Explain it clearly', text: 'I write the technical documentation and stakeholder reports on architecture and performance, so decisions are made on evidence.' },
]

export const certifications = [
  {
    name: 'Nutanix Certified Associate',
    code: 'NCA 6',
    issuer: 'Nutanix',
    text: 'Validates working in the Nutanix Prism interface: running virtual machine operations, reading cluster information, and understanding Nutanix architecture and which products fit which use cases.',
  },
  {
    name: 'AI Engineering Specialization',
    code: 'Professional certificate',
    issuer: 'IBM',
    text: 'Machine learning with Python, deep learning with Keras, TensorFlow and PyTorch, computer vision with CNNs and vision transformers, and generative AI with LLMs, LangChain, RAG and prompt engineering.',
  },
  {
    name: 'AWS AI Practitioner',
    code: 'Course certificate',
    issuer: 'Udemy',
    text: 'Prepares for the AWS Certified AI Practitioner exam: AI and ML fundamentals, generative AI, applications of foundation models, responsible AI, and security and governance for AI on AWS.',
  },
  {
    name: 'Quality Assurance / Quality Engineer Training',
    code: 'Training program',
    issuer: 'HTU',
    text: 'Test planning, test case design, defect tracking and user acceptance testing.',
  },
]

export const education = {
  degree: 'B.Sc. Artificial Intelligence & Data Science',
  school: 'Al Hussein Technical University (HTU)',
  period: '2022 – 2026',
  gpa: '3.26',
  text: 'A degree focused on machine learning, deep learning and data science, finished with an industry apprenticeship as an AI developer at Al-Bayanat through HTU’s apprenticeship program.',
}

// Interface wording around the content above.
export const ui = {
  nav: { about: 'About', work: 'Work', experience: 'Experience', skills: 'Skills', credentials: 'Credentials', contact: 'Contact' },
  status: 'AI Developer at Al-Bayanat · open to new opportunities',
  firstName: 'Mohammad',
  lastName: 'Maaitah',
  seeProjects: 'See projects',
  emailMe: 'Email me',
  atAGlance: 'At a glance',
  aboutTitle: 'About me',
  aboutNote: 'Based in Amman, Jordan. Graduating in AI and data science from HTU in 2026.',
  facts: {
    currently: 'Currently', currentlyValue: 'AI Developer, Al-Bayanat',
    focus: 'Focus', focusValue: 'RAG, multi-agent systems, deep learning',
    education: 'Education', educationValue: 'B.Sc. AI & Data Science, HTU · GPA',
    location: 'Location', email: 'Email',
  },
  whatIDo: 'What I do',
  workTitle: 'Selected work',
  workNote: 'Six projects across LLM safety, federated learning, medical imaging, explainable ML and conversational AI. Use “How it works” on any card to see its architecture.',
  howItWorks: 'How it works',
  backToOverview: 'Back to overview',
  builtWith: 'Built with',
  experienceTitle: 'Experience',
  experienceNote: 'Building production AI for a real business, from architecture to user acceptance testing.',
  technologiesUsed: 'Technologies used',
  howIWork: 'How I work',
  skillsTitle: 'Skills',
  skillsNote: 'The tools and methods I use, from language models and deep learning to delivery and teamwork.',
  credentialsTitle: 'Certifications and education',
  credentialsNote: 'Formal training in AI engineering, cloud AI, infrastructure and quality assurance.',
  gpa: 'GPA',
  contactTitle: 'Let’s build something that thinks.',
  contactText: 'I’m open to AI/ML engineering roles and collaborations on RAG systems, AI agents and applied deep learning. If you have a workflow that should be automated, or data that should be answering questions, I’d like to hear about it.',
  backToTop: 'Back to top',
  themeToDark: 'Switch to dark mode',
  themeToLight: 'Switch to light mode',
  otherLanguage: 'العربية',
  otherLanguageLabel: 'View the site in Arabic',
}
