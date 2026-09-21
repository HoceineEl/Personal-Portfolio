import { experiences, openSource, profile, projects, services, socials } from '~~/assets/constants/index.js'
import { profileAr, projectsAr } from '~~/assets/constants/ar.js'

export const SITE = 'https://hoceine.com'

const featured = projects.filter((project) => project.featured)

const projectLine = (project: (typeof projects)[number]) =>
  `- [${project.name}](${SITE}${project.url}): ${project.tagline}. ${project.description}`

export const llmsHeader = () => [
  `# ${profile.name} (${profileAr.name})`,
  '',
  `> Freelance Laravel & Filament developer based in Morocco. Builds web platforms with Laravel (Livewire, Filament, Inertia with React or Vue), installable web apps (PWAs), Filament admin panels and plugins, and Arabic-first right-to-left products for clients in Saudi Arabia, the Gulf and the UK. Available for freelance and contract work: ${profile.email}, WhatsApp +${profile.whatsapp}.`,
  '',
  `The site is available in English (${SITE}) and Arabic (${SITE}/ar). Articles are in English.`,
  '',
]

export const llmsSummary = (articleCount: number) =>
  [
    ...llmsHeader(),
    '## Selected work',
    '',
    ...featured.map(projectLine),
    `- [All projects](${SITE}/projects)`,
    '',
    '## Services',
    '',
    ...services.map((service) => `- ${service.title}: ${service.body}`),
    '',
    '## Writing',
    '',
    `- [Blog](${SITE}/blog): ${articleCount} long-form guides on Laravel, FilamentPHP, Livewire, Pest and PHP.`,
    `- [RSS feed](${SITE}/rss.xml)`,
    '',
    '## Optional',
    '',
    `- [Full context for language models](${SITE}/llms-full.txt): every project, service, role and article in one file.`,
    `- [Arabic home page](${SITE}/ar)`,
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- WhatsApp: https://wa.me/${profile.whatsapp}`,
    ...socials.map((social) => `- ${social.name}: ${social.url}`),
    '',
  ].join('\n')

type Article = { title: string, path: string, description?: string, createdAt?: string, tags?: string[] }

export const llmsFull = (articles: Article[]) =>
  [
    ...llmsHeader(),
    '## About',
    '',
    profile.description,
    '',
    '## Projects',
    '',
    ...projects.flatMap((project) => [
      `### ${project.name}${projectsAr[project.url]?.name ? ` (${projectsAr[project.url].name})` : ''}`,
      '',
      `${project.tagline}. ${project.description}`,
      '',
      ...(project.highlights || []).map((item) => `- ${item}`),
      `- Year: ${project.year}${project.role ? `, role: ${project.role}` : ''}`,
      `- Stack: ${(project.stack || []).join(', ')}`,
      `- Case study: ${SITE}${project.url}`,
      ...(project.demo ? [`- Live: ${project.demo}`] : []),
      ...(project.source ? [`- Source: ${project.source}`] : []),
      '',
    ]),
    '## Services',
    '',
    ...services.map((service) => `- **${service.title}**: ${service.body}`),
    '',
    '## Experience',
    '',
    ...experiences.map((item) => `- **${item.title}, ${item.company_name}** (${item.date}): ${item.summary}`),
    '',
    '## Open source',
    '',
    ...openSource.map((repo) => `- [${repo.name}](${repo.url}): ${repo.body}`),
    '',
    '## Articles',
    '',
    ...articles.map(
      (article) =>
        `- [${article.title}](${SITE}${article.path})${article.createdAt ? ` (${article.createdAt.slice(0, 10)})` : ''}: ${article.description || ''}`
    ),
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- WhatsApp: https://wa.me/${profile.whatsapp}`,
    ...socials.map((social) => `- ${social.name}: ${social.url}`),
    '',
  ].join('\n')
