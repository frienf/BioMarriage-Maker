import { z } from 'zod';

export const BoxSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  w: z.number().min(0).max(1),
  h: z.number().min(0).max(1),
});

export const ManifestSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  canvas: z.object({ ratio: z.tuple([z.number().positive(), z.number().positive()]) }),
  photoSlot: z.object({
    shape: z.enum(['circle', 'rounded-rect', 'arch', 'svg-path']),
    box: BoxSchema,
    path: z.string().nullable(),
    radius: z.number().nullable(),
    inset: z.number().min(0).max(0.1),
  }),
  contentArea: BoxSchema,
  exclusions: z.array(BoxSchema),
  theme: z.object({
    text: z.string(),
    heading: z.string(),
    divider: z.string(),
    fontHeading: z.string(),
    fontBody: z.string(),
    baseSize: z.number().positive(),
  }),
  layoutHint: z.enum(['one-column', 'two-column']),
});

export type Manifest = z.infer<typeof ManifestSchema>;
export type Box = z.infer<typeof BoxSchema>;
