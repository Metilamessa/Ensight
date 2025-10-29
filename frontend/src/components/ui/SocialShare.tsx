import { Group, Text } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: IconBrandLinkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: IconBrandTwitter,
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: IconBrandFacebook,
  },
  {
    name: "Email",
    href: "mailto:example@example.com",
    icon: IconMail,
  },
];

export function SocialShare() {
  return (
    <Group gap="md" className="flex mb-4">
      <Text className="font-serif text-blueblack-white" size="sm">
        Share:
      </Text>
      {socialLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blueblack-white text-surface text-xs px-3 py-1.5 rounded-full no-underline transition"
        >
          <link.icon size={16} />
          {link.name}
        </Link>
      ))}
    </Group>
  );
}
