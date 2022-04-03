import * as mongodb from 'mongodb';

export const getUri = ({ local_db, local_db_port }) =>  `mongodb://${local_db}:${local_db_port}`;

export const createConnection = (config) => {
    const uri = getUri(config)
    const client = new mongodb.MongoClient(uri);

    return client.connect()
};
