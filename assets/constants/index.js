import {
    mobile,
    backend,
    creator,
    web,

    devosoft,
    sosipo,
    a2st,
    sosipo_dashboard,
    nike_hero,
    islamic_home,
    stock_home,
    hangman_home,
    portfolio_hero,
} from "../assets";
import css from '/models/Tech/Css/scene.gltf?url'
import html from '/models/Tech/Html/scene.gltf?url'
import js from '/models/Tech/Js/scene.gltf?url'
import figma from '/models/Tech/figma/scene.gltf?url'
import github from '/models/Tech/github/scene.gltf?url'
import laravel from '/models/Tech/laravel/scene.gltf?url'
import MySql from '/models/Tech/MySql/scene.gltf?url'
import nuxt from '/models/Tech/nuxt/scene.gltf?url'
import vue from '/models/Tech/vue/scene.gltf?url'
import php from '/models/Tech/php/scene.gltf?url'
import tailwind from '/models/Tech/tailwind/scene.gltf?url'
import bootstrap from '/models/Tech/Bootstrap/scene.gltf?url'
import vite from '/models/Tech/vite/scene.gltf?url'
import portrait from '/models/portrait/scene.gltf?url'
import Earth from '/models/planet/scene.gltf?url'
export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Work",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Web Developer",
        icon: web,
    },
    {
        title: "Vue & Nuxt Developer",
        icon: mobile,
    },
    {
        title: "Laravel Developer",
        icon: backend,
    },
    {
        title: "Passionate Learner",
        icon: creator,
    },
];

const technologies = [
    {
        name: "Vue JS",
        icon: vue,
        progress: 90
    },
    {
        name: "Nuxt Js",
        icon: nuxt,
        progress: 95
    },
    {
        name: "Laravel",
        icon: laravel,
        progress: 80
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
        progress: 105
    },
];
const sub_technologies = [

    {
        name: "JavaScript",
        icon: js,
        progress: 75
    },
    {
        name: "HTML 5",
        icon: html,
        progress: 110
    },
    {
        name: "CSS 3",
        icon: css,
        progress: 110
    },

    {
        name: "PHP",
        icon: php,
        progress: 70
    },
    {
        name: "MySql",
        icon: MySql,
        progress: 70
    },
]
const other_technologies = [
    {
        name: "Github",
        icon: github,
        progress: 75
    },
    {
        name: "Vite",
        icon: vite,
        progress: 70
    },
    {
        name: "Figma",
        icon: figma,
        progress: 60
    },
    {
        name: "Bootstrap 5",
        icon: bootstrap,
        progress: 80
    },
];

const experiences = [
    {
        title: "Full Stack Web Developer",
        company_name: "Devosoft",
        icon: devosoft,
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
        icon: sosipo,
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
        icon: a2st,
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
        name: "SOSIPO Association",
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
        image: sosipo_dashboard,
        source_code_link: "https://github.com/Hzekrii/SosipoProject",
    },
    {
        name: "Personal Portfolio",
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
        image: portfolio_hero,
        demo: "https://hoceine.vercel.app",
        source_code_link: "https://github.com/HoceineEl/Personal-Portfolio",
    },
    {
        name: "Nikee",
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
        image: nike_hero,
        source_code_link: "https://github.com/HoceineEl/nike-website",
        demo: "https://nikee.pages.dev"
    },
    {
        name: "Stock Management",
        description:
            "The stock management project led to a comprehensive web app, enhancing business efficiency by handling products, orders, clients, suppliers, and more. Our teamwork boosted web development skills, and we're proud of our tailored solution. Thanks to Professor D. Jamal BAKKAS for the support.",
        tags: [
            {
                name: "VanillaJs",
                color: "yellow-text-gradient",
            },
            {
                name: "PHP",
                color: "blue-text-gradient",
            },
            {
                name: "Bootstrap",
                color: "purple-text-gradient",
            },
            {
                name: "Css",
                color: "pink-text-gradient",
            },
            {
                name: "MySql",
                color: "red-text-gradient",
            },
            {
                name: "Ajax",
                color: "green-text-gradient",
            },
        ],
        image: stock_home,
        source_code_link: "https://github.com/HoceineEl/StockManagment",
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
        image: islamic_home,
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
        image: hangman_home,
        demo: "https://hangman-ane.pages.dev/",
        source_code_link: "https://github.com/HoceineEl/hangman",
    },
];

export { services, technologies, experiences, testimonials, projects, portrait, Earth, other_technologies, sub_technologies };