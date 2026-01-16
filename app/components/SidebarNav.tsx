"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { IconName } from "./Icon";

const navItems: { name: string; href: string; icon: IconName }[] = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Tasks", href: "/tasks", icon: "tasks" },
  { name: "Habits", href: "/habits", icon: "habits" },
  { name: "Statistics", href: "/stats", icon: "statistics" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-background-secondary text-foreground-muted hover:text-foreground"
            }`}
          >
            <span
              className={`${
                isActive ? "" : "group-hover:scale-110"
              } transition-transform`}
            >
              <Icon name={item.icon} />
            </span>
            <span className="font-medium">{item.name}</span>
            {isActive && (
              <span className="ml-auto w-2 h-2 rounded-full bg-white/50" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
