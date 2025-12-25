
import portrait from '/models/portrait/scene.gltf?url'
import Earth from '/models/planet/scene.gltf?url'
export const navLinks = [
    {
        id: "#about",
        title: "About",
    },
    {
        id: "#work",
        title: "Work",
    },
    {
        id: "#projects",
        title: "Projects",
    },
    {
        id: "#contact",
        title: "Contact",
    },
    {
        id: "/blog",
        title: "Blog",
    },
];

const services = [
    {
        title: "Web Developer",
        icon: "/images/web.png",
    },
    {
        title: "Vue & Nuxt Developer",
        icon: "/images/mobile.png",
    },
    {
        title: "Laravel Developer",
        icon: "/images/backend.png",
    },
    {
        title: "Content Creator",
        icon: "/images/creator.png",
    },
];

const technologies = [
    {
        name: "VueJS",
        icon: "/images/tech/vue.svg",
        progress: 90
    },
    {
        name: "NuxtJs",
        icon: "/images/tech/nuxt.svg",
        progress: 95
    },
    {
        name: "Laravel",
        icon: "/images/tech/laravel.svg",
        progress: 80
    },
    {
        name: "TailwindCSS",
        icon: "/images/tech/tailwind.svg",
        progress: 105
    },
    {
        name: "Livewire",
        icon: "/images/tech/livewire.png",
        progress: 90
    },
    {
        name: "AlpineJs",
        icon: "/images/tech/alpine.png",
        progress: 80
    },
    {
        name: "FilamentPHP",
        icon: "/images/tech/filament.png",
        progress: 90
    },

    {
        name: "JavaScript",
        icon: "/images/tech/js.svg",
        progress: 75
    },
    {
        name: "HTML5",
        icon: "/images/tech/html.svg",
        progress: 110
    },
    {
        name: "CSS3",
        icon: "/images/tech/css.svg",
        progress: 110
    },

    {
        name: "PHP",
        icon: "/images/tech/php.svg",
        progress: 70
    },
    {
        name: "MySql",
        icon: "/images/tech/mysql.svg",
        progress: 70
    },
    {
        name: "Browser Extentions",
        icon: "/images/tech/browser-extention.svg",
        progress: 80
    },
    {
        name: "TypeScript",
        icon: "/images/tech/ts.svg",
        progress: 70
    },
    {
        name: "Github",
        icon: "/images/tech/github.svg",
        progress: 75
    },
    {
        name: "Vite",
        icon: "/images/tech/vite.svg",
        progress: 70
    },
    {
        name: "Figma",
        icon: "/images/tech/figma.svg",
        progress: 60
    },
    {
        name: "Bootstrap 5",
        icon: "/images/tech/bootstrap.svg",
        progress: 80
    },
    {
        name: "Wordpress",
        icon: "/images/tech/wordpress.svg",
        progress: 50
    },
    {
        name: "Vs Code",
        icon: "/images/tech/vscode.svg",
        progress: 90
    }
];

// const technologies_3d = [
//     {
//         name: "Vue JS",
//         icon: vue_3d,
//         progress: 90
//     },
//     {
//         name: "Nuxt Js",
//         icon: nuxt_3d,
//         progress: 95
//     },
//     {
//         name: "Laravel",
//         icon: laravel_3d,
//         progress: 80
//     },
//     {
//         name: "Tailwind CSS",
//         icon: tailwind_3d,
//         progress: 105
//     },
//     {
//         name: "JavaScript",
//         icon: js_3d,
//         progress: 75
//     },
//     {
//         name: "HTML 5",
//         icon: html_3d,
//         progress: 110
//     },
//     {
//         name: "CSS 3",
//         icon: css_3d,
//         progress: 110
//     },

//     {
//         name: "PHP",
//         icon: php_3d,
//         progress: 70
//     },
//     {
//         name: "MySql",
//         icon: MySql_3d,
//         progress: 70
//     },
//     {
//         name: "Github",
//         icon: github_3d,
//         progress: 75
//     },
//     {
//         name: "Vite",
//         icon: vite_3d,
//         progress: 70
//     },
//     {
//         name: "Figma",
//         icon: figma_3d,
//         progress: 60
//     },
//     {
//         name: "Bootstrap 5",
//         icon: bootstrap_3d,
//         progress: 80
//     },
//     {
//         name: "Wordpress",
//         icon: wordpress_3d,
//         progress: 50
//     },
// ];


