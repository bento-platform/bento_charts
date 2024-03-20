// Disable unused item linting in WebStorm:
// noinspection JSUnusedGlobalSymbols

// Categorical charts
export { default as BarChart } from './Components/Charts/BentoBarChart';
export { default as Histogram } from './Components/Charts/BentoHistogram';
export { default as PieChart } from './Components/Charts/BentoPie';

// Maps are not included in index.ts - instead, they need to be included from `bento-charts/maps`.
// This way, we can have optional peer dependencies.

export { default as ChartConfigProvider } from './ChartConfigProvider';
export * from './types/chartTypes';
