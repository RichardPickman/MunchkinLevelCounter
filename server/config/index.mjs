import { config } from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

config();

export const getDbConfig = () => ({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
});