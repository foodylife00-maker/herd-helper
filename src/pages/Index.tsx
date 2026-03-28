import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HerdInputs from "@/components/HerdInputs";
import HerdChart from "@/components/HerdChart";
import { projectHerd, type HerdParams } from "@/lib/herdProjection";
import { TrendingUp, TrendingDown, Baby, Skull } from "lucide-react";

const Index = () => {
  const [params, setParams] = useState<HerdParams>({
    herdSize: 100,
    birthRate: 25,
    deathRate: 5,
    cullRate: 10,
    years: 10,
  });

  const data = useMemo(() => projectHerd(params), [params]);
  const final = data[data.length - 1];
  const growth = final.herdSize - params.herdSize;
  const growthPct = ((growth / params.herdSize) * 100).toFixed(1);

  const stats = [
    {
      label: "Final Herd",
      value: final.herdSize.toLocaleString(),
      icon: growth >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Net Change",
      value: `${growth >= 0 ? "+" : ""}${growth.toLocaleString()} (${growthPct}%)`,
      icon: growth >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: `Yr ${params.years} Births`,
      value: final.births.toLocaleString(),
      icon: Baby,
    },
    {
      label: `Yr ${params.years} Losses`,
      value: final.losses.toLocaleString(),
      icon: Skull,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-5">
        <div className="container max-w-6xl">
          <h1 className="text-2xl text-foreground">Herd Projection</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Forecast your livestock numbers over time
          </p>
        </div>
      </header>

      <main className="container max-w-6xl py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-card">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <s.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{s.label}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Inputs */}
          <Card className="bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdInputs params={params} onChange={setParams} />
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <HerdChart data={data} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
