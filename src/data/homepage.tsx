import { Cog, GraduationCap, Store } from "lucide-react";
export const CARD_DATA = [
  {
    link: "/shops",
    title: "Browse our shops",
    icon: <Store className="h-8 w-8 text-muted-foreground" />,
    description: "Browse our artisan's shops and sites",
  },
  {
    link: "/forum",
    title: "Share Knowledge",
    icon: <GraduationCap className="h-8  w-8  text-muted-foreground" />,
    description: "Share your artisanal knowledge with others",
  },
  {
    link: "/tools",
    title: "Utilize Free Tools",
    icon: <Cog className="h-8  w-8  text-muted-foreground" />,
    description: "Use our collection of free tools",
  },
];
