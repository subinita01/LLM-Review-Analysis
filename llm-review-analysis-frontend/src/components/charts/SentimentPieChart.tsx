import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";

interface SentimentPieChartProps {
  data: {
    Positive: number;
    Neutral: number;
    Negative: number;
  };
}

export const SentimentPieChart = ({ data }: SentimentPieChartProps) => {
  const total = data.Positive + data.Neutral + data.Negative;

  const chartData = [
    { name: "Positive", value: data.Positive, color: "#3CDE96" },
    { name: "Neutral", value: data.Neutral, color: "#D9D9D9" },
    { name: "Negative", value: data.Negative, color: "#F56F5C" },
  ];

  const [animatedData, setAnimatedData] = useState(
    chartData.map((d) => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimatedData(chartData);
    }, 250);

    return () => clearTimeout(t);
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div
          className="backdrop-blur-xl shadow-xl px-4 py-3 rounded-xl"
          style={{
            background: "#1E212B",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#EBEBEC",
          }}
        >
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm opacity-80">{payload[0].value} reviews</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
  }: any) => {
    if (percent < 0.06) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#EBEBEC"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div
      className="
        relative h-[370px] w-full p-6 rounded-3xl
        bg-[#1E1F27]/90 backdrop-blur-2xl
        border border-white/10
        shadow-[0_0_25px_rgba(0,132,255,0.45)]
        hover:shadow-[0_0_40px_rgba(0,132,255,0.65)]
        transition-all duration-500
        before:absolute before:inset-0 before:rounded-3xl 
        before:p-[2px] before:bg-gradient-to-r 
        before:from-blue-500/40 before:to-purple-500/40
        before:opacity-30 before:blur-md
        hover:before:opacity-60
        after:absolute after:inset-0 after:rounded-3xl
        after:shadow-[inset_0_0_25px_rgba(0,0,0,0.45)]
        after:pointer-events-none
      "
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "#EBEBEC" }}>
            Total
          </p>
          <p className="text-4xl font-extrabold" style={{ color: "#EBEBEC" }}>
            {total}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={animatedData}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={125}
            paddingAngle={4}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            isAnimationActive={true}
            animationDuration={1100}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                className="transition-all duration-300 hover:brightness-110"
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-slate-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
