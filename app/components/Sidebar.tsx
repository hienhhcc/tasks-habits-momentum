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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:animate-pulse-glow transition-all">
            <Icon name="bolt" className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Momentum
          </span>
        </Link>
      </div>

      {/* Navigation */}
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

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-secondary transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-warning flex items-center justify-center text-white font-semibold">
            V
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Vu Vinh Hien</p>
            <p className="text-xs text-foreground-muted">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
