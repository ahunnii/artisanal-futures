import type * as z from "zod";
import type { aboutPageSchema, attributeSchema } from "./schema";

export type AboutPageFormValues = z.infer<typeof aboutPageSchema>;
export type AttributeFormValues = z.infer<typeof attributeSchema>;

export type ContentColumn = {
  id: string;
  title: string;
  slug: string;
  updatedAt: string;
};

export type CategoryProductsColumn = {
  id: string;
  storeId: string;
  name: string;
  featuredImage: string | null | undefined;
};

export type BasicGraphQLPage = {
  page: {
    id: string;
    title: string;
    content: string;
    slug: string;
    updatedAt: string;
  };
};

export type BasicGraphQLPages = {
  pages: {
    id: string;
    title: string;
    content: string;
    slug: string;
    updatedAt: string;
  }[];
};

export type DocumentInStages = {
  stage: "PUBLISHED" | "DRAFT";
}[];

export type BlogPost = {
  id: string;
  storeId?: string;
  title: string;
  content: string;
  author?: string;
  slug: string;
  tags: string[];
  cover: string;
  createdAt: string;
  updatedAt: string;
  published?: boolean;
  stage?: string;
};

export type BlogPostsResponse = {
  blogPosts: (BlogPost & { documentInStages: DocumentInStages })[];
};

export type BlogPostResponse = {
  blogPost: {
    id: string;
    storeId?: string;
    title: string;
    content: string;
    author?: string;
    slug: string;
    tags: string[];
    cover: string;
    createdAt: string;
    updatedAt: string;
    published?: boolean;
    stage?: string;
    documentInStages: DocumentInStages;
  };
};

export type ShowcaseItem = {
  id: string;
  storeId?: string;
  title: string;
  description: string;
  image: string;
  alt: string;

  createdAt: string;
  updatedAt: string;
  published?: boolean;
  stage?: string;
};

export type ShowcaseItemsResponse = {
  showcaseItems: (ShowcaseItem & { documentInStages: DocumentInStages })[];
};

export type ShowcaseItemResponse = {
  showcaseItem: {
    id: string;
    storeId?: string;
    title: string;
    description: string;
    image: string;
    alt: string;
    createdAt: string;
    updatedAt: string;
    published?: boolean;
    stage?: string;
    documentInStages: DocumentInStages;
  };
};
export type CreateShowcaseItemResponse = {
  createShowcaseItem: {
    id: string;
    storeId?: string;
    title: string;
    description: string;
    image: string;
    alt: string;
    createdAt: string;
    updatedAt: string;
    published?: boolean;
    stage?: string;
    documentInStages: DocumentInStages;
  };
};
