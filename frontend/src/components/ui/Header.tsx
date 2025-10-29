"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Burger, Group, ActionIcon, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSun,
  IconMoon,
  IconUserCircle,
  IconChevronDown,
} from "@tabler/icons-react";
import { useTheme } from "@/lib/theme";
import { SharedButton } from "@/components/ui/SharedButton";
import Image from "next/image";
import { navItems } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Menu } from "@mantine/core";
import { IconSettings, IconUser } from "@tabler/icons-react";

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useTheme();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(
    null
  );

  // Move localStorage check to useEffect
  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.localStorage) {
  //     const user = localStorage.getItem("user");
  //     if (user) {
  //       try {
  //         const parsedUser = JSON.parse(user);
  //         setRole(parsedUser.role || null);
  //       } catch (error) {
  //         console.error("Error parsing user data:", error);
  //       }
  //     }
  //     setLoggedIn(!!user); // Combine with existing isLoggedIn logic
  //   }
  // }, [setLoggedIn]); // Dependency array includes setLoggedIn
  useEffect(() => {
  if (typeof window === "undefined" || !window.localStorage) return;

  const user = localStorage.getItem("user");

  // Guard against invalid or undefined values
  if (user && user !== "undefined" && user !== "null") {
    try {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser?.role || null);
      setLoggedIn(true);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLoggedIn(false);
    }
  } else {
    // No valid user in localStorage
    setLoggedIn(false);
  }
}, [setLoggedIn]);


  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredMenu(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 200);
  };

  const toggleMobileSubmenu = (label: string) => {
    if (mobileSubmenuOpen === label) {
      setMobileSubmenuOpen(null);
    } else {
      setMobileSubmenuOpen(label);
    }
  };

  const handleMobileSubmenuClick = (href: string) => {
    close();
    setMobileSubmenuOpen(null);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1E3A5F] shadow-sm">
      <div className="container flex flex-wrap items-center justify-between px-6 py-3 mx-auto gap-y-2 md:px-20">
        <Link href="/" className="text-2xl font-bold text-white">
          <Image
            src="/images/new-red-logo.png"
            alt="Ensight Logo"
            className="hidden h-12 md:block"
            width={150}
            height={55}
          />
          <Image
            src="/images/mobile-logo.png"
            alt="Ensight Logo"
            className="block h-12 md:hidden"
            width={50}
            height={30}
          />
        </Link>

        <nav className="relative flex-wrap hidden max-w-full space-x-3 md:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-1 text-white text-sm font-medium hover:text-[#D93A3A] px-1.5 py-1 cursor-pointer transition-colors">
                <Link
                  href={item.href || "#"}
                  className="flex items-center space-x-1"
                >
                  {item.label}
                </Link>
                {item.submenu?.length > 0 && (
                  <IconChevronDown
                    size={16}
                    className="text-white group-hover:text-[#D93A3A]"
                  />
                )}
                {item.badge && (
                  <span className="ml-1 text-xs bg-[#D93A3A] text-white rounded px-1 py-0.5">
                    {item.badge}
                  </span>
                )}
              </div>

              {item.submenu && hoveredMenu === item.label && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-[#20406A] shadow-md rounded z-50">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2 text-xs text-white hover:bg-[#D93A3A] hover:text-white transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <Group className="items-center hidden gap-2 md:flex">
          <ActionIcon
            onClick={toggleColorScheme}
            aria-label="Toggle Theme"
            className="!bg-transparent hover:!bg-transparent text-white hover:text-[#D93A3A] transition-colors shadow-none"
          >
            {colorScheme === "light" ? (
              <IconMoon size={20} />
            ) : (
              <IconSun size={20} />
            )}
          </ActionIcon>

          {isLoggedIn ? (
            <>
              <Menu shadow="md" width={180} position="bottom-end">
                <Menu.Target>
                  <IconUserCircle
                    size={24}
                    className="mx-3 text-white hover:text-[#D93A3A] cursor-pointer transition-colors"
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    leftSection={<IconUser size={16} />}
                  >
                    Profile
                  </Menu.Item>

                  {role === "SUPERADMIN" && (
                    <Menu.Item
                      component={Link}
                      href="/management"
                      leftSection={<IconSettings size={16} />}
                    >
                      Management
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
              <Link href="/subscribe">
                <SharedButton
                  variant="filled"
                  className="bg-[#D93A3A] text-white hover:bg-[#B32F2F] transition-colors rounded-2xl"
                >
                  Subscribe
                </SharedButton>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <SharedButton
                  variant="light"
                  className="text-white border-white rounded-2xl"
                >
                  Login
                </SharedButton>
              </Link>
              <Link href="/subscribe">
                <SharedButton
                  variant="filled"
                  className="bg-[#D93A3A] text-white hover:bg-[#B32F2F] transition-colors rounded-2xl"
                >
                  Subscribe
                </SharedButton>
              </Link>
            </>
          )}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className="text-white md:hidden"
          aria-label="Toggle Menu"
        />
      </div>

      {opened && (
        <div className="md:hidden bg-[#1E3A5F] px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              <Text
                onClick={() => {
                  if (item.submenu?.length) {
                    toggleMobileSubmenu(item.label);
                  } else {
                    handleMobileSubmenuClick(item.href || "#");
                  }
                }}
                className="flex justify-between items-center text-white py-1 hover:text-[#D93A3A] cursor-pointer transition-colors"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-2 text-xs bg-[#D93A3A] text-white rounded px-1 py-0.5">
                    {item.badge}
                  </span>
                )}
                {item.submenu?.length > 0 && (
                  <IconChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${
                      mobileSubmenuOpen === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Text>

              {item.submenu && mobileSubmenuOpen === item.label && (
                <div className="mt-1 ml-4 space-y-1">
                  {item.submenu.map((sub) => (
                    <a
                      key={sub.label}
                      onClick={() => handleMobileSubmenuClick(sub.href)}
                      className="block text-sm text-gray-300 py-1 hover:text-[#D93A3A] cursor-pointer transition-colors"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-2">
            <ActionIcon
              onClick={toggleColorScheme}
              aria-label="Toggle Theme"
              className="!bg-transparent hover:!bg-transparent text-white hover:text-[#D93A3A] transition-colors shadow-none mb-2"
            >
              {colorScheme === "light" ? (
                <IconMoon size={20} />
              ) : (
                <IconSun size={20} />
              )}
            </ActionIcon>
            <Link href="/subscribe">
              <SharedButton
                variant="filled"
                className="w-full bg-[#D93A3A] text-white hover:bg-[#B32F2F] transition-colors"
              >
                Subscribe
              </SharedButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
