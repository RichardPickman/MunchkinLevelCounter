import mongodb from 'mongodb';


export const getUri = ({ username, password, hostname, database }) =>  `mongodb+srv://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`;

export const createConnection = (config) => { 
    const uri = getUri(config)
    const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    return client.connect()
};