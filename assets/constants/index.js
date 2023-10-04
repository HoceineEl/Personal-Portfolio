import {
    mobile,
    backend,
    creator,
    web,

    devosoft,
    sosipo,
    a2st,
    carrent,
    jobit,
    tripguide,
} from "../assets";
import css from '../models/Tech/Css/scene.gltf?url'
import html from '../models/Tech/Html/scene.gltf?url'
import js from '../models/Tech/Js/scene.gltf?url'
import figma from '../models/Tech/figma/scene.gltf?url'
import github from '../models/Tech/github/scene.gltf?url'
import laravel from '../models/Tech/laravel/scene.gltf?url'
import MySql from '../models/Tech/MySql/scene.gltf?url'
import nuxt from '../models/Tech/nuxt/scene.gltf?url'
import vue from '../models/Tech/vue/scene.gltf?url'
import php from '../models/Tech/php/scene.gltf?url'
import tailwind from '../models/Tech/tailwind/scene.gltf?url'
import pc from '../models/pc/scene.gltf?url'
import Earth from '../models/planet/scene.gltf?url'
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
        name: "HTML 5",
        icon: html
    },
    {
        name: "CSS 3",
        icon: css,
    },
    {
        name: "JavaScript",
        icon: js,
    },

    {
        name: "Vue JS",
        icon: vue,
    },
    {
        name: "Nuxt Js",
        icon: nuxt,
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
    },
    {
        name: "MySql",
        icon: MySql,
    },
    {
        name: "Laravel",
        icon: laravel,
    },
    {
        name: "Github",
        icon: github,
    },

    {
        name: "figma",
        icon: figma,
    },
    {
        name: "Php",
        icon: php,
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
        name: "Car Rent",
        description:
            "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: carrent,
        source_code_link: "https://github.com/",
    },
    {
        name: "Job IT",
        description:
            "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "restapi",
                color: "green-text-gradient",
            },
            {
                name: "scss",
                color: "pink-text-gradient",
            },
        ],
        image: jobit,
        source_code_link: "https://github.com/",
    },
    {
        name: "Trip Guide",
        description:
            "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
        tags: [
            {
                name: "nextjs",
                color: "blue-text-gradient",
            },
            {
                name: "supabase",
                color: "green-text-gradient",
            },
            {
                name: "css",
                color: "pink-text-gradient",
            },
        ],
        image: tripguide,
        source_code_link: "https://github.com/",
    },
];

export { services, technologies, experiences, testimonials, projects, pc, Earth };