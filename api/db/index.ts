import * as mongodb from 'mongodb';
import { getDbConfig } from '../config';


let instance = null;

const getUri = ({ username, password, hostname, database }) => {
    return `mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`;
};

export const createConnection = () => {
    const config = getDbConfig();
    const uri = getUri(config);
    const client = new mongodb.MongoClient(uri);

    return client.connect();
};

export const getDb = async () => {
    if (!instance) {
        instance = await createConnection();
    }

    return instance.db();
};
