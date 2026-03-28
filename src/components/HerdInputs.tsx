import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface HerdParams {
  herdSize: number;
  birthRate: number;
  deathRate: number;
  cullRate: number;
  years: number;
}

interface Props {
  params: HerdParams;
  onChange: (params: HerdParams) => void;
}

const HerdInputs = ({ params, onChange }: Props) => {
  const set = (key: keyof HerdParams, value: number) =>
    onChange({ ...params, [key]: value });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Current Herd Size</Label>
        <Input
          type="number"
          min={1}
          value={params.herdSize}
          onChange={(e) => set("herdSize", Math.max(1, +e.target.value || 1))}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Birth Rate — {params.birthRate}%
        </Label>
        <Slider
          value={[params.birthRate]}
          onValueChange={([v]) => set("birthRate", v)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Death Rate — {params.deathRate}%
        </Label>
        <Slider
          value={[params.deathRate]}
          onValueChange={([v]) => set("deathRate", v)}
          min={0}
          max={50}
          step={0.5}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Cull Rate — {params.cullRate}%
        </Label>
        <Slider
          value={[params.cullRate]}
          onValueChange={([v]) => set("cullRate", v)}
          min={0}
          max={50}
          step={0.5}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Projection Period — {params.years} {params.years === 1 ? "year" : "years"}
        </Label>
        <Slider
          value={[params.years]}
          onValueChange={([v]) => set("years", v)}
          min={1}
          max={20}
          step={1}
        />
      </div>
    </div>
  );
};

export default HerdInputs;
