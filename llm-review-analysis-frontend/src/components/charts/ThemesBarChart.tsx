import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { useMemo, useCallback } from "react";

interface Theme {
  name: string;
  count: number;
}

interface ThemesBarChartProps {
  pros: Theme[];
  cons: Theme[];
}

export const ThemesBarChart = ({ pros, cons }: ThemesBarChartProps) => {
  // ONLY Pros + Cons mapped cleanly (no duplicates, no extra bars)
  const data = useMemo(() => {
    return [
      ...pros.map((p) => ({ ...p, type: "pro" as const })),
      ...cons.map((c) => ({ ...c, type: "con" as const })),
    ]
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [pros, cons]);

  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (active && payload?.length) {
      const item = payload[0].payload;

      return (
        <div
          className="backdrop-blur-xl shadow-xl px-4 py-3 rounded-xl"
          style={{
            background: "#1E212B",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#EBEBEC",
          }}
        >
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm opacity-80">
            {item.count} mentions ({item.type === "pro" ? "Pro" : "Con"})
          </p>
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div
      className="
        relative h-[370px] w-full p-6 rounded-3xl
        bg-[#1E1F27]/90 backdrop-blur-2xl
        border border-white/10 
        shadow-[0_0_25px_rgba(0,132,255,0.45)]
        hover:shadow-[0_0_35px_rgba(0,132,255,0.6)]
        transition-all duration-500
        before:absolute before:inset-0 before:rounded-3xl 
        before:p-[2px] before:bg-gradient-to-r 
        before:from-blue-500/40 before:to-purple-500/40
        before:opacity-20 before:blur-md
        hover:before:opacity-50
        after:absolute after:inset-0 after:rounded-3xl
        after:shadow-[inset_0_0_25px_rgba(0,0,0,0.45)]
        after:pointer-events-none
      "
    >
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, bottom: 10, left: 5 }}
          barGap={12}            // More spacing between rows
        >
          {/* CLEAN AXIS */}
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fill: "#EBEBEC", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />

          {/* BACK TRACKS */}
          <Bar
            dataKey="count"
            fill="#2B2F3C"
            radius={[8, 8, 8, 8]}
            barSize={24}
            background={{ fill: "#2B2F3C" }}
          />

          {/* ACTIVE BARS — ONLY PROS & CONS */}
          <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={24}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.type === "pro" ? "#3CDE96" : "#F56F5C"}
                className="transition-all duration-300 hover:brightness-110"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* LEGEND — shifted downward for breathing room */}
      <div className="flex justify-center gap-10 mt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#3CDE96" }} />
          <span className="text-slate-300 text-sm">Pros</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#F56F5C" }} />
          <span className="text-slate-300 text-sm">Cons</span>
        </div>
      </div>
    </div>
  );
};
