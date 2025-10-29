// src/components/ui/NavLink.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Anchor, AnchorProps } from "@mantine/core";
import { forwardRef } from "react";

interface SubmenuItem {
  label: string;
  href: string;
}

interface NavLinkProps extends AnchorProps {
  href: string;
  label: string;
  submenu?: SubmenuItem[];
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, label, submenu, ...props }, ref) => {
    const pathname = usePathname();
    const isActive =
      pathname === href ||
      (submenu?.some((item) => pathname === item.href) ?? false);

    if (submenu) {
      return (
        <Menu trigger="hover" shadow="md" radius="md" offset={10}>
          <Menu.Target>
            <Anchor
              component="button"
              className={`text-text-secondary transition-colors ${
                isActive ? "text-primary-accent" : "hover:text-primary-accent"
              }`}
              //eslint-disable-next-line
              ref={ref as any}
              {...props}
            >
              {label}
            </Anchor>
          </Menu.Target>
          <Menu.Dropdown className="bg-surface border-border shadow-card z-[1000]">
            {submenu.map((item) => (
              <Menu.Item
                key={item.href}
                component={Link}
                href={item.href}
                className={`text-text-secondary hover:text-primary-accent hover:bg-surface-alt px-4 py-2 ${
                  pathname === item.href ? "text-primary-accent" : ""
                }`}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Anchor
        component={Link}
        href={href}
        className={`text-text-secondary transition-colors ${
          isActive ? "text-primary-accent" : "hover:text-primary-accent"
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
