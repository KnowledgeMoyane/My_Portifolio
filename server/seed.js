// Loads the content of your original static page into Supabase.
// Usage:  npm run seed          (only runs if the database is empty)
//         npm run seed -- --force   (wipes existing items and re-seeds)
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const site = {
  short_name: 'K. Moyane// ENG', status_text: 'ONLINE (JHB)', header_cta: "LET'S TALK",
  hero_badge: 'PROFESSIONAL PORTFOLIO', hero_eyebrow: '// SOFTWARE ARCHITECTURE & SYSTEMS ENGINEERING',
  hero_1: 'BUILDING', hero_highlight: 'DIGITAL', hero_3: 'EXPERIENCES', hero_4: 'THAT MATTER.',
  hero_intro: 'I am a software engineer and informatics researcher based in Johannesburg, dedicated to translating high-throughput computational logic and clean distributed architecture into resilient, utilitarian digital systems.',
  explore_label: 'EXPLORE MY WORK', cv_label: 'CURRICULUM VITAE', cv_url: '', scroll_label: 'SCROLL TO EXPLORE ARCHITECTURE',
  photo_url: '', node_label: 'NODE: UJ-APK-01', availability_badge: 'AVAILABLE FOR HIRE',
  full_name: 'Knowledge Moyane', age_label: '23 Yrs Old', role_title: 'Student (final year)',
  degree_line: 'BSc in Computer Science & Informatics · University of Johannesburg, South Africa',
  focus_1: 'DISTRIBUTED SYSTEMS', focus_2: 'HIGH CONCURRENCY',
  academic_focus: 'ACADEMIC FOCUS: SOFTWARE ENGINEERING', graduation: 'GRADUATION: 2027',
  socials: [
    'github|GitHub|https://github.com', 'linkedin|LinkedIn|https://linkedin.com',
    'email|Gmail|mailto:knowledgemoyane7@gmail.com', 'whatsapp|WhatsApp|https://wa.me/27710129549',
    'facebook|Facebook|https://facebook.com', 'instagram|Instagram|https://instagram.com',
  ],
  about_eyebrow: '01 / IDENTITY & ROOTS', about_title: 'CURIOUS BY NATURE.\nBUILDER BY CHOICE.',
  about_uni_label: '// UNIVERSITY OF JOHANNESBURG',
  about_lead_before: 'I am completing my Bachelor of Science in', about_lead_highlight: 'Computer Science and Informatics',
  about_lead_after: ' at the University of Johannesburg, exploring how modern software paradigms can bridge structural challenges across the African continent.',
  about_body: 'My engineering philosophy revolves around ruthless reduction of complexity. Software should not just work it must be predictable, auditable, and resilient under adverse networking conditions. Whether developing high-concurrency ledger pipelines or intuitive educational portals, I obsess over end-to-end craft: from binary wire protocols up to subtle micro-interactions.',
  quote: 'Simplicity is prerequisite for reliability.', quote_author: '— Edsger W. Dijkstra // Core Engineering Compass',
  edu_label: 'FORMAL EDUCATION', edu_title: 'BSc Computer Science & Informatics', edu_campus: 'University of Johannesburg (Auckland Park Campus)',
  network_label: 'NETWORK & SOCIAL RELAYS', network_tag: '// CONNECT', network_footer: 'DIRECT ENCRYPTED RELAYS',
  projects_eyebrow: '// ARCHIVAL REPOSITORY & SHOWCASE', projects_title: 'Projects:',
  projects_sub: 'Engineered systems, distributed services, and full-stack software deployed to production.',
  projects_badge1: 'ALL REPOSITORIES VERIFIED', projects_badge2: 'PROD READY',
  skills_eyebrow: '02 / CAPABILITIES & RADAR', skills_title: 'PRECISION TOOLING.\nMODERN RUNTIMES.',
  skills_sub: 'Engineered proficiency spanning systems programming, high-density frontends, distributed databases, and deterministic CI/CD deployment pipelines.',
  experience_eyebrow: '03 / TIMELINE & LOGS', experience_title: 'EXPERIENCE & MILESTONES.',
  experience_sub: 'Progressive records of university leadership, peer instruction, open-source commits, and hackathon prototypes.',
  leadership_eyebrow: '04 / COMMUNITY ENGAGEMENT & MENTORSHIP', leadership_title: 'LEADERSHIP & VOLUNTEERING.',
  leadership_sub: 'Fostering youth empowerment, educational access, and community growth through student leadership and volunteer initiatives.',
  certificates_eyebrow: '05 / VERIFIED CREDENTIALS & LICENSES', certificates_title: 'CERTIFICATES & ACCREDITATIONS.',
  certificates_sub: 'Formally validated competencies across software engineering, algorithmic problem solving, and networking systems.',
  contact_eyebrow: '06 / DIRECT DISPATCH & PROTOCOLS', contact_title: 'INITIATE A CONVERSATION.',
  contact_sub: 'Available for software engineering roles, distributed architecture consultation, and high-impact digital ventures in Johannesburg or worldwide remotely.',
  location_name: 'Johannesburg, South Africa', coordinates: '26.1824° S, 28.0041° E (Auckland Park Hub)',
  email: 'knowledgemoyane7@gmail.com', phone: '+27 710 129 549',
  timezone_text: 'South Africa Standard Time (UTC+2) · Prompt reply guaranteed', open_status: 'STATUS: OPEN FOR NEW OPPORTUNITIES',
  scope_options: ['Full-Time Software Engineering Role', 'Systems Architecture & Contract', 'Academic & Informatics Collaboration', 'General Technical Inquiries'],
  success_message: '✓ TRANSMISSION PACKET DISPATCHED. EXPECT RESPONSE WITHIN 24 HOURS.',
  footer_eyebrow: '// RADICAL ARCHITECTURE & CODE', footer_title: "LET'S BUILD SOMETHING EXTRAORDINARY.",
  geographic_base: 'Johannesburg, South Africa ( WILLING TO RELOCATE )',
  footer_left_1: 'ACADEMIC // UNIVERSITY OF JOHANNESBURG', footer_left_2: 'DEPT. COMPUTER SCIENCE & INFORMATICS',
  copyright: '© 2026 ALL RIGHTS RESERVED', timezone: 'Africa/Johannesburg',
};

