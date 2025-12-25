import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('../../.env') });

export const APP_NAME = "better-up-time";
