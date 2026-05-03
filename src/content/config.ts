import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    displayDate: z.string().optional(),
    rank: z.number(),
    published: z.boolean().default(true),
  }),
});

const people = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    rank: z.number(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.string(),
    displayDate: z.string().optional(),
    rank: z.number(),
    published: z.boolean().default(true),
    pdf: z.string().optional(),
    pdfLabel: z.string().optional(),
    cover: z.string().optional(),
    carousel: z.boolean().optional(),
    carouselInstruction: z.string().optional(),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { news, people, notes };