const experiences = [
    {
        title: "Full Stack Developer",
        company_name: "NewTags",
        icon: "/images/company/newtags.svg",
        iconBg: "#CCFF00",
        date: "2024 - Present (2 Years)",
        points: [
            "Building multi-tenant SaaS applications using the TALL Stack (Tailwind, Alpine.js, Laravel, Livewire).",
            "Developed Mediano - Sports Academies Management SaaS with unique branding and subscription management per academy.",
            "Created Mwshor - Project Management Platform with Kanban boards, timelines, and client tracking.",
            "Contributed to EisarApp - Training SaaS with progress monitoring, certifications, and compliance management.",
            "Developed Ala Khutah - Job Posting Platform with candidate tracking and application management.",
            "Built Adiaf - Wholesale E-commerce Platform with complex pricing tiers and inventory management.",
            "Architected and deployed multiple production SaaS products serving hundreds of users.",
        ],
    },
    {
        title: "Full Stack Web Developer",
        company_name: "Devosoft",
        icon: "/images/company/devosoft.png",
        iconBg: "#383E56",
        date: "November 2022 - September 2023",
        points: [
            "Balanced full-time studies with night-time internship as a Full Stack Web Developer.",
            "Explored diverse technologies including Laravel, Filament, Vue.js, Nuxt.js, and WordPress.",
            "Contributed to various projects from e-commerce platforms to Learning Management Systems.",
            "Developed strong client communication skills and project planning abilities.",
        ],
    },
    {
        title: "Backend Developer (Intern)",
        company_name: "SOSIPO (Ministry of Agriculture)",
        icon: "/images/company/sosipo.png",
        iconBg: "#E6DEDD",
        date: "Jan 2023 - March 2023",
        points: [
            "Led a financial project using Laravel, JavaScript, and Bootstrap for the Ministry of Agriculture.",
            "Implemented role-based permissions and comprehensive accounting features.",
            "Focused on application security by studying all possible security cases.",
            "Gained teamwork and client communication skills.",
        ],
    },
    {
        title: "WinForms Developer (Intern)",
        company_name: "A2 Services Et Technologies",
        icon: "/images/company/a2st.png",
        iconBg: "#383E56",
        date: "July 2022 - September 2022",
        points: [
            "Created a library management system using Windows Forms, SQL Server, and C#.",
            "Gained valuable hands-on experience in application programming.",
            "Collaborated with the CEO to understand project requirements.",
            "Contributed to foundational skills as a developer.",
        ],
    },
];

