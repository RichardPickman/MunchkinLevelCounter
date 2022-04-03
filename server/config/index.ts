import { config } from 'dotenv';

interface ServerConfig {
    port: number;
    address: string;
}

interface dbConfig {
    username: string,
    password: string,
    hostname: string,
    database: string,
    local_db: string,
    local_db_port: string,
}

config();

const getDbConfig = (): dbConfig => ({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
    local_db: process.env.DB_LOCAL_HOSTNAME,
    local_db_port: process.env.DB_LOCAL_PORT,
});

const getServerConfig = (): ServerConfig => ({
    port: Number(process.env.WS_SERVER_PORT),
    address: process.env.WS_ADDRESS,
});


export const getConfig = () => ({
    db: getDbConfig(),
    ws: getServerConfig(),
});
