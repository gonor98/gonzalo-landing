import { Linkedin, Instagram, Mail, Globe, Building2, type LucideIcon } from "lucide-react";

export type Social = {
  name: string;
  handle: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export const SOCIALS: Social[] = [
  {
    name: "LinkedIn",
    handle: "@gonzaloacuna",
    href: "https://www.linkedin.com/in/gonzaloacuna",
    icon: Linkedin,
    external: true,
  },
  {
    name: "Instagram",
    handle: "@gonavacu",
    href: "https://www.instagram.com/gonavacu/",
    icon: Instagram,
    external: true,
  },
  {
    name: "PropMatch",
    handle: "@propmatch-mx",
    href: "https://www.linkedin.com/in/propmatch-mx/",
    icon: Building2,
    external: true,
  },
  {
    name: "Email",
    handle: "gonzalo@propmatchapp.com",
    href: "mailto:gonzalo@propmatchapp.com",
    icon: Mail,
  },
  {
    name: "Web",
    handle: "gonzaloacuna.com",
    href: "https://www.gonzaloacuna.com/",
    icon: Globe,
    external: true,
  },
];