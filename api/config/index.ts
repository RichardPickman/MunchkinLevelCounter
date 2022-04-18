import { config } from 'dotenv';

interface ServerConfig {
    port: string;
    host: string;
}

interface dbConfig {
    username: string,
    password: string,
    hostname: string,
    database: string,
}

config();

export const getDbConfig = (): dbConfig => ({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
});

export const getServerConfig = (): ServerConfig => ({
    port: process.env.WS_PORT,
    host: process.env.WS_HOST,
});
