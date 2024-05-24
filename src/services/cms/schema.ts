import * as z from "zod";

export const attributeSchema = z.object({
  name: z.string().min(2),
  values: z
    .array(
      z.object({
        content: z.string(),
      })
    )
    .refine(
      (input) => {
        return !!(input.flatMap((val) => val.content).join("").length > 0);
      },
      {
        message: "You need at least one value for your attribute.",
        path: ["0.content"],
      }
    ),
});

export const aboutPageSchema = z.object({
  title: z.string(),
  content: z.string(),
  slug: z.string(),
});

export const showcaseItemSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  alt: z.string().optional().default(""),
  image: z.string(),
});
