import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  accent?: boolean;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  subtitle,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        accent
          ? "bg-forest-700 text-white"
          : "bg-white border border-stone-100 shadow-card"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className={`p-2.5 rounded-xl ${
            accent ? "bg-white/10" : "bg-forest-50"
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              trend.positive
                ? accent
                  ? "bg-white/10 text-emerald-200"
                  : "bg-emerald-50 text-emerald-600"
                : accent
                ? "bg-white/10 text-red-200"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>
      <p
        className={`text-xs font-medium mb-1 ${
          accent ? "text-stone-300" : "text-stone-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-xl font-bold font-headline ${
          accent ? "text-white" : "text-forest-900"
        }`}
      >
        {value}
      </p>
      {subtitle && (
        <p
          className={`text-xs mt-2 font-medium ${
            accent ? "text-stone-400" : "text-stone-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
