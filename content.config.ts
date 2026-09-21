import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const schema = z.object({
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  banner: z.string().optional(),
  noImage: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  wordCount: z.number().optional(),
  minutes: z.number().optional(),
})

export default defineContentConfig({
  collections: {
    blog: defineCollection({ type: 'page', source: 'blog/*.md', schema }),
    projects: defineCollection({ type: 'page', source: 'projects/*.md', schema }),
    blog_ar: defineCollection({ type: 'page', source: 'ar/blog/*.md', schema }),
    projects_ar: defineCollection({ type: 'page', source: 'ar/projects/*.md', schema }),
  },
})
