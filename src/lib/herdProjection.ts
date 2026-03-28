export interface HerdParams {
  herdSize: number;
  birthRate: number;
  deathRate: number;
  cullRate: number;
  years: number;
}

export interface DataPoint {
  year: number;
  herdSize: number;
  births: number;
  losses: number;
}

export function projectHerd(params: HerdParams): DataPoint[] {
  const { herdSize, birthRate, deathRate, cullRate, years } = params;
  const data: DataPoint[] = [{ year: 0, herdSize, births: 0, losses: 0 }];

  let current = herdSize;
  for (let y = 1; y <= years; y++) {
    const births = current * (birthRate / 100);
    const deaths = current * (deathRate / 100);
    const culls = current * (cullRate / 100);
    current = Math.max(0, current + births - deaths - culls);
    data.push({
      year: y,
      herdSize: Math.round(current),
      births: Math.round(births),
      losses: Math.round(deaths + culls),
    });
  }
  return data;
}
