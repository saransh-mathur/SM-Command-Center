import { CareerApplication, OutreachTemplate, StarProject } from '../types';

export const INITIAL_APPLICATIONS: CareerApplication[] = [
 {
 id: 'app-1',
 company: 'Stripe',
 role: 'Backend Infrastructure Engineer',
 salaryRange: '₹35L - ₹50L',
 location: 'Remote / Bangalore',
 stage: 'targeted',
 dateAdded: '2026-08-10',
 notes: 'Focus on high-throughput idempotency keys, distributed transaction pipelines, and pgvector caching.',
 url: 'https://stripe.com/jobs',
 tags: ['Python', 'Distributed Systems', 'PostgreSQL'],
 },
 {
 id: 'app-2',
 company: 'Coinbase',
 role: 'Senior Software Engineer - Platform',
 salaryRange: '₹40L - ₹55L',
 location: 'Remote',
 stage: 'tailored',
 dateAdded: '2026-08-09',
 notes: 'Resume customized with RAG document retrieval performance benchmarks and async FastAPI latency optimizations.',
 url: 'https://coinbase.com/careers',
 tags: ['FastAPI', 'Docker', 'AWS'],
 },
 {
 id: 'app-3',
 company: 'Postman',
 role: 'Software Engineer - AI Tools & Runtime',
 salaryRange: '₹30L - ₹42L',
 location: 'Bangalore / Hybrid',
 stage: 'outreach',
 dateAdded: '2026-08-08',
 notes: 'Cold outreach sent to VP of Eng on LinkedIn. Follow-up scheduled for Friday.',
 url: 'https://postman.com/careers',
 tags: ['AI / RAG', 'API Design', 'Python'],
 },
 {
 id: 'app-4',
 company: 'Razorpay',
 role: 'Backend Platform Engineer',
 salaryRange: '₹28L - ₹38L',
 location: 'Bangalore',
 stage: 'outreach',
 dateAdded: '2026-08-07',
 notes: 'Referred via NMIMS Alumni network. Recruiter acknowledged message.',
 url: 'https://razorpay.com/jobs',
 tags: ['Microservices', 'Kafka', 'PostgreSQL'],
 },
 {
 id: 'app-5',
 company: 'Atlassian',
 role: 'Backend Systems Engineer',
 salaryRange: '₹38L - ₹52L',
 location: 'Bangalore / Remote',
 stage: 'interview',
 dateAdded: '2026-08-05',
 notes: 'Round 1 System Design scheduled for next Tuesday. Review sliding window, rate limiting & cache invalidation.',
 url: 'https://atlassian.com/company/careers',
 tags: ['System Design', 'Algorithms', 'High Scale'],
 },
 {
 id: 'app-6',
 company: 'Databricks',
 role: 'Solutions Architect / SWE',
 salaryRange: '₹45L - ₹60L',
 location: 'Bangalore / Remote',
 stage: 'targeted',
 dateAdded: '2026-08-11',
 notes: 'Targeting AI compute orchestration team. Align with MBA Quantitative Methods analytics.',
 url: 'https://databricks.com/company/careers',
 tags: ['Distributed Compute', 'Python', 'AI'],
 },
];

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
 {
 id: 'tpl-1',
 title: 'LinkedIn Recruiter Cold Ping',
 category: 'recruiter',
 subject: 'Exploring Backend / AI Systems Roles @ {{Company}}',
 body: `Hi {{Recruiter_Name}},

I came across {{Company}}'s work on {{Team/Product}} and was thoroughly impressed by your engineering scale.

I'm a Backend & AI Systems Engineer with deep hands-on expertise in building high-throughput FastAPI/Python microservices, hybrid vector search (RAG + pgvector), and distributed data pipelines. Concurrently, I'm pursuing an MBA (Sem 1) to bridge technical architecture with executive business KPIs.

I saw the {{Role_Title}} opening and would love to connect for a quick 5-minute chat to share how my background in latency optimization and AI retrieval workflows aligns with your current roadmap.

Best regards,
Saransh Mathur`,
 tags: ['Recruiter', 'Short', 'High Conversion'],
 },
 {
 id: 'tpl-2',
 title: 'Engineering Manager Value-Add Pitch',
 category: 'hiring_manager',
 subject: 'Solving Latency & RAG Pipeline Throughput — Quick Idea for {{Company}}',
 body: `Hi {{Manager_Name}},

I’ve been following your recent engineering updates regarding {{Specific_Engineering_Problem/Product}}. 

In my recent projects, I designed an async RAG pipeline utilizing hybrid PostgreSQL + pgvector indexing that reduced query latency by 45% while maintaining strict data consistency across concurrent requests. 

I’d love to contribute these architectural patterns to your team on the {{Role_Title}} opening. Would you be open to a brief 10-minute exchange this week?

Portfolio & System Demos: https://github.com/saranshmathur

Warm regards,
Saransh Mathur`,
 tags: ['Hiring Manager', 'Technical', 'Value-First'],
 },
 {
 id: 'tpl-3',
 title: 'Alumni Warm Coffee Chat Request',
 category: 'alumni',
 subject: 'Fellow NMIMS MBA / Engineer reaching out — quick advice',
 body: `Hi {{Alumni_Name}},

Hope you're having a great week! I'm a fellow engineer currently in Sem 1 of the NMIMS MBA program, focusing on bridging distributed systems architecture with Product Management and technical leadership.

I saw your impressive trajectory at {{Company}} as {{Role}} and would love to hear any 1-2 key insights you’d give to an engineer navigating this dual-track path.

If you have 10 minutes for a virtual coffee over the next couple of weeks, I’d be immensely grateful!

Best,
Saransh Mathur`,
 tags: ['Alumni', 'Warm', 'Networking'],
 },
 {
 id: 'tpl-4',
 title: 'Post-Interview 4-Part Thank You',
 category: 'followup',
 subject: 'Thank You — {{Role_Title}} Interview Discussion',
 body: `Hi {{Interviewer_Name}},

Thank you for taking the time to speak with me today about {{Role_Title}} at {{Company}}. I really enjoyed our discussion around {{Specific_Topic_Discussed, e.g. Cache Invalidation / RAG Document Chunking}}.

Reflecting on your question regarding {{Key_Challenge_Mentioned}}, I believe applying an asynchronous write-behind cache paired with an event-driven worker queue would yield the exact throughput and resilience we talked about.

I’m very excited about the opportunity to join the team. Looking forward to the next steps!

Warm regards,
Saransh Mathur`,
 tags: ['Follow-Up', 'Interview', 'Technical Polish'],
 },
];

