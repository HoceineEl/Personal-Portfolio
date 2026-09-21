export const SITE_URL = "https://hoceine.com";

export const profile = {
    name: "Hoceine El Idrissi",
    firstName: "Hoceine",
    role: "Full-stack web developer",
    email: "contact@hoceine.com",
    whatsapp: "212697361188",
    formEndpoint: "https://formsubmit.co/ajax/contact@hoceine.com",
    location: "Morocco",
    timezone: "Africa/Casablanca",
    photo: "/images/hoceine.jpeg",
    twitter: "@HoceineElidrisi",
    description:
        "Hoceine El Idrissi is a full-stack web developer in Morocco building web platforms, installable web apps (PWAs) and Filament admin panels, often in Arabic, for teams in Saudi Arabia, the UK and beyond.",
};

export const navLinks = [
    { id: "/#work", title: "Work" },
    { id: "/#services", title: "Services" },
    { id: "/#about", title: "About" },
    { id: "/blog", title: "Writing" },
];

export const services = [
    {
        title: "Web apps and platforms",
        body: "From a first version you can put in front of users to a platform with tenants, roles, billing and four languages. Laravel on the back, Livewire, React or Vue on the front, whichever fits.",
    },
    {
        title: "Installable web apps (PWAs)",
        body: "Phone-first web apps that install to the home screen, work offline for the basics and send push notifications, without an app store in the way. Nokhbat Alhoffaz and WiserPocket both work this way.",
    },
    {
        title: "Admin panels and Filament plugins",
        body: "Panels your operations team actually enjoys using. Custom resources, dashboards, bulk actions, and plugins built to the standard of FilamentCraft.",
    },
    {
        title: "Arabic-first and RTL products",
        body: "Right-to-left interfaces, bilingual content and Arabic copy that reads naturally, shipped for clients in Saudi Arabia, Morocco and across the region.",
    },
    {
        title: "Rescue and level up an existing app",
        body: "Slow queries, tangled controllers, no tests. I untangle it, add Pest coverage, and leave the codebase easier to change than I found it.",
    },
];

export const process = [
    {
        title: "A short call",
        body: "Thirty minutes to understand the business, the users and what done looks like. No slide decks.",
    },
    {
        title: "A scoped plan",
        body: "A written plan with milestones, trade-offs and a fixed price or weekly rate. You know what you get before you pay.",
    },
    {
        title: "Weekly working builds",
        body: "A deployed build every week on a staging URL. You click through real software, not status reports.",
    },
];

