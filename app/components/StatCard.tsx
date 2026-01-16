interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "accent" | "success" | "warning" | "danger";
}

const colorConfig = {
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "accent",
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-accent/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorConfig[color]}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.positive
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <h3
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {value}
      </h3>
      <p className="text-sm text-foreground-muted">{title}</p>
      {subtitle && (
        <p className="text-xs text-foreground-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}
