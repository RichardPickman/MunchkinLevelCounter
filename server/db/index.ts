import * as mongodb from 'mongodb';

export const getUri = ({ username, password, hostname, database }) =>  `mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`;

export const createConnection = (config) => {
    const uri = getUri(config)
    const client = new mongodb.MongoClient(uri);

    return client.connect()
};
