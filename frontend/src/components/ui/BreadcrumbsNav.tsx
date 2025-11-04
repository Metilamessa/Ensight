import { Breadcrumbs } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbsNav({ items, className }: BreadcrumbsNavProps) {
  return (
    <Breadcrumbs
      separator={<IconChevronRight size={16} className="text-secondary" />}
      className={`top-[90px] left-20 w-full z-10 flex flex-row items-center gap-2 ${
        className || ""
      }`}
    >
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          className={
            index === items.length - 1
              ? "text-primary-accent font-medium hover:underline"
              : "text-blueblack-white hover:text-primary-accent transition-colors "
          }
        >
          {item.label}
        </a>
      ))}
    </Breadcrumbs>
  );
}
