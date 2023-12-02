
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
        title: "Passionate Learner",
        icon: "/images/creator.png",
    },
];

const technologies = [
    {
        name: "Vue JS",
        icon: "/images/tech/vue.svg",
        progress: 90
    },
    {
        name: "Nuxt Js",
        icon: "/images/tech/nuxt.svg",
        progress: 95
    },
    {
        name: "Laravel",
        icon: "/images/tech/laravel.svg",
        progress: 80
    },
    {
        name: "Tailwind CSS",
        icon: "/images/tech/tailwind.svg",
        progress: 105
    },
    {
        name: "JavaScript",
        icon: "/images/tech/js.svg",
        progress: 75
    },
    {
        name: "HTML 5",
        icon: "/images/tech/html.svg",
        progress: 110
    },
    {
        name: "CSS 3",
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
        title: "Full Stack Web Developer",
        company_name: "Devosoft",
        icon: "/images/company/devosoft.png",
        iconBg: "#383E56",
        date: "November 2022 - September 2023     (5M By Night & 5M Full Time)",
        points: [
            "Balancing full-time studies at the Superior School of Technology with night-time internship as a Full Stack Web Developer at Devosoft startup.",
            " Explored diverse technologies, including Laravel, Figma, Vue.js, GitHub, and even ventured into WordPress.",
            "Successfully contributed to a variety of projects, from ecommerce management to LMSs, with a passion for tackling new challenges.",
            "Developed strong client communication skills and honed project planning abilities.",
            " Shared the love for learning by teaching others about technology."
        ],
    },

    {
        title: "Full Stack Laravel Developer",
        company_name: "SOSIPO(Ministry of Agriculture)",
        icon: "/images/company/sosipo.png",
        iconBg: "#E6DEDD",
        date: "Jan 2023 - March 2023",
        points: [
            "Developed a web app for the \"Ministry of Agriculture\" affiliated company as a year-end project, with a strong focus on learning how to secure applications by studying all possible security cases.",
            "Led a comprehensive project for the SOSIPO Amical Income Association, covering financial operations and more.",
            "Used Laravel, JavaScript, and Bootstrap for web development.",
            "Gained teamwork and client communication skills.",
        ],
    },
    {
        title: "Windows Forms .NET Developer",
        company_name: "A2 Services Et Technologies",
        icon: "/images/company/a2st.png",
        iconBg: "#383E56",
        date: "July 2022 - September 2022",
        points: [
            `Created a library management system using Windows Forms, SQL Server, and C#
            during my internship.`,
            "Gained valuable hands-on experience in application programming.",
            "Collaborated with the CEO to understand project requirements.",
            "Contributed to my skill set as a developer.",
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
    {
        name: "SOSIPO Financial Management App",
        description:
            "Developed a financial management web app for SOSIPO Association, automating processes, enhancing transparency, and boosting efficiency. Achieved financial stability and member satisfaction.",
        tags: [
            {
                name: "Laravel",
                color: "red-text-gradient",
            },
            {
                name: "MySql",
                color: "blue-text-gradient",
            },
            {
                name: "Bootstrap",
                color: "purple-text-gradient",
            },
            {
                name: "JavaScript",
                color: "yellow-text-gradient",
            },
            {
                name: "ChartJs",
                color: "pink-text-gradient",
            },
            {
                name: "Ajax",
                color: "green-text-gradient",
            },
        ],
        image: "/images/Projects/sosipo/dashboard-dark.jpg",
        demo: "https://youtu.be/P44KFiygTWo",
        source_code_link: "https://github.com/Hzekrii/SosipoProject",
    },
    {
        name: "Personal Portfolio Showcase",
        description:
            "In my portfolio project, I have showcased my expertise in Vue and Nuxt, integrating 3D models, and tackling complex challenges. I've delved into performance optimization techniques, demonstrating my commitment to creating efficient, interactive web experiences.",
        tags: [
            {
                name: "VueJs",
                color: "green-text-gradient",
            },
            {
                name: "TailwindcsCss",
                color: "blue-text-gradient",
            },
            {
                name: "NuxtJs",
                color: "green-text-gradient",
            },
            {
                name: "ThreeJs",
                color: "pink-text-gradient",
            },
            {
                name: "TresJs",
                color: "purple-text-gradient",
            },

        ],
        image: "/images/Projects/portfolio/hero.png",
        demo: "https://hoceine.vercel.app",
        source_code_link: "https://github.com/HoceineEl/Personal-Portfolio",
    },
    {
        name: "Streamlining Learning - Enhancing Video Delivery in LMS",
        description:
            "Integrate HLS into an LMS with ffmpeg, hls.js, and Plyr, enabling video lifecycle management, watermarking, demo extraction, bitrate encoding, segmentation, HLS formatting, MySQL storage, and multi-quality preview",
        tags: [
            {
                name: "Laravel",
                color: "red-text-gradient",
            },
            {
                name: "Javascript",
                color: "yellow-text-gradient",
            },
            {
                name: "FFMPEG",
                color: "green-text-gradient",
            },
            {
                name: "Plyr",
                color: "blue-text-gradient",
            },
            {
                name: "MySql",
                color: "pink-text-gradient",
            },
            {
                name: "Bootstrap",
                color: "purple-text-gradient",
            },
            {
                name: "HLS.js",
                color: "yellow-text-gradient",
            },
            {
                name: "Ajax",
                color: "purple-text-gradient",
            },

        ],
        image: "/images/Projects/lms/home.jpg",
        demo: "https://youtu.be/XZmX3QPkptQ",
        source_code_link: "https://github.com/HoceineEl/LearningManagmentSystemeLaravel10",
    },
    {
        name: "Nikee Website Revamp",
        description:
            "Revamped Nike's website with a contemporary design, optimized UI/UX, and dynamic sliders for a captivating user experience, enhancing brand engagement and online shopping satisfaction.",
        tags: [
            {
                name: "VueJs",
                color: "green-text-gradient",
            },
            {
                name: "TailwindCss",
                color: "blue-text-gradient",
            },
        ],
        image: "/images/Projects/nike/hero.jpg",
        source_code_link: "https://github.com/HoceineEl/nike-website",
        demo: "https://nikee.pages.dev"
    },
    {
        name: "Youtube Ad Skipper  Extention",
        description:
            "Innovated a Chrome and Firefox extension to automate YouTube ad skipping, enhancing the viewing experience. Simplify content consumption with a sleek and efficient ad skipper.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "Chrome Extention",
                color: "purple-text-gradient",
            },
            {
                name: "Firefox Extention",
                color: "blue-text-gradient",
            },
        ],
        image: "/images/Projects/skipper/skipper.png",
        source_code_link: "https://github.com/HoceineEl/Youtube-ad-skipper",
    },
    {
        name: "Nur Net Browser Extention",
        description:
            "Nur Net shields against distractions by blocking intensive websites, redirecting users to meaningful content. Take control of your online experience, staying focused on what matters most.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "Chrome Extention",
                color: "purple-text-gradient",
            },
            {
                name: "Firefox Extention",
                color: "blue-text-gradient",
            },
        ],
        image: "/images/Projects/nurnet/logo.png",
        source_code_link: "https://github.com/HoceineEl/NurNet-chrome",
    },
    {
        name: "Remind Me | ذكرني Extention",
        description:
            "Remind Me is your spiritual companion, sending customizable notifications with verses, Azkar, or Quranic recitations. Stay connected with Allah throughout your day.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "Chrome Extention",
                color: "purple-text-gradient",
            },
            {
                name: "Firefox Extention",
                color: "blue-text-gradient",
            },
        ],
        image: "/images/Projects/dakkerni/home.JPG",
        source_code_link: "https://github.com/HoceineEl/dekr-reminder-chrome-extention",
    },
    {
        name: "Islamic Trivia",
        description:
            "Developed an engaging Islamic quiz, testing knowledge with 50 questions. Tailored individual results with descriptions, offering a unique insight into each participant's understanding of Islam.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "JSON",
                color: "green-text-gradient",
            },
            {
                name: "TailwindCss",
                color: "blue-text-gradient",
            },
        ],
        image: "/images/Projects/quiz/home.jpg",
        demo: "https://islamictrivia.vercel.app/",
        source_code_link: "https://github.com/HoceineEl/Islamic_Quiz",
    },
    {
        name: "Hagman Game",
        description:
            "When I began my journey in learning JavaScript, I honed my logical thinking by creating a Hangman game, elevating it with complex features. This project showcases my growth and problem-solving skills in web development, highlighting the fun side of programming.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "Css",
                color: "blue-text-gradient",
            },

        ],
        image: "/images/Projects/hangman/home.png",
        demo: "https://hangman-ane.pages.dev/",
        source_code_link: "https://github.com/HoceineEl/hangman",
    },
];

export { services, technologies, experiences, testimonials, projects, portrait, Earth, };