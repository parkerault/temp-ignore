export default {
  overview: "/overview/:symbol",
  getOverview: (symbol: string) => `/overview/${symbol}`,
} as const;