const testimonials = [
    {
        testimonial:
            "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
        name: "Sara Lee",
        designation: "CFO",
        company: "Acme Co",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        testimonial:
            "I've never met a web developer who truly cares about their clients' success like Rick does.",
        name: "Chris Brown",
        designation: "COO",
        company: "DEF Corp",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        testimonial:
            "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
        name: "Lisa Wang",
        designation: "CTO",
        company: "456 Enterprises",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
];

const projects = [
    // === FEATURED SAAS PROJECTS ===
    {
        name: "DecorCopilot – AI Interior Design SaaS",
        description:
            "AI-powered room transformation platform using Google Gemini. Features 30+ design styles, visual search, floor planning, and actionable design suggestions. PWA-enabled with dark/light themes.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Google Gemini", color: "blue-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/decorcopilot/mockup.png",
        noImage: true,
        demo: "https://decorcopilot.com",
        url: "/projects/decorcopilot",
        featured: true,
    },
    {
        name: "WiserPocket – Financial Management Platform",
        description:
            "Personal finance tracking with AI chat assistance, budgeting tools, expense categorization, and analytics dashboard. Features voice input, transaction management, and financial goal tracking.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "AI Chat", color: "green-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/wiserpocket/mockup.png",
        noImage: true,
        demo: "https://wiserpocket.com",
        url: "/projects/wiserpocket",
        featured: true,
    },
    {
        name: "SmartShop – Multi-Tenant E-Commerce Platform",
        description:
            "Cloud-based e-commerce SaaS with vendor stores, payment integration (PayPal, Stripe), shipping logistics (Aramex, DHL, FedEx), POS system, and AI-powered business insights. Multi-language and multi-currency support.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Multi-tenant", color: "green-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/smartshop/mockup.png",
        noImage: true,
        demo: "https://smartshop.ps",
        url: "/projects/smartshop",
        featured: true,
    },
    {
        name: "Mediano – Sports Academies Management SaaS",
        description:
            "Multi-tenant SaaS for sports academies with unique branding, subscription management, and secure access per academy. All-in-one solution for training sessions, attendance tracking, events, and sales.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "Alpine.js", color: "blue-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Multi-tenant", color: "green-text-gradient" },
        ],
        image: "/images/my_projects/mediano/mockup.png",
        noImage: true,
        url: "/projects/mediano",
        featured: true,
    },
    {
        name: "Mwshor – SaaS Project Management Platform",
        description:
            "Multi-tenant project management SaaS with Kanban boards, timelines, and comprehensive task management. Client tracking through personalized panels, scalable for any industry.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "Alpine.js", color: "blue-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/mwshor/mockup.png",
        noImage: true,
        url: "/projects/mwshor",
        featured: true,
    },
    {
        name: "Adiaf – Hajj Management SaaS System",
        description:
            "Comprehensive multi-tenant Hajj management SaaS with role-based panels. Distinct spaces for Company, Center, Admin, Attendant, Guide, and Pilgrim. Full workflow automation for pilgrimage operations.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Multi-tenant", color: "green-text-gradient" },
            { name: "Role-based", color: "pink-text-gradient" },
        ],
        image: "/images/my_projects/adiaf/mockup.png",
        noImage: true,
        url: "/projects/adiaf",
        featured: true,
    },
    {
        name: "Ala Khutah – Historical Hijra Journey Platform",
        description:
            "Jobs portal and workforce management for a 470km historical Hijra path project in Saudi Arabia with 7 overnight stations over 6 months. Features recruitment portal with geographic filtering and competency assessment.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Arabic UI", color: "green-text-gradient" },
        ],
        image: "/images/my_projects/alakhutah/mockup.png",
        noImage: true,
        demo: "https://jobs-app.alakhutah.com",
        url: "/projects/alakhutah",
        featured: true,
    },
    {
        name: "EisarApp – Multi-Tenant Training SaaS",
        description:
            "Multi-tenant SaaS for training workflows and employee development. Features progress monitoring with certifications and compliance management. Scalable architecture for enterprise training needs.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Multi-tenant", color: "green-text-gradient" },
        ],
        image: "/images/my_projects/eisarapp/mockup.png",
        noImage: true,
        url: "/projects/eisarapp",
        featured: true,
    },
    {
        name: "Quran Association Management System",
        description:
            "Comprehensive management system for Abi Zaid Al Qayrawani Association. Manages attendance, finances, and role-based access. Integrated WhatsApp API for automated reminders and parent messaging.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "WhatsApp API", color: "green-text-gradient" },
        ],
        image: "/images/my_projects/quran-association/mockup.png",
        noImage: true,
        url: "/projects/quran-association",
    },
    // === OTHER PROJECTS ===
    {
        name: "Radiant Emergency Plumber",
        description:
            "Professional website for Manchester Plumbing Services with 24/7 emergency response. Features 7+ service pages, SEO optimization, and modern responsive design. Over 18 years of expertise showcased.",
        tags: [
            { name: "Vue.js", color: "green-text-gradient" },
            { name: "Nuxt.js", color: "green-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
            { name: "Nuxt Content", color: "purple-text-gradient" },
        ],
        image: "/images/my_projects/rep/mockup.png",
        demo: "https://radiantemergencyplumber.co.uk/",
        url: "/radiant-emergency-plumber",
        source_code_link: "https://github.com/hoceineel/rep",
    },
    {
        name: "Eisar Reserve – Room Reservation System",
        description:
            "Comprehensive room reservation system with booking management, calendar integration, and admin dashboard. Built with FilamentPHP for a powerful admin experience.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "FilamentPHP", color: "yellow-text-gradient" },
            { name: "Livewire", color: "purple-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/eisar-reserve/mockup.jpg",
        url: "/eisar-reserve",
        source_code_link: "https://github.com/HoceineEl/EisarReserve",
    },
    {
        name: "SOSIPO Financial Management App",
        description:
            "Financial management web app for Ministry of Agriculture affiliated association. Features role-based permissions, accounting operations, and comprehensive reporting with ChartJS visualizations.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "MySQL", color: "blue-text-gradient" },
            { name: "Bootstrap", color: "purple-text-gradient" },
            { name: "ChartJS", color: "pink-text-gradient" },
        ],
        image: "/images/my_projects/sosipo/mockup.png",
        demo: "https://youtu.be/LHKfUdVW8VA",
        url: "/sosipo",
        source_code_link: "https://github.com/Hzekrii/SosipoProject",
    },
    {
        name: "Personal Portfolio & Blog",
        description:
            "Neo-Brutalism designed portfolio with 3D elements, dark/light mode, and integrated blog. Showcases expertise in Vue, Nuxt, and modern web technologies with performance optimization.",
        tags: [
            { name: "Vue.js", color: "green-text-gradient" },
            { name: "Nuxt.js", color: "green-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
            { name: "Three.js", color: "pink-text-gradient" },
        ],
        image: "/images/my_projects/portfolio/mockup.png",
        demo: "https://hoceine.com",
        url: "/personal-portfolio",
        source_code_link: "https://github.com/HoceineEl/Personal-Portfolio",
    },
    {
        name: "HLS Video Streaming in LMS",
        description:
            "Advanced video delivery system with HLS integration, FFMPEG processing, watermarking, demo extraction, multi-bitrate encoding, and Redis caching. Multi-quality preview with Plyr player.",
        tags: [
            { name: "Laravel", color: "red-text-gradient" },
            { name: "FFMPEG", color: "green-text-gradient" },
            { name: "HLS.js", color: "yellow-text-gradient" },
            { name: "Redis", color: "red-text-gradient" },
        ],
        image: "/images/my_projects/lms/home.jpg",
        demo: "https://youtu.be/5erufn_t5cc",
        url: "/enhancing-video-delivery-in-lms",
        source_code_link: "https://github.com/HoceineEl/LearningManagmentSystemeLaravel10",
    },
    {
        name: "Nur Net Browser Extension",
        description:
            "Content guard extension that shields against distractions by blocking intensive websites and redirecting to meaningful content. Available on Chrome and Firefox.",
        tags: [
            { name: "JavaScript", color: "yellow-text-gradient" },
            { name: "Chrome Extension", color: "purple-text-gradient" },
            { name: "Firefox Extension", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/nurnet/logo.png",
        url: "/nur-net",
        demo: "https://youtu.be/0HaLcNqbKCI",
        chrome: 'https://chromewebstore.google.com/u/1/detail/nur-net-the-explicit-cont/enonjhmheggkloeodggkmcfhgppkbgai',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/nur-net-the-content-guard/',
        source_code_link: "https://github.com/HoceineEl/NurNet-chrome",
    },
    {
        name: "Remind Me | ذكرني Extension",
        description:
            "Spiritual companion extension sending customizable notifications with Quranic verses, Azkar, or recitations. Stay connected with Allah throughout your day.",
        tags: [
            { name: "JavaScript", color: "yellow-text-gradient" },
            { name: "Chrome Extension", color: "purple-text-gradient" },
            { name: "Firefox Extension", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/dakkerni/tile.jpg",
        url: "/remind-me",
        chrome: "https://chromewebstore.google.com/detail/remind-me-%D8%B0%D9%83%D8%B1%D9%86%D9%8A/lpkahcgbcaenijeaehcmaodpcacmogap",
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/remind-me-%D8%B0%D9%83%D8%B1%D9%86%D9%8A/',
        source_code_link: "https://github.com/HoceineEl/dekr-reminder-chrome-extention",
    },
    {
        name: "YouTube Ad Skipper Extension",
        description:
            "Chrome and Firefox extension to automate YouTube ad skipping, enhancing the viewing experience with a sleek and efficient interface.",
        tags: [
            { name: "JavaScript", color: "yellow-text-gradient" },
            { name: "Chrome Extension", color: "purple-text-gradient" },
            { name: "Firefox Extension", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/skipper/skipper.jpg",
        chrome: "https://chromewebstore.google.com/detail/legal-youtube-ad-skipper/ceccdngldibjefbfobnkmjaempfkmeke",
        url: "/youtube-ad-skipper",
    },
    {
        name: "Islamic Trivia Quiz",
        description:
            "Engaging Islamic knowledge quiz with 50 questions, tailored results, and personalized insights into each participant's understanding of Islam.",
        tags: [
            { name: "JavaScript", color: "yellow-text-gradient" },
            { name: "Tailwind CSS", color: "blue-text-gradient" },
        ],
        image: "/images/my_projects/quiz/banner.png",
        demo: "https://islamictrivia.vercel.app/",
        url: "/islamic-trivia",
        source_code_link: "https://github.com/HoceineEl/Islamic_Quiz",
    },
];

const socials = [
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/hoceinelidrissi',
        icon: '/images/facebook.svg'
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/@Hoceineelidrissi2',
        icon: '/images/youtube.svg'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/elidrissihoceine/',
        icon: '/images/linkedin.svg'
    },
    {
        name: 'Github',
        url: 'https://github.com/hoceineel',
        icon: '/images/github.svg'
    }
]
export { socials, services, technologies, experiences, testimonials, projects, portrait, Earth, };