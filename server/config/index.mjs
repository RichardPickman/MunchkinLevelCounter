import { config } from 'dotenv';


config();

const getDbConfig = () => ({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
});

const getServerConfig = () => ({
    port: process.env.WS_SERVER_PORT,
});


export const getConfig = () => ({
    db: getDbConfig(),
    ws: getServerConfig(),
});
