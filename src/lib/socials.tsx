import type { ComponentType, SVGProps } from "react";
import { Mail, Globe, Building2 } from "lucide-react";

type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

const LinkedinIcon: IconCmp = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 16} height={props.size ?? 16} {...props}>
    <path d="M20.451 20.452h-3.555v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.353V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.063 2.063 0 11.001-4.127 2.063 2.063 0 010 4.127zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon: IconCmp = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size ?? 16} height={props.size ?? 16} {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.327 3.608 1.302.975.975 1.24 2.242 1.302 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.327 2.633-1.302 3.608-.975.975-2.242 1.24-3.608 1.302-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.327-3.608-1.302-.975-.975-1.24-2.242-1.302-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.327-2.633 1.302-3.608C4.51 2.567 5.777 2.302 7.143 2.24 8.41 2.175 8.79 2.163 12 2.163zm0 1.838c-3.155 0-3.523.012-4.766.069-1.024.047-1.58.218-1.95.363-.49.19-.84.418-1.207.785-.367.367-.594.717-.785 1.207-.145.37-.316.926-.363 1.95-.057 1.243-.069 1.611-.069 4.766s.012 3.523.069 4.766c.047 1.024.218 1.58.363 1.95.19.49.418.84.785 1.207.367.367.717.594 1.207.785.37.145.926.316 1.95.363 1.243.057 1.611.069 4.766.069s3.523-.012 4.766-.069c1.024-.047 1.58-.218 1.95-.363.49-.19.84-.418 1.207-.785.367-.367.594-.717.785-1.207.145-.37.316-.926.363-1.95.057-1.243.069-1.611.069-4.766s-.012-3.523-.069-4.766c-.047-1.024-.218-1.58-.363-1.95a3.252 3.252 0 00-.785-1.207 3.252 3.252 0 00-1.207-.785c-.37-.145-.926-.316-1.95-.363C15.523 4.013 15.155 4 12 4zm0 3.838a4.162 4.162 0 110 8.324 4.162 4.162 0 010-8.324zm0 6.862a2.7 2.7 0 100-5.4 2.7 2.7 0 000 5.4zm5.298-7.027a.974.974 0 11-1.948 0 .974.974 0 011.948 0z" />
  </svg>
);

export type Social = {
  name: string;
  handle: string;
  href: string;
  icon: IconCmp;
  external?: boolean;
};

export const SOCIALS: Social[] = [
  {
    name: "LinkedIn",
    handle: "@gonzaloacuna",
    href: "https://www.linkedin.com/in/gonzaloacuna",
    icon: LinkedinIcon,
    external: true,
  },
  {
    name: "Instagram",
    handle: "@gonavacu",
    href: "https://www.instagram.com/gonavacu/",
    icon: InstagramIcon,
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