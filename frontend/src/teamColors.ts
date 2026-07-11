const CORES: Record<string, string> = {
  Brazil: "#009C3B",
  Argentina: "#6CACE4",
  France: "#002654",
  England: "#CF081F",
  Spain: "#C60B1E",
  Portugal: "#046A38",
  Germany: "#111111",
  Netherlands: "#EC6E1B",
  Croatia: "#E4002B",
  Belgium: "#E1A100",
  Morocco: "#007A3D",
  Japan: "#002D62",
};

export function corDoTime(team: string): string {
  return CORES[team] ?? "#009c3b";
}