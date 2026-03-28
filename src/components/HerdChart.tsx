import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  year: number;
  herdSize: number;
  births: number;
  losses: number;
}

interface Props {
  data: DataPoint[];
}

const HerdChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={360}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="herdFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(145, 35%, 32%)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="hsl(145, 35%, 32%)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 85%)" />
      <XAxis
        dataKey="year"
        tickFormatter={(v) => `Yr ${v}`}
        tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }}
      />
      <YAxis tick={{ fontSize: 12, fill: "hsl(150, 10%, 45%)" }} />
      <Tooltip
        contentStyle={{
          background: "hsl(40, 30%, 97%)",
          border: "1px solid hsl(40, 15%, 85%)",
          borderRadius: 8,
          fontSize: 13,
        }}
        formatter={(value: number, name: string) => [
          Math.round(value).toLocaleString(),
          name,
        ]}
        labelFormatter={(v) => `Year ${v}`}
      />
      <Area
        type="monotone"
        dataKey="herdSize"
        name="Herd Size"
        stroke="hsl(145, 35%, 32%)"
        strokeWidth={2.5}
        fill="url(#herdFill)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default HerdChart;
