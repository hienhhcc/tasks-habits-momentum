import Link from "next/link";
import Icon from "./Icon";
import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 bg-card border-r border-border flex flex-col z-50">
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
      <SidebarNav />

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
