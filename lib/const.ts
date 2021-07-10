import { join } from "path";
import { tmpPath } from './util/tmpPath';

export const __root = join(__dirname, '..');

export const OUTPUT_DIR = tmpPath();

export const __cacheMapFile = join(OUTPUT_DIR, '.novel-cache-map.json');
