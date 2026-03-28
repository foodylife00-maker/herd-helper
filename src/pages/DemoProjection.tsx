import { useState } from "react";
import { Layout } from "@/components/Layout";
import { HerdInputForm } from "@/components/HerdInputForm";
import { ProjectionTable } from "@/components/ProjectionTable";
import { ProjectionChart } from "@/components/ProjectionChart";
import { StatCard } from "@/components/StatCard";
import { HerdData, calculateHerdProjection, formatNumber } from "@/lib/herdCalculations";
import { Beef, TrendingUp, Target, Calendar, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Pre-loaded sample scenario
const SAMPLE_CONFIG = {
  femaleAdults: 60,
  maleAdults: 4,
  young: 25,
  years: 8,
  birthRate: 0.85,
  mortalityRate: 0.05,
  cullRate: 0.10,
};

const SAMPLE_PROJECTIONS = calculateHerdProjection(
  SAMPLE_CONFIG.femaleAdults,
  SAMPLE_CONFIG.young,
  SAMPLE_CONFIG.years,
  SAMPLE_CONFIG.birthRate,
  SAMPLE_CONFIG.mortalityRate,
  2,
  SAMPLE_CONFIG.cullRate,
  0.50,
  SAMPLE_CONFIG.maleAdults
);

const DemoProjection = () => {
  const [projections, setProjections] = useState<HerdData[]>(SAMPLE_PROJECTIONS);
  const [config, setConfig] = useState(SAMPLE_CONFIG);

  const handleGenerate = (data: {
    femaleAdults: number;
    maleAdults: number;
    young: number;
    years: number;
    birthRate: number;
    mortalityRate: number;
    cullRate: number;
  }) => {
    const results = calculateHerdProjection(
      data.femaleAdults,
      data.young,
      data.years,
      data.birthRate,
      data.mortalityRate,
      2,
      data.cullRate,
      0.50,
      data.maleAdults
    );
    setProjections(results);
    setConfig(data);
  };

  const finalData = projections[projections.length - 1];
  const initialData = projections[0];
  const growthPercent = initialData && finalData
    ? ((finalData.total - initialData.total) / initialData.total * 100).toFixed(1)
    : "0";

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Demo Banner */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Demo: Herd Projection (Standalone)</p>
              <p className="text-sm text-muted-foreground">
                This demo runs independently with sample data — 60 cows, 4 bulls, 25 calves projected over 8 years.
                Adjust the form to re-generate. No login or other sections required.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">Member 1</Badge>
                <Badge variant="secondary">Fibonacci Growth Model</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Herd Projection</h1>
          <p className="text-muted-foreground">
            Fibonacci-based growth projections for your cattle operation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Starting Herd" value={formatNumber(initialData?.total || 0)} subtitle="Total cattle" icon={Beef} variant="primary" />
          <StatCard title="Final Projection" value={formatNumber(finalData?.total || 0)} subtitle={`Year ${config.years}`} icon={Target} variant="accent" />
          <StatCard title="Total Growth" value={`${growthPercent}%`} subtitle="Over projection period" icon={TrendingUp} variant="primary" />
          <StatCard title="Projection Years" value={config.years} subtitle="Planning horizon" icon={Calendar} variant="muted" />
        </div>

        {/* Form + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <HerdInputForm onSubmit={handleGenerate} initialValues={config} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ProjectionChart data={projections} />
            <ProjectionTable data={projections} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoProjection;