const V = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
const items = {
  projects: [
    { featured: true, code: '[PROJ_01] // FLAGSHIP ENTERPRISE', status: 'ACTIVE SYSTEM', title: 'MUTUAL TRUST (LMS)',
      subtitle: 'FULL-STACK DEVELOPMENT & EDTECH ARCHITECTURE · LEAD DEVELOPER',
      description: 'An enterprise-grade Learner Management System designed to resolve South African public and private education bottlenecks. Centralises learner tracking, continuous assessments, automated grading pipelines, staff allocation, and multi-tenant telemetry for low-bandwidth environments.',
      tech: ['React 19', 'NestJS', 'PostgreSQL', 'Redis Cache', 'Docker', 'Tailwind CSS'],
      link_label: 'VIEW SYSTEM ARCHITECTURE', link_url: '', media_url: V + 'BigBuckBunny.mp4', media_caption: 'Mutual Trust LMS Walkthrough' },
    { code: '[PROJ_02] // HIGH CONCURRENCY', status: 'FINTECH DISTRIBUTED', title: 'APEX FINANCIAL LEDGER',
      description: 'Real-time fraud telemetry and double-entry distributed ledger engine. Capable of settling micro-payments with sub-50ms deterministic finality, distributed event sequencing via Kafka, and immutable state audits.',
      tech: ['Go (Golang)', 'Apache Kafka', 'TimescaleDB', 'GraphQL'], link_label: 'EXPLORE GOLANG REPOSITORY', link_url: '',
      media_url: V + 'ForBiggerBlazes.mp4', media_caption: 'Apex High-Throughput Engine' },
    { code: '[PROJ_03] // URBAN GEOGRAPHY', status: 'PUBLIC TRANSIT ROUTING', title: 'JOZI TRANSIT PULSE',
      description: 'Algorithmic routing solver mapping informal Johannesburg minibus-taxi networks. Leverages geospatial graph traversal algorithms to compute real-time multimodal commute routes with offline Progressive Web App caching.',
      tech: ['TypeScript', 'Next.js', 'MapLibre GL', 'WebSockets'], link_label: 'TEST INTERACTIVE ROUTER', link_url: '',
      media_url: V + 'ElephantsDream.mp4', media_caption: 'Jozi Transit Pulse Engine / Route Simulation' },
  ],
  skills: [
    { title: '// 01: FRONTEND & WEB', icon: 'devices', items: ['Web Dev (HTML5 & CSS3)', 'React & Modern UI', 'Angular Framework', 'Responsive Web Apps'] },
    { title: '// 02: BACKEND & SECURITY', icon: 'terminal', items: ['Node.js & Express.js', 'Auth & Sec (JWT, OAuth, bcrypt)', 'API Architecture & REST', 'Problem-Solving & Logic'] },
    { title: '// 03: DATABASE & DATA', icon: 'database', items: ['PostgreSQL & Relational SQL', 'MongoDB (NoSQL Engine)', 'Oracle Database Systems', 'Schema Design & Integrity'] },
    { title: '// 04: IT & LEADERSHIP', icon: 'hub', items: ['IT Support & Troubleshooting', 'Networking (LAN, WAN, VPN)', 'Team Leadership & People Mgmt', 'Project Mgmt & Strategic Planning'] },
  ],
  experience: [
    { period: 'JAN 2026 — PRESENT', role: 'FOUNDER & PRESIDENT', org: 'IntegraTech Society', location: 'University of Johannesburg · Auckland Park, Gauteng (Hybrid)', active: true, badge: 'ACTIVE LEADERSHIP',
      bullets: ['Founded an interdisciplinary tech community for UJ students across Engineering, Computer Science, IT, and Mathematics & Statistics.', 'Set society vision and strategy, spearheading planning and student engagement to connect members with industry partners and skill-building opportunities.'] },
    { period: 'MAY 2025 — JAN 2026', role: 'WEB DEV & SYS MAINTENANCE', org: 'Quadrupleplay Holdings (Pty) Ltd', location: 'Johannesburg, Gauteng (On-site)', badge: 'ENTERPRISE OPS',
      bullets: ['Worked directly under CEO supervision, collaborating with leadership on strategic technology initiatives and operations.', 'Supported core software development workflows and executed continuous system maintenance schedules.', 'Helped implement cloud and automation solutions to optimize operational efficiency and reliability.', 'Led the Technical Support Team in resolving complex network infrastructure and operations issues.'] },
    { period: 'MAR 2024 — MAY 2025', role: 'JR. FULL-STACK WEB DEV', org: 'Quadrupleplay Holdings (Pty) Ltd', location: 'Remote', badge: 'FULL-STACK DEV',
      bullets: ['Built and maintained responsive web applications using HTML, CSS, Bootstrap, Tailwind CSS, with back-ends in PHP, Node.js, and Express.js.', 'Maintained company web systems and created automation workflows for e-commerce platforms such as Shopify.', 'Engineered MySQL and SQL Server database schemas, managing hosting and production deployment via cPanel, FTP, and DNS.'] },
    { period: 'JAN 2024 — NOV 2024', role: 'INTERNET INSTALLATION TECH', org: 'Touch IT Networks', location: 'Johannesburg, Gauteng (On-site)', badge: 'INFRASTRUCTURE & NETWORKS',
      bullets: ['Installed and deployed servers, routers, switches, enterprise firewalls, and active networking hardware.', 'Structured, terminated, and validated physical cabling infrastructure including fibre optic and copper lines.', 'Deployed wireless access points and configured high-reliability corporate wireless networks.'] },
  ],
  leadership: [
    { period: 'OCT 2025 — JUL 2026', role: 'SPORTS COORDINATOR', org: 'Promaths Alumni, UJ Chapter', location: 'University of Johannesburg · Student Outreach', active: true, badge: 'STUDENT LEADERSHIP',
      bullets: ['Promoted student engagement and integration by welcoming and guiding new and continuing students.'] },
    { period: 'FEB 2025 — OCT 2025', role: 'MARKETING & MEDIA COORDINATOR', org: 'Promaths Alumni, UJ Chapter', location: 'Johannesburg, Gauteng', badge: 'BRAND & CAMPAIGNS',
      bullets: ['Planned, executed and monitored multi-channel campaigns across social media, email and digital ads.', 'Worked with creative teams on content aligned to brand objectives, and analysed campaign performance to drive improvements.'] },
    { period: 'VOLUNTEER INITIATIVE', role: 'DATA CAPTURING VOLUNTEER', org: 'Kutlwanong Centre for Maths, Science & Technology', location: 'Higher Education Funding Project', badge: 'STEM ADVOCACY & DATA',
      bullets: ['Supported data collection and statistical analysis for a higher education funding project.'] },
    { period: 'FEB 2023 — JAN 2024', role: 'STUDENT MENTOR', org: 'GrindClub Motive Africa', location: 'Gauteng, South Africa', badge: 'YOUTH MENTORSHIP',
      bullets: ['Mentored Grade 12 learners on career choices, leadership development and personal well-being.'] },
  ],
  certificates: [
    { image_url: '', cert_id: 'ID: JBSIL-PGB-2023-06712', tag: 'DISTINCTION', period: 'FEB 2023 — NOV 2027 (EXPECTED)', badge: 'GRADUATED WITH DISTINCTION',
      title: 'Programming & GRIT Bootcamp', issuer: 'Johannesburg Business School (JBS) Innovation Lab',
      description: 'Completed an intensive 3-month training and mentoring programme covering Python and data structures.',
      tags: ['Python', 'Data Structures', 'Algorithmic Logic', 'JBS Innovation'], footer: 'ISSUED BY JBS INNOVATION LAB', auth_label: 'AUTHENTICATED' },
    { image_url: '', cert_id: 'CREDENTIAL: ABC123XYZ789', tag: 'CISCO ACADEMY', period: 'OCTOBER 2023', badge: 'VERIFIED CREDENTIAL',
      title: 'Getting Started with Cisco Packet Tracer', issuer: 'Cisco Networking Academy',
      description: 'Hands-on simulation and configuration of complex enterprise network topologies, routing protocols, switches, and packet inspection.',
      tags: ['Cisco Systems', 'Packet Tracer', 'Network Topology', 'Protocol Simulation'], footer: 'CISCO NETWORKING ACADEMY', auth_label: 'AUTHENTICATED' },
  ],
};

const force = process.argv.includes('--force');
const { count } = await db.from('items').select('*', { count: 'exact', head: true });
if (count > 0 && !force) { console.log(`Database already has ${count} items. Use "npm run seed -- --force" to wipe and re-seed.`); process.exit(0); }
if (force) await db.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

const up = await db.from('site_settings').upsert({ key: 'site', data: site });
if (up.error) throw up.error;
const rows = Object.entries(items).flatMap(([collection, list]) => list.map((data, position) => ({ collection, position, data })));
const ins = await db.from('items').insert(rows);
if (ins.error) throw ins.error;
console.log(`Seeded site settings + ${rows.length} items.`);
