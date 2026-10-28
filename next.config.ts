import type { NextConfig } from 'next';
import { basePath } from './src/lib/site';
const config: NextConfig = { output: 'export', basePath, trailingSlash: true };
export default config;
