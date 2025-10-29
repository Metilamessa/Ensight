import Link from "next/link";
import { Text, Anchor } from "@mantine/core";
import { Footermenus } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary font-serif font-bold text-lg mb-4">
              Ensight
            </h3>
            <Text className="text-muted font-serif">
              Actionable business intelligence focused on Africa’s growth
              sectors.
            </Text>
          </div>

          {Footermenus.map((menu) => (
            <div key={menu.title}>
              <h4 className="text-primary font-serif font-semibold mb-4">
                {menu.title}
              </h4>
              <ul className="space-y-2">
                {menu.items.map((item) => (
                  <li key={item.label}>
                    <Anchor
                      component={Link}
                      href={item.href}
                      className="text-secondary font-serif hover:text-primary-accent"
                    >
                      {item.label}
                    </Anchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center">
          <Text className="text-muted font-serif text-sm">
            © 2025 Ensight. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