export const technologies = [
    { name: "Laravel", icon: "/images/tech/laravel.svg", group: "core" },
    { name: "FilamentPHP", icon: "/images/tech/filament.png", group: "core" },
    { name: "Livewire", icon: "/images/tech/livewire.png", group: "core" },
    { name: "Alpine.js", icon: "/images/tech/alpine.png", group: "core" },
    { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg", group: "core" },
    { name: "PHP", icon: "/images/tech/php.svg", group: "core" },
    { name: "Inertia.js", icon: "/images/tech/inertia.png", group: "also" },
    { name: "Vue", icon: "/images/tech/vue.svg", group: "also" },
    { name: "Nuxt", icon: "/images/tech/nuxt.svg", group: "also" },
    { name: "TypeScript", icon: "/images/tech/ts.svg", group: "also" },
    { name: "MySQL", icon: "/images/tech/mysql.svg", group: "also" },
    { name: "React", icon: "/images/tech/react.svg", group: "also" },
    { name: "PWA", icon: null, group: "also" },
    { name: "Pest", icon: null, group: "also" },
    { name: "Laravel Forge", icon: "/images/tech/forge.svg", group: "tools" },
    { name: "GitHub", icon: "/images/tech/github.svg", group: "tools" },
    { name: "Vite", icon: "/images/tech/vite.svg", group: "tools" },
    { name: "Claude Code", icon: "/images/tech/claude.png", group: "tools" },
];

export const experiences = [
    {
        title: "Founder & maintainer",
        company_name: "FilamentCraft",
        image: "/images/my_projects/filamentcraft/cover.webp",
        screenshot: true,
        url: "/projects/filamentcraft",
        date: "2026 – now",
        summary:
            "A commercial Shopify-style website builder for Filament 4 and 5, sold through its own Composer registry. 32 built-in sections, a no-code section builder and full RTL.",
    },
    {
        title: "TALL stack developer",
        company_name: "NewTags",
        date: "2024 – now",
        summary:
            "Client platforms for companies in Saudi Arabia: Mediano, Mwshor, Adiaf, the Ala Khutah jobs portal and EisarApp, from first migration to production.",
    },
    {
        title: "Full stack web developer",
        company_name: "Devosoft",
        date: "2022 – 2023",
        summary:
            "Night-time developer while finishing my studies. E-commerce platforms and learning management systems with Laravel, Filament, Vue, Nuxt and WordPress.",
    },
    {
        title: "Backend developer, intern",
        company_name: "SOSIPO · Ministry of Agriculture",
        url: "/projects/sosipo",
        date: "2023",
        summary:
            "Led a financial management app with role-based permissions and full accounting flows for an association affiliated with the ministry.",
    },
    {
        title: "Desktop developer, intern",
        company_name: "A2 Services et Technologies",
        date: "2022",
        summary: "A library management system in C#, WinForms and SQL Server. Where it all started.",
    },
];

export const projects = [
    {
        name: "FilamentCraft",
        tagline: "Visual website builder for Filament",
        description:
            "Turns any Filament panel into a Shopify-style site builder: drag sections onto a live canvas, edit against an iframe preview, publish. A commercial plugin with 32 sections, a no-code section builder, a store module and full RTL.",
        year: 2026,
        role: "Founder",
        platforms: "Filament plugin",
        stack: ["Filament 4 & 5", "Livewire", "TypeScript", "Pest"],
        cover: "builder",
        url: "/projects/filamentcraft",
        demo: "https://filamentcraft.dev?ref=portfolio",
        highlights: [
            "32 sections plus a no-code section builder",
            "Sold through its own Composer registry",
            "Filament 4 and 5 from one codebase",
        ],
        featured: true,
    },
    {
        name: "WiserPocket",
        tagline: "AI finance tracker you can talk to",
        description:
            "Log spending by talking or by snapping a receipt, then ask an AI assistant about your own money. Budgets, goals, debts and recurring transactions in four languages, installable on any phone.",
        year: 2025,
        role: "Solo",
        platforms: "Web, PWA",
        stack: ["Laravel", "React", "Inertia", "Gemini"],
        cover: "phone",
        image: "/images/my_projects/wiserpocket/cover.webp",
        screenshot: true,
        url: "/projects/wiserpocket",
        demo: "https://wiserpocket.com",
        highlights: [
            "Voice and receipt input",
            "Installable, with an AI assistant that has memory",
            "English, Arabic, French and Spanish",
        ],
        featured: true,
    },
    {
        name: "SmartShop",
        tagline: "Multi-vendor e-commerce platform",
        description:
            "Vendor stores with PayPal and Stripe, Aramex, DHL and FedEx shipping, a point-of-sale mode, and AI business insights. Multi-language and multi-currency.",
        year: 2024,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Livewire", "Filament", "Multi-tenant"],
        cover: "store",
        url: "/projects/smartshop",
        demo: "https://smartshop.ps",
        highlights: [
            "Stores for many vendors on one platform",
            "PayPal, Stripe, Aramex, DHL and FedEx",
            "Point of sale and a REST API",
        ],
        featured: true,
    },
    {
        name: "Adiaf",
        tagline: "Hajj operations platform",
        description:
            "Hajj operators in Saudi Arabia run the whole pilgrimage on it. Companies, centers, admins, attendants, guides and pilgrims each get their own panel, from registration and group assignment to the daily schedule.",
        year: 2024,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Filament", "Multi-panel", "RTL"],
        cover: "panels",
        url: "/projects/adiaf",
        highlights: [
            "Six role-based panels",
            "Pilgrim registration to completion",
            "Built for Ashraqat Company",
        ],
        featured: true,
    },
    {
        name: "Mediano",
        tagline: "Sports academy management",
        description:
            "One platform, many sports academies, each with its own branding, subscription and data. Training sessions, attendance, events, tournaments and merchandise sales in one place, evolving continuously since 2024.",
        year: 2024,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Livewire", "Filament", "Multi-tenant"],
        cover: "calendar",
        url: "/projects/mediano",
        highlights: [
            "A branded space per academy",
            "3,400+ commits since mid-2024",
            "Kept current up to Laravel 13 and Filament 5",
        ],
        featured: true,
    },
    {
        name: "Nokhbat Alhoffaz",
        tagline: "Quran and book-reading circles app",
        description:
            "A phone-first app for Quran memorisation circles. Teachers publish the day's portion on Tajweed mushaf pages, students send voice recitations, teachers reply by voice with a private score. Streaks, attendance and push reminders take care of themselves.",
        year: 2026,
        role: "Solo",
        platforms: "Installable web app",
        stack: ["Laravel 13", "React 19", "Filament 5", "Web Push"],
        cover: "voice",
        url: "/projects/nokhbat-alhoffaz",
        highlights: [
            "Voice recitations and voice replies",
            "Tajweed mushaf pages, Warsh narration",
            "Push reminders and automatic streaks",
        ],
        featured: true,
    },
    {
        name: "DecorCopilot",
        tagline: "AI interior design",
        description:
            "Photograph a room and restyle it in 30+ design styles with Google Gemini. Visual search, floor planning and suggestions you can act on, as an installable web app.",
        year: 2024,
        role: "Full stack",
        platforms: "Web, PWA",
        stack: ["Laravel", "Inertia", "Gemini", "PWA"],
        cover: "gallery",
        image: "/images/my_projects/decorcopilot/cover.webp",
        screenshot: true,
        url: "/projects/decorcopilot",
        demo: "https://decorcopilot.com",
        highlights: [
            "30+ design styles",
            "Google Gemini image generation",
            "Installable as a PWA",
        ],
        featured: true,
    },
    {
        name: "Ala Khutah",
        tagline: "Recruitment for a 470 km Hijra trail",
        description:
            "Jobs portal and workforce management for a historical Hijra route in Saudi Arabia: seven overnight stations over six months, with geographic filtering and competency scoring.",
        year: 2024,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Filament", "Arabic UI"],
        cover: "table",
        url: "/projects/alakhutah",
        demo: "https://jobs-app.alakhutah.com",
        featured: true,
    },
    {
        name: "Mwshor",
        tagline: "Project management for agencies",
        description:
            "Kanban boards, timelines and task management, with client panels so customers follow progress without a single status email.",
        year: 2024,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Livewire", "Filament", "Alpine.js"],
        cover: "kanban",
        url: "/projects/mwshor",
        featured: true,
    },
    {
        name: "EisarApp",
        tagline: "Training and compliance platform",
        description:
            "Training workflows for enterprise teams, with progress tracking, certifications and compliance reporting per organisation.",
        year: 2023,
        role: "Full stack",
        platforms: "Web",
        stack: ["Laravel", "Livewire", "Filament", "Multi-tenant"],
        cover: "chart",
        url: "/projects/eisarapp",
        featured: true,
    },
    {
        name: "Abi Zaid Association",
        tagline: "Management system for a Quran school",
        description:
            "Attendance, finances and role-based access for the Abi Zaid Al Qayrawani Association, with WhatsApp reminders sent to parents automatically.",
        year: 2023,
        role: "Solo",
        platforms: "Web",
        stack: ["Laravel", "Filament", "WhatsApp API"],
        cover: "calendar",
        url: "/projects/quran-association",
        demo: "https://abi-zaid.com",
        featured: true,
    },
    {
        name: "Eisar Reserve",
        tagline: "Room reservation system",
        description: "Bookings, calendar views and a themeable Filament admin for managing rooms and guests.",
        year: 2024,
        stack: ["Laravel", "Filament"],
        image: "/images/my_projects/eisar-reserve/mockup.jpg",
        url: "/projects/eisar-reserve",
        source: "https://github.com/HoceineEl/EisarReserve",
    },
    {
        name: "Radiant Emergency Plumber",
        tagline: "Marketing site for a Manchester plumber",
        description: "24/7 emergency plumbing site with seven service pages, built for local search.",
        year: 2023,
        stack: ["Nuxt", "Nuxt Content", "Tailwind CSS"],
        image: "/images/my_projects/rep/mockup.png",
        url: "/projects/radiant-emergency-plumber",
        demo: "https://radiantemergencyplumber.co.uk/",
    },
    {
        name: "HLS video in an LMS",
        tagline: "Adaptive streaming pipeline",
        description: "FFmpeg processing, watermarking, demo extraction and multi-bitrate HLS with Redis-backed queues.",
        year: 2023,
        stack: ["Laravel", "FFmpeg", "HLS.js", "Redis"],
        image: "/images/my_projects/lms/home.jpg",
        url: "/projects/enhancing-video-delivery-in-lms",
        demo: "https://youtu.be/5erufn_t5cc",
        source: "https://github.com/HoceineEl/LearningManagmentSystemeLaravel10",
    },
    {
        name: "SOSIPO Finance",
        tagline: "Accounting for a ministry association",
        description: "Role-based financial management with approvals, repayments and ChartJS reporting.",
        year: 2023,
        stack: ["Laravel", "MySQL", "Bootstrap"],
        image: "/images/my_projects/sosipo/mockup.png",
        url: "/projects/sosipo",
        source: "https://github.com/Hzekrii/SosipoProject",
    },
    {
        name: "Nur Net",
        tagline: "Content guard browser extension",
        description: "Blocks harmful sites and redirects to something worth your time. Chrome and Firefox.",
        year: 2023,
        stack: ["JavaScript", "WebExtensions"],
        image: "/images/my_projects/nurnet/logo.png",
        url: "/projects/nur-net",
        chrome: "https://chromewebstore.google.com/u/1/detail/nur-net-the-explicit-cont/enonjhmheggkloeodggkmcfhgppkbgai",
        firefox: "https://addons.mozilla.org/en-US/firefox/addon/nur-net-the-content-guard/",
        source: "https://github.com/HoceineEl/NurNet-chrome",
    },
    {
        name: "Remind Me · ذكرني",
        tagline: "Quran and azkar reminders extension",
        description: "Gentle notifications with verses, azkar or recitations through the day.",
        year: 2023,
        stack: ["JavaScript", "WebExtensions"],
        image: "/images/my_projects/dakkerni/tile.jpg",
        url: "/projects/remind-me",
        chrome: "https://chromewebstore.google.com/detail/remind-me-%D8%B0%D9%83%D8%B1%D9%86%D9%8A/lpkahcgbcaenijeaehcmaodpcacmogap",
        firefox: "https://addons.mozilla.org/en-US/firefox/addon/remind-me-%D8%B0%D9%83%D8%B1%D9%86%D9%8A/",
        source: "https://github.com/HoceineEl/dekr-reminder-chrome-extention",
    },
    {
        name: "YouTube Ad Skipper",
        tagline: "Browser extension",
        description: "Skips YouTube ads the moment the button appears.",
        year: 2023,
        stack: ["JavaScript", "WebExtensions"],
        image: "/images/my_projects/skipper/skipper.jpg",
        url: "/projects/youtube-ad-skipper",
        chrome: "https://chromewebstore.google.com/detail/legal-youtube-ad-skipper/ceccdngldibjefbfobnkmjaempfkmeke",
    },
    {
        name: "Islamic Trivia",
        tagline: "50-question knowledge quiz",
        description: "A quiz with tailored results and insight into each answer.",
        year: 2023,
        stack: ["JavaScript", "Tailwind CSS"],
        image: "/images/my_projects/quiz/banner.png",
        url: "/projects/islamic-trivia",
        demo: "https://islamictrivia.vercel.app/",
        source: "https://github.com/HoceineEl/Islamic_Quiz",
    },
];

export const openSource = [
    {
        name: "filament-modular-subscriptions",
        body: "Modular subscriptions for Filament with pricing and usage calculation.",
        url: "https://github.com/NewTags/filament-modular-subscriptions",
    },
    {
        name: "filament-usage-billing",
        body: "Metered, modular billing for multi-tenant Filament apps.",
        url: "https://github.com/HoceineEl/filament-usage-billing",
    },
    {
        name: "laravel-modular-subscriptions",
        body: "Subscriptions with custom modules for any Laravel app.",
        url: "https://github.com/HoceineEl/laravel-modular-subscriptions",
    },
    {
        name: "filament-scroll-navigator",
        body: "Scroll-to-top and scroll-to-bottom for long Filament pages.",
        url: "https://github.com/HoceineEl/filament-scroll-navigator",
    },
];

export const findProject = (path) => projects.find((project) => project.url === path);

export const socials = [
    { name: "GitHub", url: "https://github.com/hoceineel", icon: "/images/github.svg" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/elidrissihoceine/", icon: "/images/linkedin.svg" },
    { name: "YouTube", url: "https://www.youtube.com/@Hoceineelidrissi2", icon: "/images/youtube.svg" },
    { name: "Facebook", url: "https://www.facebook.com/hoceinelidrissi", icon: "/images/facebook.svg" },
];