export const STAR_PROJECTS: StarProject[] = [
 {
 id: 'proj-1',
 title: 'SM Command Center & Dual-Track RAG Copilot',
 role: 'Lead Architect & Full-Stack Engineer',
 timeframe: '2026',
 summary: 'A unified local operating system integrating hardware thermal control, Docker container orchestration, asynchronous SQLite/PostgreSQL fallback, and a local RAG engine for real-time semantic document search across MBA course materials.',
 impactMetrics: [
 'Engineered sub-80ms semantic vector retrieval over 600+ pages of academic textbooks and financial schemas.',
 'Implemented async connection pooling with zero-downtime database fallback.',
 'Built a reactive React 18 + Tailwind frontend with live telemetry polling at 1Hz.',
 ],
 techStack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'React', 'TypeScript', 'Docker', 'TailwindCSS'],
 githubUrl: 'https://github.com/saranshmathur/command-center',
 },
 {
 id: 'proj-2',
 title: 'LegalTech Document OCR & Compliance Pipeline',
 role: 'Backend & AI Systems Engineer',
 timeframe: '2025 - 2026',
 summary: 'Production pipeline for automated extraction, clause classification, and risk scoring of multi-page legal contracts using multi-LLM routing and OCR preprocessing.',
 impactMetrics: [
 'Reduced contract review turnaround from 4 hours to under 3 minutes per document.',
 'Achieved 96.4% precision on critical liability and indemnity clause detection.',
 'Containerized and deployed with automated pre-commit linting and CI/CD security scanning.',
 ],
 techStack: ['Django', 'Celery', 'Redis', 'PyTorch', 'AWS S3', 'PostgreSQL'],
 },
];
