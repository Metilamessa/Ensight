import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, AnchorProps } from "@mantine/core";
import { forwardRef } from "react";

interface NavLinkProps extends AnchorProps {
  href: string;
  label: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, label, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Anchor
        component={Link}
        href={href}
        className={`text-secondary transition-colors ${
          isActive
            ? "text-primary-accent"
            : "hover:text-primary-accent hover:[filter:brightness(var(--color-link-hover-brightness,1.15))]"
        }`}
        ref={ref}
        {...props}
      >
        {label}
      </Anchor>
    );
  }
);

NavLink.displayName = "NavLink";
